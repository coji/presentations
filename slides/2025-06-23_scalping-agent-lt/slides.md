---
theme: default
background: https://cdn.jsdelivr.net/gh/slidevjs/slidev-covers@main/static/vg0Mph2RmI4.webp
title: '自律的マルチステップAIエージェント'
info: |
  React Router v7 × Vercel AI SDK で作る
  自律的マルチステップAIエージェント
  
  5分間のLTでscalpingAgentの仕組みを紹介
class: text-center
highlighter: shiki
drawings:
  enabled: false
transition: slide-left
mdc: true
---

# 自律的マルチステップAIエージェント

React Router v7 × Vercel AI SDK で作る scalpingAgent

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    2025/06/23 Remix Tokyo LT
  </span>
</div>

---

# 自己紹介

<div class="flex items-center gap-8">
  <img src="/images/coji.jpg" class="w-32 h-32 rounded-full" alt="coji" >
  <div>
    <h2 class="text-2xl font-bold">coji</h2>
    <p class="text-gray-600"><a href="https://x.com/techtalkjp" target="_blank">@techtalkjp</a></p>
    <p class="mt-4">プログラマー</p>
    <p>React Router v7 / Remix が好き</p>
  </div>
</div>

---

# 今日話すこと

React Router v7 + Vercel AI SDK でマルチステップAIエージェントを作り、雰囲気で株取引をしました。

**scalpingAgent** - 自律的なマルチステップAIエージェント

- 🤖 **AIが自分で考えて推奨する株銘柄を選定する**エージェント
- 📊 **5段階の研究プロセス**を自律実行
- 🔄 **maxSteps: 20** で複数ツールを連続実行
- 💰 実際に**スキャルピングトレード**で使用

※ スキャルピング = 数分〜30分以内の超短期トレード

<img width="400" src="https://info.monex.co.jp/image/fx/guide/scalping/img02.png" alt="scalping-image" >

---

# デモ

http://localhost:5173

---

# 核心機能: maxSteps

**従来のAI**: 1つのツールを実行して終了 (maxSteps: 1)

**scalpingAgent**: AIが自律的に5段階を連続実行 (maxSteps: 20)

```typescript
await streamText({
  model: google('gemini-2.5-flash'),
  tools: { /* 5種類のカスタムツール */ },
  maxSteps: 20,  // ← ここがポイント！
  system: systemPrompt
})
```

<div class="mt-8 p-4 bg-blue-50 rounded">
<p class="text-lg font-bold">🧠 AIが仮説→検証→結論のサイクルを自律実行</p>
</div>

---

# システムプロンプト（抜粋）

```text
# 東証スキャルピング研究エージェント - 段階的分析システム

あなたは科学的手法を用いて段階的にスキャルピング機会を研究する専門エージェントです。
DeepResearchのように、仮説→検証→結論のサイクルを通じて最適解を発見します。

## 🔬 研究プロセス（5段階）

### 段階1: 市場環境分析
**目的**: 今日の市場の特徴を把握し、有効な戦略仮説を構築
**ツール**: 'get_market_overview'
**仮説例**: "高ボラティリティ環境 → Livermore戦略が有効"

### 段階2: 候補銘柄の発見  
**目的**: 仮説に基づき有望な銘柄を収集。最低20銘柄を抽出。
**ツール**: 'get_stock_rankings'

### 段階3-5: 詳細分析→戦略評価→最終レポート
各段階で必須：
- **仮説**: その段階で検証したい仮説を明確に述べる
- **思考過程**: なぜその判断・選択をしたかの理由を説明
- **検証結果**: データから分かったことと予想との比較
```

---

# 実際のトレード実績

<div class="flex justify-center">

|  | 取引回数 | 損益 |
|---|---|---|
| 3月 | 13 | <span class="text-red-500">¥-122,340</span> |
| 4月 | 17 | <span class="text-green-500">¥23,380</span> |
| 5月 | 24 | <span class="text-green-500">¥126,890</span> |
| 6月 | 22 | <span class="text-green-500">¥92,186</span> |
| **総計** | **74** | <span class="text-green-500 font-bold">¥120,116</span> |

</div>

<div class="mt-8 text-center">
<p class="text-sm text-gray-600">初月は損失も、システム改善で安定利益に</p>
</div>

---

# まとめ

**Vercel AI SDK + React Router v7** で簡単にマルチステップAIエージェントが作れる

<v-clicks>

- **`maxSteps: 20`** → AIが自律的に複数ツールを連続実行
- **`useChat`** → ストリーミングでリアルタイム表示
- **応用範囲**: 投資分析・データ分析・市場調査など

<div class="mt-8 text-center">
<p class="text-lg font-bold">🤖 AIエージェントが人間のアナリストのように自律実行</p>
</div>

</v-clicks>

---

# ありがとうございました

<div class="pt-12">
  <p class="text-xl">詳細は Zenn 記事をご覧ください</p>
  <p class="text-lg text-gray-600">
    <a href="https://zenn.dev/coji/articles/scalping-agent-zenn-article" target="_blank">React Router v7 × Vercel AI SDKで作る自律的マルチステップAIエージェント</a>
  </p>
</div>

<div class="pt-8">
  <p>@techtalkjp</p>
</div>
