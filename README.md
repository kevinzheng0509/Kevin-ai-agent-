# KevinOS v5.0 Personal Secretary

可直接放到 GitHub Pages 的個人 AI 秘書。

## 功能
- Calendar 本機行程 + Google Calendar 快捷入口
- Gmail 教授/學校/助教 Email 草稿
- 統計講義知識庫 txt/md/csv/貼文字搜尋
- 排球訓練紀錄與建議
- 股票觀察清單與投資檢查表
- 研究所申請 Dashboard
- AI 助手：輸入 OpenAI API Key 啟用完整模式
- 匯出/匯入 JSON 備份

## 部署
1. 建立 GitHub repo
2. 把所有檔案放到 repo 根目錄
3. Settings → Pages → Deploy from branch → main/root
4. 用手機 Safari/Chrome 開網址後加入主畫面

## 限制
GitHub Pages 純前端版不能真正讀取 Gmail/Google Calendar。若要真同步，需要 Google OAuth + 後端伺服器。

## 安全
OpenAI API Key 只存在瀏覽器 localStorage，不會寫進 GitHub。
