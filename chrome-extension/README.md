# Lao Voice Input Chrome Extension

ใช้ Web Speech API ของ Chrome เพื่อพูดภาษาลาวลงใน input, textarea หรือ contenteditable ที่กำลังโฟกัส โดยควบคุมผ่าน Sidebar เพื่อไม่บังหน้าเว็บ

## ติดตั้งแบบ Developer mode

1. เปิด `chrome://extensions`
2. เปิด **Developer mode**
3. กด **Load unpacked**
4. เลือกโฟลเดอร์ `chrome-extension`
5. กดไอคอน Extension เพื่อเปิด Sidebar
6. เปิดเว็บใดก็ได้ แล้วคลิก input, textarea หรือช่อง contenteditable
7. กดปุ่มไมค์ใน Sidebar แล้วอนุญาต microphone
8. กดปุ่มไมค์อีกครั้ง หรือกด `Alt/Option` ใน Sidebar เพื่อหยุด

หมายเหตุ: เวอร์ชันนี้ใช้ภาษาลาวอย่างเดียว และใช้ได้กับเว็บที่อนุญาตให้ Extension inject script เท่านั้น
