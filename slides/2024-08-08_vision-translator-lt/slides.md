---
theme: default
background: https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## 海外のプログラマーと会話するための翻訳アプリ（仮）
  Apple Vision Pro ユーザーミートアップ LT
transition: slide-left
title: 海外のプログラマーと会話するための翻訳アプリ（仮）
---

# 海外のプログラマーと会話するための翻訳アプリ（仮）

2024-08-08 coji

---

# 自己紹介: 溝口浩二 coji

プログラマー。数人規模で作られてるめっちゃ便利なものが好き。

<img src="/images/coji.jpg" className='rounded-full absolute top-8 right-24 w-16' alt="coji" />

<v-click>
Remix Tokyo Meetupのオーガナイザー
</v-click>

<v-click>

- React のフルスタックフレームワーク ”Remix" を使った開発者のミートアップ。
- 世界各国にそれぞれオーガナイザーがいて Discord でやりとりがある。
<img src="/images/remix-meetups.png" alt="remix meetups" className="rounded w-90">

</v-click>

<v-clicks>

- みんな日本に興味津津。「訪日するかもしれないからそのときはミートアップに呼んでよ」と言われてる。
- 楽しそう。だけど私は英語は全然喋れない。仕事でも関西弁のノリとジェスチャーで乗り切ってきました。
- 好きなものが同じプログラマー同士なので、せっかくなら技術的なおしゃべりをしたい。

</v-clicks>

<v-click>
→ Apple Vision Pro + LLM でどこまでできるかな？
</v-click>

---

# 買ってしまったので作るしかない

<v-clicks>

- ノリで登壇駆動。Swift / iOS 開発未経験なのに LT まで 1ヶ月。
- 1ヶ月あれば、なんとかなるだろ、と思ってた。ChatGPT あるしな！

</v-clicks>

<v-click>

- 甘かった。
  - Swift / SwiftUI / 各種フレームワークの学習
  - Swift Concurrency? Observation Framework???
  - 「@なんとか」を書いて動かしては、翌日忘れる毎日。
  - ARKit や RealityKit は断念。無理！

</v-click>

<v-click>

アプリ中核の技術的な要素自体はそんなに難しくなかったので、Apple のサンプルアプリを参考にしたった。

- アルタイム音声認識と文字起こしは AVFoundation と Speech Framework で。
- gpt-4o-mini で 翻訳 (MacPaw/OpenAI)

</v-click>

---

# デモ

とりあえず YouTube にあった Steve Jobs のスピーチを使用

<iframe width="823" height="463" src="https://www.youtube.com/embed/JIK_UcH7-Bs?si=5twltMuRPY_e-L4d" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

# 今後も趣味的にほそぼそやっていきたい

Apple Vision Pro を買ってしまったので仕方ない。サンクコストの誤謬を活用するぞ！

- ネイティブのトークスピードにも対応したい (今は75%再生じゃないとダメ)
- 日本語・英語の自動判別切り替えしたい
- 話者識別もしたいな！
- Google Meets や Discord でも使いたい
- 字幕を常に見てる下あたりに固定したい
- UX の向上 (もろもろ細かいやつ)

---

```yaml
layout: center
class: text-center
```

# Thank You

ソースコード: https://github.com/coji/visionos-example

X: [@techtalkjp](https://x.com/techtalkjp)

<!--
ご清聴ありがとうございました。詳細はGitHubをご覧ください。質問やフィードバックをお待ちしています。
-->