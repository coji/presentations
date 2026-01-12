---
theme: default
title: Remix 3 ディスカッション
info: 深掘りトピック集
author: coji
transition: slide-left
mdc: true
---

# ディスカッション用スライド

LT の続き - もう少し突っ込んだ話

---
layout: section
---

# 論点1

Remix 3 の状態管理ってどうなる？

---

# カスタムフックがない問題

React だとロジックをカスタムフックに切り出す

```tsx
function useTasks() { ... }
function useAuth() { ... }
```

Remix 3 にはカスタムフックがない。どうする？

---

# 自分の試み: ViewModel パターン

EventTarget ベースだから、ViewModel に切り出せる

```tsx
class TaskViewModel extends EventTarget {
  tasks: Task[] = []

  addTask(title: string) {
    this.tasks.push({ id: this.nextId++, title, completed: false })
    this.emit()
  }

  toggleTask(id: number) {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.emit()
    }
  }

  private emit() {
    this.dispatchEvent(new Event('change'))
  }
}
```

---

# ViewModel パターンのメリット

- 純粋な TypeScript、フレームワーク非依存
- vitest でそのままテストできる
- Repository パターンや DI も自然にできる
- React でも同じ ViewModel を useSyncExternalStore で使える

---

# Provider ラッパーは要らない

```tsx
function App(this: Handle) {
  const vm = new TaskViewModel()
  this.on(vm, { change: () => this.update() })
  vm.load()

  return () => (
    <TaskList tasks={vm.filteredTasks} />
  )
}
```

`<TaskContext.Provider value={...}>` で囲む必要がない。シンプル。

**補足**: 子コンポーネントに渡すなら `this.context.set(vm)` も使える。

---
layout: section
---

# 論点2

CustomEvent の良さとは？

---

# 単なる 'change' イベントじゃない

```tsx
// 単なる状態変更通知
this.dispatchEvent(new Event('change'))
```

```tsx
// ドメインイベントの表現
this.dispatchEvent(new CustomEvent('reservation:confirmed', {
  detail: { id: '123', confirmedAt: new Date() }
}))
```

「予約が確定した」「予約がキャンセルされた」といった<br>
**ビジネスロジックのイベント**を Web 標準 API で表現できる

---

# TypedEventTarget で型安全に

@remix-run/interaction には TypedEventTarget がある

```tsx
type ReservationEvents = {
  'reservation:confirmed': CustomEvent<{ id: string; confirmedAt: Date }>
  'reservation:cancelled': CustomEvent<{ id: string; reason: string }>
}

class ReservationViewModel extends TypedEventTarget<ReservationEvents> {
  confirm(id: string) {
    this.dispatchEvent(new CustomEvent('reservation:confirmed', {
      detail: { id, confirmedAt: new Date() }
    }))
  }
}
```

addEventListener の型が効く。型補完もバッチリ。

---

# ドメインイベントが Web 標準で書ける意味

`reservation:confirmed` は Remix 専用の機能じゃない

```tsx
// このコードは React でも Vue でも Vanilla JS でも動く
const vm = new ReservationViewModel()

vm.addEventListener('reservation:confirmed', (e) => {
  console.log(`予約 ${e.detail.id} が確定しました`)
})
```

ドメインロジックがフレームワークに依存しない。

10年後に React がなくなっても、このコードは動く。

---

# 一休方式との接点

一休レストランの記事「React/Remix への依存を最小にするフロントエンド設計」

```
┌─────────────────────────────────────────┐
│  コンポーネント層（React / Remix 3）    │  ← 表示責務のみ
├─────────────────────────────────────────┤
│  アダプター層                           │  ← useSyncExternalStore / this.on
├─────────────────────────────────────────┤
│  Vanilla JS ロジック層                  │  ← EventTarget ベースの ViewModel
└─────────────────────────────────────────┘
```

Web 標準だから、React でも Vue でも Svelte でも Vanilla JS でも動く

---
layout: section
---

# 論点3

「覇権」はどうなる？

---

# 正直な回答

覇権は取らないと思う。興味もない。

- React Router v7 が React エコシステムを担当
- Remix 3 は「別の選択肢」を提示しているだけ
- エコシステムもまだ発展途上

---

# でも価値はある

- 「React の当たり前を相対化する」ことに価値がある
- useState、useEffect、Context が「必須」ではないと気づける
- その気づきは React 開発にも活かせる

---

# フレームワーク選びの軸

「どれが勝つか」より「何を重視するか」で選ぶべき

- 一休みたいに10年以上続くプロダクトなら、Web 標準に寄せる価値がある
- 短期のプロジェクトなら React のエコシステムを活かした方がいい
- 両方知っておくことで選択肢が増える

AI でコード生成が当たり前になっても、<br>
「何を生成させるか」の設計判断は人間がする

---
layout: section
---

# その他のトピック

質問があれば

---

# class への抵抗感

- 自分も正直 class には抵抗がある
- React の関数コンポーネント + Hooks に慣れていると古臭く感じる
- ただ EventTarget 自体が class ベースの API なので、継承が自然

---

# 継承 vs 委譲

<div class="grid grid-cols-2 gap-4">
<div>

### 継承パターン

```tsx
class TaskViewModel extends EventTarget {
  // ...
}
```

</div>
<div>

### 委譲パターン

```tsx
function createTaskViewModel() {
  const emitter = new EventTarget()
  return {
    subscribe: (fn) =>
      emitter.addEventListener('change', fn),
    // ...
  }
}
```

</div>
</div>

EventTarget を使う以上どこかで `new EventTarget()` は必要。<br>
継承で持つか委譲で持つかの違い。好みの問題。

---

# Remix 3 コンポーネントの補足

- `connect` 属性で DOM 要素への参照を取得（React の ref 相当）
- 関数を返す関数という構造（初期化とレンダリングの分離）
- JSX はほぼ同じ、`className` じゃなくて `class`

---

# モバイルへの可能性（妄想）

Remix 3 の設計は SwiftUI や Jetpack Compose と共通点がある

- 普通の変数で状態管理
- EventTarget ベースの変更通知
- セマンティックなインタラクション

将来「Remix Native」のようなものが出てきたら、<br>
同じ ViewModel を Web とモバイルで共有できるかも？

---
layout: end
---

# 質問・議論しましょう

<div class="text-sm">

- 記事: https://zenn.dev/coji/articles/remix-3-component-library-trial
- 記事: https://zenn.dev/coji/articles/remix-3-interaction-and-viewmodel
- デモ: https://remix-task-manager-eight.vercel.app/

</div>
