# ROスキルタイマー

PCゲーム（主にRO）用の手動再同期タイマー。HTML単体（`timer.html`）。Chrome `--app` で運用。

## 制約

- **点滅・ストロボ禁止**（光感受性てんかん配慮）。`@keyframes` の opacity 振動、setInterval によるクラス点滅、box-shadow パルス、全画面フラッシュ全部禁止。状態変化は CSS `transition` で表現。

## 機能

- 入力: 周期秒、警告秒
- バーがクリックでResync。Space/Enter/1 でも Resync、Esc/0 で Stop（フォーカス時のみ）
- 状態色: inactive灰 / normal緑 / danger赤BG（残り≦警告秒）
- 残秒は等幅で右揃え固定幅
- `requestAnimationFrame` 駆動。`setInterval` 不使用
- 設定（周期・警告秒）のみ localStorage 永続化。ランタイム状態は揮発
- ウィンドウ高さは `--app` モードでのみ JS が 60px に強制（通常タブでは NOP）。幅はユーザー操作に委ねる

## 起動 (Windows / Chrome --app --guest)

`--guest` で既定プロファイルから完全分離・ディスク無汚染。セッション終了時に全消去されるので設定 (周期/警告秒) は毎回デフォルトから。

ローカル:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --guest --app="file:///C:/app/rotimer/timer.html"
```

GitHub Pages:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --guest --app="https://maiha.github.io/rotools/skill-timer/timer.html"
```

- 高さは JS が 60px に強制するので `--window-size` 省略可
- `--guest` が効かない Chrome バージョンでは `--incognito` に差し替え
