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

- React Hook Form (RHF) 使ってる人 🙋‍♂️
- 柔軟で使いやすいですよね。
- （いまは）みんな使ってて安心ですね！

- ちょっとコードがゴチャつきません？
- 覚えること意外に多くないですか？
  - そして忘れませんか？
- React 19 への対応、どうします...?

そこで

---

## Conformとは？

- Web標準のHTMLフォームを拡張するフォームライブラリ
- サーバーサイドとの連携を**第一**に設計。
- **フォーム周りのコードがシンプルに。**
  - 覚えやすい。忘れない。

---

## 1. JSX がスッキリ

- Web標準に準拠したシンプルな記述
- `getFormProps`, `getInputProps` で見通し◎
- RHF: `register` など、JSXにpropsが増えがち

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
- **ヘルパー関数**: `getFormProps`, `getInputProps` などのヘルパー関数で、`aria-invalid`, `aria-describedby` などの a17y 属性も設定される。

```html {all|8,9,10}
<form id=":r2:" novalidate>
  <label for=":r2:-email">Email</label>
  <input 
    id=":r2:-email"
    form=":r2:"
    type="email"
    name="email"
    aria-invalid="true"
    aria-describedby=":r2:-email-error" />
  <p id=":r2:-email-error">Required</p>
</form>
```

※ ↑バリデーションエラー時にレンダリングされるHTML

- `input` に `aria-invalid`, `aria-describedby` 属性が設定。
- エラー表示要素に id 属性を設定 (`field.email.errorId`)
- それを示す `aria-describedby` 属性が `input` に自動で設定される

---

## 3. サーバー連携が直感的

- form の submit はサーバーに送信される、という基本に忠実
- サーバーアクションとの連携が自然
- RHF: `handleSubmit` など、クライアントJSでの処理が中心

```ts
'use server';
export const myAction = async (prevState, formData) => {
  // formDataをparseして検証
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== 'success') {
    return submission.reply();
  }
  // 検証成功後の処理
};
```

---

## 4. React 19 Server Functions に対応

- フォームの状態管理をサーバーに委譲可能
- Reactの最新トレンドに追従
- RHF: Server Functions との連携は検討中

```tsx
'use client'
import { useForm, getInputProps, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { myAction } from './action';

function MyForm() {
  const [lastResult, action] = useActionState(myAction, null)
  const [form, fields] = useForm({
    // クライアントサイドでは検証せず
    lastResult    // lastResult でサーバからの検証結果を表示する
  });

  return (
    <form action={action} {...getFormProps(form)}>
      <input {...getInputProps(fields.email, { type: 'email' })} />
    </form>
  );
}
```

---

## 4. プログレッシブエンハンスメント

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

## 5. Zod, Yup, Valibot を使ったバリデーション

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

## リソース

- 公式サイト (英語): [https://conform.guide/](https://conform.guide/)
- 公式サイト (日本語): [https://ja.conform.guide/](https://ja.conform.guide/)
- GitHub: [https://github.com/edmundhung/conform](https://github.com/edmundhung/conform)
