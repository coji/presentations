---
---

# Conform を推す

Web標準とReactの進化に寄り添うフォームバリデーション

溝口浩二 [@techtalkjp](https://x.com/techtalkjp)

- プログラマー
- 数人規模で作られてるめっちゃ便利なものが好き
- remix, conform, fly.io, duckdb, turso 推しです

---

## フォームライブラリ、何使ってますか？

<v-clicks depth="2">

- React Hook Form (RHF) 使ってる人 🙋‍♂️
- 柔軟で使いやすいですよね。
- みんな使ってて安心ですね！（いまは）
- でも、ちょっとフォームやフィールドまわりのコードがゴチャつきません？
- 覚えること意外に多くないです？
  - そしてそれを毎回忘れませんか？
- React 19 への対応、どうします...?

</v-clicks>

<v-click>
そこで
</v-click>

<v-click>

<div class="text-8xl mx-auto text-center mt-8">
Conform を推す
</div>

</v-click>

---

## Conformとは？

<v-clicks>

- Web標準のHTMLフォームを拡張するフォームライブラリ
- サーバーサイドとの連携を**第一**に設計。
- **フォーム周りのコードがシンプルに。**
  - 覚えやすい。忘れない。

</v-clicks>

<v-click>

以下、私が Conform の好きなところを、ご紹介していきます。

</v-click>

---

## 1. JSX がスッキリ

- Web標準に準拠したシンプルな記述
- `getFormProps`, `getInputProps` で見通し◎

```tsx
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

function MyForm() {
  const [form, fields] = useForm({
    onValidate: ({ formData }) => parseWithZod(formData, { schema });
  });

  return (
    <form {...getFormProps(form)}>
      <input {...getInputProps(fields.email, { type: 'email' })} />
    </form>
  );
}
```

---

## 2. アクセシビリティ(a17y)にも対応

- **Web標準のフォーム要素**: そもそも論として、セマンティックなHTMLはa17yの基本
- **ヘルパー関数**: `getFormProps`, `getInputProps` などのヘルパー関数で、<br>
`aria-invalid`, `aria-describedby` などの a17y 属性も自動で設定される。

```html {all|8,9,10}
<form id=":r2:" novalidate>
  <label for=":r2:-email">Email</label>
  <input 
    id=":r2:-email"
    form=":r2:"
    type="email"
    name="email"
    aria-invalid="true"
    aria-describedby=":r2:-email-error" /> <!-- エラー詳細要素のID -->
  <p id=":r2:-email-error">Required</p> <!-- エラー詳細 -->
</form>
```

↑バリデーションエラー時にレンダリングされるHTML

<v-click>

- エラー表示要素に id 属性を設定 (`field.email.errorId`)
- それを示す `aria-describedby` 属性が `input` に自動で設定される
- コントロールに `aria-invalid` 属性が付与されるので、エラー時スタイリングでも使いやすい。

</v-click>

---

## 3. サーバー連携が直感的

- form の submit はサーバーに送信される、という基本に忠実
- React 19 Server Functions に対応。極めて自然な連携。
- React Hook Form: Server Functions には非対応。

```ts
'use server';
export const myAction = async (prevState, formData) => {
  const submission = parseWithZod(formData, { schema });  // formDataをparseして検証
  if (submission.status !== 'success') {
    return submission.reply();
  }
  // 検証成功後の処理
};
```

```tsx
'use client';
function MyForm() {
  const [lastResult, action] = useActionState(myAction, null)
  const [form, fields] = useForm({ lastResult });
  return (
    <form {...getFormProps(form)} action={action}>
      <input {...getInputProps(fields.email, { type: 'email' })} />
    </form>
  );
}
```

---

## 5. プログレッシブエンハンスメント

- ページロード中など JS 無効状態でも動く。
- サーバ側でバリデーションするだけでもバリデーション結果表示。
  - 時間がないときに最低限の実装で、次の機能に進める。
  - 時間ができたらクライアントサイドをリッチに。
- RHF: クライアントサイドJSに依存。ちゃんと全部書く必要あり。

```tsx
import { myAction } from './action';

function MyForm() {
  const [lastResult, action] = useActionState(myAction, null)
  const [form, fields] = useForm({
    // onValidate を設定しない = クライアントサイドでは検証せず。
    lastResult    // lastResult でサーバからの検証結果をフォームに反映
  });

  return (
    <form action={action} {...getFormProps(form)}>
      <input {...getInputProps(fields.email, { type: 'email' })} />
    </form>
  );
}
```

---

## 6. Zod, Yup, Valibot を使ったバリデーション

- `parseWithZod`, `parseWithYup`, `parseWithValibot` で普通にできます。

```tsx {3,11}
import { useForm, getInputProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

function MyForm() {
  const [form, fields] = useForm({
    onValidate: ({ formData }) => parseWithZod(formData, { schema });
  });

  return (
    <form {...getFormProps(form)}>
      <input {...getInputProps(fields.email)} />
    </form>
  );
}
```

---

## まとめ

- Conform: Web標準に回帰し、Reactの進化に寄り添うフォームライブラリ
- JSX のシンプルさ、直感的なサーバー連携
- React 19 の Server Functions にも対応
- 今こそ Conform を試してみませんか？

---

## おまけ

- [Next.js 15 app router での React Hook Form / Conform の様々な書き方デモ](https://form-validate-beige.vercel.app/)

<iframe class="w-full h-100 rounded" src="https://form-validate-beige.vercel.app/" />

---

## リソース

- 公式サイト (日本語): [https://ja.conform.guide/](https://ja.conform.guide/)
- GitHub: [https://github.com/edmundhung/conform](https://github.com/edmundhung/conform)
- Conform 作者 [Edmund の bsky](https://bsky.app/profile/edmundhung.bsky.social)
