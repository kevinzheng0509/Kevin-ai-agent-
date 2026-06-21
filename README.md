# KevinOS v4.0

KevinOS 是一個可以放到 GitHub Pages 的個人 AI Agent PWA。  
它可以在 Mac、iPhone、iPad、Android、Windows 的瀏覽器使用，也可以加入手機主畫面。

## 功能

- 🎓 StudyAgent：統計、回歸、時間序列、R/Python
- 🇺🇸 GraduateAgent：TOEFL、SOP、CV、作品集
- 🏐 VolleyballAgent：腳踝穩定、彈跳、恢復訓練
- 📈 InvestmentAgent：投資紀律與風險分析
- ⚾ MLBAgent：大谷、Dodgers、數據分析
- 🎮 HOFAgent：勁旅對決 HOF 卡分析

## 如何放到 GitHub Pages

1. 建立一個新的 GitHub Repository，例如：`KevinOS`
2. 把本資料夾所有檔案上傳到 repo 根目錄
3. 到 GitHub repo 的：
   `Settings` → `Pages`
4. Source 選：
   `Deploy from a branch`
5. Branch 選：
   `main` / `/root`
6. 等 GitHub Pages 產生網址

## 如何使用 AI 模式

打開 KevinOS 網頁後，在左下角輸入你的 OpenAI API Key，按「儲存到本機」。

注意：
- API Key 只存在你的瀏覽器 localStorage
- 不會寫進 GitHub
- 不要把 API Key 寫死在程式碼裡

## 手機加入主畫面

### iPhone
1. 用 Safari 打開 KevinOS 網址
2. 按分享
3. 選「加入主畫面」

### Android
1. 用 Chrome 打開 KevinOS 網址
2. 選單
3. 選「加入主畫面」

## 本機測試

直接打開 `index.html` 即可。  
若要測試 PWA 快取，建議用簡單 server：

```bash
python3 -m http.server 3000
```

然後打開：

```text
http://localhost:3000
```

## 安全提醒

這是前端版 PWA，適合個人使用與 GitHub Pages。
如果你之後要開放給別人用，應該改成後端代理版本，避免 API Key 暴露或濫用。
