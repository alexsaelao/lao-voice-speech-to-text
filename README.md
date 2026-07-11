# Lao Speech-to-Text MVP

เดโมฟรีสำหรับกดไมโครโฟน พูดภาษาลาว และแสดงข้อความในช่องข้อความ โดยใช้ Web Speech API ของเบราว์เซอร์ ไม่ใช้ OpenAI และไม่ต้องมี API key

## เปิดใช้งาน

เปิด `index.html` ด้วย Google Chrome หรือ Microsoft Edge หรือรัน local server:

```bash
python3 -m http.server 4173
```

จากนั้นเปิด http://localhost:4173 และกด Allow เพื่ออนุญาตไมโครโฟน

ระบบตั้งภาษาเสียงไว้ที่ `lo-LA` หากเบราว์เซอร์หรืออุปกรณ์ไม่รองรับ ระบบจะแจ้งให้ผู้ใช้ทราบ
