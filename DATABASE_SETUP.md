# Setup Database PostgreSQL dengan Neon

## 🚀 Langkah-langkah Setup

### 1. Buat Akun Neon

1. Pergi ke [neon.tech](https://neon.tech)
2. Daftar dengan GitHub atau email
3. Buat project baru

### 2. Dapatkan Connection String

1. Di dashboard Neon, pergi ke "Connection Details"
2. Copy connection string yang berformat:

   ```bash
   postgresql://username:password@host/database?sslmode=require
   ```

### 3. Setup Environment Variables

1. Buat file `.env` di root project
2. Tambahkan DATABASE_URL:

   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   ```

### 4. Generate dan Push Schema

```bash
# Generate migration files
bun run db:generate

# Push schema ke database
bun run db:push
```

### 5. (Opsional) Buka Database Studio

```bash
# Buka Drizzle Studio untuk melihat database
bun run db:studio
```

## 📊 Schema Database

### Tabel `rsvp`

- `id` (serial): Primary key
- `name` (varchar): Nama lengkap (required)
- `email` (varchar): Email (optional)
- `phone` (varchar): No. telepon (optional)
- `attendance` (varchar): "hadir" atau "tidak_hadir" (required)
- `guestCount` (varchar): Jumlah tamu (default: "1")
- `message` (text): Pesan/ucapan (optional)
- `isPublic` (boolean): Apakah RSVP dipublikasikan (default: true)
- `createdAt` (timestamp): Waktu dibuat
- `updatedAt` (timestamp): Waktu diupdate

### Tabel `wishes`

- `id` (serial): Primary key
- `name` (varchar): Nama lengkap (required)
- `email` (varchar): Email (optional)
- `message` (text): Ucapan/doa (required)
- `isPublic` (boolean): Apakah ucapan dipublikasikan (default: true)
- `createdAt` (timestamp): Waktu dibuat
- `updatedAt` (timestamp): Waktu diupdate

## 🔧 API Functions

### RSVP Functions

- `createRSVP(data)`: Membuat RSVP baru
- `getRSVPs(publicOnly)`: Mengambil daftar RSVP
- `getRSVPStats()`: Mengambil statistik RSVP

### Wishes Functions

- `createWish(data)`: Membuat ucapan baru
- `getWishes(publicOnly)`: Mengambil daftar ucapan

## 🎯 Fitur

### Privacy Control

- User dapat memilih untuk mempublikasikan RSVP/ucapan mereka atau tidak
- Data yang tidak dipublikasikan tetap tersimpan tapi tidak ditampilkan ke user lain

### Real-time Statistics

- Jumlah total RSVP
- Jumlah yang hadir vs tidak hadir  
- Total tamu yang akan hadir
- Jumlah ucapan yang masuk

### Responsive Forms

- Validasi input
- Loading states
- Success/error feedback
- Mobile-optimized UI

## 🛠️ Troubleshooting

### Connection Issues

1. Pastikan DATABASE_URL benar
2. Cek bahwa database Neon sudah aktif
3. Verifikasi SSL certificate

### Migration Issues

1. Hapus folder `drizzle/` jika ada
2. Jalankan `bun run db:generate` lagi
3. Push dengan `bun run db:push`

### API Errors

1. Cek console browser untuk error detail
2. Pastikan environment variables ter-load dengan `.env` file
3. Verifikasi schema sudah ter-push ke database
4. Pastikan Bun server berjalan untuk API endpoints
5. Test API endpoints di `/api/rsvp` dan `/api/wishes`

### Process is not defined Error

Jika mendapat error "process is not defined":
1. Pastikan API routes sudah setup di server
2. Database operations hanya dijalankan di server-side
3. Client-side menggunakan fetch API ke endpoints

---

💡 **Tips**: 
- Gunakan Drizzle Studio untuk debugging dan melihat data secara visual
- Test API endpoints dengan curl atau Postman
- Cek network tab di browser untuk API call errors
