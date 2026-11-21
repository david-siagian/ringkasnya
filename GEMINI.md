# Workspace Rules

## Planning & Documentation
- Setiap kali membuat atau memperbarui dokumen rencana (Implementation Plan / `/plan`), selain menyimpannya di Artifact Directory sistem, **wajib** juga menyimpan salinan file rencana tersebut (`PLAN.md`) langsung di dalam folder proyek aktif (`E:\MyApp\ringkasnya\PLAN.md`).

## Desain & UX (Ringkasnya)
- **Kontras Cover & Header**: Kartu buku (`BookCard`) dan banner header pembaca (`BookReader`) menggunakan `book.coverGradient` dengan nuansa gelap (`800`–`950`) yang serasi dengan warna ilustrasi `.svg` masing-masing buku agar teks putih selalu kontras dan tidak bertabrakan.
- **Ilustrasi Sampul Buku (.svg)**: Setiap kali membuat atau meng-generate gambar sampul buku, buat dalam format vektor `.svg` saja (`viewBox="0 0 600 800"`, simpan di `public/images/covers/<slug>.svg` dan daftarkan di `coverImage` pada `src/data/books/<slug>.ts`) dengan gaya editorial datar (ala Headway/Blinkist/Booksnap) alih-alih file raster `.jpg`/`.png`. Desain sampul harus sebisa mungkin menyerupai sampul buku aslinya (palet warna & motif visual khas) serta menyertakan **judul buku dan nama penulis** dengan posisi tipografi yang mirip seperti sampul buku aslinya (mengacu pada contoh `.svg` yang sudah ada).
- **Navigasi & Transisi Smooth**: Jangan mengandalkan CSS `scroll-behavior: smooth` bawaan browser untuk hash scroll; gunakan `SmoothHashLink` dan `PageTransitionWrapper` (`src/components/SmoothNavigation.tsx`) agar scroll dan perpindahan halaman selalu mulus.

## Standar Konten & Durasi Baca
- **Arah Kurasi & Gaya Bahasa**: Fokuskan katalog utama pada ringkasan buku nonfiksi berbasis pengetahuan (sains, ekonomi, politik, psikologi, sejarah, masyarakat, perilaku, organisasi, budaya kerja) dan hindari menonjolkan *self-help* populer yang minim landasan ilmiah. Tulis seluruh ringkasan, `keyNote`, dan `keyConcepts` dalam Bahasa Indonesia yang luwes, jernih, dan mudah dipahami pembaca awam—seminimal mungkin memakai jargon akademis yang berat.
- **Standar Wajib Setiap Penambahan/Pembaruan Buku**: Setiap kali menambahkan buku baru di `src/data/books/<slug>.ts` (atau memperbarui konten buku yang ada), jumlah kata wajib disesuaikan agar hasil perhitungan dinamis `withCalculatedReadingTimes` (`WORDS_PER_MINUTE = 200` di `src/data/books.ts`) memenuhi rentang kedua mode berikut:
  - **Mode Kilat (5–7 Menit)**: ~950–1.450 kata untuk gabungan teks Mode Kilat (`synopsis`, `whoIsItFor`, `keyConcepts`, `quotes`, `conclusion`, serta `title`, `quickSummary`, dan `keyNote` pada tiap `keyTakeaways`) sehingga `quickTimeMinutes` berada di kisaran **5–7 menit**.
  - **Mode Mendalam (15–20 Menit)**: ~2.950–4.050 kata untuk gabungan Mode Kilat + `deepContent` (sekitar **2.000–2.600 kata** khusus pada `deepContent` di seluruh `keyTakeaways`) sehingga `readingTimeMinutes` berada di kisaran **15–20 menit** (~2,5x–3x lebih dalam dari Mode Kilat).
  - Selaraskan juga properti statis `quickTimeMinutes` dan `readingTimeMinutes` di dalam `src/data/books/<slug>.ts` agar sesuai dengan hasil estimasi di atas.
- **Format Sinopsis**: Bagian `synopsis` pada setiap buku cukup ditulis **1 paragraf ringkas (4–7 baris)** saja. Jika pemangkasan sinopsis mengurangi total kata, kompensasikan penambahan teks pada `deepContent`, `quickSummary`, atau `conclusion` agar estimasi durasi baca tetap berada dalam rentang standar.

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

## Pengujian & Verifikasi (Playwright)
- **Lingkup Uji**: Gunakan **Playwright smoke test** (`npm run test:e2e`, mengacu ke `tests/smoke.spec.ts`) yang ringan dan terfokus pada alur UI utama (desktop & mobile).
- **Kapan Dijalankan**:
  - **Pengerjaan harian & merge ke `dev`**: Tidak perlu dijalankan; cukup `npx tsc --noEmit` dan `npm run build` agar proses deploy preview tetap cepat.
  - **On-demand / Pra-rilis**: Hanya dijalankan jika diminta secara eksplisit oleh user atau khusus sebelum rilis ke `main`.
- **Skenario Minimal yang Diverifikasi**:
  - **Beranda (`/`)**: Zero `console.error` / `pageerror`, pencarian & filter kategori berfungsi, serta navigasi/smooth scroll ke katalog berjalan normal.
  - **Halaman Reader (`/buku/<slug>`, mis. `/buku/sapiens`)**: Toggle **Mode Kilat vs Mode Mendalam** berfungsi, bagian **Konsep Kunci** tampil normal, tombol salin kutipan & tema (`useTheme`) bekerja, serta endpoint `/api/health` merespons normal.

## Feature & Bugfix Review Board (Wajib Sebelum Coding)
Setiap kali diminta menambahkan **fitur baru**, mengubah **alur pengguna**, atau melakukan **perbaikan bug (fixing)**, JANGAN langsung menulis atau mengubah kode terlebih dahulu. Lakukan evaluasi ringkas melalui 3 *role* berikut sebelum menyusun rencana implementasi.

*(Bypass: Jika instruksi secara eksplisit menyertakan `"skip review"`, `"no review"` atau `"eksekusi"`, lewati Review Board dan langsung eksekusi.)*

### I. Role Wajib (Selalu Aktif untuk Fitur & Perubahan Antarmuka)

#### 1. Product & UX Reviewer (Human-Centric & Tren)
- **Nilai & Kebiasaan Pengguna:** Apakah fitur/perbaikan menjawab kebutuhan pembaca ringkasan buku dan pendengar audio secara nyata, atau menambah beban visual/aliran yang tidak perlu?
- **Ergonomi & Tren Produk:** Evaluasi alur baca, konsep kunci, pemutar audio, dan highlight terhadap pola aplikasi modern (kecepatan *time-to-value*, *mobile-first*, transisi halus, tanpa gangguan berlebih). Sarankan alternatif yang lebih ringan jika diperlukan.

#### 2. QA & Edge-Case Skeptic (Keandalan & Akar Masalah)
- **State & Kegagalan:** Periksa *empty state*, *loading state*, jaringan terputus/lambat, teks panjang, audio belum tersedia/gagal dimuat, dan klik ganda cepat.
- **Akar Masalah vs Tambalan:** Pastikan *bug fix* menyentuh akar penyebab, bukan sekadar menyembunyikan *error* di UI.
- **Verifikasi:** Rencanakan skenario pengujian spesifik (termasuk uji browser Playwright untuk alur UI utama) agar regresi mudah terdeteksi.

---

### II. Role Kondisional (Aktifkan Hanya Sesuai Konteks Perubahan)

#### 3. Growth & Retention Strategist *(Aktifkan jika menyentuh alur utama, onboarding, navigasi, atau pengalaman konsumsi konten)*
- **Dampak pada Retensi & Alur Kembali:** Apakah fitur/perbaikan membantu pengguna kembali menggunakan aplikasi secara alami dan menyelesaikan nilai utamanya, atau justru menambah friksi yang membuat pengguna berhenti di tengah jalan?
- **Nilai Jangka Panjang vs Gimmick:** Apakah efeknya mendorong kebiasaan penggunaan yang sehat dan berkelanjutan, atau sekadar kebaruan sesaat yang cepat diabaikan?

#### 4. Cost & Unit Economics Auditor *(Aktifkan HANYA jika menyentuh AI/LLM, TTS, API berbayar, atau storage/egress Cloudflare R2)*
- **Biaya Marginal & Caching:** Pastikan hasil generasi LLM/TTS dan aset audio di Cloudflare R2 di-*cache* atau dideduplikasi agar tidak memicu generasi maupun *request* berulang yang boros.
- **Proteksi Abuse & Kuota:** Cegah *loop* permintaan ulang, eksekusi *batch* tak terkendali, atau pemanggilan API tanpa batas yang dapat membengkakkan tagihan.

#### 5. Systems & Reliability Engineer *(Aktifkan HANYA jika mengubah alur data, skema database, batch pipeline, atau logika backend)*
- **Ketahanan & Konsistensi Data:** Bagaimana perilaku sistem saat koneksi terputus, *retry* dijalankan, *payload* besar, atau proses *batch* gagal di tengah jalan (idempotensi dan *rollback*)?
- **Performa & Maintainability:** Apakah *query*, *indexing*, atau manajemen *state* tetap efisien dan mudah di-*debug* seiring bertambahnya jumlah buku dan pengguna?

#### 6. Security & Privacy Gatekeeper *(Aktifkan HANYA jika menyentuh auth, data pengguna, RLS, atau endpoint/API route)*
- **Otorisasi & Validasi Server-Side:** Pastikan hak akses diperiksa di sisi *server* dan database (*Row Level Security* Supabase), bukan hanya disembunyikan di UI.
- **Proteksi Input & Kebocoran Data:** Validasi seluruh input *endpoint*, cegah eksposur *secret*/kredensial, dan pastikan pengguna hanya dapat mengakses atau mengubah data miliknya sendiri.

---

### Format Output Wajib Sebelum Mengubah Kode:
1. **Role Aktif:** Sebutkan *role* wajib + *role* kondisional mana saja yang diaktifkan (dan abaikan *role* kondisional yang tidak relevan).
2. **Review Singkat:** Maksimal 2 kalimat per *role* aktif agar padat dan mudah dibaca cepat dari layar ponsel.
3. **Keputusan:** Nyatakan **Layak lanjut apa adanya**, **Lanjut dengan penyesuaian**, atau **Sebaiknya disederhanakan**, disertai alasan utama.
4. **Konfirmasi:** Jika keputusan adalah **Layak lanjut apa adanya**, langsung terapkan perubahan tanpa perlu meminta konfirmasi user terlebih dahulu. Untuk keputusan selain itu (**Lanjut dengan penyesuaian** atau **Sebaiknya disederhanakan**), minta persetujuan eksplisit sebelum mulai menulis/mengubah kode.