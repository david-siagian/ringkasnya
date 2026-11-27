# Implementation Plan — Fase 3 (Backend, Auth & Komunitas Pembaca)

Dokumen ini menyimpan rencana pengembangan **Fase 3** untuk `ringkasnya.com`, mencakup aktivasi infrastruktur backend Cloudflare, autentikasi & pembayaran, serta fitur interaksi pembaca berbasis gagasan.

---

## Ringkasan Status

| Area / Tahap | Status | Keterangan |
|---|---|---|
| **1. Infrastruktur Cloudflare D1 (`DB`)** | **Selesai** | Production (`ringkasnya-db`) & Preview (`ringkasnya-db-preview`) aktif |
| **1. Cloudflare KV (`SESSION_KV`)** | **Selesai** | Production & Preview (`SESSION_KV_preview`) aktif sebagai `secondaryStorage` Better Auth |
| **1B. Migrasi Konten Statis ke D1** | **Selesai** | 58 buku awal dimigrasikan ke D1; `src/data/books/` dibersihkan |
| **2. Fase 3.1 — Auth Dasar & Akun** | **Selesai** | Better Auth + Drizzle ORM (`0004`), `/masuk`, `/daftar`, `/akun`, `UserMenu` |
| **2. Fase 3.2 — Progres Baca & Bookmark** | **Selesai** | Sinkronisasi bookmark, status selesai, mode baca, & progres via `/api/progress` ke D1 dan `/akun` |
| **2. Fase 3.3 — Payment & Keanggotaan** | **Pending** | Tabel `subscriptions` siap; payment gateway & webhook belum dibuat |
| **2. Admin CMS (`/admin`)** | **Pending** | Dashboard & API admin (CRUD ringkasan, publish, hitung durasi) belum dibuat |
| **3. Opini Pembaca** | **Selesai** | Fitur *Opini* aktif di `BookReader`, D1 (`0024`), wajib login untuk kirim & apresiasi *Bermanfaat* |
| **4. Artikel — Gelombang 1 (MVP)** | **Selesai** | 6 artikel Bedah Istilah Ilmiah aktif di `src/pages/artikel/` |
| **4. Artikel — Gelombang Berikutnya** | **Pending** | Backlog editorial (istilah baru & format esai/roadmap/eksperimen) |
| **5. Ekspansi Katalog 100 Buku** | **Selesai** | **100 / 100 buku** (Fase 1 + Batch 1–5) lengkap di Cloudflare D1 |

---

## 1. Infrastruktur Backend (Cloudflare D1 & KV)

Mengaktifkan binding yang sudah disiapkan di `wrangler.jsonc`:
- **Cloudflare D1 (`DB`) — Selesai (D1 Murni, Region APAC)**:
  - Production (`main`): `ringkasnya-db`
  - Preview (`dev`): `ringkasnya-db-preview` (terisolasi di blok `previews` agar pengujian tidak memengaruhi data production)
  - Migrasi SQL: folder `migrations/` dengan verifikasi koneksi aman (`SELECT 1`) di `/api/health`.
- **Cloudflare KV (`SESSION_KV`) — Selesai**:
  - Production (`main`): `SESSION_KV` (`8b4bdc32e4494dbbbffff764b3e99140`)
  - Preview (`dev`): `SESSION_KV_preview` (`c21a2251722d4a7ea5b5d3c6a315db2f`)
  - Terintegrasi ke **Better Auth** sebagai `secondaryStorage` (`src/lib/auth.ts`) untuk *session caching* di edge (dengan guard `expirationTtl >= 60` detik dan *fallback* aman ke D1).
  - *Catatan*: Proteksi *rate-limiting* direkomendasikan memakai **Cloudflare WAF Rate Limiting** di lapisan edge.
- **URL Preview Build Cloudflare (Branch Kerja & `dev`)**:
  - Setiap branch baru yang di-push ke GitHub otomatis memicu **Cloudflare Workers Builds** dengan format URL preview: `https://<slug-branch>-app.ringkasnya.workers.dev` (karakter `/` pada nama branch diubah menjadi `-`, misalnya branch `dev` → `https://dev-app.ringkasnya.workers.dev`, branch `fix/contoh` → `https://fix-contoh-app.ringkasnya.workers.dev`).
  - Saat melaporkan hasil pengerjaan branch baru sebelum merge ke `dev`, **selalu berikan URL preview build Cloudflare** tersebut (bukan URL GitHub/PR).
- **API Routes (`src/pages/api/`) — Sebagian Aktif**:
  - **Aktif**: `/api/health`, `/api/auth/[...all]`, `/api/opinions/*`, dan `/api/progress/*`.
  - **Pending**: endpoint Admin CMS dan webhook pembayaran.

---

## 1B. Migrasi Konten Buku ke Cloudflare D1 — Selesai

Seluruh **58 buku awal** telah dipindahkan dari file TypeScript statis (`src/data/books/`) ke Cloudflare D1 (`books` + `book_contents`), 5 halaman utama telah dikonversi ke SSR D1 dengan edge caching (`s-maxage=300`), bundle JS client `CatalogSection` menyusut dari ~1,43 MB menjadi ~24 kB, dan folder statis `src/data/books/` telah dibersihkan.

---

## 2. Autentikasi, Admin CMS & Pembayaran (Fase 3 Inti)

- **Tahap 1: Login & Manajemen Akun Dasar — Selesai**
  - **Library & ORM**: **Better Auth (`better-auth`)** + **Drizzle ORM (`drizzle-orm/d1`)** di atas **Cloudflare D1** (`ringkasnya-db` & `ringkasnya-db-preview`).
  - **Migrasi SQL**: `migrations/0004_create_auth_tables.sql` mencakup 6 tabel: `users`, `sessions`, `accounts`, `verifications`, `user_book_progress` (persiapan Fase 3.2), dan `subscriptions` (persiapan Fase 3.3).
  - **Keamanan Workers-Native**: Hashing kata sandi menggunakan Web Crypto API `PBKDF2-SHA256` (`src/lib/password.ts`), cookie sesi `HttpOnly`/`SameSite=Lax`, per-request factory `createAuth(env)` (`src/lib/auth.ts`), dan proteksi route `/akun` via Astro SSR middleware (`src/middleware.ts`).
  - **Halaman & UI**: `/masuk`, `/daftar`, `/akun` (`prerender = false`), endpoint `/api/auth/[...all]`, dan integrasi `UserMenu` di `Navbar.tsx` (desktop dropdown & mobile drawer) dengan dukungan Email/Password + Google OAuth opsional via `.dev.vars` / Cloudflare Secrets.
- **Tahap 2: Sinkronisasi Progres Baca & Bookmark — Selesai**
  - Memanfaatkan tabel `user_book_progress` melalui `/api/progress`, `/api/progress/sync`, dan `/api/progress/[slug]` untuk menyimpan bookmark, status selesai, mode baca terakhir, dan progres poin inti lintas perangkat (dengan *merge* otomatis dari `localStorage` saat login dan ringkasan di `/akun`).
- **Tahap 3: Admin CMS (`/admin`) — Pending**
  - Dashboard khusus admin (terlindungi autentikasi & role `admin` server-side) untuk menambah, mengedit konten ringkasan, mengubah status `is_published` (draft/publish), menandai `is_premium`, serta otomatis menghitung ulang durasi baca (`quick_time_minutes` & `reading_time_minutes`) langsung ke Cloudflare D1 tanpa perlu deploy ulang.
- **Tahap 4: Payment Gateway & Keanggotaan — Pending**
  - Integrasi pembayaran untuk paket akses penuh/keanggotaan terhubung ke tabel `subscriptions`.

---

## 3. Fitur Opini Pembaca — Selesai

> **Status**: Selesai diimplementasikan (`migrations/0024_create_book_opinions.sql`, `src/pages/api/opinions/`, `src/components/BookOpinionsSection.tsx`).

Fitur interaksi **Opini** pada halaman `BookReader` dengan placeholder *"Bagikan opini Anda tentang buku ini"*:
- **Penempatan**: Di bagian bawah `BookReader` setelah kesimpulan, konsep kunci, dan kutipan (sebelum rekomendasi buku lainnya) pada Mode Kilat maupun langkah penutup Mode Mendalam.
- **Akses & Identitas**: Membaca opini terbuka untuk publik; mengirim opini, menyunting/menghapus opini sendiri, dan memberi apresiasi **Bermanfaat** wajib login menggunakan akun Fase 3.1 (memanfaatkan modal login jika belum masuk).
- **Struktur & Keamanan**: Daftar *flat* dengan sortir *Terbaru* / *Paling Bermanfaat*, *pagination* (*Muat lebih banyak*), sanitasi *plain-text only* (maksimal 1.000 karakter), dan moderasi hapus untuk `role = 'admin'`.

---

## 4. Fitur Artikel & Roadmap Pengembangan Konten Editorial

Fitur **Artikel** menyajikan bacaan singkat **4–6 menit** di luar ringkasan buku yang terhubung langsung ke teks ringkasan melalui *inline highlight* + pratinjau cepat (*Opsi A: popover/drawer* dengan definisi 2–3 kalimat dan tautan *"Baca Artikel Lengkap"*).

### A. Gelombang 1 (MVP) — Selesai
Fokus pada **Bedah Istilah Ilmiah** yang ikonik dan muncul di ringkasannya di katalog:
1. **Prinsip Anna Karenina** (*Guns, Germs, and Steel*)
2. **Efek Dunning-Kruger** (*The Death of Expertise*, *Think Again*, *The Joy of Science*)
3. **Destruksi Kreatif** (*Why Nations Fail*, *The Lean Startup*)
4. **Bias Konfirmasi** (*The Joy of Science*, *The Death of Expertise*, *Thinking, Fast and Slow*)
5. **Efek Jangkar** (*Thinking, Fast and Slow*, *Predictably Irrational*, *Influence*)
6. **Adaptasi Hedonis** (*A Guide to the Good Life*, *The Psychology of Money*, *Sapiens*)

### B. Kriteria Kurasi Istilah untuk Gelombang Berikutnya — Pending
- **Hanya istilah ilmiah yang khas & punya sejarah/nama unik**: utamakan pola penamaan seperti *"Efek ..."*, *"Prinsip ..."*, *"Teori ..."*, *"Hipotesis ..."*, *"Bias ..."*, *"Hukum ..."*, atau *"Paradoks ..."*.
- **Hindari istilah umum atau frasa majemuk panjang**: jangan masukkan konsep terlalu luas/umum meskipun ilmiah (mis. *Korelasi vs Kausalitas*, *Neuroplastisitas*, *Seleksi Kerabat*, *Healthspan vs Lifespan*, *Meme sebagai Replikator Budaya*), dan ringkas frasa gabungan menjadi istilah tunggal yang tajam (mis. **Efek Default**, **Ritme Sirkadian**, **Efek Kepemilikan**, **Prinsip Ketidakpastian Heisenberg**, **Hipotesis Nenek**, **Efek Halo**).

### C. Backlog Format Artikel Masa Depan — Pending
Selain **Bedah Istilah**, rubrik Artikel ke depannya dapat diperluas ke format editorial berikut:
1. **Sintesis Lintas Buku (*Cross-Book Essay*)**: Membandingkan atau merangkai argumen dari 2–3 buku di katalog (mis. *Guns, Germs, and Steel* vs *Why Nations Fail* tentang penyebab kemajuan bangsa).
2. **Kacamata Sains untuk Fenomena Aktual (*Real-World Lens*)**: Membedah fenomena sehari-hari atau isu di Indonesia menggunakan kerangka sains & psikologi dari buku-buku Ringkasnya.
3. **Peta Belajar / Panduan Membaca (*Reading Roadmap*)**: Urutan bacaan terkurasi untuk pembaca baru yang ingin mendalami satu tema besar (mis. jalur belajar evolusi & sejarah manusia).
4. **Kisah di Balik Eksperimen & Pemikir Klasik**: Cerita naratif di balik eksperimen terkenal atau kolaborasi ilmuwan besar yang sering dirujuk lintas buku (mis. Kahneman & Tversky).

---

## 5. Ekspansi Katalog 100 Buku & Pembaruan Kategori — Selesai (`100 / 100 Buku`)

> **Daftar Lengkap 100 Buku**: Lihat [`BOOKS_LIST.md`](./BOOKS_LIST.md) untuk daftar lengkap **58 buku awal** dan **42 buku Fase 2 (Batch 1–5)** beserta target skala poin inti & durasi baca masing-masing.

- **Pembaruan Kategori (`0002_update_categories_tubuh_kesehatan.sql`) — Selesai**:
  - Menambahkan kategori baru **`Teknologi & Masa Depan`**.
  - Mengubah nama kategori **`Kesehatan & Medis`** → **`Tubuh & Kesehatan`**.
- **Progres Katalog (`100 / 100 Buku` — Selesai di Cloudflare D1)**:
  - **Buku Awal (Eksisting)**: 58 buku (`#1–#58`) selesai dimigrasikan, disesuaikan skala & durasi bacanya (`0016`–`0022`), serta diselaraskan `cover_gradient`-nya (`0023`).
  - **Batch 1 (`0003_add_books_batch_1.sql` & `0005_rescale_books_batch_1.sql`)**: 10 buku selesai (`#59–#68`).
  - **Batch 2 (`0006_add_books_batch_2.sql`)**: 10 buku selesai (`#69–#78`).
  - **Batch 3 (`0013_add_books_batch_3.sql`)**: 10 buku selesai (`#79–#88`).
  - **Batch 4 (`0014_add_books_batch_4.sql`)**: 10 buku selesai (`#89–#98`).
  - **Batch 5 (`0015_add_books_batch_5.sql`)**: 2 buku selesai (`#99–#100`).
