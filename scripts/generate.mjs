import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const SLIDES_DIR = 'slides'
const DIST_DIR = 'dist'

// スキャンしてプレゼン情報を取得
function getPresentation() {
  const slidesPath = path.join(process.cwd(), SLIDES_DIR)
  const dirs = fs.readdirSync(slidesPath, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && !d.name.startsWith('node_modules'))
    .map(d => d.name)
    .filter(name => /^\d{4}-\d{2}-\d{2}_/.test(name)) // YYYY-MM-DD_ で始まるもののみ

  const presentations = []

  for (const dir of dirs) {
    const slidesFile = path.join(slidesPath, dir, 'slides.md')
    if (!fs.existsSync(slidesFile)) continue

    const content = fs.readFileSync(slidesFile, 'utf-8')
    const { data } = matter(content)

    // 日付をディレクトリ名から抽出
    const dateMatch = dir.match(/^(\d{4}-\d{2}-\d{2})_(.+)$/)
    const date = dateMatch ? dateMatch[1] : ''
    const slug = dir

    // タイトルはfrontmatterから取得、なければディレクトリ名の後半部分
    const title = data.title || (dateMatch ? dateMatch[2].replace(/-/g, ' ') : dir)

    presentations.push({ date, slug, title })
  }

  // 日付降順でソート
  return presentations.sort((a, b) => b.date.localeCompare(a.date))
}

// vercel.json を生成
function generateVercelJson(presentations) {
  const rewrites = presentations.map(p => ({
    source: `/${p.slug}/(.*)`,
    destination: `/${p.slug}/index.html`
  }))

  const config = {
    rewrites,
    buildCommand: 'pnpm run build',
    outputDirectory: 'dist'
  }

  fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2) + '\n')
  console.log('Generated vercel.json')
}

// dist/index.html を生成
function generateIndexHtml(presentations) {
  const listItems = presentations.map(p => `      <li>
        <a href="/${p.slug}/">
          <span class="date">${p.date}</span>${escapeHtml(p.title)}
        </a>
      </li>`).join('\n')

  const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Presentations - coji</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #0f0f0f;
        color: #e0e0e0;
        min-height: 100vh;
        padding: 2rem;
      }
      h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #fff;
      }
      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      a {
        display: block;
        padding: 1rem 1.5rem;
        background: #1a1a1a;
        border-radius: 8px;
        color: #60a5fa;
        text-decoration: none;
        transition: background 0.2s, transform 0.2s;
      }
      a:hover {
        background: #252525;
        transform: translateX(4px);
      }
      .date {
        color: #888;
        font-size: 0.875rem;
        margin-right: 1rem;
      }
    </style>
  </head>
  <body>
    <h1>Presentations</h1>
    <ul>
${listItems}
    </ul>
  </body>
</html>
`

  // dist ディレクトリがなければ作成
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true })
  }

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html)
  console.log('Generated dist/index.html')
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// メイン
const presentations = getPresentation()
console.log(`Found ${presentations.length} presentations`)

generateVercelJson(presentations)
generateIndexHtml(presentations)

console.log('Done!')
