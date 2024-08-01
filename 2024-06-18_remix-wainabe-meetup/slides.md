---
theme: seriph
background: https://cover.sli.dev
title: Remix + Pagefind で全文検索
info: |
  ## Remix + Pagefind で全文検索
  [Remixドキュメント日本語版](https://remix-docs-ja.techtalk.jp)に無料の全文検索機能を入れた話。
class: text-center
highlighter: shiki
transition: slide-left
mdc: true
download: true
---

# Remix + Pagefind

 [Remix Docs Japanese](https://remix-docs-ja.techtalk.jp) with free full-text search functionality.

Remix "ワインと鍋" Meetup

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---

```yaml
layout: image-right
image: https://techtalk.jp//images/about.webp
```

# coji

A web developer based on Tokyo, Japan.

<img src="/images/coji.jpg" className='rounded-full absolute top-11 left-96 w-16' alt="coji" />

<v-clicks>

- Love the things that are very useful and simple to use, made by a small group of people
  - Remix
  - Conform
  - DuckDB
  - Turso
- Also love tech talks.
  - I decided to name my own company
  - [TechTalk inc.](https://techtalk.jp)

</v-clicks>

---

# Remix Docs Japanese

A website I maintained to help my Japanese co-workers learn and understand the "Remix way".

https://github.com/coji/remix-docs-ja

<img src="/images/remix-docs-ja.png" class="absolute right-0 w-160 top-30" alt="Remixドキュメント日本語版" />

- Tech Stacks
  - Remix v2.9.2 (single fetch)
  - Fly.io + Cloudflare Cache
  - Markdown based
  - Translated using Gemini 1.5 Flash

---

# Full-text Search Functionality

<img class="mx-auto border rounded-md h-[90%]" src="/images/search-usefetcher.gif" alt="demo" >
---

# Pagefind

Provides search functionality for websites with minimal bandwidth and no infrastructure.

<div className='text-center mx-auto my-16'>
<img src="https://pagefind.app/pagefind.svg" class="w-full mb-8 h-20" alt="pagefind" />
<a href="https://pagefind.app" target="_blank">https://pagefind.app</a>
</div>

<v-clicks>

- Open source library written in Rust
- Multilingual and Japanese support out of the box
- Provides a <span v-mark.red="4">NodeJS indexing API</span> and <span v-mark.blue="5">browser-based search API</span>, along with a CLI and default UI

</v-clicks>

---

# How Full-text search works

<div class="mx-auto text-center mt-20">
  <img src="/images/architecture.png" class="w-full" alt="architecture" />
</div>

---

# Indexing

When building the app, also perform index building simultaneously.

```ts {*|2|2,10-15|2,10-15,18}
const buildIndex = async () => {
  const { index } = await pagefind.createIndex({})

  const docs = await glob('docs/**/*.md')
  for (const filename of docs) {
    const { dir, name } = path.parse(filename)
    const pathname = path.join('/', path.basename(dir), name)
    const doc = await getDoc(pathname)

    await index.addCustomRecord({
      content: doc.html,
      meta: { title: doc.attributes.title.toString() },
      language: 'ja',
      url: pathname
    })
  }

  await index.writeFiles({ outputPath: 'public/pagefind' })
}

await buildIndex()
```

---

# Indexing (cont.)

pagefind.js must be removed from the bundle by specifying external in rollupOptions.

vite.config.ts

```ts {13}
export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: { rollupOptions: { external: ['/pagefind/pagefind.js?url'] } },
})

```

---

# Search

clientLoader: Execute searches solely on the browser side. It also works in SPA mode.

Form

```tsx
<fetcher.Form action="/resources/search">
  <Input id="query" name="q" placeholder="Search..." />
  <Button size="sm">Search</Button>
</fetcher.Form>
```

clientLoader

```ts {*|3-5|3-5,6|3-5,6,7|3-5,6,7,9}
export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url)
  const pagefind = (await import(
    '/pagefind/pagefind.js?url'
  )) as unknown as Pagefind
  await pagefind.init()
  const ret = await pagefind.search(url.searchParams.get('q'))
  const results = await Promise.all(ret.results.map((result) => result.data()))
  return { results }
}
```

---

# Conclusion

By combining Remix and Pagefind, you can build a website with full-text search functionality that is incredibly simple and low-cost.

<v-clicks>

- Pagefind is a free, open-source search library that supports Japanese out of the box
- No server-side infrastructure is required, and search processing can be completed entirely in the browser, significantly reducing operational costs
- By leveraging Remix's clientLoader, you can seamlessly implement client-side search
It's an ideal solution for adding full-text search to Markdown-based documentation
- I recommend to try building a user-friendly and powerful search-enabled website using Remix and Pagefind!

</v-clicks>

---

```yaml
layout: end
```

# Thank You

---

```yaml
layout: statement
```

# One more thing

---

# One more thing

<v-clicks depth="2">

- Remix ２年前から使ってるけど、当時はそんな案件(クライアント)はまったくなかった。
- どっかで Remix の仕事あったらいいのにな〜と思っていた。そういう人は今もいるはず。
- プロダクション利用も徐々に増えてきたけど、まだ少数。
  - そういう企業で Remix に慣れてるエンジニアのニーズはあるようだ。
  - 近い将来、既存 react-router アプリの v7 へのマイグレーションニーズが出てきそう。
- Remix エンジニア採用したい人と、Remix 仕事したい人のマッチングをできるといいな。
- そうだ: Remixドキュメント日本語版に Remix を使う仕事の募集情報載ってるといいかも？
  - Web 2.0 の頃にあった Job Board 的な。日本国内限定だけど。
- 採用情報へのリンク、載せたい方いらっしゃいますか？
  - 大変になってきたら無料では無理かもだけど、そこまで盛り上がる気はちょっとしないかな。。？
- 興味ある方いらっしゃる前提で: あとで相談させてください。
  - [X](https://x.com/techtalkjp)のDMなど
  - ついでに Remix を企業・プロダクションで使ってる方を Meetup にお誘いしたい。
  - 会場提供もしてもらえるといいな！

</v-clicks>

---

```yaml
layout: end
```

# Thank You (本当)
