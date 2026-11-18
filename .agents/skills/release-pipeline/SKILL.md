---
name: release-pipeline
description: >-
  Use this skill whenever a new feature, bug fix, or requirement in ringkasnya.id
  is ready to be verified, committed, pushed to GitHub, and deployed to Vercel
  (including TypeScript/lint checks, production build, Playwright UI verification,
  and post-deploy smoke checks).
---

# Release & Verification Pipeline (`ringkasnya.id`)

Jalankan langkah-langkah berikut secara berurutan di `E:\MyApp\ringkasnya`. Pada Windows, jalankan `npm run build`, `git push`, `npx vercel`, dan `gh` dengan `BypassSandbox: true`.

## 1. Pre-Flight Quality Checks
1. **Typecheck & Lint**:
   - `npx tsc --noEmit`
   - `npm run lint`
2. **Audit Konten Buku (jika mengubah `src/data/books/`)**:
   - Pastikan Mode Kilat ~1.350–1.750 kata (`quickTimeMinutes` 6–10) dan Mode Mendalam ~4.150–5.500 kata (`readingTimeMinutes` 20–30).
   - Pastikan sampul buku memakai format `.svg` di `public/images/covers/<slug>.svg`.

## 2. Production Build
- Jalankan `npm run build` (`BypassSandbox: true`) dan pastikan seluruh halaman statis/SSG terbentuk dengan exit code 0.

## 3. Verifikasi UI via Playwright
- Jalankan server produksi lokal (`npm run start`) dan verifikasi dengan Playwright (desktop & mobile):
  - Beranda (`/`): tidak ada console/page error, pencarian & filter kategori berfungsi, klik **Katalog Buku** melakukan smooth scroll ke `#katalog`.
  - Halaman Reader (`/buku/atomic-habits`): kontras hijau emerald terbaca jelas, toggle **Mode Kilat** vs **Mode Mendalam** berfungsi, **Action Checklist** tersimpan, dan tombol salin kutipan bekerja.
- Hentikan server lokal setelah selesai.

## 4. Git Commit & Push
- Pastikan berada di branch `main` (atau merge ke `main`):
  - `git status`
  - `git add <files>` & `git commit -m "<pesan ringkas>"`
  - `git push origin main` (`BypassSandbox: true`)

## 5. Deploy ke Vercel Production
- Jalankan `npx vercel --yes --prod` (`BypassSandbox: true`) dan tunggu hingga `readyState` = `READY` dan ter-alias ke `https://ringkasnya.vercel.app`.

## 6. Post-Deploy Smoke Check & Dokumentasi
- Verifikasi respons live (aman walau Deployment Protection aktif):
  - `npx vercel curl / --deployment https://ringkasnya.vercel.app -- --silent --head`
  - `npx vercel curl /icon.svg --deployment https://ringkasnya.vercel.app -- --silent --head`
- Jika ada perubahan fitur besar/arsitektur, sinkronkan `PLAN.md` dan `README.md`.
