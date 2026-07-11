(function () {
  "use strict";

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    try { chrome.runtime.sendMessage({ type: "voice-state", status: "Chrome ບໍ່ຮອງຮັບ Speech Recognition ໃນໜ້ານີ້", listening: false }); } catch {}
    return;
  }

  let focusedField = null;
  let recognition = null;
  let isListening = false;
  let autoSend = true;
  let speechLanguage = "lo-LA";
  let transcript = "";

  const messages = {
    "lo-LA": { unsupported: "Chrome ບໍ່ຮອງຮັບ Speech Recognition ໃນໜ້ານີ້", noInput: "ກະລຸນາຄລິກ input ໃນໜ້າເວັບກ່ອນ", listening: "ກຳລັງຟັງ... ເວົ້າໄດ້ເລີຍ", ready: "ພ້ອມໃຊ້ງານ", noTarget: "ບໍ່ພົບ input ທີ່ໃຊ້ງານໄດ້", sent: "ສົ່ງເຂົ້າ input ອັດຕະໂນມັດແລ້ວ", preview: "ພ້ອມໃຊ້ງານ · ຂໍ້ຄວາມຢູ່ໃນ Preview", microphone: "ກະລຸນາອະນຸຍາດ microphone ໃນ Chrome", retry: "ລອງເວົ້າໃໝ່ອີກຄັ້ງ", selected: "ເລືອກ input ແລ້ວ · ກົດໄມໂຄຣໂຟນໃນ Sidebar" },
    "th-TH": { unsupported: "Chrome ไม่รองรับ Speech Recognition ในหน้านี้", noInput: "กรุณาคลิก input บนหน้าเว็บก่อน", listening: "กำลังฟัง... พูดได้เลย", ready: "พร้อมใช้งาน", noTarget: "ไม่พบ input ที่ใช้งานได้", sent: "ส่งเข้า input อัตโนมัติแล้ว", preview: "พร้อมใช้งาน · ข้อความอยู่ใน Preview", microphone: "กรุณาอนุญาตไมโครโฟนใน Chrome", retry: "ลองพูดใหม่อีกครั้ง", selected: "เลือก input แล้ว · กดไมโครโฟนใน Sidebar" },
    "en-US": { unsupported: "Speech Recognition is not supported on this page", noInput: "Select an input on the web page first", listening: "Listening... start speaking", ready: "Ready", noTarget: "No available input was found", sent: "Sent to input automatically", preview: "Ready · text is in Preview", microphone: "Allow microphone access in Chrome", retry: "Try speaking again", selected: "Input selected · press the microphone in the Sidebar" },
    "vi-VN": { unsupported: "Trang này không hỗ trợ Nhận dạng giọng nói", noInput: "Hãy chọn ô nhập trên trang web trước", listening: "Đang nghe... hãy bắt đầu nói", ready: "Sẵn sàng", noTarget: "Không tìm thấy ô nhập khả dụng", sent: "Đã tự động gửi vào ô nhập", preview: "Sẵn sàng · văn bản ở trong Preview", microphone: "Hãy cho phép micro trong Chrome", retry: "Hãy nói lại", selected: "Đã chọn ô nhập · nhấn mic trong Sidebar" },
    "zh-CN": { unsupported: "此页面不支持语音识别", noInput: "请先选择网页中的输入框", listening: "正在聆听… 请开始说话", ready: "准备就绪", noTarget: "未找到可用输入框", sent: "已自动发送到输入框", preview: "准备就绪 · 文字在预览中", microphone: "请在 Chrome 中允许使用麦克风", retry: "请再说一次", selected: "已选择输入框 · 点击侧边栏麦克风" },
  };

  chrome.storage.local.get({ autoSend: true, language: "lo-LA" }).then(({ autoSend: saved, language }) => {
    autoSend = Boolean(saved);
    speechLanguage = language;
  });

  const isEditable = (element) => element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement
    || element?.isContentEditable;

  function message(key) {
    return messages[speechLanguage]?.[key] || messages["en-US"][key] || key;
  }

  function notify(key, listening = isListening) {
    try {
      const response = chrome.runtime.sendMessage({ type: "voice-state", status: message(key), listening });
      response?.catch?.(() => {});
    } catch {}
  }

  function notifyPreview(text, final = false) {
    try {
      const response = chrome.runtime.sendMessage({ type: "transcript-preview", text, final });
      response?.catch?.(() => {});
    } catch {}
  }

  function insertText(text) {
    if (!focusedField || !document.contains(focusedField)) {
      notify("noInput");
      return;
    }

    focusedField.focus();
    if (focusedField instanceof HTMLInputElement || focusedField instanceof HTMLTextAreaElement) {
      const start = focusedField.selectionStart ?? focusedField.value.length;
      const end = focusedField.selectionEnd ?? focusedField.value.length;
      const value = focusedField.value;
      const nextValue = `${value.slice(0, start)}${text}${value.slice(end)}`;
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(focusedField), "value")?.set;
      setter?.call(focusedField, nextValue);
      focusedField.setSelectionRange(start + text.length, start + text.length);
      focusedField.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    document.execCommand("insertText", false, text);
  }

  function findAutomaticTarget() {
    const active = document.activeElement;
    if (isEditable(active)) return active;
    if (focusedField && document.contains(focusedField) && isEditable(focusedField)) return focusedField;
    const candidates = [...document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]')];
    return candidates.find((element) => {
      const style = getComputedStyle(element);
      return !element.disabled && !element.readOnly && style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
    }) || null;
  }

  function setListening(listening) {
    isListening = listening;
    notify(listening ? "listening" : "ready", listening);
  }

  function getTargetForCurrentMode() {
    if (autoSend) focusedField = findAutomaticTarget();
    return focusedField && document.contains(focusedField) && isEditable(focusedField) ? focusedField : null;
  }

  function toggleRecognition() {
    if (autoSend && !getTargetForCurrentMode()) {
      notify("noTarget", false);
      return;
    }
    if (autoSend) focusedField.focus();
    if (isListening) {
      recognition?.stop();
      return;
    }

    transcript = "";
    notifyPreview("");
    recognition = new Recognition();
    recognition.lang = speechLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      let currentText = "";
      let allFinal = true;
      for (let i = 0; i < event.results.length; i += 1) {
        currentText += event.results[i][0].transcript;
        allFinal = allFinal && event.results[i].isFinal;
      }
      transcript = currentText.trim();
      notifyPreview(transcript, allFinal);
    };
    recognition.onend = () => {
      setListening(false);
      if (autoSend && transcript) {
        insertText(transcript);
        notify("sent", false);
      } else if (transcript) {
        notify("preview", false);
      }
    };
    recognition.onerror = (event) => {
      setListening(false);
      notify(event.error === "not-allowed" ? "microphone" : "retry", false);
    };

    try { recognition.start(); } catch { setListening(false); }
  }

  document.addEventListener("focusin", (event) => {
    if (isEditable(event.target)) {
      focusedField = event.target;
      notify("selected");
    }
  }, true);

  // Fallback: if the web page still has keyboard focus, Alt/Option toggles voice there too.
  document.addEventListener("keydown", (event) => {
    const isOptionOrAlt = event.key === "Alt" || event.code === "AltLeft" || event.code === "AltRight";
    if (!isOptionOrAlt || event.repeat) return;
    event.preventDefault();
    toggleRecognition();
  }, true);

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "toggle-voice") {
      toggleRecognition();
      sendResponse({ ok: true });
    }
    if (message.type === "set-auto-send") {
      autoSend = Boolean(message.enabled);
      chrome.storage.local.set({ autoSend });
      sendResponse({ ok: true, enabled: autoSend });
    }
    if (message.type === "set-language") {
      speechLanguage = message.language || "lo-LA";
      chrome.storage.local.set({ language: speechLanguage });
      if (isListening) recognition?.stop();
      sendResponse({ ok: true, language: speechLanguage });
    }
    if (message.type === "get-voice-state") {
      sendResponse({ listening: isListening, hasTarget: Boolean(focusedField && document.contains(focusedField)), autoSend });
    }
    return true;
  });
})();
