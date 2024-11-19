---
theme: default
background: https://cover.sli.dev
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## 動画アドネットワーク
  Cloudflare x Hono x Remix でコストゼロ実装
drawings:
  persist: false
title: どうせやるなら無料で作る動画アドネットワーク
---

# どうせやるなら無料で作る<br>動画アドネットワーク

Cloudflare x Hono x Remix

Mizoguchi Coji

[@techtalkjp](https://x.com/techtalkjp)

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
Start <carbon:arrow-right class="inline"/>
  </span>
</div>

---

```yaml
layout: two-cols
```

# きっかけ

<v-clicks>

- ひとりで作ってるメディア: "Hyperlocal Tokyo"
  - https://tokyo.hyper-local.app/
  - 出先で「いますぐどこかいい所は？」で使える
  - 最低でも10年ぐらいは続けるつもり
  - そのうち、広告枠作って自分で売りたいな
- でも既存サービスは...
  - ク**みたいなきったねー広告ばっかり
  - 大規模メディアしか相手してない
  - 独自のフォーマット作れない
    - せっかくメディアから自分で作ってるのに
- 「今なら、自分ひとりで、無料でできるのでは？」
  - ほぼ趣味だし。AIあるし。
  - 動画アドネットワークをゼロから作ろう
  - オープンソースでね！
</v-clicks>

::right::

<img src="/images/hyperlocal-tokyo.png" alt="hyperlocal tokyo" />

---

```yaml
layout: two-cols
```

# アーキテクチャ

<div class="mermaid">
graph TD
    A[Publisher/Advertｖiser] -->|Clerk Auth| B[Remix UI]
    B --> C[Hono API]
    C --> D[R2: 動画]
    C --> E[KV: メタデータ]
    C --> F[Turso: トラッキング]
    G[Publisher Site] -->|VAST| C
</div>

::right::

# 特徴

<v-clicks>

- コストゼロ
  - 全部エッジで動く
- TypeScript で全部つくる
  - ひとりで全部つくってメンテずっとするので
  - 最初はミニマムに小さく
  - 困ったら作り直す
- マルチテナント対応
  - 広告主
  - 媒体社

</v-clicks>

---

```yaml
layout: two-cols
```

# 使用技術

- Cloudflare
  - R2: 動画ストレージ
  - Workers: アドサーバ実装 (Hono)
    - VAST 4.1: 動画広告規格
  - Workers: 管理UI (Remix)
    - UI: shadcn/ui
    - Clerk: 認証・マルチテナント
- Turso: エッジ分散DB (分散SQLite)

::right::

<div className='flex gap-4'>
  <img src="/images/logo_cloudflare.webp" className='bg-white p-4 rounded h-24' alt="cloudflare" />
  <img src="/images/logo_hono.webp" className='bg-white p-4 rounded h-24' alt="hono" />
</div>

<div className='flex gap-4'>
  <img src="/images/remix-glowing.png" className='h-32' alt="remix" />
  <img src="/images/logo-turso.png" className='h-16 mt-8' alt="turso" />
</div>

<div className='flex justify-between gap-4 items-center'>
  <div className='text-4xl'>Kysely</div>
  <div className='text-4xl'>shadcn/ui</div>
  <img src="/images/logo_clerk.jpeg" className='h-16' alt="clerk" />
</div>

---

```yaml
layout: two-cols
```

# デモ

1. [広告サーバと JS SDK](https://ad-server.van.techtalk.jp/)
   - 動画広告の再生
   - 音声広告の再生
   - トラッキング
     - vast
     - impression
     - progress (0%, 25%, 50%, 75%, 100%)
     - click

2. [管理UI: 広告主 / 媒体社向け](https://ui.van.techtalk.jp/)
   - Clerk によるマルチテナント認証
   - 配信設定
   - 広告枠管理
   - 配信パフォーマンス確認

::right::

<img src="/images/demo_ui.png" alt="ui demo" className='-ml-8' >
<img src="/images/demo_ad.png" alt="ad demo" className="-mt-32 ml-8"/>

---

```yaml
layout: default
```

# 実装の面白いポイント

```ts {all|2|3-4|6-8|all}
app.get('/vast/:id', async (c) => {
  const campaignId = c.param('id')
  // 動画・メタデータ取得
  const { video, metadata } = await getCampaignData(campaignId)
  
  // VASTレスポンス生成
  const vast = generateVAST(video, metadata)
  return c.json(vast)
})
```

<v-clicks>

- VASTという広告規格との出会い
- エッジでの完結した実装
- マルチテナントの認証・認可

</v-clicks>

---

```yaml
layout: default
```

# これから

- キャンペーン予算管理の「均等配信」や「フロントローディング」とか普通のやつを実装したい。
- まだUIで入稿できないのでちゃんと作りたい
  - ちょっとダルいけど。comform 使うよ。

- UIのダッシュボード・レポートも必要だよね
  - [@eiichi292929](https://x.com/eiichi292929) さんによる[DuckDB Wasm の OPFS サポート](https://github.com/duckdb/duckdb-wasm/pull/1856)マージ待ってる。頼む。

- OSSとして地道にメンテしていきます。
- MIT ライセンスなので好きにしてください。
  - ニーズがもしあれば、有償での機能追加もおもしろそう

ソースコードはこちら:
[github.com/coji/video-ad-network](https://github.com/coji/video-ad-network)

---

```yaml
layout: end
```

# Thank you
