# 📚 Bookshelf App dicodingcourse project

Aplikasi Bookshelf adalah aplikasi pengelolaan buku berbasis web yang dibuat dengan HTML, Tailwind CSS, dan JavaScript. Proyek ini merupakan bagian dari submission kursus Dicoding.

## Fitur Utama

- ✨ Menambahkan buku baru
- 🔍 Pencarian buku berdasarkan judul
- 📋 Mengelola status buku (selesai/belum selesai dibaca)
- ✏️ Edit informasi buku
- 🗑️ Hapus buku
- 📊 Statistik koleksi buku
- 🔄 Pengurutan buku berdasarkan judul dan tahun
- 💾 Penyimpanan data menggunakan Local Storage
- 📱 Tampilan responsif untuk berbagai ukuran layar

## Teknologi yang Digunakan

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- Local Storage API
- Browser Drag and Drop API

## Cara Penggunaan

### Menambah Buku Baru
1. Isi form dengan informasi buku:
   - Judul buku
   - Penulis
   - Tahun terbit
   - Status selesai dibaca
2. Klik tombol "Masukkan Buku ke rak"

### Mencari Buku
1. Gunakan form pencarian di bagian atas
2. Ketik judul buku yang ingin dicari
3. Hasil pencarian akan muncul secara otomatis

### Mengelola Buku
- Klik "Selesai dibaca" untuk memindahkan buku antar rak
- Gunakan tombol "Edit" untuk mengubah informasi buku
- Gunakan tombol "Hapus" untuk menghapus buku
- Drag and drop buku untuk memindahkan antar rak

## Struktur Data

```javascript
{
  id: string,
  title: string,
  author: string,
  year: number,
  isComplete: boolean
}
```

## Fitur Tambahan

### Statistik
- Menampilkan total buku
- Jumlah buku yang sudah selesai dibaca
- Jumlah buku yang belum selesai dibaca

### Pengurutan
- Mengurutkan buku berdasarkan judul
- Mengurutkan buku berdasarkan tahun terbit

### Notifikasi
- Notifikasi sukses saat berhasil menambah/edit/hapus buku
- Notifikasi error saat terjadi kesalahan

## Instalasi

1. Clone repository ini
```bash
git clone [url-repository-anda]
```

2. Buka file `index.html` di browser

## Pengembangan

Beberapa ide untuk pengembangan lebih lanjut:
- Implementasi backend untuk penyimpanan data
- Fitur kategori/tag untuk buku
- Fitur rating dan review buku
- Fitur ekspor data buku
- Fitur berbagi buku


---
Dibuat sebagai bagian dari submission kursus Dicoding
