---
theme: default
background: https://cover.sli.dev
title: Remix の細かすぎて伝わらない好きなところ
class: text-center
highlighter: shiki
transition: slide-left
mdc: true
download: true
---

# Remix の細かすぎて伝わらない好きなところ

<!-- 30秒: こんにちは。今日は「Remixの細かすぎて伝わらない好きなところ」についてお話しします。Remixは最近注目を集めているReactフレームワークですが、その魅力は細部に宿っています。これから10分間で、私が特に気に入っている点をご紹介します。 -->
---

# 自己紹介: 溝口浩二 coji

東京在住のプログラマー。 [X](https://x.com/techtalkjp) | [GitHub](https://github.com/coji)

<img src="/images/coji.jpg" className='rounded-full absolute top-8 right-24 w-16' alt="coji" />

- [TechTalk (ひとり法人)](https://www.techtalk.jp) ← フリークアウト ← ドワンゴ
  - 主にクライアントワークで、新規事業開発に伴う MVP のひとり開発をよくやってます。
  - 数社で技術/開発アドバイザー。

- 数人規模で作られてるめっちゃ便利なものが好き。
  - 推し: Remix, Conform, DuckDB, Flyio

- Remix が便利なので2年前から仕事で使っています。語りたい！
  - [Remix Tokyo Meetup](https://www.meetup.com/remix-tokyo/) オーガナイザー
    - 数ヶ月以内にまた都内でオフラインの小規模ミートアップを企画中
  - [Remixドキュメント日本語版](https://remix-docs-ja.techtalk.jp/) メンテしてます。
  - [Remix の Discord に日本語OKチャンネルもできました](https://discord.gg/br3Bw3PqYy)。ぜひ。

<!-- 1分: 私は溝口浩二、東京在住のプログラマーです。現在はTechTalkという会社で、主に新規事業開発のMVP開発を行っています。Remixは2年前から仕事で使用しており、その魅力にすっかり惹かれています。実は、Remix Tokyo Meetupのオーガナイザーもしています。では、本題に入りましょう。 -->

---

## 1. Web標準がベースになっている

- Web といえば、Request を受け取って Response を返す。
  - Web開発の基本に立ち返る爽快感
  - 仕様も安定。
- わかりやすい = 覚えやすい = 読みやすい = 間違いにくい

```tsx
import { json, redirect } from '@remix-run/node'

// ページ読み込み GET 時に呼び出され、Request を受けとり Response を返す
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("q");
  return json({ search }); // json の Response を返す Remix のヘルパー関数
}

// フォームからの POST 時に呼び出され、Request を受けとり Reponse を返す
export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  return redirect(`/hello/${name}`); // location ヘッダ付きの Reponse を返す Remix のヘルパー関数
}
```

Web標準の仕様(MDN): [Request](https://developer.mozilla.org/ja/docs/Web/API/Request), [Response](https://developer.mozilla.org/ja/docs/Web/API/Response), [URL](https://developer.mozilla.org/ja/docs/Web/API/URL_API), [URLSearchParams](https://developer.mozilla.org/ja/docs/Web/API/URLSearchParams), [FormData](https://developer.mozilla.org/ja/docs/Web/API/FormData)

<!-- 1分30秒: Remixの最大の魅力は、Web標準に基づいていることです。RequestとResponseという基本的な概念を中心に設計されており、これがWeb開発の基本に立ち返る爽快感を与えてくれます。例えば、このコードを見てください。loaderとactionの実装がとてもシンプルで直感的です。これにより、コードが読みやすく、覚えやすく、そして間違いにくくなるのです。 -->

---

## 2. 妙な抽象化やブラックボックスがない

- コードを追えば、全てがわかる安心感
- 例: Cookie によるセッション管理も Request / Response のヘッダで普通に触れます。
  - 自前のヘルパー関数書いてもOK。

```ts
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  return json({ userId });
}

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", "123");
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
```

<!-- 1分: 次に素晴らしいのは、不要な抽象化やブラックボックスがないことです。例えば、Cookieによるセッション管理も、RequestとResponseのヘッダーを直接扱えます。このアプローチにより、コードの動作が透明で理解しやすくなります。必要に応じて自前のヘルパー関数を書くこともできる柔軟性も魅力です。 -->

---

## 3. クリアなデータフロー

- loader / component / action のサイクルで、コンパクトに責務を分離。
- useState, useEffect 不要。

```javascript
export const loader = async () => json(await getUsers());

export const action = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  return await createUser(name);
}

export default function Users() {
  const users = useLoaderData();
  return (
    <form method="post">
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <input name="name" />
      <button type="submit">submit</button> 
    <form>
  );
}
```

<img className='absolute right-10 top-46 w-120' alt="fullstack dataflow" src="https://remix.run/blog-images/posts/remix-data-flow/loader-action-component.png" />

<!-- 1分30秒: Remixのloader、action、componentの構造は、責務を明確に分離しています。これにより、データの流れが非常にクリアになります。特筆すべきは、useStateやuseEffectがほとんど不要になること。 -->

---

## 3 (cont). クリアなデータフロー 認証ガードの例

- loader で認証ガード。
- 表示側では認証されてるのを前提にできて、めっちゃシンプルに。
- Remix のデータフローがわかりやすさ生むことの好例。

```tsx
export const loader = ({ request }) => {
  const user = await requireUser(request); // ログインしていなかったらログイン画面にリダイレクト
  return json({ user });
}

export default function Dashboard() {
  const { user } = useLoaderData(); 
  
  // すでに認証してる前提になるので user は必ずある！
  return (<h1>Welcome, {user.name}</h1>);
}
```

<!-- 認証のガード処理も、loaderで簡単に実装できます。このスライドのコードを見てください。とてもシンプルで直感的ですよね。 -->

---

## 4. 「段階的に強化」ができる

- 最低限の機能性で一旦リリース。
- あとで時間ができたらいろいろ工夫して UX を向上。

```javascript
// 今日リリースするために、最低限の実装で。
export default function ContactPage() {
  return (
    <form method="post">
      <input name="name" required />
      <button type="submit">登録</button>
    </form>
  );
}
```

```javascript
// あとで時間ができたらいろいろ工夫して UX を向上。
export default function ContactPage() {
  const navigation = useNavigation();
  const actionData = useActionData();
  return (
    <Form method="post">
      <input type="text" name="name" required />
      <button type="submit" disabled={navigation.state === "submitting"}>
        {navigation.state === "submitting" ? "登録中..." : "登録"}
      </button>
      {actionData?.error && <p>{actionData.error}</p>}
    </Form>);}
```
<!-- 1分: Remixの素晴らしい点の一つは、プログレッシブエンハンスメントの考え方を実践できることです。最初は基本的なHTMLフォームから始めて、徐々に機能を追加していけます。このアプローチにより、基本機能を迅速にリリースし、その後ユーザー体験を段階的に向上させることができます。 -->

---

## 5. SPA mode が超イイ

- API サーバがある前提での業務用Webアプリに最適。
- SSR 時と同じように、責務を分けてクリアに書ける。
- 普通の SPA に比べ状態管理ほぼ不要に。シンプル！

```javascript
export const clientLoader = ({ request }) => {
  const posts = await apiRequest('posts')
  return posts;
};

export default function PostIndexPage() {
  const posts = useLoaderData();
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <div>{post.title}</div>
          <div>{post.body}</div>
        </div>
      ))}
    </div>
  )
}
```

<!-- 1分: Remixは、シングルページアプリケーション（SPA）モードも提供しています。これは特に、APIサーバーがある業務用Webアプリに最適です。SSRと同じ感覚で書けるため、学習コストが低く、状態管理もシンプルになります。普通のSPAと比べて、コードがとても簡潔になるんです。 -->

---

## 6. つらい React Server Component (RSC) 対応が不要

- RSCでパラダイム転換した書き換え... 別に必要ないのでは？
  - SSR 対応して、Vite でバンドル最適化もされて、十分速いです。
  - Next.js Page Router から Remix で動くように書き換えるのも比較的容易です(経験談)
- Remix も 将来的に RSC 対応は検討中ですが、だいぶ扱いやすいものになりそう。

```tsx
function loader() {
  const { title, content } = await loadArticle();
  return {
    articleHeader: <Header title={title} />,
    articleContent: <AsyncRenderMarkdownToJSX makdown={content} />,
  };
}

export default function Component() {
  const { articleHeader, articleContent } = useLoaderData();
  return (
    <main>
      {articleHeader}
      <React.Suspense fallback={<LoadingArticleFallback />}>
        {articleContent}
      </React.Suspense>
    </main>
  );
}
```

出典: [RFC: React Elements and Promises as loader / action data](https://github.com/remix-run/remix/discussions/8048)

<!-- 1分: RemixはRSCのようなパラダイムシフトを強制しません。これは大きな利点です。将来的にRSC対応の予定はありますが、より扱いやすい形になりそうです。このアプローチにより、既存のスキルセットを活かしつつ、徐々に新しい技術を取り入れることができます。 -->

---

## 7. 最もダウンロードされてる React フレームワークになりそう

- 次バージョン Remix v3 は、**React Router v7** という名前になります(同じチームが開発)。
- React Router は Next.js よりも多くダウンロードされています。

![react-router-vs-next-vs-remix](/images/npmtrends-nextjs-remix-react-router.png)

出典: [npmtrends](https://npmtrends.com/@remix-run/react-vs-next-vs-react-router)

<!-- 30秒: 最後に、Remixの将来性について触れたいと思います。次のバージョンのRemixは、React Router v7として提供される予定です。React RouterはNext.jsよりもダウンロード数が多く、これはRemixの潜在的な影響力の大きさを示しています。 -->

---

# まとめ：Remix の魅力

1. **Web標準への回帰** - シンプルで直感的、覚えやすく読みやすい

2. **透明性の高さ** - 妙な抽象化やブラックボックスがなく、全てが追跡可能

3. **クリアなデータフロー** - loader/action/component の明確な責務分離

4. **段階的な機能強化** - プログレッシブエンハンスメントの実現

5. **柔軟な適用範囲** - SSRからSPAまで、同じ概念で対応可能

6. **将来への適応性** - 既存コードを活かしつつRSCなど新技術へも柔軟に対応

7. **コミュニティの成長** - React Routerとの統合による広範な採用

Remixは、Web開発の本質に立ち返りつつ、
現代的なニーズに応える「ちょうどいい」フレームワーク

**「Web開発、こうあるべきだよね」**
と思わせてくれる

シンプルで強力、直感的で柔軟、そして楽しくて堅実なフレームワークです。

<!-- 1分: まとめると、Remixは「Web開発、こうあるべきだよね」と思わせてくれるフレームワークです。Web標準への回帰、高い透明性、クリアなデータフロー、段階的な機能強化の容易さ、柔軟な適用範囲、そして将来への適応性。これらの特徴が、Remixを現代的なニーズに応える「ちょうどいい」フレームワークにしています。シンプルで強力、直感的で柔軟、そして楽しくて堅実。それがRemixなのです。ご清聴ありがとうございました。 -->

---

```yaml
layout: end
```

Thank you.

coji

https://x.com/techtalkjp

---

```yaml
layout: cover
background: https://cover.sli.dev
```

# 向こう1年どうなる？

現状の Remix v2 から、次のRemix v3 = React Router v7へ。<br />
そして、その先へ。

---

# Remix v3 = React Router v7

Remix の次バージョンである v3 は React Router v7 という名前になります。

<img class="rounded" src="https://remix.run/blog-images/posts/merging-remix-and-react-router/react-router-remix-graphic.jpeg" alt='roadmap' />

---

# React Router v7 への移行に向けて

ステップの見通し

1. 最新の Remix v2.x を維持する
2. Future Flags を個別に有効化して動作確認
   - 3-1: 軽微な future flags に対応する
   - 3-2: **single fetch** に対応する
3. React Router v7 への移行
4. 開発動向に注意する

---

# ステップ1: 最新の Remix v2.x を維持する

定期的に最新の Remix v2.x バージョンにアップデートしてください：

```bash
npm install @remix-run/react@latest @remix-run/node@latest
```

これにより、最新の機能とバグ修正が確保され、将来の移行がスムーズになります。

---

# ステップ2: Future Flags を個別に有効化

vite.config.ts で Future Flags を有効化し、個別にテストします：

```javascript
remix({
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    unstable_lazyRouteDiscovery: true, // 遅延ルート発見
    // unstable_singleFetch: true, // 後のステップで有効化
  },
})
```

各フラグを有効にした後、アプリケーションの動作を慎重にテストしてください。

---

# ステップ2-1: 軽微な future flags に対応する

対応が必要な Future Flags

- **v3_fetcherPersist**: フェッチャーの永続化
- **v3_relativeSplatPath**: 相対スプラットパスの変更
- **v3_throwAbortReason**: アボート理由のスロー
- **unstable_lazyRouteDiscovery**: 遅延ルート発見機能 (大規模アプリでのバンドルサイズ削減)

これらのフラグを順次有効化し、アプリケーションの動作を確認してください。
`unstable_lazyRouteDiscovery` はまだ unstable ではありますが、コードの変更はまず不要と思われます。

---

# ステップ2-2: single fetch に対応する

シングルフェッチの準備 ※ まだ unstable なので、安定化されてから対応することをお勧めします。

- クライアントサイド遷移時、単一の HTTP リクエストだけで処理が行われるようになります。
  - これまでは個別ルートごとにパラレルに loader が呼ばれる fetch が走っていました。
- loader と action からの裸のオブジェクト（Date, Error, Promise, RegExp など）の送信が可能に
- シリアル化の処理とレスポンス ステータス/ヘッダーの渡し方に変更があるため、既存のコードの一部見直しが必要 (認証のセッションや toast 等に影響か)

---

# ステップ3. React Router v7 への移行

予想される移行プロセス（半年以内?）

- Future Flags が有効な場合、ほぼシームレスな移行
- 主な変更点：import ステートメントの更新
- 例: `@remix-run/react` → `react-router`
- コードモッドツールが提供される予定
- 実際のコードロジックの変更は最小限か不要と予想

移行時期が近づいたら、公式ドキュメントを確認し、具体的な手順に従ってください。

---

# Remixの今後の展望

これまでの Remix は React Router になります。では、新しい Remix (v4?)は？<br />
Remix の開発者である Ryan Florence は以下のようにブログに書いています。

Remixの今後の展望：大きな変革の予感

- React 19 と RSC により、Remixの基本概念が劇的に変わる可能性
- 新API "Reverb" 開発中：現行版とは「大きく異なる」アプローチ
- ただし、段階的な採用を可能に：
  - React Router v7 で現行版と新版の並行運用を実現
- Remixの名前とコミュニティは維持
- 近い将来、革新的な新APIを公開予定

※ 出典: [Incremental Path to React 19: React Conf Follow-Up](https://remix.run/blog/incremental-path-to-react-19#rsc-changes-remix)

ちょっと不安もありますが、今後どうなっていくのか、要チェックですね！
