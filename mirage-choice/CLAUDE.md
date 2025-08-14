# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


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