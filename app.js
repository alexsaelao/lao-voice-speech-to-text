const input = document.querySelector("#textInput");
const micButton = document.querySelector("#micButton");
const micIcon = document.querySelector("#micIcon");
const clearButton = document.querySelector("#clearButton");
const copyButton = document.querySelector("#copyButton");
const status = document.querySelector("#status");
const stateIcon = document.querySelector("#stateIcon");
const languageButton = document.querySelector("#languageButton");
const languageIcon = document.querySelector("#languageIcon");
const languageLabel = document.querySelector("#languageLabel");
const languageMenu = document.querySelector("#languageMenu");
const languageOptions = [...languageMenu.querySelectorAll("[data-language]")];
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let finalText = "";
let listening = false;
let currentLanguage = localStorage.getItem("voice-capture-language") || "lo-LA";

const ui = {
  "lo-LA": { brandSubtitle: "ບັນທຶກສຽງ", kicker: "ປ່ຽນສຽງເປັນຂໍ້ຄວາມ", title: "ປ່ຽນສຽງເປັນ", titleAccent: "ຂໍ້ຄວາມລາວ", intro: "ກົດປຸ່ມ ແລ້ວເວົ້າໄດ້ເລີຍ.<br />ຂໍ້ຄວາມຈະປາກົດແບບສົດໆ.", ready: "ພ້ອມໃຊ້ງານ", transcript: "ຂໍ້ຄວາມທີ່ຖອດສຽງ", placeholder: "ຂໍ້ຄວາມທີ່ເວົ້າຈະປາກົດຢູ່ບ່ອນນີ້...", footer: "ຕ້ອງໃຊ້ Chrome ຫຼື Edge ແລະອະນຸຍາດໃຊ້ໄມໂຄຣໂຟນ", start: "ເລີ່ມເວົ້າ", stop: "ຢຸດເວົ້າ", listening: "ກຳລັງຟັງ... ເວົ້າໄດ້ເລີຍ", unsupported: "browser ນີ້ບໍ່ຮອງຮັບການຮູ້ຈຳສຽງ", startFailed: "ເລີ່ມໄມໂຄຣໂຟນບໍ່ສຳເລັດ", denied: "ບໍ່ໄດ້ຮັບສິດໃຊ້ໄມໂຄຣໂຟນ", noSpeech: "ບໍ່ໄດ້ຍິນສຽງ. ລອງເວົ້າໃໝ່.", languageError: "browser ບໍ່ຮອງຮັບພາສານີ້", network: "ການຮູ້ຈຳສຽງຕ້ອງໃຊ້ internet", cleared: "ລ້າງຂໍ້ຄວາມແລ້ວ", empty: "ຍັງບໍ່ມີຂໍ້ຄວາມໃຫ້ກ໊ອບປີ້", copied: "ກ໊ອບປີ້ຂໍ້ຄວາມແລ້ວ", copyManual: "ກົດ Cmd/Ctrl+C ເພື່ອກ໊ອບປີ້" },
  "th-TH": { brandSubtitle: "บันทึกเสียง", kicker: "เปลี่ยนเสียงเป็นข้อความ", title: "เปลี่ยนเสียงเป็น", titleAccent: "ข้อความภาษาไทย", intro: "กดปุ่มแล้วพูดได้เลย<br />ข้อความจะแสดงแบบเรียลไทม์", ready: "พร้อมใช้งาน", transcript: "ข้อความที่ถอดเสียง", placeholder: "ข้อความที่พูดจะแสดงที่นี่...", footer: "ต้องใช้ Chrome หรือ Edge และอนุญาตให้ใช้ไมโครโฟน", start: "เริ่มพูด", stop: "หยุดพูด", listening: "กำลังฟัง... พูดได้เลย", unsupported: "เบราว์เซอร์นี้ไม่รองรับการรู้จำเสียง", startFailed: "เริ่มไมโครโฟนไม่สำเร็จ", denied: "ไม่ได้รับอนุญาตให้ใช้ไมโครโฟน", noSpeech: "ไม่ได้ยินเสียง ลองพูดใหม่", languageError: "เบราว์เซอร์ไม่รองรับภาษานี้", network: "การรู้จำเสียงต้องใช้อินเทอร์เน็ต", cleared: "ล้างข้อความแล้ว", empty: "ยังไม่มีข้อความให้คัดลอก", copied: "คัดลอกข้อความแล้ว", copyManual: "กด Cmd/Ctrl+C เพื่อคัดลอก" },
  "en-US": { brandSubtitle: "Voice capture", kicker: "SPEECH TO TEXT", title: "Turn speech into", titleAccent: "written text", intro: "Press the microphone and start speaking.<br />Your transcript appears live.", ready: "Ready", transcript: "TRANSCRIPT", placeholder: "Your speech will appear here...", footer: "Use Chrome or Edge and allow microphone access", start: "Start speaking", stop: "Stop speaking", listening: "Listening... start speaking", unsupported: "This browser does not support speech recognition", startFailed: "Could not start the microphone", denied: "Microphone access was not allowed", noSpeech: "No speech heard. Try again.", languageError: "This browser does not support this language", network: "Speech recognition requires an internet connection", cleared: "Transcript cleared", empty: "There is no text to copy", copied: "Transcript copied", copyManual: "Press Cmd/Ctrl+C to copy" },
  "vi-VN": { brandSubtitle: "Ghi âm giọng nói", kicker: "GIỌNG NÓI THÀNH VĂN BẢN", title: "Chuyển giọng nói", titleAccent: "thành văn bản", intro: "Nhấn micro và bắt đầu nói.<br />Văn bản sẽ hiện theo thời gian thực.", ready: "Sẵn sàng", transcript: "BẢN GHI", placeholder: "Văn bản từ giọng nói sẽ xuất hiện ở đây...", footer: "Dùng Chrome hoặc Edge và cho phép dùng micro", start: "Bắt đầu nói", stop: "Dừng nói", listening: "Đang nghe... hãy bắt đầu nói", unsupported: "Trình duyệt này không hỗ trợ nhận dạng giọng nói", startFailed: "Không thể bật micro", denied: "Chưa được cấp quyền dùng micro", noSpeech: "Không nghe thấy giọng nói. Hãy thử lại.", languageError: "Trình duyệt không hỗ trợ ngôn ngữ này", network: "Nhận dạng giọng nói cần kết nối internet", cleared: "Đã xóa văn bản", empty: "Không có văn bản để sao chép", copied: "Đã sao chép văn bản", copyManual: "Nhấn Cmd/Ctrl+C để sao chép" },
  "zh-CN": { brandSubtitle: "语音记录", kicker: "语音转文字", title: "将语音转换为", titleAccent: "文字", intro: "点击麦克风开始说话。<br />文字将实时显示。", ready: "准备就绪", transcript: "文字记录", placeholder: "语音文字将显示在这里...", footer: "请使用 Chrome 或 Edge，并允许麦克风权限", start: "开始说话", stop: "停止说话", listening: "正在聆听… 请开始说话", unsupported: "此浏览器不支持语音识别", startFailed: "无法启动麦克风", denied: "未获得麦克风权限", noSpeech: "没有听到声音，请重试。", languageError: "此浏览器不支持该语言", network: "语音识别需要网络连接", cleared: "已清除文字", empty: "没有可复制的文字", copied: "文字已复制", copyManual: "按 Cmd/Ctrl+C 复制" },
};

function t(key) { return ui[currentLanguage]?.[key] || ui["en-US"][key] || key; }

function setStatus(message, isListening = false) {
  status.textContent = message;
  status.classList.toggle("is-listening", isListening);
  status.parentElement.classList.toggle("is-listening", isListening);
  stateIcon.textContent = isListening ? "◉" : "✦";
}

function setListening(isListening) {
  listening = isListening;
  micButton.classList.toggle("is-listening", isListening);
  micButton.setAttribute("aria-pressed", String(isListening));
  micButton.setAttribute("aria-label", isListening ? t("stop") : t("start"));
  micIcon.innerHTML = isListening ? '<path d="M8 8h8v8H8z" fill="currentColor" />' : '<path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 1 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5Z" stroke="currentColor" stroke-width="1.8" /><path d="M18.5 11.5v.5a6.5 6.5 0 0 1-13 0v-.5M12 18.5V22M8.5 22h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />';
}

function applyLanguage(language) {
  currentLanguage = ui[language] ? language : "lo-LA";
  localStorage.setItem("voice-capture-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.innerHTML = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  micButton.setAttribute("aria-label", listening ? t("stop") : t("start"));
  if (!listening) setStatus(t("ready"));
}

function selectLanguage(option) {
  applyLanguage(option.dataset.language);
  languageLabel.textContent = option.dataset.label;
  languageIcon.src = option.querySelector("img").src;
  languageMenu.hidden = true;
  languageButton.setAttribute("aria-expanded", "false");
  languageOptions.forEach((item) => item.setAttribute("aria-selected", String(item === option)));
}

languageButton.addEventListener("click", () => {
  languageMenu.hidden = !languageMenu.hidden;
  languageButton.setAttribute("aria-expanded", String(!languageMenu.hidden));
});
languageOptions.forEach((option) => option.addEventListener("click", () => selectLanguage(option)));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".language-picker")) { languageMenu.hidden = true; languageButton.setAttribute("aria-expanded", "false"); }
});

const initialOption = languageOptions.find((option) => option.dataset.language === currentLanguage) || languageOptions[0];
selectLanguage(initialOption);

if (!SpeechRecognition) {
  micButton.disabled = true;
  micButton.style.opacity = "0.55";
  setStatus(t("unsupported"));
} else {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  micButton.addEventListener("click", () => {
    if (listening) return recognition.stop();
    finalText = input.value.trim();
    recognition.lang = currentLanguage;
    try { recognition.start(); } catch (error) { if (error.name !== "InvalidStateError") setStatus(t("startFailed")); }
  });
  recognition.onstart = () => { setListening(true); setStatus(t("listening"), true); };
  recognition.onresult = (event) => {
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += `${transcript} `;
      else interimText += transcript;
    }
    input.value = `${finalText}${interimText}`.trim();
  };
  recognition.onend = () => { setListening(false); setStatus(t("ready")); };
  recognition.onerror = (event) => {
    setListening(false);
    const key = { "not-allowed": "denied", "no-speech": "noSpeech", "language-not-supported": "languageError", network: "network" }[event.error];
    setStatus(key ? t(key) : `${t("startFailed")}: ${event.error}`);
  };
}

clearButton.addEventListener("click", () => { finalText = ""; input.value = ""; setStatus(t("cleared")); });
copyButton.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return setStatus(t("empty"));
  try {
    await navigator.clipboard.writeText(text);
    setStatus(t("copied"));
    copyButton.classList.add("is-copied");
    window.setTimeout(() => copyButton.classList.remove("is-copied"), 1200);
  } catch { input.focus(); input.select(); setStatus(t("copyManual")); }
});
document.addEventListener("keydown", (event) => { if (event.code !== "Space" || event.target === input) return; event.preventDefault(); micButton.click(); });
