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

- **Pembaruan Kategori (`0002_update_categories_tubuh_kesehatan.sql`)**:
  - Menambahkan kategori baru **`Teknologi & Masa Depan`**.
  - Mengubah nama kategori **`Kesehatan & Medis`** → **`Tubuh & Kesehatan`**.
- **Batch 1 (`0003_add_books_batch_1.sql`) — Selesai (Total: 68/100 Buku)**:
  1. *Hello World* — Hannah Fry (`Teknologi & Masa Depan`)
  2. *Life 3.0* — Max Tegmark (`Teknologi & Masa Depan`)
  3. *Cosmos* — Carl Sagan (`Sains & Alam Semesta`)
  4. *Pale Blue Dot* — Carl Sagan (`Sains & Alam Semesta`)
  5. *The Swerve* — Stephen Greenblatt (`Sejarah & Peradaban`)
  6. *Nexus* — Yuval Noah Harari (`Teknologi & Masa Depan`)
  7. *Co-Intelligence* — Ethan Mollick (`Teknologi & Masa Depan`)
  8. *Chip War* — Chris Miller (`Teknologi & Masa Depan`)
  9. *The Gene* — Siddhartha Mukherjee (`Tubuh & Kesehatan`)
  10. *Tiny Habits* — BJ Fogg (`Produktivitas & Pengembangan Diri`)
- **Batch 2 (`0006_add_books_batch_2.sql`) — Selesai (Total: 78/100 Buku)**:
  1. *Astrophysics for People in a Hurry* — Neil deGrasse Tyson (`Sains & Alam Semesta`)
  2. *The Order of Time* — Carlo Rovelli (`Sains & Alam Semesta`)
  3. *Breath* — James Nestor (`Tubuh & Kesehatan`)
  4. *Justice* — Michael J. Sandel (`Filsafat & Kebijaksanaan`)
  5. *The Sixth Extinction* — Elizabeth Kolbert (`Sains & Alam Semesta`)
  6. *The Coming Wave* — Mustafa Suleyman (`Teknologi & Masa Depan`)
  7. *Algorithms to Live By* — Brian Christian & Tom Griffiths (`Teknologi & Masa Depan`)
  8. *Humankind* — Rutger Bregman (`Sejarah & Peradaban`)
  9. *The Information* — James Gleick (`Teknologi & Masa Depan`)
  10. *The Innovators* — Walter Isaacson (`Teknologi & Masa Depan`)
- **Sisa Roadmap**: 22 buku lagi (Batch 3–4 @ 10 buku/batch + Batch 5 @ 2 buku) menuju 100 buku.


---

## Fase 3 (Tahap 1): Arsitektur Login User, Database & Keamanan (`branch: dev`)

- **Library & ORM**: **Better Auth (`better-auth`)** + **Drizzle ORM (`drizzle-orm/d1`)** di atas **Cloudflare D1** (`ringkasnya-db` & `ringkasnya-db-preview`).
- **Migrasi SQL**: `migrations/0004_create_auth_tables.sql` (berurutan setelah `0001`–`0003` tabel buku) mencakup 6 tabel: `users`, `sessions`, `accounts`, `verifications`, `user_book_progress` (persiapan Fase 3.2), dan `subscriptions` (persiapan Fase 3.3).
- **Keamanan Workers-Native**: Hashing kata sandi menggunakan Web Crypto API `PBKDF2-SHA256` (`src/lib/password.ts`), cookie sesi `HttpOnly`/`SameSite=Lax`, per-request factory `createAuth(env)` (`src/lib/auth.ts`), dan proteksi route `/akun` via Astro SSR middleware (`src/middleware.ts`).
- **Halaman & UI**: `/masuk`, `/daftar`, `/akun` (`prerender = false`), endpoint `/api/auth/[...all]`, dan integrasi `UserMenu` di `Navbar.tsx` (desktop dropdown & mobile drawer) dengan dukungan Email/Password + Google OAuth opsional via `.dev.vars` / Cloudflare Secrets.
