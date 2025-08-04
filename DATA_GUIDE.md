# Wedding Invitation Website

Website undangan pernikahan yang responsif dan mobile-first dengan animasi yang indah menggunakan Motion dan DaisyUI.

## 🎯 Fitur

- **Mobile-First Design**: Dioptimalkan untuk perangkat mobile
- **Responsive**: Adaptif untuk desktop dan mobile
- **Animasi Smooth**: Menggunakan Motion library untuk animasi yang halus
- **Countdown Timer**: Hitungan mundur waktu real-time ke hari pernikahan
- **Story Timeline**: Perjalanan cinta dalam 4 tahap
- **Gallery**: Foto-foto mempelai
- **RSVP Form**: Formulir konfirmasi kehadiran
- **Music Player**: Kontrol musik background
- **Share Function**: Berbagi undangan via Web Share API

## 📝 Cara Mengubah Data

Semua data website disimpan dalam file JSON untuk memudahkan perubahan tanpa perlu edit kode. Cukup edit file `src/data/weddingData.json`:

### 1. Data Mempelai

```json
"couple": {
  "groom": {
    "name": "Nama Mempelai Pria",
    "parents": "Nama Orang Tua Pria",
    "photo": "URL_FOTO_PRIA"
  },
  "bride": {
    "name": "Nama Mempelai Wanita", 
    "parents": "Nama Orang Tua Wanita",
    "photo": "URL_FOTO_WANITA"
  }
}
```

### 2. Informasi Hero Section

```json
"hero": {
  "title": "Wedding Invitation",
  "coupleNames": "Nama & Nama",
  "date": "Hari, Tanggal Bulan Tahun",
  "time": "Jam WIB"
}
```

### 3. Detail Acara

```json
"events": [
  {
    "type": "Akad Nikah",
    "date": "Hari, Tanggal Bulan Tahun",
    "time": "Jam",
    "venue": "Nama Tempat",
    "address": "Alamat Lengkap"
  }
]
```

### 4. Cerita Cinta (4 Tahap)

```json
"story": [
  {
    "icon": "💕",
    "title": "Judul Tahap",
    "date": "Bulan Tahun",
    "description": "Deskripsi cerita...",
    "color": "from-pink-200 to-rose-200"
  }
]
```

### 5. Gallery Foto

```json
"gallery": [
  "URL_FOTO_1",
  "URL_FOTO_2",
  "URL_FOTO_3"
]
```

### 6. Countdown Timer

```json
"countdown": {
  "weddingDate": "2025-08-11T09:00:00"
}
```

### 7. Quote/Ayat

```json
"quote": {
  "text": "Teks quote atau ayat",
  "source": "Sumber quote"
}
```

### 8. Maps & Sharing

```json
"maps": {
  "url": "https://maps.google.com/link"
},
"sharing": {
  "title": "Judul untuk share",
  "text": "Teks untuk share",
  "copyMessage": "Pesan saat link disalin"
}
```

## 🚀 Menjalankan Aplikasi

```bash
# Install dependencies
bun install

# Jalankan development server
bun run dev

# Build untuk production
bun run build
```

## 🎨 Kustomisasi

### Warna Tema

Edit file `tailwind.config.js` untuk mengubah skema warna:

```javascript
themes: [
  {
    wedding: {
      primary: "#d1a3a4",    // Warna utama
      secondary: "#f4d1d1",  // Warna sekunder  
      accent: "#b08080",     // Warna aksen
      // ... warna lainnya
    }
  }
]
```

### Foto

- Ganti URL foto di `weddingData.json`
- Atau upload foto ke folder `public/images/` dan gunakan path relatif
- Format yang disarankan: JPG/PNG, ukuran optimal 400x400px untuk gallery

### Font & Styling

- Edit `src/index.css` untuk styling global
- Font serif digunakan untuk judul, sans untuk teks biasa
- Responsive breakpoints: mobile-first dengan `sm:` untuk desktop

## 📱 Mobile Features

- **Full Viewport**: Mobile device menggunakan full viewport width
- **Fixed Controls**: Tombol musik dan share fixed di kanan bawah
- **Smooth Scroll**: Navigasi halus antar section
- **Touch Optimized**: Semua interaksi dioptimalkan untuk touch

## 🔧 Tech Stack

- **React 19**: Framework utama
- **Motion**: Library animasi
- **DaisyUI**: Komponen UI
- **Tailwind CSS**: Utility CSS
- **TypeScript**: Type safety
- **Bun**: Package manager & bundler

## 📄 Struktur File

```bash
src/
├── components/
│   ├── CountdownTimer.tsx
│   └── QuoteSection.tsx
├── data/
│   └── weddingData.json     # 📝 FILE UTAMA UNTUK EDIT DATA
├── App.tsx
├── index.css
└── index.tsx
```

## 💡 Tips

1. **Backup Data**: Selalu backup `weddingData.json` sebelum edit
2. **Format Tanggal**: Gunakan format ISO untuk countdown (YYYY-MM-DDTHH:mm:ss)
3. **Optimasi Foto**: Kompres foto sebelum upload untuk performa lebih baik
4. **Test Mobile**: Selalu test di device mobile setelah perubahan
5. **Progressive Enhancement**: Website tetap berfungsi tanpa JavaScript

## 🐛 Troubleshooting

- **Countdown tidak akurat**: Periksa format tanggal di `weddingData.json`
- **Foto tidak muncul**: Pastikan URL foto dapat diakses publik
- **Animasi lag**: Coba kurangi jumlah foto di gallery
- **Share tidak berfungsi**: Fallback ke copy link otomatis tersedia

---

❤️ **Made with Love** untuk momen spesial Anda ❤️
