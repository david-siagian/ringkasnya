# Workspace Rules

## CRITICAL GATE: Feature & Bugfix Review Board (Wajib Sebelum Coding)
- Setiap kali user meminta **fitur baru**, perubahan **alur pengguna / antarmuka**, atau **perbaikan bug (fixing)**, **WAJIB** baca dan jalankan skill `review-board` (`.agents/skills/review-board/SKILL.md`) **sebelum** memanggil `edit_file` atau `write_file`.
- Evaluasi di dalam *internal thought* **tidak sah** — hasil Review Board harus dicetak ke chat sesuai format skill `review-board` sebelum perubahan kode pertama dilakukan.
- *(Bypass: hanya lewati jika prompt secara eksplisit menyertakan `"skip review"`, `"no review"`, atau `"eksekusi"`.)*

## Planning & Documentation
- Setiap kali membuat atau memperbarui dokumen rencana (Implementation Plan / `/plan`), selain menyimpannya di Artifact Directory sistem, **wajib** juga menyimpan salinan file rencana tersebut (`PLAN.md`) langsung di dalam folder proyek aktif (`E:\MyApp\ringkasnya\PLAN.md`).

## Desain & UX (Ringkasnya)
- **Kontras Cover & Header**: Kartu buku (`BookCard`) dan banner header pembaca (`BookReader`) menggunakan `book.coverGradient` dengan nuansa gelap (`800`–`950`) yang serasi dengan warna ilustrasi `.svg` masing-masing buku agar teks putih selalu kontras dan tidak bertabrakan.
- **Ilustrasi Sampul Buku (.svg)**: Setiap kali membuat atau meng-generate gambar sampul buku, buat dalam format vektor `.svg` saja (`viewBox="0 0 600 800"`, simpan di `public/images/covers/<slug>.svg` dan daftarkan di kolom `cover_image` tabel `books` di Cloudflare D1) dengan gaya editorial datar (ala Headway/Blinkist/Booksnap) alih-alih file raster `.jpg`/`.png`. Desain sampul harus sebisa mungkin menyerupai sampul buku aslinya (palet warna & motif visual khas) serta menyertakan **judul buku, subjudul asli, dan nama penulis** dengan posisi tipografi yang mirip seperti sampul buku aslinya (mengacu pada contoh `.svg` yang sudah ada). Khusus **subjudul di dalam sampul `.svg`**, wajib menggunakan **bahasa/subjudul asli buku** (jika buku aslinya berbahasa Inggris, tampilkan subjudul di sampulnya dalam Bahasa Inggris — hanya untuk teks di dalam sampul `.svg`, sedangkan kolom `original_title` & `tagline` di database tetap Bahasa Indonesia sesuai `CONTENT.md`).
- **Navigasi & Transisi Smooth**: Jangan mengandalkan CSS `scroll-behavior: smooth` bawaan browser untuk hash scroll; gunakan `SmoothHashLink` dan `PageTransitionWrapper` (`src/components/SmoothNavigation.tsx`) agar scroll dan perpindahan halaman selalu mulus.

## Standar Konten & Durasi Baca
- **Single Source of Truth (`CONTENT.md`)**: Setiap kali akan men-generate buku baru, memperbarui, atau menyunting konten maupun metadata buku di Ringkasnya, **WAJIB** membaca dan mematuhi seluruh standar di [`CONTENT.md`](./CONTENT.md) — mencakup arah kurasi & gaya bahasa, skala poin inti & durasi baca proporsional terhadap tebal halaman, rentang kata `quickSummary` / `deepContent` / paragraf, urutan & penomoran bab `1..N`, format judul/`original_title`/`tagline`/sampul `.svg`, serta kategori & `editorial_tier`.
- **Validasi Wajib Sebelum Migrasi**: Jalankan `npm run validate:content -- migrations/<nama_file>.sql` untuk memastikan seluruh perubahan konten lolos aturan [`CONTENT.md`](./CONTENT.md) sebelum di-commit dan di-push.

## Operasional CLI (Windows)
- Jalankan `git push`, `npx wrangler`, `cf`, dan `gh` dengan `BypassSandbox: true` untuk menghindari `EPERM`/hang pada sandbox Windows.
- Jalankan `git add`, `git commit`, dan `git push` sebagai pemanggilan perintah yang **terpisah** (jangan digabung dalam satu baris perintah), agar approval prefix-matching tetap bekerja tanpa perlu meminta izin ulang untuk setiap commit message yang unik.
- Jalankan perintah `git` (`git add`, `git commit`, `git push`, `git checkout`, `git merge`, `git pull`) **langsung tanpa flag `-C <path>`** (karena *working directory* command sudah berada di root workspace), dan gunakan `git push` langsung untuk branch yang sudah memiliki *upstream* (atau `git push -u origin <nama-branch>` untuk branch baru) agar *prefix-matching* "Always Allow" pada `git push` cukup disetujui sekali.
- When interacting with Cloudflare, use the `cf` CLI unless the project has a Wrangler configuration file.

## Git Workflow & Branching
- **Branch `main` Hanya untuk Rilis (Production)**: Jangan melakukan commit atau push langsung ke `main` untuk pengerjaan fitur, bugfix, atau perubahan harian.
- **Branch `dev` sebagai Integrasi & Preview**: Semua perubahan fitur/bugfix digabungkan terlebih dahulu ke branch `dev`.
- **Alur Kerja Fitur / Bugfix / Lainnya**:
  1. Pastikan berada di branch `dev` terbaru (`git checkout dev`, lalu `git pull origin dev`), kemudian buat branch baru dari `dev` (misalnya `feat/<nama-fitur>`, `fix/<nama-bug>`, `docs/<topik>`, `chore/<topik>`).
  2. Kerjakan perubahan pada branch baru tersebut (tidak perlu menjalankan `npm run build` maupun `npx test` secara lokal; untuk *refactor* besar yang menyentuh banyak file/tipe data, jalankan `npm run typecheck` sebelum push agar terhindar dari bolak-balik memperbaiki error di CI).
  3. Commit dan push perubahan ke branch baru tersebut (`git push -u origin <nama-branch>`).
  4. Merge branch tersebut ke `dev` (`git checkout dev`, `git merge <nama-branch>`, `git push origin dev`), lalu pantau status workflow GitHub Actions (`.github/workflows/deploy.yml`) menggunakan `gh run list` / `gh run watch` untuk memastikan seluruh step (TypeScript Check, Build Project, dan Apply D1 Migrations) berjalan sukses.

## Deployment & Rilis
- **Auto-Deploy Cloudflare & GitHub Actions Aktif**:
  - **Preview (`dev`)**: Push/merge ke branch `dev` memicu workflow GitHub Actions (`CI & D1 Migrations`: typecheck, build, dan migrasi D1 preview) serta build & deploy Preview di Cloudflare Workers.
  - **Production (`main`)**: Push/merge ke branch `main` (khusus rilis) memicu workflow GitHub Actions (`CI & D1 Migrations`: typecheck, build, dan migrasi D1 production) serta build & deploy Production di Cloudflare Workers.
  - Tidak perlu menjalankan `npx wrangler deploy`, `npm run build`, maupun `npx test` secara manual setelah `git push`; cukup pantau eksekusi GitHub Actions hingga seluruh step dinyatakan sukses.
- **Auto-Push Setelah Selesai Fitur/Bug**: Setiap kali selesai mengerjakan fitur atau perbaikan bug, langsung lakukan `git commit` dan `git push` ke branch kerja (yang ditarik dari `dev`), lalu merge ke `dev` dan push `dev`, kemudian pantau hasil GitHub Actions hingga sukses, kecuali user meminta untuk tidak di-push terlebih dahulu.

## Pengujian & Verifikasi
- **GitHub Actions sebagai Gerbang Utama**: Tidak perlu menjalankan `npm run build` ataupun `npx test` / `npm run test:e2e` secara lokal saat pengerjaan harian (cukup `npm run typecheck` opsional bila melakukan *refactor* besar lintas file/tipe data). Setelah push ke `dev` atau `main`, pantau workflow GitHub Actions (`gh run list` / `gh run watch`) untuk memastikan seluruh step berhasil.
- **Playwright Smoke Test (On-Demand)**: Uji browser (`npm run test:e2e`, mengacu ke `tests/smoke.spec.ts`) hanya dijalankan jika diminta secara eksplisit oleh user, dengan skenario minimal:
  - **Beranda (`/`)**: Zero `console.error` / `pageerror`, pencarian & filter kategori berfungsi, serta navigasi/smooth scroll ke katalog berjalan normal.
  - **Halaman Reader (`/buku/<slug>`, mis. `/buku/sapiens`)**: Toggle **Mode Kilat vs Mode Mendalam** berfungsi, bagian **Konsep Kunci** tampil normal, tombol salin kutipan & tema (`useTheme`) bekerja, serta endpoint `/api/health` merespons normal.