# Implementation Plan — Fase 3 (Backend, Auth & Komunitas Pembaca)

Dokumen ini menyimpan rencana pengembangan **Fase 3** untuk `ringkasnya.com`, mencakup aktivasi infrastruktur backend Cloudflare, autentikasi & pembayaran, serta fitur interaksi pembaca berbasis gagasan.

---

## 1. Infrastruktur Backend (Cloudflare D1 & KV)

Mengaktifkan binding yang sudah disiapkan di `wrangler.jsonc`:
- **Cloudflare D1 (`DB`) — Aktif (D1 Murni, Region APAC)**:
  - Production (`main`): `ringkasnya-db`
  - Preview (`dev`): `ringkasnya-db-preview` (terisolasi di blok `previews` agar pengujian tidak memengaruhi data production)
  - Migrasi SQL: folder `migrations/` dengan verifikasi koneksi aman (`SELECT 1`) di `/api/health`.
- **Cloudflare KV (`SESSION_KV`) — Menunggu Fase Auth**: Penyimpanan sesi autentikasi dan *rate-limiting* ringan di edge.
- **API Routes (`src/pages/api/`)**: Endpoint SSR di Cloudflare Workers untuk menangani autentikasi, webhook pembayaran, dan fitur komunitas.

---

## 1B. Migrasi Konten Buku ke Cloudflare D1 — Selesai

Seluruh **58 buku** telah dipindahkan dari file TypeScript statis (`src/data/books/`) ke Cloudflare D1 (`books` + `book_contents`), 5 halaman utama telah dikonversi ke SSR D1 dengan edge caching (`s-maxage=300`), bundle JS client `CatalogSection` menyusut dari ~1,43 MB menjadi ~24 kB, dan folder statis `src/data/books/` telah dibersihkan.

---

## 2. Autentikasi, Admin CMS & Pembayaran (Fase 3 Inti)

- **Login & Manajemen Akun**: Sistem masuk pembaca (mis. OAuth Google) beserta sinkronisasi progres baca & bookmark lintas perangkat.
- **Admin CMS (`/admin`)**: Dashboard khusus admin (terlindungi autentikasi & role `admin` server-side) untuk menambah, mengedit konten ringkasan, mengubah status `is_published` (draft/publish), menandai `is_premium`, serta otomatis menghitung ulang durasi baca (`quick_time_minutes` & `reading_time_minutes`) langsung ke Cloudflare D1 tanpa perlu deploy ulang.
- **Payment Gateway**: Integrasi pembayaran untuk paket akses penuh/keanggotaan.

---

## 3. Fitur Baru (Backlog Fase 3): Diskusi Ide / Catatan Pembaca

> **Status**: Ditunda / disimpan untuk Fase 3 (belum diimplementasikan).

Fitur interaksi agar pembaca dapat menuliskan tanggapan atau gagasan terhadap suatu buku tanpa menggunakan label *"Komentar"* yang bernuansa media sosial kasual.

### A. Kandidat Nama Fitur
- **Diskusi Ide** *(rekomendasi utama — kritis, setara, mendorong pertukaran gagasan)*
- **Catatan Pembaca** *(hangat, seperti margin notes)*
- **Refleksi Pembaca** *(kontemplatif, fokus pada dampak bacaan)*
- **Sudut Pandang** *(editorial, memancing perspektif alternatif)*
- **Ruang Gagasan** *(bernuansa klub buku modern)*

### B. Konsep Product & UX
- **Penempatan**: Diletakkan di bagian bawah halaman `BookReader` setelah kesimpulan agar tidak mengganggu alur baca utama.
- **Pemantik Diskusi**: Menyertakan 1 *prompt* pemantik singkat (mis. *"Gagasan mana yang paling menarik atau justru ingin Anda sanggah?"*) agar kualitas tulisan pembaca tetap bernas.
- **Empty State**: Dirancang tetap mengundang saat buku belum memiliki tanggapan agar halaman tidak terasa sepi.

### C. Kebutuhan Teknis & Keamanan
- **Penyimpanan**: Persisten di Cloudflare D1 (terhubung per `slug` buku).
- **Sanitasi & Keamanan**: Sanitasi *plain-text only* (anti-XSS), validasi input server-side, dan *rate limiting* di endpoint API.
- **Anti-Bot & Moderasi**: Proteksi anti-bot (mis. Cloudflare Turnstile) serta mekanisme moderasi/hapus dari sisi admin.

### D. Keputusan Terbuka (Difinalisasi Saat Memulai Fase 3)
1. **Nama Final**: Memilih antara *Diskusi Ide*, *Catatan Pembaca*, atau kandidat lain.
2. **Identitas Pengirim**:
   - *Opsi A (Ringan)*: Nama tampilan / opsional anonim + Turnstile (tanpa wajib login).
   - *Opsi B (Terintegrasi Auth)*: Wajib login menggunakan akun Fase 3.
3. **Struktur Interaksi**: 1 tingkat (*flat*) + tombol apresiasi (*"Bermanfaat"*) vs mendukung *reply/thread*.

---

## 4. Fitur Artikel & Roadmap Pengembangan Konten Editorial

Fitur **Artikel** menyajikan bacaan singkat **5–7 menit** (~1.000–1.400 kata) di luar ringkasan buku yang terhubung langsung ke teks ringkasan melalui *inline highlight* + pratinjau cepat (*Opsi A: popover/drawer* dengan definisi 2–3 kalimat dan tautan *"Baca Artikel Lengkap"*).

### A. Gelombang 1 (MVP — Aktif)
Fokus pada **Bedah Istilah Ilmiah** yang ikonik dan muncul di ringkasan buku katalog:
1. **Prinsip Anna Karenina** (*Guns, Germs, and Steel*)
2. **Efek Dunning-Kruger** (*The Death of Expertise*, *Think Again*, *The Joy of Science*)
3. **Destruksi Kreatif** (*Why Nations Fail*, *The Lean Startup*)
4. **Bias Konfirmasi** (*The Joy of Science*, *The Death of Expertise*, *Thinking, Fast and Slow*)
5. **Efek Jangkar** (*Thinking, Fast and Slow*, *Predictably Irrational*, *Influence*)
6. **Adaptasi Hedonis** (*A Guide to the Good Life*, *The Psychology of Money*, *Sapiens*)

### B. Kriteria Kurasi Istilah untuk Gelombang Berikutnya
- **Hanya istilah ilmiah yang khas & punya sejarah/nama unik**: utamakan pola penamaan seperti *"Efek ..."*, *"Prinsip ..."*, *"Teori ..."*, *"Hipotesis ..."*, *"Bias ..."*, *"Hukum ..."*, atau *"Paradoks ..."*.
- **Hindari istilah umum atau frasa majemuk panjang**: jangan masukkan konsep terlalu luas/umum meskipun ilmiah (mis. *Korelasi vs Kausalitas*, *Neuroplastisitas*, *Seleksi Kerabat*, *Healthspan vs Lifespan*, *Meme sebagai Replikator Budaya*), dan ringkas frasa gabungan menjadi istilah tunggal yang tajam (mis. **Efek Default**, **Ritme Sirkadian**, **Efek Kepemilikan**, **Prinsip Ketidakpastian Heisenberg**, **Hipotesis Nenek**, **Efek Halo**).

### C. Backlog Format Artikel Masa Depan (Disimpan untuk Tahap Lanjutan)
Selain **Bedah Istilah**, rubrik Artikel ke depannya dapat diperluas ke format editorial berikut:
1. **Sintesis Lintas Buku (*Cross-Book Essay*)**: Membandingkan atau merangkai argumen dari 2–3 buku di katalog (mis. *Guns, Germs, and Steel* vs *Why Nations Fail* tentang penyebab kemajuan bangsa).
2. **Kacamata Sains untuk Fenomena Aktual (*Real-World Lens*)**: Membedah fenomena sehari-hari atau isu di Indonesia menggunakan kerangka sains & psikologi dari buku-buku Ringkasnya.
3. **Peta Belajar / Panduan Membaca (*Reading Roadmap*)**: Urutan bacaan terkurasi untuk pembaca baru yang ingin mendalami satu tema besar (mis. jalur belajar evolusi & sejarah manusia).
4. **Kisah di Balik Eksperimen & Pemikir Klasik**: Cerita naratif di balik eksperimen terkenal atau kolaborasi ilmuwan besar yang sering dirujuk lintas buku (mis. Kahneman & Tversky).

---

## 5. Ekspansi Katalog 100 Buku & Pembaruan Kategori (Bertahap 10 Buku/Batch)

> **Daftar Lengkap 100 Buku**: Lihat [`BOOKS_LIST.md`](./BOOKS_LIST.md) untuk daftar lengkap **58 buku awal**, **20 buku yang sudah digenerate (Batch 1–2)**, serta **22 buku yang belum digenerate (Batch 3–5)** beserta target skala poin inti & durasi baca masing-masing.

- **Pembaruan Kategori (`0002_update_categories_tubuh_kesehatan.sql`)**:
  - Menambahkan kategori baru **`Teknologi & Masa Depan`**.
  - Mengubah nama kategori **`Kesehatan & Medis`** → **`Tubuh & Kesehatan`**.
- **Progres Saat Ini (`78 / 100 Buku`)**:
  - **Buku Awal (Eksisting)**: 58 buku (lihat [`BOOKS_LIST.md`](./BOOKS_LIST.md#fase-1-58-buku-awal-sudah-dimigrasikan--disesuaikan-di-d1)).
  - **Batch 1 (`0003_add_books_batch_1.sql` & `0005_rescale_books_batch_1.sql`)**: 10 buku selesai (`59–68`).
  - **Batch 2 (`0006_add_books_batch_2.sql`)**: 10 buku selesai (`69–78`).
  - **Fase Selanjutnya (`Batch 3–5`)**: 22 buku tersisa (`79–100`, detail di [`BOOKS_LIST.md`](./BOOKS_LIST.md#fase-2-42-buku-terakhir-sudah-dimigrasikan-ke-d1)).


---

## Fase 3 (Tahap 1): Arsitektur Login User, Database & Keamanan (`branch: dev`)

- **Library & ORM**: **Better Auth (`better-auth`)** + **Drizzle ORM (`drizzle-orm/d1`)** di atas **Cloudflare D1** (`ringkasnya-db` & `ringkasnya-db-preview`).
- **Migrasi SQL**: `migrations/0004_create_auth_tables.sql` (berurutan setelah `0001`–`0003` tabel buku) mencakup 6 tabel: `users`, `sessions`, `accounts`, `verifications`, `user_book_progress` (persiapan Fase 3.2), dan `subscriptions` (persiapan Fase 3.3).
- **Keamanan Workers-Native**: Hashing kata sandi menggunakan Web Crypto API `PBKDF2-SHA256` (`src/lib/password.ts`), cookie sesi `HttpOnly`/`SameSite=Lax`, per-request factory `createAuth(env)` (`src/lib/auth.ts`), dan proteksi route `/akun` via Astro SSR middleware (`src/middleware.ts`).
- **Halaman & UI**: `/masuk`, `/daftar`, `/akun` (`prerender = false`), endpoint `/api/auth/[...all]`, dan integrasi `UserMenu` di `Navbar.tsx` (desktop dropdown & mobile drawer) dengan dukungan Email/Password + Google OAuth opsional via `.dev.vars` / Cloudflare Secrets.

---

## 6. Roadmap Penguatan Infrastruktur Cloudflare (Prioritas Penerapan)

Daftar fitur Cloudflare kategori **Sangat Penting** dan **Penting** yang dijadwalkan untuk diterapkan guna memperkuat keamanan, performa, dan efisiensi kuota D1/Workers:

### A. Prioritas 1 — Sangat Penting (Segera / Fase 3 Lanjutan)
1. **Cloudflare Turnstile (Proteksi Anti-Bot pada Form Auth & Interaksi)**
   - **Tujuan**: Melindungi endpoint pendaftaran (`/daftar`), masuk (`/masuk`), serta form masa depan (reset password & *Diskusi Ide*) dari *spam account*, *credential stuffing*, dan *brute-force* tanpa mengganggu UX dengan CAPTCHA visual.
   - **Rencana Implementasi**:
     - Pasang widget Turnstile di komponen form `/daftar` dan `/masuk`.
     - Simpan `TURNSTILE_SITE_KEY` (vars/public) dan `TURNSTILE_SECRET_KEY` (Cloudflare Secrets / `.dev.vars`).
     - Lakukan verifikasi token *server-side* (`siteverify`) sebelum meneruskan request ke `better-auth` di `/api/auth/[...all]`.

2. **Cloudflare KV (`SESSION_KV`) — Aktivasi Session Cache & Rate Limiting**
   - **Tujuan**: Mengurangi beban baca/tulis pada Cloudflare D1 dan menurunkan latensi pengecekan sesi serta pembatasan request (*rate limiting*).
   - **Rencana Implementasi**:
     - Buat KV namespace untuk production & preview, lalu aktifkan binding `SESSION_KV` di `wrangler.jsonc` (yang saat ini masih dikomentari).
     - Integrasikan `SESSION_KV` sebagai *secondary storage* / cache sesi pada `better-auth` (`src/lib/auth.ts`).
     - Terapkan *rate limiting* ringan berbasis KV pada endpoint sensitif (`/api/auth/*`, endpoint komunitas/API publik).

### B. Prioritas 2 — Penting (Optimasi Skala & Operasional)
3. **Workers Cache / Cache Rules (Optimasi & Invalidasi Cache Konten Publik)**
   - **Tujuan**: Memaksimalkan kecepatan muat halaman bacaan publik (`/`, `/katalog`, `/buku/[slug]`, `/artikel`, `/artikel/[slug]`) yang bersifat *read-heavy* dan meminimalkan eksekusi SSR berulang ke D1 (melengkapi header `s-maxage=300` yang sudah berjalan).
   - **Rencana Implementasi**:
     - Terapkan strategi *edge caching* terstruktur menggunakan `Workers Cache` / `Cache Rules` untuk halaman publik non-personal.
     - Siapkan mekanisme *cache invalidation* (atau *cache key versioning*) saat Admin CMS / migrasi D1 memperbarui konten buku atau artikel.

4. **Cloudflare WAF & Rate Limiting Rules (Pertahanan Layer Jaringan)**
   - **Tujuan**: Memblokir trafik berbahaya, *bot scraper* agresif, dan lonjakan request ke `/api/auth/*` atau `/api/*` di layer jaringan sebelum menyentuh Worker dan menghabiskan kuota D1/CPU.
   - **Rencana Implementasi**:
     - Konfigurasi *Rate Limiting Rules* di dashboard Cloudflare khusus untuk endpoint `/api/auth/*` (mis. batas percobaan login/daftar per IP) dan `/api/*`.
     - Aktifkan aturan WAF dasar untuk mitigasi pola serangan umum dan *abusive bots*.
