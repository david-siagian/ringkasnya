# Ringkasnya — Baca Intinya, Praktikkan Ilmunya

Website ringkasan buku populer dunia dalam Bahasa Indonesia dengan pendekatan **ATM (Amati, Tiru, Modifikasi)**:
- **Mode Baca Dwi-Kecepatan**: *Mode Kilat (6–10 Menit)* & *Mode Mendalam (20–30 Menit)* dengan panjang teks terukur (~200 kata/menit).
- **6 Buku Kurasi Modular**: *Atomic Habits*, *The Psychology of Money*, *Deep Work*, *Show Your Work!*, *Filosofi Teras*, dan *Essentialism*.
- **Navigasi & Transisi Smooth**: Smooth scroll `requestAnimationFrame` untuk tautan bagian (`#katalog`, `#metode`) dan transisi fade-slide antar halaman.
- **Action Checklist Interaktif**: Daftar langkah nyata di akhir setiap ringkasan buku yang dapat dicentang pembaca dan tersimpan otomatis di browser (`localStorage`).
- **Shareable Quotes**: Kutipan berkesan dari buku yang dapat disalin dalam 1 klik.

## Tech Stack (Cloudflare-Native Hybrid Stack)
- **Astro 5** + **`@astrojs/cloudflare`** (Hybrid Static & Cloudflare Workers SSR)
- **React 19** & **TypeScript**
- **Tailwind CSS** & **Lucide Icons**
- **Cloudflare Pages / Workers** (`wrangler.jsonc` siap untuk integrasi **Cloudflare D1** & **KV** pada fitur Login & Pembayaran)

## Cara Menjalankan secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:4321` di browser Anda.

Untuk mensimulasikan runtime produksi Cloudflare secara lokal:

```bash
npm run build
npm run cf:preview
```

## Verification Plan & Release Pipeline

Setiap kali perbaikan atau fitur selesai dibuat, jalankan alur verifikasi hingga deploy produksi (`release-pipeline`):

### 1. Automated Verification
- Menjalankan `npm run build` di `E:\MyApp\ringkasnya` (dengan `BypassSandbox: true` pada Windows) untuk memastikan kompilasi TypeScript, astro build, dan bundle Cloudflare Worker (`dist/_worker.js`) berjalan tanpa error.

### 2. UI Verification (Playwright)
- Setiap kali ada perubahan UI, uji tampilan, alur interaksi, dan layout secara langsung melalui **Playwright** (desktop & mobile) untuk memastikan tidak ada regresi visual maupun fungsional.

### 3. Commit, Push & Deploy ke Cloudflare
1. Commit dan push perubahan ke GitHub (`git push`, dengan `BypassSandbox: true`).
2. Deploy ke produksi Cloudflare Workers (`npm run cf:deploy` atau `npx wrangler deploy`, dengan `BypassSandbox: true`).
