---
theme: seriph
background: https://cover.sli.dev
title: Remix の細かすぎて伝わらない好きなところ
class: text-center
highlighter: shiki
transition: slide-left
mdc: true
download: true
---

# Remix の細かすぎて伝わらない好きなところ

---

# 自己紹介: 溝口浩二 coji

東京在住のプログラマ。 [X](https://x.com/techtalkjp) | [GitHub](https://github.com/coji)

<img src="/images/coji.jpg" className='rounded-full absolute top-8 right-24 w-16' alt="coji" />

- [TechTalk (ひとり法人)](https://www.techtalk.jp) ← フリークアウト ← ドワンゴ
  - 主にクライアントワークで、新規事業開発に伴う MVP のひとり開発をよくやってます。
  - 数社で技術/開発アドバイザー。

- 数人規模で作られてるめっちゃ便利なものが好き。
  - 推し: Remix, Conform, DuckDB, Flyio

- Remix が便利なので2年前から仕事で使っています。語りたい！
  - [Remix Tokyo Meetup](https://www.meetup.com/remix-tokyo/) オーガナイザー
  - 数ヶ月以内にまた都内でオフラインの小規模ミートアップを企画中
  - Remix の Discord で日本語OKチャンネルもできました。ぜひ。

---

## 1. Web標準がベースになっている

- Web といえば、Request と Response
- Web開発の基本に立ち返る爽快感
- わかりやすい = 覚えやすい = 読みやすい = 間違いにくい

```tsx
import { json, redirect } from '@remix-run/node'

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("q");
  return json({ search }); // json の Response を返すヘルパー関数
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  return redirect(`/hello/${name}`); // location ヘッダ付きの Reponse を返すヘルパー関数
}
```

Web標準の仕様(MDN): [Request](https://developer.mozilla.org/ja/docs/Web/API/Request), [Response](https://developer.mozilla.org/ja/docs/Web/API/Response), [URL](https://developer.mozilla.org/ja/docs/Web/API/URL_API), [URLSearchParams](https://developer.mozilla.org/ja/docs/Web/API/URLSearchParams), [FormData](https://developer.mozilla.org/ja/docs/Web/API/FormData)

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

---

## 3. クリアなデータフロー

- loader / action / component で、コンパクトに責務を分離。
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
    <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
    <form method="post">
      <input name="name" />
      <button type="submit">submit</button> 
    <form>
  );
}
```

---

## 3 (cont). クリアなデータフロー 認証ガードの例

- loader で認証ガード。
- 表示側では認証されてるのを前提にできて、めっちゃシンプルに!
- データフローがわかりやすいことの好例。

```tsx
export const loader = ({ request }) => {
  const user = await requireUser(request); // ログインしていなかったらログイン画面にリダイレクト
  return json({ user });
}

export default function Dashboard() {
  const { user } = useLoaderData(); // 認証してる前提になるので user は必ずある！
  return (<h1>Welcome, {user.name}</h1>);
}
```

---

## 4. 「段階的に強化」ができる

- 最低限の機能性で一旦リリース。
- あとで時間ができたらいろいろ工夫して UX を向上。

```javascript
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
    </Form>
  );
}
```

---

## 5. SPA mode が超イイ

- API サーバがある前提での業務用Webアプリに最適。
- SSR 時と同じノリで書ける (loader の代わりに clientLoader)
- 普通の SPA に比べると、状態管理ほぼ不要に。シンプル！

```javascript
import { clientLoader } from "@remix-run/react";
import { apiRequest } from 'app-admin-api'

export const clientLoader = async ({ request }) => {
  const posts = await apiRequest('posts')
  return posts;
};

export default function PostIndexPage() {
  const posts = useLoaderData();
  return (<div>
    {posts.map((post) => (
      <div key={post.id}>
        <div>{post.title}</div>
        <div>{post.body}<div>
      </div>
    ))}
    </div>)
}
```

---

## 6. つらい React Server Component (RSC) 対応が不要

- 別にそこまでして...パラダイム転換が必要ですか？
- Remix も 将来的に RSC 対応は検討中だが、だいぶ扱いやすいものになりそう。

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

---

## 7. 最もダウンロードされてる React フレームワークになりそう

- 次バージョン Remix v3 は、**React Router v7** という名前になります(同じチームが開発)。
- React Router は Next.js よりも多くダウンロードされています。

![react-router-vs-next-vs-remix](/images/npmtrends-nextjs-remix-react-router.png)

出典: [npmtrends](https://npmtrends.com/@remix-run/react-vs-next-vs-react-router)

---

# まとめ：Remix の魅力

1. **Web標準への回帰** - シンプルで直感的、覚えやすく読みやすい

2. **透明性の高さ** - 妙な抽象化やブラックボックスがなく、全てが追跡可能

3. **クリアなデータフロー** - loader/action/component の明確な責務分離

4. **段階的な機能強化** - プログレッシブエンハンスメントの実現

5. **柔軟な適用範囲** - SSRからSPAまで、同じ概念で対応可能

6. **将来への適応性** - RSCなど新技術へも柔軟に対応

7. **コミュニティの成長** - React Routerとの統合による広範な採用

Remixは、Web開発の本質に立ち返りつつ、
現代的なニーズに応える「ちょうどいい」フレームワーク

**「Web開発、こうあるべきだよね」**
と思わせてくれる

シンプルで強力、直感的で柔軟、そして楽しくて堅実なフレームワークです。
