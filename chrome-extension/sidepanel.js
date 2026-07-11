const micButton = document.querySelector("#micButton");
const micIcon = document.querySelector("#micIcon");
const status = document.querySelector("#status");
const autoSendToggle = document.querySelector("#autoSendToggle");
const transcriptPreview = document.querySelector("#transcriptPreview");
const previewState = document.querySelector("#previewState");
const copyButton = document.querySelector("#copyButton");
const clearButton = document.querySelector("#clearButton");
const languageButton = document.querySelector("#languageButton");
const languageIcon = document.querySelector("#languageIcon");
const languageLabel = document.querySelector("#languageLabel");
const languageMenu = document.querySelector("#languageMenu");
const languageOptions = [...languageMenu.querySelectorAll("[data-language]")];
let panelListening = false;
let currentLanguage = "lo-LA";

const ui = {
  "lo-LA": { brandSubtitle: "ປ່ຽນສຽງເປັນຂໍ້ຄວາມ", kicker: "ປ່ຽນສຽງເປັນຂໍ້ຄວາມ", title: "ເວົ້າພາສາລາວ", titleAccent: "ໃສ່ input", intro: "ເລືອກ input ແລ້ວເວົ້າໄດ້ເລີຍ", ready: "ພ້ອມໃຊ້ງານ", previewTitle: "ຕົວຢ່າງຂໍ້ຄວາມ", previewPlaceholder: "ຂໍ້ຄວາມຈາກສຽງຈະສະແດງຢູ່ບ່ອນນີ້...", copy: "ກ໊ອບປີ້", clear: "ລ້າງ", autoTitle: "ສົ່ງເຂົ້າ input ຫຼັງຢຸດເວົ້າ", autoDescription: "ເປີດເພື່ອສົ່ງ Preview ເຂົ້າ input ອັດຕະໂນມັດ", shortcut: "ເລີ່ມ–ຢຸດ", privacy: "ປິດໂໝດນີ້ເພື່ອໃຊ້ input ທີ່ເລືອກເທົ່ານັ້ນ", copied: "ກ໊ອບປີ້ແລ້ວ", readyToSend: "ພ້ອມສົ່ງ", typing: "ກຳລັງພິມ...", start: "ເລີ່ມເວົ້າ", stop: "ຢຸດເວົ້າ", openPage: "ເປີດໜ້າເວັບກ່ອນ", reloadPage: "ໂຫຼດໜ້າເວັບໃໝ່ ແລ້ວລອງໃໝ່" },
  "th-TH": { brandSubtitle: "ส่วนขยายการพูด", kicker: "เปลี่ยนเสียงเป็นข้อความ", title: "พูดภาษาไทย", titleAccent: "ใส่ใน input", intro: "เลือก input แล้วกดไมโครโฟนเพื่อพูด", ready: "พร้อมใช้งาน", previewTitle: "ตัวอย่างข้อความ", previewPlaceholder: "ข้อความจากเสียงจะแสดงที่นี่...", copy: "คัดลอก", clear: "ล้าง", autoTitle: "ส่งเข้า input หลังหยุดพูด", autoDescription: "เปิดเพื่อส่ง Preview เข้า input อัตโนมัติ", shortcut: "เริ่ม–หยุด", privacy: "ปิดโหมดนี้เพื่อเก็บข้อความไว้ใน Preview เท่านั้น", copied: "คัดลอกแล้ว", readyToSend: "พร้อมส่ง", typing: "กำลังพิมพ์...", start: "เริ่มพูด", stop: "หยุดพูด", openPage: "กรุณาเปิดหน้าเว็บก่อน", reloadPage: "รีโหลดหน้าเว็บแล้วลองใหม่" },
  "en-US": { brandSubtitle: "Speech to Text", kicker: "SPEECH TO TEXT", title: "Speak English", titleAccent: "to any input", intro: "Select an input, then press the microphone", ready: "Ready", previewTitle: "TEXT PREVIEW", previewPlaceholder: "Your speech will appear here...", copy: "Copy", clear: "Clear", autoTitle: "Send to input after speaking", autoDescription: "Automatically send the preview after you stop", shortcut: "Start–stop", privacy: "Turn this off to keep text in Preview only", copied: "Copied", readyToSend: "Ready to send", typing: "Typing...", start: "Start speaking", stop: "Stop speaking", openPage: "Open a web page first", reloadPage: "Reload the page and try again" },
  "vi-VN": { brandSubtitle: "Tiện ích giọng nói", kicker: "GIỌNG NÓI THÀNH VĂN BẢN", title: "Nói tiếng Việt", titleAccent: "vào input", intro: "Chọn ô nhập, rồi nhấn mic để nói", ready: "Sẵn sàng", previewTitle: "XEM TRƯỚC VĂN BẢN", previewPlaceholder: "Văn bản từ giọng nói sẽ xuất hiện ở đây...", copy: "Sao chép", clear: "Xóa", autoTitle: "Gửi vào input sau khi nói", autoDescription: "Tự gửi Preview sau khi bạn dừng nói", shortcut: "Bắt đầu–dừng", privacy: "Tắt để chỉ giữ văn bản trong Preview", copied: "Đã sao chép", readyToSend: "Sẵn sàng gửi", typing: "Đang nhập...", start: "Bắt đầu nói", stop: "Dừng nói", openPage: "Hãy mở một trang web trước", reloadPage: "Tải lại trang rồi thử lại" },
  "zh-CN": { brandSubtitle: "语音扩展程序", kicker: "语音转文字", title: "说中文", titleAccent: "写入输入框", intro: "选择输入框后，点击麦克风说话", ready: "准备就绪", previewTitle: "文字预览", previewPlaceholder: "语音文字将显示在这里...", copy: "复制", clear: "清除", autoTitle: "说完后发送到输入框", autoDescription: "停止说话后自动发送预览文字", shortcut: "开始–停止", privacy: "关闭后只在预览中保留文字", copied: "已复制", readyToSend: "可以发送", typing: "正在输入...", start: "开始说话", stop: "停止说话", openPage: "请先打开网页", reloadPage: "请刷新页面后重试" },
};

Object.assign(ui["th-TH"], { brandSubtitle: "เปลี่ยนเสียงเป็นข้อความ" });
Object.assign(ui["vi-VN"], { brandSubtitle: "Giọng nói thành văn bản" });
Object.assign(ui["zh-CN"], { brandSubtitle: "语音转文字" });

function t(key) {
  return ui[currentLanguage]?.[key] || ui["en-US"][key] || key;
}

function applyUiLanguage(language) {
  currentLanguage = ui[language] ? language : "lo-LA";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  if (!panelListening) status.textContent = t("ready");
  if (!transcriptPreview.value) previewState.textContent = t("ready");
}

function activeTab() {
  return chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

async function setAutoSend(enabled) {
  await chrome.storage.local.set({ autoSend: enabled });
  const tab = await activeTab();
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "set-auto-send", enabled }).catch(() => {});
}

async function setLanguage(language, label, icon) {
  await chrome.storage.local.set({ language });
  applyUiLanguage(language);
  languageLabel.textContent = label;
  languageIcon.src = icon.src;
  languageIcon.alt = label;
  languageMenu.hidden = true;
  languageButton.setAttribute("aria-expanded", "false");
  languageOptions.forEach((option) => option.setAttribute("aria-selected", String(option.dataset.language === language)));
  const tab = await activeTab();
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "set-language", language }).catch(() => {});
}

function renderState(message, listening) {
  const wasListening = panelListening;
  panelListening = listening;
  status.textContent = message;
  status.classList.toggle("is-listening", listening);
  micButton.classList.toggle("is-listening", listening);
  micButton.setAttribute("aria-label", listening ? t("stop") : t("start"));
  micIcon.innerHTML = listening
    ? '<path d="M8 8h8v8H8z" fill="currentColor" />'
    : '<path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 1 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5Z" stroke="currentColor" stroke-width="1.8"/><path d="M18.5 11.5v.5a6.5 6.5 0 0 1-13 0v-.5M12 18.5V22M8.5 22h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />';
}

async function toggleVoiceFromPanel() {
  const tab = await activeTab();
  if (!tab?.id) return renderState(t("openPage"), false);
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "toggle-voice" });
  } catch {
    renderState(t("reloadPage"), false);
  }
}

micButton.addEventListener("click", toggleVoiceFromPanel);

languageButton.addEventListener("click", () => {
  languageMenu.hidden = !languageMenu.hidden;
  languageButton.setAttribute("aria-expanded", String(!languageMenu.hidden));
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => setLanguage(option.dataset.language, option.dataset.label, option.querySelector("img")));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".language-picker")) {
    languageMenu.hidden = true;
    languageButton.setAttribute("aria-expanded", "false");
  }
});

copyButton.addEventListener("click", async () => {
  const text = transcriptPreview.value.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    transcriptPreview.select();
    document.execCommand("copy");
  }
  previewState.textContent = t("copied");
});

clearButton.addEventListener("click", () => {
  transcriptPreview.value = "";
  previewState.textContent = t("ready");
});

chrome.storage.local.get({ autoSend: true, language: "lo-LA" }).then(({ autoSend, language }) => {
  autoSendToggle.checked = Boolean(autoSend);
  const option = languageOptions.find((item) => item.dataset.language === language) || languageOptions[0];
  setLanguage(option.dataset.language, option.dataset.label, option.querySelector("img"));
});

autoSendToggle.addEventListener("change", () => {
  setAutoSend(autoSendToggle.checked);
});

document.addEventListener("keydown", (event) => {
  const isOptionOrAlt = event.key === "Alt" || event.code === "AltLeft" || event.code === "AltRight";
  if (!isOptionOrAlt || event.repeat) return;
  event.preventDefault();
  toggleVoiceFromPanel();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "voice-state") {
    renderState(message.status, message.listening);
  }
  if (message.type === "transcript-preview") {
    transcriptPreview.value = message.text || "";
    previewState.textContent = message.final ? t("readyToSend") : t("typing");
  }
});

activeTab().then((tab) => {
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "get-voice-state" }).catch(() => {});
});
