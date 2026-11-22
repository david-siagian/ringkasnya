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

## 2. Autentikasi & Pembayaran (Fase 3 Inti)

- **Login & Manajemen Akun**: Sistem masuk pembaca (mis. OAuth / Magic Link) beserta sinkronisasi progres baca & bookmark lintas perangkat.
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
