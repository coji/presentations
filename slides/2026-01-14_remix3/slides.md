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
  <p class="text-sm opacity-50">2025年1月14日 Offers フロントエンドカンファレンス</p>
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
<div>

<iframe
  src="https://remix-task-manager-eight.vercel.app/"
  class="w-full h-full rounded-lg border border-gray-300"
  allow="clipboard-write"
/>

</div>
</div>

---

# useState がない

React と Remix 3 のコードを比較してみます。

<div class="grid grid-cols-2 gap-4">
<div>

### React

```tsx {2}
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

```tsx {2,5-6}
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

---

# useEffect がない

<div class="grid grid-cols-2 gap-4">
<div>

### React

```tsx {4-11}
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

```tsx {4-7,9-12}
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

# カスタムフックの代わりに ViewModel

<div class="grid grid-cols-2 gap-4">
<div>

### React

```tsx {2,5-10}
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = (title: string) => {
    setTasks(prev => [...prev, {
      id: nextId++,
      title,
      completed: false
    }])
  }

  return { tasks, addTask }
}
```

</div>
<div>

### Remix 3

```tsx {1,10}
class TaskViewModel extends EventTarget {
  tasks: Task[] = []

  addTask(title: string) {
    this.tasks.push({
      id: this.nextId++,
      title,
      completed: false
    })
    this.dispatchEvent(new Event('change'))
  }
}
```

</div>
</div>

<v-click>

**EventTarget** は Web 標準 API。ブラウザにもともとある機能。

</v-click>

---

# これの何が面白いのか

React の独自作法と Web 標準の対比

| やりたいこと | React | Remix 3 |
|------------|-------|---------|
| 状態を持つ | useState | 普通の変数 |
| 副作用 | useEffect | そのまま書く |
| クリーンアップ | return 関数 | AbortSignal |
| ロジック再利用 | カスタムフック | EventTarget 継承 |

<v-click>

Remix 3 は「React の作法」ではなく<br>
「**JavaScript と Web 標準の作法**」で同じことをやろうとしている。

</v-click>

<v-click>

まだ機能は少ないけど、この方向性で発展していくのが楽しみ。

</v-click>

---

# おまけ: 同じ ViewModel が React でも動く

さっきの TaskViewModel、実は React でもそのまま使えます。

```tsx {5-6}
// React で使う場合
function useTaskViewModel() {
  return useSyncExternalStore(
    (cb) => {
      vm.addEventListener('change', cb)
      return () => vm.removeEventListener('change', cb)
    },
    () => vm
  )
}
```

<v-click>

EventTarget は Web 標準だから、どのフレームワークでも動く。

これが「フレームワーク非依存」の意味です。

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

<v-click>

気になったら記事を読んでください:

- 基本編: Remix 3 の新コンポーネントライブラリを試してみた
- 応用編: セマンティックイベントと ViewModel でフレームワーク依存を減らす

</v-click>

---

layout: end
---

# ありがとうございました

<div class="text-sm">

- 記事: https://zenn.dev/coji/articles/remix-3-component-library-trial
- 記事: https://zenn.dev/coji/articles/remix-3-interaction-and-viewmodel
- デモ: https://remix-task-manager-eight.vercel.app/
- GitHub: https://github.com/coji/remix-task-manager

</div>
