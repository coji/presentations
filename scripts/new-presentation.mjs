import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const SLIDES_DIR = 'slides'

// 引数からタイトルを取得
const title = process.argv[2]

if (!title) {
  console.error('Usage: pnpm new <title>')
  console.error('Example: pnpm new my-awesome-presentation')
  process.exit(1)
}

// 今日の日付を取得 (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0]

// ディレクトリ名を生成
const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
const dirName = `${today}_${slug}`
const dirPath = path.join(process.cwd(), SLIDES_DIR, dirName)

// ディレクトリが既に存在するかチェック
if (fs.existsSync(dirPath)) {
  console.error(`Error: Directory already exists: ${dirPath}`)
  process.exit(1)
}

// ディレクトリを作成
fs.mkdirSync(dirPath, { recursive: true })
fs.mkdirSync(path.join(dirPath, 'public', 'images'), { recursive: true })

// slides.md を作成
const slidesContent = `---
theme: default
title: ${title}
author: coji
transition: slide-left
mdc: true
---

# ${title}

<div class="absolute bottom-10">
  <p>coji</p>
  <p class="text-sm opacity-50">${today}</p>
</div>

---

# スライド 1

内容をここに書く

---

# スライド 2

内容をここに書く

---
layout: end
---

# ありがとうございました
`

fs.writeFileSync(path.join(dirPath, 'slides.md'), slidesContent)

// package.json を作成
const packageJson = {
  name: dirName,
  type: 'module',
  private: true,
  scripts: {
    build: `slidev build --base /${dirName}/ --out ../../dist/${dirName}`,
    dev: 'slidev --open',
    export: 'slidev export'
  },
  dependencies: {
    '@slidev/cli': '^52.11.2',
    '@slidev/theme-default': '0.25.0',
    '@slidev/theme-seriph': '0.25.0',
    vue: '^3.5.26'
  }
}

fs.writeFileSync(
  path.join(dirPath, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n'
)

console.log(`Created new presentation: ${dirPath}`)
console.log('')
console.log('Installing dependencies...')
execSync('pnpm install', { stdio: 'inherit' })

console.log('')
console.log('Done! Next steps:')
console.log(`  cd ${SLIDES_DIR}/${dirName}`)
console.log('  pnpm dev')
