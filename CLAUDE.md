# CLAUDE.md

針對 Claude Code 在此專案工作時的偏好說明。

## 工作流程

- **修改程式後請自動 commit 並 push 到 GitHub origin/main**，不要要求使用者手動執行 git 指令。
- commit message 用繁體中文，遵循目前 repo 的格式（短標題 + 條列細節）。
- 不要在訊息結尾附「在 Codespace 操作」的指示區塊 ── 使用者的 Codespace 透過 `scripts/auto-pull.js` 自動同步，不需要手動 `git pull`。

## 自動同步機制

`npm run dev` 會同時啟動三件事：

| 名稱 | 內容 | 變動時行為 |
|---|---|---|
| `api` | `node --watch mock-server.js` | mock-server.js 改動會自動重啟 |
| `web` | `vite` | 前端檔案改動透過 HMR 即時更新 |
| `sync` | `node scripts/auto-pull.js` | 每 5 秒 fetch origin/main，有新 commit 就 `git pull --ff-only` |

整個鏈路：Claude push → Codespace 5 秒內 pull → vite HMR / node --watch 重載 → 使用者瀏覽器即時看到更新。

## 溝通風格

- 全程使用繁體中文回答。
- 回答盡量精簡，不要重複解釋已知的設計決策。
- 改動後簡述變更內容與驗證結果即可（build / 測試），不要附「下一步」指示。
