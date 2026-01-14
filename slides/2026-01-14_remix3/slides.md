---
theme: default
title: Remix 3 ってどんなもの？
info: React ユーザーのための 10 分イントロ
author: coji
transition: slide-left
mdc: true
---

# Remix 3 ってどんなもの？

React ユーザーのための 10 分イントロ

<div class="absolute bottom-10">
  <p>coji</p>
  <p class="text-sm opacity-50">2025年1月14日 #Offers_DeepDive</p>
</div>

---

# 自己紹介

coji です。

<v-clicks>

- 普段は **React Router v7** を使って開発しています
- Remix 3 を仕事で使う予定は正直ありません
- でも触ってみたら面白かった
- 今日はその「面白さ」を共有します

</v-clicks>

---

# Remix 3 とは

2025年10月にデモ公開、12月に npm 公開

<v-click>

ここで大きな分岐が起きました。

</v-click>

<v-clicks>

- **React Router v7**: React エコシステムに深く統合
- **Remix 3**: React から離れて Web 標準ベース

</v-clicks>

<v-click>

今日話すのは Remix 3 の方です。

</v-click>

---

# デモ

<div class="grid grid-cols-2 gap-4 h-[400px]">
<div>

タスク管理アプリです。見た目は普通ですよね。

<v-clicks>

- タスクの追加、完了、削除
- **長押し**で編集モード
- **矢印キー**でタスク間を移動

</v-clicks>

<v-click>

でも中身は React じゃありません。

</v-click>

</div>
<div class="flex flex-col gap-2 h-full">

<iframe
  src="https://remix-task-manager-eight.vercel.app/"
  class="w-full flex-1 rounded-lg border border-gray-300"
  allow="clipboard-write"
/>

<div>
<a href="https://github.com/coji/remix-task-manager" target="_blank" class="text-xs text-blue-400 hover:underline"><span>https://github.com/coji/remix-task-manager</span></a>
</div>

</div>
</div>

---

# useState がない

React と Remix 3 のコードを比較してみます。

<div class="grid grid-cols-2 gap-4">
<div>

### React

```tsx {|2}
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

</div>
<div>

### Remix 3

```tsx {|2,5-6}
function Counter(this: Handle) {
  let count = 0
  return () => (
    <button on={{ click: () => {
      count++
      this.update()
    }}}>
      {count}
    </button>
  )
}
```

</div>
</div>

<v-click>

useState がない。**普通の JavaScript 変数**。

</v-click>

<v-click>

再描画は自動じゃない。**`this.update()` を呼ぶまで画面は変わらない**。

</v-click>

---

# useEffect がない

<div class="grid grid-cols-2 gap-4">
<div>

### React

```tsx {|4-11}
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setCount(c => c + 1),
      1000
    )
    return () => clearInterval(id)
  }, [])

  return <div>{count}</div>
}
```

</div>
<div>

### Remix 3

```tsx {|4-7,9-12}
function Timer(this: Handle) {
  let count = 0

  const id = setInterval(() => {
    count++
    this.update()
  }, 1000)

  this.signal.addEventListener(
    'abort',
    () => clearInterval(id)
  )

  return () => <div>{count}</div>
}
```

</div>
</div>

<v-click>

useEffect がない。クリーンアップは **AbortSignal**（Web 標準）。

</v-click>

---

# createContext / useContext がない

ダークモードを複数コンポーネントで共有したい場合

<div class="grid grid-cols-2 gap-4">
<div>

### React

```tsx {|1-2,4-9}
const ThemeContext = createContext(null)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

</div>
<div>

### Remix 3

```tsx {|1-7}
class ThemeStore extends EventTarget {
  value = 'light'
  toggle() {
    this.value = this.value === 'light' ? 'dark' : 'light'
    this.dispatchEvent(new Event('change'))
  }
}
```

</div>
</div>

<v-click>

**EventTarget** は Web 標準 API。状態変更を通知できる。

</v-click>

---

# Remix 3 での Context の使い方

ThemeStore を提供する側と使う側

<div class="grid grid-cols-2 gap-4">
<div>

### 提供する側

```tsx {|3-4}
function ThemeProvider(this: Handle) {
  const theme = new ThemeStore()
  this.context.set(theme)
  this.on(theme, { change: () => this.update() })

  return ({ children }) => (
    <div class={theme.value === 'dark' ? 'dark' : ''}>
      {children}
    </div>
  )
}
```

</div>
<div>

### 使う側

```tsx {|2-3}
function ThemeToggle(this: Handle) {
  const theme = this.context.get(ThemeProvider)
  this.on(theme, { change: () => this.update() })

  return () => (
    <button on={{ click: () => theme.toggle() }}>
      {theme.value === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

</div>
</div>

<v-click>

`this.context.set/get` で共有、`this.on()` で購読して `this.update()` で再描画。

</v-click>

---

# これの何が面白いのか

React の独自作法と Web 標準の対比

| やりたいこと | React | Remix 3 |
|------------|-------|---------|
| 状態を持つ | useState | 普通の変数 |
| 再描画 | 自動 | this.update() |
| 副作用 | useEffect | そのまま書く |
| クリーンアップ | return 関数 | AbortSignal |
| 状態の共有 | createContext + useContext | EventTarget + this.on() |

<v-click>

Remix 3 は「React の作法」ではなく<br>
「**JavaScript と Web 標準の作法**」で同じことをやろうとしている。

</v-click>

<v-click>

まだ機能は少ないけど、この方向性で発展していくのが楽しみ。

</v-click>

---

# おまけ: 同じ ThemeStore が React でも動く

さっきの ThemeStore クラス、実は React でもそのまま使えます。

<div class="grid grid-cols-2 gap-4">
<div>

### ThemeStore（再掲）

```tsx
class ThemeStore extends EventTarget {
  value = 'light'
  toggle() {
    this.value = this.value === 'light' ? 'dark' : 'light'
    this.dispatchEvent(new Event('change'))
  }
}
```

</div>
<div>

### React での使い方

```tsx {|4-5}
const theme = new ThemeStore()

function useTheme() {
  return useSyncExternalStore(
    (cb) => {
      theme.addEventListener('change', cb)
      return () => theme.removeEventListener('change', cb)
    },
    () => theme.value
  )
}
```

</div>
</div>

<v-click>

EventTarget は Web 標準だから、**React でも Vue でも Svelte でも動く**。

</v-click>

---

# まとめ

**Remix 3 は Web 標準 + JavaScript ネイティブで UI を作る試み**

<v-clicks>

- useState → 普通の変数
- useEffect → そのまま書く + AbortSignal
- カスタムフック → EventTarget 継承の ViewModel

</v-clicks>

<v-click>

まだ発展途上だけど、React とは違うアプローチとして面白い。

</v-click>

---
layout: end
---

# ありがとうございました

<div class="text-sm">

気になったら記事を読んでください:

- [Remix 3 の新コンポーネントライブラリを試してみた](https://zenn.dev/coji/articles/remix-3-component-library-trial)
- [セマンティックイベントと ViewModel でフレームワーク依存を減らす](https://zenn.dev/coji/articles/remix-3-interaction-and-viewmodel)
- [デモアプリ](https://remix-task-manager-eight.vercel.app/) / [GitHub](https://github.com/coji/remix-task-manager)

</div>
