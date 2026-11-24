# Workspace Rules

## CRITICAL GATE: Feature & Bugfix Review Board (Wajib Sebelum Coding)
- Setiap kali user meminta **fitur baru**, perubahan **alur pengguna / antarmuka**, atau **perbaikan bug (fixing)**, **WAJIB** baca dan jalankan skill `review-board` (`.agents/skills/review-board/SKILL.md`) **sebelum** memanggil `edit_file` atau `write_file`.
- Evaluasi di dalam *internal thought* **tidak sah** — hasil Review Board harus dicetak ke chat sesuai format skill `review-board` sebelum perubahan kode pertama dilakukan.
- *(Bypass: hanya lewati jika prompt secara eksplisit menyertakan `"skip review"`, `"no review"`, atau `"eksekusi"`.)*

## Planning & Documentation
- Setiap kali membuat atau memperbarui dokumen rencana (Implementation Plan / `/plan`), selain menyimpannya di Artifact Directory sistem, **wajib** juga menyimpan salinan file rencana tersebut (`PLAN.md`) langsung di dalam folder proyek aktif (`E:\MyApp\ringkasnya\PLAN.md`).

## Desain & UX (Ringkasnya)
- **Kontras Cover & Header**: Kartu buku (`BookCard`) dan banner header pembaca (`BookReader`) menggunakan `book.coverGradient` dengan nuansa gelap (`800`–`950`) yang serasi dengan warna ilustrasi `.svg` masing-masing buku agar teks putih selalu kontras dan tidak bertabrakan.
- **Ilustrasi Sampul Buku (.svg)**: Setiap kali membuat atau meng-generate gambar sampul buku, buat dalam format vektor `.svg` saja (`viewBox="0 0 600 800"`, simpan di `public/images/covers/<slug>.svg` dan daftarkan di kolom `cover_image` tabel `books` di Cloudflare D1) dengan gaya editorial datar (ala Headway/Blinkist/Booksnap) alih-alih file raster `.jpg`/`.png`. Desain sampul harus sebisa mungkin menyerupai sampul buku aslinya (palet warna & motif visual khas) serta menyertakan **judul buku dan nama penulis** dengan posisi tipografi yang mirip seperti sampul buku aslinya (mengacu pada contoh `.svg` yang sudah ada).
- **Navigasi & Transisi Smooth**: Jangan mengandalkan CSS `scroll-behavior: smooth` bawaan browser untuk hash scroll; gunakan `SmoothHashLink` dan `PageTransitionWrapper` (`src/components/SmoothNavigation.tsx`) agar scroll dan perpindahan halaman selalu mulus.

## Standar Konten & Durasi Baca
- **Kepatuhan Wajib ke `CONTENT.md`**: Setiap kali akan men-generate buku baru, memperbarui, atau menyunting konten buku di Ringkasnya, **WAJIB** membaca dan mematuhi seluruh aturan di [`CONTENT.md`](./CONTENT.md) (skala poin inti & durasi baca proporsional terhadap tebal halaman, rentang kata `quickSummary` / Intisari Bab, jumlah kata & paragraf per bab pada `deepContent`, rentang kata per paragraf, urutan bab sesuai buku asli, penomoran `number: 1..N`, serta checklist validasi seluruh kolom `books` dan `book_contents`).
- **Arah Kurasi & Gaya Bahasa**: Fokuskan katalog utama pada ringkasan buku nonfiksi berbasis pengetahuan (sains, ekonomi, politik, psikologi, sejarah, masyarakat, perilaku, organisasi, budaya kerja) dan hindari menonjolkan *self-help* populer yang minim landasan ilmiah. Tulis seluruh ringkasan, `keyNote`, dan `keyConcepts` dalam Bahasa Indonesia yang luwes, jernih, dan mudah dipahami pembaca awam—seminimal mungkin memakai jargon akademis yang berat.
- **Standar Wajib Setiap Penambahan/Pembaruan Buku (Skala Berbasis Tebal Halaman)**: Setiap kali menambahkan buku baru atau memperbarui konten buku di Cloudflare D1 (tabel `books` & `book_contents`), jumlah poin inti (`keyTakeaways`) dan jumlah kata wajib disesuaikan dengan **tebal halaman buku asli** agar hasil perhitungan `withCalculatedReadingTimes` (`WORDS_PER_MINUTE = 200` di `src/lib/book-constants.ts`) memenuhi skala **Mode Kilat 4–8 menit** dan **Mode Mendalam 15–22 menit** berikut:
  - **Tipis / Ringkas (< 220 halaman)**: **5 poin inti** · Mode Kilat **4–5 menit** (~750–1.050 kata) · Mode Mendalam **15 menit** (~2.900–3.099 kata).
  - **Sedang / Standar (220–380 halaman)**: **6 poin inti** · Mode Kilat **5–6 menit** (~950–1.250 kata) · Mode Mendalam **15–17 menit** (~2.950–3.450 kata).
  - **Tebal (381–520 halaman)**: **7–8 poin inti** · Mode Kilat **6–7 menit** (~1.150–1.450 kata) · Mode Mendalam **18–20 menit** (~3.550–4.050 kata).
  - **Sangat Tebal / Epik (> 520 halaman)**: **8–9 poin inti** · Mode Kilat **7–8 menit** (~1.350–1.650 kata) · Mode Mendalam **20–22 menit** (~3.950–4.450 kata).
  - **Rumus Acuan Cepat** (dari `halaman`):
    - Poin Inti = `clamp(round(4 + halaman / 120), 5, 9)`
    - Target Kilat (menit) = `clamp(round(3.5 + halaman / 130), 4, 8)`
    - Target Mendalam (menit) = `clamp(round(12 + halaman / 60), 15, 22)`
  - Selaraskan kolom `quick_time_minutes`, `reading_time_minutes`, dan `takeaways_count` di tabel `books` agar sesuai dengan hasil estimasi di atas.
- **Format Sinopsis**: Bagian `synopsis` pada setiap buku cukup ditulis **1 paragraf ringkas (4–7 baris)** saja. Jika pemangkasan sinopsis mengurangi total kata, kompensasikan penambahan teks pada `deepContent`, `quickSummary`, atau `conclusion` agar estimasi durasi baca tetap berada dalam rentang standar.
- **Format Judul & Subjudul Buku (`title` & `original_title`)**:
  - Kolom `title` di tabel `books` **cukup berisi judul utama buku saja** tanpa subjudul setelah tanda titik dua (`:`) — misalnya `Quiet` (bukan `Quiet: The Power of Introverts in a World That Can't Stop Talking`) atau `Sapiens` (bukan `Sapiens: A Brief History of Humankind`), agar tampilan kartu di katalog tetap bersih dan mudah dipindai.
  - Kolom `original_title` (tagline/subjudul yang tampil di bawah judul pada `BookPreviewModal` dan `BookReader`) **wajib ditulis dalam Bahasa Indonesia**, **tidak boleh mengulang judul buku** di depannya (tanpa pola `"Judul: ..."`), dan tidak boleh kosong/`NULL` — misalnya `Kekuatan Orang Introver di Dunia yang Tak Berhenti Bicara`.
- **Urutan Katalog, Kategori & Popularitas Goodreads**:
  - Setiap penambahan buku baru di tabel `books` **wajib** menyertakan kolom `goodreads_ratings` (angka perkiraan jumlah *ratings* buku di Goodreads) dan `editorial_tier` (`1` = berbasis sains, riset, sejarah ilmiah, atau klasik intelektual; `2` = nonfiksi populer, finansial praktis, atau refleksi populer; `3` = kategori `Organisasi & Bisnis`, `Karier & Budaya Kerja`, dan `Produktivitas & Pengembangan Diri`) agar pengurutan query di `src/lib/books-repository.ts` selalu akurat.
  - Urutan `CATEGORIES` dipertahankan di `src/lib/book-constants.ts`: (1) `Sains & Alam Semesta`, (2) `Teknologi & Masa Depan`, (3) `Nalar & Berpikir Kritis`, (4) `Psikologi & Perilaku`, (5) `Sejarah & Peradaban`, (6) `Filsafat & Kebijaksanaan`, (7) `Ekonomi & Keuangan`, (8) `Organisasi & Bisnis`, (9) `Karier & Budaya Kerja`, (10) `Tubuh & Kesehatan`, (11) `Produktivitas & Pengembangan Diri`.
  - Query katalog di `src/lib/books-repository.ts` mengurutkan berdasarkan `editorial_tier` (`1` → `2` → `3`) terlebih dahulu, lalu berdasarkan `goodreads_ratings` tertinggi di dalam masing-masing tier, sehingga **Perpustakaan Kurasi** dan bagian atas tab **Semua** selalu menonjolkan buku nonfiksi ilmiah/berbasis riset.

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