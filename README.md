# Ringkasnya — Baca Intinya, Pahami Dunianya

Platform ringkasan buku nonfiksi pilihan dunia (**ringkasnya.com**) dalam Bahasa Indonesia yang mengalir dan mudah dipahami siapa saja—mulai dari sains, nalar & berpikir kritis, psikologi, sejarah, filsafat, hingga ekonomi dan organisasi:
- **Dua Mode Baca**: *Mode Kilat (5–7 Menit)* untuk menangkap inti setiap bab dengan cepat & *Mode Mendalam (15–20 Menit)* untuk menyelami cerita, bukti, dan konteks lengkapnya (~200 kata/menit).
- **Konsep Kunci**: Rangkuman konsep-konsep utama di setiap buku yang ditulis ulang dengan bahasa sederhana agar gagasan besarnya cepat melekat dan mudah ditinjau ulang.
- **Katalog Nonfiksi Kurasi (Cloudflare D1)**: Tersedia dalam 10 kategori tematik yang diurutkan berdasarkan *editorial tier* dan popularitas Goodreads.
- **Artikel Editorial & Popover Istilah**: Artikel singkat berdurasi 4–6 menit per rubrik yang dilengkapi ilustrasi SVG, definisi istilah interaktif, dan rekomendasi buku terkait.
- **Kartu Kutipan & Pengalaman Baca Personal**: Kutipan pilihan yang bisa disalin atau diunduh sebagai kartu PNG bergaya editorial, fitur *bookmark*, penanda buku selesai (`localStorage`), pengatur ukuran huruf, serta mode terang/gelap.
- **Navigasi & Transisi Smooth**: Smooth scroll `requestAnimationFrame` untuk tautan bagian (`#katalog`, `#metode`) dan transisi fade-slide antar halaman.

## Tech Stack (Cloudflare-Native Hybrid Stack)
- **Astro 5** + **`@astrojs/cloudflare`** (Hybrid Static & Cloudflare Workers SSR)
- **React 19** & **TypeScript**
- **Tailwind CSS** & **Lucide Icons**
- **Cloudflare Workers & Cloudflare D1** (`wrangler.jsonc` terhubung ke database `ringkasnya-db` untuk katalog & konten buku)
- **Playwright** (`npm run test:e2e`) untuk smoke test alur UI utama

## Cara Menjalankan secara Lokal

```bash
npm install
npm run db:migrate:local
npm run dev
```

Buka `http://localhost:4321` di browser Anda.

Untuk mensimulasikan runtime produksi Cloudflare secara lokal:

```bash
npm run build
npm run cf:preview
```

## Verifikasi & Alur Rilis

### 1. Verifikasi Lokal
- Jalankan `npx tsc --noEmit` dan `npm run build` untuk memastikan pengecekan tipe TypeScript, kompilasi Astro, dan bundle Cloudflare Worker (`dist/_worker.js`) berjalan tanpa error.
- Jalankan `npm run test:e2e` (Playwright smoke test) secara *on-demand* atau sebelum rilis ke `main`.

### 2. Git Workflow & Auto-Deploy Cloudflare
- Pengerjaan fitur, perbaikan bug, dan pembaruan dilakukan melalui branch turunan dari `dev`, lalu di-merge kembali ke `dev`.
- **Preview (`dev`)**: Push/merge ke branch `dev` memicu build & deploy Preview di Cloudflare Workers.
- **Production (`main`)**: Push/merge ke branch `main` (khusus rilis) memicu build & deploy Production di Cloudflare Workers.
