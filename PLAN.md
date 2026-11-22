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

## 1B. Migrasi Konten Buku ke Cloudflare D1 (Tahap Berikutnya)

Memindahkan seluruh **58 buku** dari file TypeScript statis (`src/data/books/*.ts`) ke Cloudflare D1 sekaligus memangkas ukuran bundle JS client (`CatalogSection` saat ini ~1,43 MB karena mengimpor `CATEGORIES` dari file yang membundel seluruh buku).

### A. Desain Skema 2 Tabel (Vertical Partitioning)
1. **Tabel `books`** *(metadata katalog ringan — untuk `/`, `/katalog`, `/topik`, `/tentang`, dan `relatedBooks`)*:
   - `slug TEXT PRIMARY KEY`, `title`, `original_title`, `author`, `year`, `category`, `reading_time_minutes`, `quick_time_minutes`, `rating`, `goodreads_ratings`, `editorial_tier` (`1|2|3`), `cover_gradient`, `cover_accent`, `cover_image`, `badge_text`, `tagline`, `synopsis`, `who_is_it_for_json`, `takeaways_count`, `is_published` (default `1`), `is_premium` (default `0`), `created_at`, `updated_at`.
   - Index: `idx_books_catalog_order (is_published, editorial_tier ASC, goodreads_ratings DESC, rating DESC, title ASC)` dan `idx_books_category (is_published, category)`.
2. **Tabel `book_contents`** *(payload baca lengkap — hanya di-JOIN pada `/buku/[slug]`)*:
   - `book_slug TEXT PRIMARY KEY REFERENCES books(slug) ON DELETE CASCADE`, `key_takeaways_json`, `key_concepts_json`, `quotes_json`, `conclusion`, `updated_at`.

### B. Langkah Implementasi
1. **Migrasi Skema**: Buat `migrations/0001_create_books_tables.sql` dan terapkan ke lokal (`--local`), preview (`ringkasnya-db-preview`), dan production (`ringkasnya-db`).
2. **Seeder Idempoten (58 Buku)**: Buat script generator SQL (`INSERT ... ON CONFLICT DO UPDATE`) dari data 58 buku saat ini lengkap dengan kalkulasi `withCalculatedReadingTimes` dan `effectiveEditorialTier`, serta script `db:seed:local`, `db:seed:preview`, dan `db:seed:prod`.
3. **Pisahkan Konstanta & Repository D1**:
   - Pindahkan `CATEGORIES` ke `src/lib/book-constants.ts` dan perbarui `CatalogSection.tsx` agar bundle client menyusut drastis.
   - Buat `src/lib/books-repository.ts` (`getBookCatalog`, `getBookBySlug`, `getPublishedBookCount`) dengan *prepared statements* dan mapping aman ke tipe `BookCatalogItem` & `BookSummary`.
4. **Konversi 5 Halaman ke SSR D1 + Edge Caching**:
   - Ubah `index.astro`, `katalog.astro`, `topik.astro`, `tentang.astro`, dan `buku/[slug].astro` menjadi `export const prerender = false` dengan pembacaan dari `Astro.locals.runtime.env.DB` dan header `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600`.
5. **Verifikasi & Pembersihan**:
   - Cek jumlah data (`58` buku), `npx tsc --noEmit`, `npm run build` (pastikan ukuran chunk `CatalogSection` turun drastis), `npx wrangler deploy --dry-run`, dan uji halaman di Preview `dev` sebelum membersihkan `src/data/books/`.

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
