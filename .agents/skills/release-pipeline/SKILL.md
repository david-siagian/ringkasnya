---
name: release-pipeline
description: >-
  Use this skill whenever a new feature, bug fix, or requirement in ringkasnya.com
  is ready to be verified, committed, pushed to GitHub, and deployed to Cloudflare
  (including TypeScript checks, Astro/Cloudflare production build, Playwright UI
  verification, and post-deploy smoke checks).
---

# Release & Verification Pipeline (`ringkasnya.com`)

Jalankan langkah-langkah berikut secara berurutan di `E:\MyApp\ringkasnya`. Pada Windows, jalankan `npm run build`, `git push`, `npx wrangler`, dan `gh` dengan `BypassSandbox: true`.

## 1. Pre-Flight Quality Checks
1. **Typecheck**:
   - `npm run typecheck` (`npx tsc --noEmit`)
2. **Audit Konten Buku (jika mengubah `src/data/books/`)**:
   - Pastikan Mode Kilat ~950–1.450 kata (`quickTimeMinutes` 5–7) dan Mode Mendalam ~2.950–4.050 kata (`readingTimeMinutes` 15–20).
   - Pastikan sampul buku memakai format `.svg` di `public/images/covers/<slug>.svg`.

## 2. Production Build (Astro + Cloudflare Worker Adapter)
- Jalankan `npm run build` (`BypassSandbox: true`) dan pastikan seluruh halaman prerender serta bundle Cloudflare Worker (`dist/_worker.js`) terbentuk dengan exit code 0.

## 3. Verifikasi UI via Playwright (Opsional / Khusus Rilis ke `main`)
- **Lewati langkah ini** untuk pengerjaan harian atau merge ke `dev` agar proses deploy tetap cepat (cukup Typecheck + Production Build).
- **Jalankan hanya saat diminta eksplisit atau sebelum rilis ke `main`** (`npm run test:e2e` dengan `tests/smoke.spec.ts`, desktop & mobile):
  - Beranda (`/`): tidak ada console/page error, pencarian & filter kategori berfungsi, klik **Katalog Buku** melakukan smooth scroll ke `#katalog`.
  - Halaman Reader (`/buku/sapiens`): kontras tema terbaca jelas, toggle **Mode Kilat** vs **Mode Mendalam** berfungsi, bagian **Konsep Kunci** tampil normal, dan tombol salin kutipan bekerja.

## 4. Git Commit & Push
- Pastikan berada di branch `main` (atau merge ke `main`):
  - `git status`
  - `git add <files>` & `git commit -m "<pesan ringkas>"`
  - `git push origin main` (`BypassSandbox: true`)

## 5. Deploy ke Cloudflare Workers (with Static Assets)
- Jalankan `npx wrangler deploy` (`BypassSandbox: true`).

## 6. Post-Deploy Smoke Check & Dokumentasi
- Verifikasi respons live dari URL produksi Cloudflare (`https://ringkasnya.<subdomain>.workers.dev` atau domain kustom) termasuk endpoint `/api/health`.
- Jika ada perubahan fitur besar/arsitektur, sinkronkan `PLAN.md` dan `README.md`.
