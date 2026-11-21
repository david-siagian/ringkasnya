# Workspace Rules

## Planning & Documentation
- Setiap kali membuat atau memperbarui dokumen rencana (Implementation Plan / `/plan`), selain menyimpannya di Artifact Directory sistem, **wajib** juga menyimpan salinan file rencana tersebut (`PLAN.md`) langsung di dalam folder proyek aktif (`E:\MyApp\ringkasnya\PLAN.md`).

## Desain & UX (Ringkasnya)
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
- Jalankan `git add`, `git commit`, dan `git push` sebagai pemanggilan perintah yang **terpisah** (jangan digabung dalam satu baris perintah), agar approval prefix-matching tetap bekerja tanpa perlu meminta izin ulang untuk setiap commit message yang unik.
- Jalankan perintah `git` (`git add`, `git commit`, `git push`, `git checkout`, `git merge`, `git pull`) **langsung tanpa flag `-C <path>`** (karena *working directory* command sudah berada di root workspace), dan gunakan `git push` langsung untuk branch yang sudah memiliki *upstream* (atau `git push -u origin <nama-branch>` untuk branch baru) agar *prefix-matching* "Always Allow" pada `git push` cukup disetujui sekali.
- When interacting with Cloudflare, use the `cf` CLI unless the project has a Wrangler configuration file.

## Git Workflow & Branching
- **Branch `main` Hanya untuk Rilis (Production)**: Jangan melakukan commit atau push langsung ke `main` untuk pengerjaan fitur, bugfix, atau perubahan harian.
- **Branch `dev` sebagai Integrasi & Preview**: Semua perubahan fitur/bugfix digabungkan terlebih dahulu ke branch `dev`.
- **Alur Kerja Fitur / Bugfix / Lainnya**:
  1. Pastikan berada di branch `dev` terbaru (`git checkout dev`, lalu `git pull origin dev`), kemudian buat branch baru dari `dev` (misalnya `feat/<nama-fitur>`, `fix/<nama-bug>`, `docs/<topik>`, `chore/<topik>`).
  2. Kerjakan perubahan pada branch baru tersebut dan pastikan verifikasi (`npx tsc --noEmit` dan `npm run build`) lulus.
  3. Commit dan push perubahan ke branch baru tersebut (`git push -u origin <nama-branch>`).
  4. Merge branch tersebut ke `dev` (`git checkout dev`, `git merge <nama-branch>`, `git push origin dev`).

## Deployment & Rilis
- **Auto-Deploy Cloudflare Aktif**:
  - **Preview (`dev`)**: Push/merge ke branch `dev` memicu build & deploy Preview di Cloudflare Workers (`npx wrangler preview`).
  - **Production (`main`)**: Push/merge ke branch `main` (khusus rilis) memicu build & deploy Production di Cloudflare Workers (`npx wrangler deploy`).
  - Tidak perlu menjalankan `npx wrangler deploy` secara manual setelah `git push` (cukup pastikan `npx tsc --noEmit` dan `npm run build` lulus secara lokal sebelum commit/push).
- **Auto-Push Setelah Selesai Fitur/Bug**: Setiap kali selesai mengerjakan fitur atau perbaikan bug dan verifikasi (`npx tsc --noEmit` / `npm run build`) lulus, langsung lakukan `git commit` dan `git push` ke branch kerja (yang ditarik dari `dev`), lalu merge ke `dev` dan push `dev`, kecuali user meminta untuk tidak di-push terlebih dahulu.

## Feature & Bugfix Review Board (Wajib Sebelum Coding)
Setiap kali diminta menambahkan **fitur baru**, mengubah **alur pengguna**, atau melakukan **perbaikan bug (fixing)**, JANGAN langsung menulis atau mengubah kode terlebih dahulu. Lakukan evaluasi ringkas melalui 3 *role* berikut sebelum menyusun rencana implementasi.

*(Bypass: Jika instruksi secara eksplisit menyertakan `"skip review"`, `"no review"` atau `"eksekusi"`, lewati Review Board dan langsung eksekusi.)*

### A. Product & UX Reviewer (Human-Centric & Tren)
- **Nilai & Kebiasaan Pengguna:** Apakah fitur/perbaikan menjawab kebutuhan pembaca ringkasan buku dan pendengar audio secara nyata, atau menambah beban visual/aliran yang tidak perlu?
- **Ergonomi & Tren Produk:** Evaluasi alur baca, pemutar audio, highlight, dan kuis terhadap pola aplikasi modern (kecepatan *time-to-value*, *mobile-first*, transisi halus, tanpa gangguan berlebih). Sarankan alternatif yang lebih ringan jika diperlukan.

### B. Growth & Retention Strategist (Retensi & Kebiasaan Pengguna)
- **Dampak pada Retensi & Alur Kembali:** Apakah fitur/perbaikan membantu pengguna kembali menggunakan aplikasi secara alami dan menyelesaikan nilai utamanya, atau justru menambah friksi yang membuat pengguna berhenti di tengah jalan?
- **Nilai Jangka Panjang vs Gimmick:** Apakah efeknya mendorong kebiasaan penggunaan yang sehat dan berkelanjutan, atau sekadar kebaruan sesaat yang cepat dilupakan?

### C. QA & Edge-Case Skeptic (Keandalan & Akar Masalah)
- **State & Kegagalan:** Periksa *empty state*, *loading state*, jaringan terputus/lambat, teks panjang, audio belum tersedia/gagal dimuat, dan klik ganda cepat.
- **Akar Masalah vs Tambalan:** Pastikan *bug fix* menyentuh akar penyebab, bukan sekadar menyembunyikan *error* di UI.
- **Verifikasi:** Rencanakan skenario pengujian spesifik (termasuk uji browser Playwright untuk alur UI utama) agar regresi mudah terdeteksi.

### Format Output Wajib Sebelum Mengubah Kode:
1. **Review Singkat (3 Role):** Maksimal 2 kalimat per *role* agar padat dan mudah dibaca cepat.
2. **Dampak Retensi:** Nyatakan secara singkat apakah dampaknya **Positif**, **Perlu dijaga (risiko friksi)**, atau **Netral**.
3. **Keputusan:** Nyatakan **Layak lanjut apa adanya**, **Lanjut dengan penyesuaian**, atau **Sebaiknya disederhanakan**, disertai alasan utama.
4. **Konfirmasi:** Minta persetujuan eksplisit sebelum mulai menulis/mengubah kode.