# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 【最重要】言語設定

**必須要件**: このプロジェクトでは**日本語でのやりとりが必須**です。
- 全ての会話は日本語で行うこと
- コメント・説明・エラーメッセージも日本語で記述すること  
- ログコンパクション後も日本語を維持すること
- 英語での応答は禁止

This project **REQUIRES Japanese communication at all times**. All conversations, comments, and responses must be in Japanese, even after log compaction.

## 【MUST GLOBAL】要求解釈の鉄則 (プロジェクトのCLAUDE.mdより優先)

**適用範囲**: ユーザーからの**機能要求・仕様決定**に関する解釈のみ
**適用外**: 技術的実装手段・エラー対処・ツール操作の詳細

### 曖昧な要求への対応
- **推測禁止**: 不明な点は必ず質問する
- **確認優先**: 「○○という理解で正しいですか？」と確認
- **最小実行**: 明示的に要求されたことのみ実行

### 禁止行為チェックリスト
□ 要求されていない機能の追加
□ 勝手なリファクタリング
□ 推測に基づく実装
□ 親切心からの拡大解釈

## 【重要】デバッグ方針

### 同じ問題が3回以上発生した場合
**小手先の修正は禁止**。以下の抜本的アプローチを取ること：

1. **根本原因分析**：「なぜこの問題が繰り返し発生するのか？」
2. **設計レベルでの見直し**：「この機能の設計自体に問題はないか？」
3. **完全作り直し判断**：「部分修正ではなく、完全に作り直すべきか？」
4. **実装方針変更**：「異なるアプローチで実装すべきか？」

### デグレループ防止キーワード
ユーザーが以下を言及した場合は**抜本的修正**を実行：
- 「同じ問題が再発」
- 「何度も同じデグレ」  
- 「小手先の修正でなく」
- 「根本的に直して」
- 「1から考えて」

### 抜本的修正の例
- アニメーション問題 → 連続制御から分離制御に変更
- 位置計算問題 → 相対計算から絶対計算に変更
- タイミング問題 → Promise chaining から async/await分離に変更

## Project Overview

This is a simple Japanese web application called "蜃気楼の選択" (Fate's Choice) that randomly selects one option from A-H when the user clicks a button. It's a single-page application with mystical/occult theming.

## Architecture

The project consists of three core files:

- **index.html**: Main HTML structure with Japanese UI text
- **script.js**: JavaScript logic for random selection and animations
- **style.css**: Dark gradient styling with glowing effects and animations

### Key Components

- **Random Selection Logic**: Uses `Math.random()` to pick from options A-H array in `script.js:22`
- **Animation System**: Scale transform animation triggered on result display in `script.js:8-11`
- **Hash-based Result Display**: Optional URL hash handling for direct result display in `script.js:14-19`
- **Visual Design**: Dark mystical theme with gradient backgrounds and text shadows

## Development

This is a pure HTML/CSS/JavaScript project with no build system or dependencies.

### Testing
Open `index.html` directly in a web browser to test functionality.

### File Structure
- All files are in the root directory
- CSS uses modern features like `backdrop-filter` and gradient backgrounds
- JavaScript uses modern ES6+ syntax with `addEventListener` and arrow functions

### Key Styling
- Uses CSS custom properties and modern layout with flexbox
- Implements glassmorphism effect with `backdrop-filter: blur(10px)`
- Text shadows create glowing effects for mystical appearance