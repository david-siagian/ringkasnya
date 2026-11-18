# ringkasnya.id — Baca Intinya, Praktikkan Ilmunya

Website ringkasan buku populer dunia dalam Bahasa Indonesia dengan pendekatan **ATM (Amati, Tiru, Modifikasi)**:
- **Mode Baca Dwi-Kecepatan**: *Mode Kilat (6–10 Menit)* & *Mode Mendalam (20–30 Menit)* dengan panjang teks terukur (~200 kata/menit).
- **6 Buku Kurasi Modular**: *Atomic Habits*, *The Psychology of Money*, *Deep Work*, *Show Your Work!*, *Filosofi Teras*, dan *Essentialism*.
- **Navigasi & Transisi Smooth**: Smooth scroll `requestAnimationFrame` untuk tautan bagian (`#katalog`, `#metode`) dan transisi fade-slide antar halaman.
- **Action Checklist Interaktif**: Daftar langkah nyata di akhir setiap ringkasan buku yang dapat dicentang pembaca dan tersimpan otomatis di browser (`localStorage`).
- **Shareable Quotes**: Kutipan berkesan dari buku yang dapat disalin dalam 1 klik.

## Tech Stack (Fase 1 - MVP)
- **Next.js 15** (App Router, Static Site Generation)
- **React 19** & **TypeScript**
- **Tailwind CSS** & **Lucide Icons**

## Cara Menjalankan secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser Anda.

## Verification Plan & Release Pipeline

Setiap kali perbaikan atau fitur selesai dibuat, jalankan alur verifikasi hingga deploy produksi (`release-pipeline`):

### 1. Automated Verification
- Menjalankan `npm run build` di `E:\MyApp\ringkasnya` (dengan `BypassSandbox: true` pada Windows) untuk memastikan kompilasi TypeScript, linting, dan generasi halaman statis Next.js berjalan tanpa error.

### 2. Manual & UI Verification
1. Menguji navigasi **Katalog Buku**, **Cara Kerja**, dan klik kartu buku untuk memastikan smooth scroll & transisi halaman bekerja mulus.
2. Membuka halaman detail buku (`/buku/atomic-habits`), menguji toggle **Mode Kilat (6–10 Menit)** vs **Mode Mendalam (20–30 Menit)**, serta mencentang **Action Checklist** dan menyalin kutipan.

### 3. Commit, Push & Deploy ke Produksi
1. Commit dan push perubahan ke GitHub (`git push`, dengan `BypassSandbox: true`).
2. Deploy ke produksi Vercel (`npx vercel --yes --prod`, dengan `BypassSandbox: true`) dan verifikasi situs live di `https://ringkasnya.vercel.app`.
