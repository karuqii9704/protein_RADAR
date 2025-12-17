# 🚀 Dashboard MSU - Scripts

Folder ini berisi script untuk menjalankan aplikasi dengan mudah.

## 📁 File List

| File                   | Fungsi                                       |
| ---------------------- | -------------------------------------------- |
| `START_ALL.bat`        | **Jalankan ini!** Otomatis buka semua server |
| `1_start_backend.bat`  | Jalankan Backend saja (port 3000)            |
| `2_start_frontend.bat` | Jalankan Frontend saja (port 3001)           |
| `3_start_ngrok.bat`    | Jalankan ngrok tunnels                       |

## 🌐 Cara Share ke Teman via ngrok

### Langkah 1: Jalankan Semua Server

Double-click `START_ALL.bat` - akan membuka 3 window terminal.

### Langkah 2: Ambil ngrok URL

Lihat di terminal ngrok, akan muncul seperti ini:

```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:3000 (Backend)
Forwarding    https://xyz789.ngrok-free.app -> http://localhost:3001 (Frontend)
```

### Langkah 3: Update Frontend Environment

1. Buka file `Frontend\.env.local`
2. Ganti URL ini dengan ngrok Backend URL:
   ```
   NEXT_PUBLIC_API_URL=https://abc123.ngrok-free.app
   ```
3. Restart Frontend (Ctrl+C lalu jalankan ulang `2_start_frontend.bat`)

### Langkah 4: Share URL

Share **Frontend ngrok URL** (https://xyz789.ngrok-free.app) ke teman-teman!

## ⚠️ Catatan Penting

1. **Jangan tutup terminal** - Semua window harus tetap terbuka
2. **URL berubah setiap restart** - ngrok gratis memberikan URL baru setiap kali restart
3. **Pastikan PostgreSQL jalan** - Database harus aktif sebelum menjalankan server
4. **ngrok Web Interface** - Buka http://127.0.0.1:4040 untuk monitor traffic

## 🔧 Troubleshooting

### Error "ngrok not found"

Install ngrok dulu: https://ngrok.com/download

### Error "Port already in use"

Jalankan di PowerShell:

```powershell
# Kill proses di port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Kill proses di port 3001
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

### Error Database Connection

Pastikan PostgreSQL sudah berjalan dan `.env` di Backend sudah benar.
