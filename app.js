const KEVINOS_SYSTEM_PROMPT = `
你是 KevinOS v4.0，一個專屬於鄭仲傑 Kevin 的個人 AI Agent。

使用者背景：
- 國立東華大學應用數學系學生
- 目標申請國外 Statistics / Data Science 研究所
- 關注數理統計、回歸分析、時間序列、R、Python
- 曾任班代與排球隊長
- 喜歡排球、MLB、大谷翔平、Dodgers、勁旅對決、科技產品、汽車與室內設計
- 偏好直接、實用、先結論再原因的回答

核心任務：
1. 協助學業與作業
2. 協助留學申請、TOEFL、SOP、CV、作品集
3. 協助排球訓練、腳踝穩定、彈跳與恢復
4. 協助投資觀察與風險分析
5. 協助 MLB 與勁旅對決策略
6. 協助生活決策

回答格式：
永遠優先使用：
【結論】
【原因】
【行動建議】

數學/統計題使用：
【直覺】
【理論】
【推導】
【計算】
【答案】

留學/作品集題要額外說：
【對申請的幫助】
【可否放履歷/作品集】
【怎麼包裝】

排球/健康相關：
優先提醒安全、恢復、循序漸進。若疑似醫療問題，要建議就醫，不要假裝診斷。

投資相關：
不保證獲利。必須列出優點、風險、最壞情況、策略。

KevinOS Ultimate Rule：
如果有兩個答案，一個簡單、一個更能幫 Kevin 未來發展，選擇後者。
`;

const chat = document.querySelector("#chat");
const form = document.querySelector("#chatForm");
const messageInput = document.querySelector("#message");
const apiKeyInput = document.querySelector("#apiKey");
const saveKeyButton = document.querySelector("#saveKey");
const clearChatButton = document.querySelector("#clearChat");

const storageKey = "kevinos-openai-key";
const chatKey = "kevinos-chat-history";

let messages = JSON.parse(localStorage.getItem(chatKey) || "[]");

function addMessage(role, content, persist = true) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = content;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  if (persist && (role === "user" || role === "assistant")) {
    messages.push({ role, content });
    localStorage.setItem(chatKey, JSON.stringify(messages.slice(-30)));
  }
  return div;
}

function renderHistory() {
  chat.innerHTML = "";
  addMessage("system", "KevinOS 已啟動。先在左下角輸入 OpenAI API Key，或直接用本機快捷模板規劃。", false);
  messages.forEach(m => addMessage(m.role, m.content, false));
}

function buildLocalResponse(text) {
  const t = text.trim();

  if (t.includes("/今日") || t.includes("今天")) {
    return `【結論】
今天優先做 4 件事：學業一件、英文一件、身體一件、長期申請一件。

【原因】
你現在最重要的主線是：大四畢業、研究所申請、TOEFL、作品集，以及維持排球身體狀態。

【行動建議】
1. 學業：完成目前最急的一份作業或整理一章考試筆記。
2. 英文：TOEFL Reading 1 篇 + 單字 20 個。
3. 身體：腳踝穩定 15 分鐘，包含單腳站、提踵、彈力帶外翻。
4. 長期：把一個統計作業整理成 portfolio 草稿。`;
  }

  if (t.includes("/統計") || t.includes("/學業")) {
    return `【結論】
把題目貼上來，我會用「直覺 → 理論 → 推導 → 計算 → 答案」幫你解。

【行動建議】
你可以直接貼數理統計、回歸、時間序列、實驗設計或 R/Python 題目。`;
  }

  if (t.includes("/留學") || t.includes("/TOEFL") || t.includes("/作品集")) {
    return `【結論】
你的留學主線應該是：TOEFL 100+、統計作品集、SOP/CV、推薦信。

【行動建議】
本週優先順序：
1. TOEFL 每天 45 分鐘。
2. 整理 MediaTek 2454 時間序列專案。
3. CV 加入統計、排球隊長、班代經驗。
4. SOP 主軸：統計建模 + Data Science + 時間序列。`;
  }

  if (t.includes("/排球") || t.includes("/復健")) {
    return `【結論】
你最該優先練的是腳踝穩定與落地控制，不是盲目加重量。

【行動建議】
今天做：
1. 單腳站 3 組 × 30 秒
2. 慢速提踵 3 組 × 12 下
3. 彈力帶腳踝外翻 3 組 × 15 下
4. 小跳落地定住 3 組 × 8 下`;
  }

  if (t.includes("/投資")) {
    return `【結論】
投資先建立紀律，不要只問能不能買。

【行動建議】
每次買之前先寫：
1. 為什麼買
2. 最壞情況
3. 停損/停利
4. 持有多久
5. 這筆錢佔總資金幾 %`;
  }

  if (t.includes("/勁旅對決") || t.includes("HOF")) {
    return `【結論】
勁旅對決 HOF 卡要先看位置稀缺性、技能、隊伍加成，再決定練不練或換不換。

【行動建議】
把你的球員卡截圖或名單貼上來，我會幫你排：
1. 培養優先順序
2. 兌換建議
3. 先發/板凳定位
4. 是否值得投入資源`;
  }

  return `【結論】
我收到你的問題了。若你有輸入 OpenAI API Key，我會用完整 AI 模式回答；目前先用 KevinOS 本機模式回覆。

【行動建議】
你可以輸入快捷指令：
/今日、/統計、/留學、/TOEFL、/排球、/投資、/MLB、/勁旅對決`;
}

async function askOpenAI(userText) {
  const apiKey = localStorage.getItem(storageKey);
  if (!apiKey) return buildLocalResponse(userText);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: KEVINOS_SYSTEM_PROMPT },
        ...messages.slice(-12).map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userText }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  const data = await response.json();
  return data.output_text || "KevinOS 沒有取得回覆，請再試一次。";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  messageInput.value = "";
  addMessage("user", text);

  const loading = addMessage("assistant", "KevinOS 思考中...", false);

  try {
    const answer = await askOpenAI(text);
    loading.textContent = answer;
    messages.push({ role: "assistant", content: answer });
    localStorage.setItem(chatKey, JSON.stringify(messages.slice(-30)));
  } catch (error) {
    loading.textContent = `【錯誤】
API 呼叫失敗。請確認：
1. API Key 是否正確
2. OpenAI 帳戶是否有額度
3. 網路是否正常

詳細訊息：
${error.message.slice(0, 500)}`;
  }
});

document.querySelectorAll("[data-prompt]").forEach(btn => {
  btn.addEventListener("click", () => {
    messageInput.value = btn.dataset.prompt;
    messageInput.focus();
  });
});

saveKeyButton.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    alert("請先輸入 API Key");
    return;
  }
  localStorage.setItem(storageKey, key);
  apiKeyInput.value = "";
  alert("已儲存到本機瀏覽器");
});

clearChatButton.addEventListener("click", () => {
  messages = [];
  localStorage.removeItem(chatKey);
  renderHistory();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

renderHistory();
