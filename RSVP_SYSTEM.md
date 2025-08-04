# 🎉 Wedding Invitation dengan RSVP & Ucapan Database

Website undangan pernikahan lengkap dengan sistem RSVP dan ucapan yang terhubung dengan database PostgreSQL di Neon.

## ✨ Fitur Baru

### 🎯 RSVP System

- **Form RSVP Lengkap**: Nama, email, telepon, kehadiran, jumlah tamu, pesan
- **Privacy Control**: User dapat memilih untuk mempublikasikan RSVP atau tidak
- **Real-time Statistics**: Jumlah hadir, tidak hadir, total tamu
- **Live Updates**: RSVP list update otomatis setelah submit
- **Responsive Design**: Optimized untuk mobile dan desktop

### 💬 Wishes System

- **Ucapan & Doa**: Form terpisah khusus untuk ucapan
- **Public/Private**: Kontrol privasi untuk setiap ucapan
- **Live Display**: Ucapan ditampilkan real-time
- **Elegant UI**: Card-based design dengan animasi

## 🚀 Quick Start

### 1. Setup Database

```bash
# Copy environment variables
cp .env.example .env

# Edit .env dengan DATABASE_URL dari Neon
# DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

### 2. Setup Database Schema

```bash
# Generate migration files
bun run db:generate

# Push schema ke database
bun run db:push
```

### 3. Jalankan Aplikasi

```bash
# Install dependencies (jika belum)
bun install

# Start development server
bun run dev
```

### 4. (Opsional) Database Studio

```bash
# Buka Drizzle Studio untuk manage database
bun run db:studio
```

## 🛠️ Tech Stack

### Frontend

- **React 19**: Framework utama
- **Motion**: Animasi smooth
- **DaisyUI**: Component library
- **Tailwind CSS**: Utility-first CSS
- **TypeScript**: Type safety

### Backend & Database

- **PostgreSQL**: Database di Neon
- **Drizzle ORM**: Type-safe database operations
- **Neon Serverless**: Serverless PostgreSQL

## 📊 Database Schema

### RSVP Table

```sql
CREATE TABLE rsvp (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  attendance VARCHAR(20) NOT NULL, -- 'hadir' atau 'tidak_hadir'
  guest_count VARCHAR(10) DEFAULT '1',
  message TEXT,
  is_public BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Wishes Table

```sql
CREATE TABLE wishes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## 🎨 UI/UX Features

### Form Validasi

- **Required Fields**: Validasi client-side
- **Loading States**: Spinner saat submit
- **Success/Error Feedback**: Alert yang jelas
- **Auto-reset**: Form clear setelah berhasil submit

### Real-time Updates

- **Auto Refresh**: List RSVP dan ucapan update otomatis
- **Statistics**: Counter real-time untuk hadir/tidak hadir
- **Smooth Animations**: Motion library untuk transitions

### Privacy Control

- **Public/Private Toggle**: Checkbox untuk kontrol publikasi
- **Data Protection**: Data private tetap tersimpan tapi tidak ditampilkan

## 📱 Mobile Optimization

- **Touch-friendly**: Semua input optimal untuk touch
- **Responsive Forms**: Layout adaptif mobile/desktop
- **Smooth Scrolling**: Navigasi halus antar section
- **Optimized Loading**: Fast database operations

## 🔧 API Functions

### RSVP Operations

```typescript
// Buat RSVP baru
await createRSVP({
  name: "John Doe",
  email: "john@example.com",
  attendance: "hadir",
  guestCount: "2",
  message: "Selamat menikah!",
  isPublic: true
});

// Ambil semua RSVP public
const { data: rsvps } = await getRSVPs(true);

// Ambil statistik RSVP
const { data: stats } = await getRSVPStats();
```

### Wishes Operations

```typescript
// Buat ucapan baru
await createWish({
  name: "Jane Doe",
  email: "jane@example.com", 
  message: "Bahagia selalu!",
  isPublic: true
});

// Ambil semua ucapan public
const { data: wishes } = await getWishes(true);
```

## 🎯 Best Practices

### Database

- **Connection Pooling**: Menggunakan Neon serverless
- **Type Safety**: Drizzle ORM dengan TypeScript
- **Error Handling**: Comprehensive error handling
- **Performance**: Optimized queries dengan indexing

### Security

- **Input Validation**: Client dan server-side validation
- **SQL Injection Prevention**: Drizzle ORM protection
- **Privacy Controls**: User-controlled data visibility
- **Environment Variables**: Secure credential management

### User Experience

- **Progressive Enhancement**: Berfungsi tanpa JavaScript
- **Graceful Degradation**: Fallback untuk browser lama
- **Loading States**: Clear feedback untuk user actions
- **Error Recovery**: Informative error messages

## 🔍 Troubleshooting

### Database Connection Issues

```bash
# Cek environment variables
echo $DATABASE_URL

# Test connection dengan Drizzle Studio
bun run db:studio
```

### Migration Issues

```bash
# Reset migrations
rm -rf drizzle/
bun run db:generate
bun run db:push
```

### API Errors

1. Cek browser console untuk error details
2. Verify DATABASE_URL dalam .env
3. Pastikan schema sudah ter-push ke database

## 📈 Analytics & Insights

### RSVP Analytics

- **Attendance Rate**: Persentase kehadiran
- **Guest Count**: Total tamu yang akan hadir  
- **Response Timeline**: Grafik RSVP over time
- **Message Sentiment**: Analisis sentiment ucapan

### Performance Metrics

- **Response Time**: Database query performance
- **Error Rate**: API success/failure rate
- **User Engagement**: Time spent, interactions

---

💝 **Selamat menggunakan sistem RSVP & Ucapan untuk hari bahagia Anda!** 💝
