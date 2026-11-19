# Workspace Rules

## Planning & Documentation
- Setiap kali membuat atau memperbarui dokumen rencana (Implementation Plan / `/plan`), selain menyimpannya di Artifact Directory sistem, **wajib** juga menyimpan salinan file rencana tersebut (`PLAN.md`) langsung di dalam folder proyek aktif (`E:\MyApp\ringkasnya\PLAN.md`).

## Desain & UX (ringkasnya.id)
- **Kontras Cover & Header**: Kartu buku (`BookCard`) dan banner header pembaca (`BookReader`) menggunakan `book.coverGradient` dengan nuansa gelap (`800`–`950`) yang serasi dengan warna ilustrasi `.svg` masing-masing buku agar teks putih selalu kontras dan tidak bertabrakan.
- **Ilustrasi Sampul Buku (.svg)**: Setiap kali membuat atau meng-generate gambar sampul buku, buat dalam format vektor `.svg` saja (simpan di `public/images/covers/<slug>.svg` dan daftarkan di `coverImage` pada `src/data/books/<slug>.ts`) dengan gaya editorial datar (ala Headway/Blinkist/Booksnap) tanpa teks, alih-alih file raster `.jpg`/`.png`.
- **Navigasi & Transisi Smooth**: Jangan mengandalkan CSS `scroll-behavior: smooth` bawaan browser untuk hash scroll; gunakan `SmoothHashLink` dan `PageTransitionWrapper` (`src/components/SmoothNavigation.tsx`) agar scroll dan perpindahan halaman selalu mulus.

## Standar Konten & Durasi Baca
- Hitung estimasi baca pada kecepatan ~200 kata/menit dan simpan tiap buku sebagai modul terpisah di `src/data/books/<slug>.ts`:
  - **Mode Kilat (6–10 Menit)**: 1.350–1.750 kata (`quickTimeMinutes` di kisaran 6–10).
  - **Mode Mendalam (20–30 Menit)**: 4.150–5.500 kata (`readingTimeMinutes` di kisaran 20–30).
- **Format Sinopsis**: Bagian `synopsis` pada setiap buku cukup ditulis **1 paragraf ringkas (4–7 baris)** saja. Jika pemangkasan sinopsis mengurangi total kata, kompensasikan penambahan teks pada `deepContent`, `quickSummary`, atau `conclusion` agar estimasi durasi baca tetap konsisten.

## Operasional CLI (Windows)
- Jalankan `npm run build`, `git push`, `npx wrangler`, `cf`, dan `gh` dengan `BypassSandbox: true` untuk menghindari `EPERM`/hang pada sandbox Windows.
- When interacting with Cloudflare, use the `cf` CLI unless the project has a Wrangler configuration file.

## Deployment & Rilis
- **Wajib Deploy Setelah Push**: Setiap kali selesai melakukan `git commit` dan `git push`, **wajib** langsung melanjutkan dengan deploy ke Cloudflare Workers menggunakan `npx wrangler deploy` (pastikan `npm run build` sudah dijalankan pada perubahan terbaru) serta melakukan verifikasi smoke check ke URL produksi (`https://app.ringkasnya.workers.dev`).
