# Standar Penulisan Konten Buku — Ringkasnya

Dokumen ini adalah panduan resmi (**single source of truth**) untuk men-generate, menyunting, dan memvalidasi seluruh konten buku di **Ringkasnya** (`ringkasnya.com`), baik pada tabel `books` maupun `book_contents` di Cloudflare D1.

Setiap proses pembuatan atau pembaruan konten buku **wajib** memenuhi seluruh kriteria di bawah ini agar kualitas, ritme baca, dan proporsionalitas konten konsisten di seluruh katalog.

---

## 1. Arah Kurasi & Gaya Bahasa

- **Fokus Kurasi:** Utamakan buku nonfiksi berbasis pengetahuan (sains, teknologi, nalar kritis, psikologi, sejarah, filsafat, ekonomi, kesehatan, organisasi, dan budaya kerja). Hindari menonjolkan *self-help* populer yang minim landasan ilmiah.
- **Bahasa & Nada:** Tulis seluruh teks dalam **Bahasa Indonesia yang luwes, jernih, hangat, dan mudah dipahami pembaca awam**. Hindari terjemahan kaku kata per kata (*translationese*) dan minimalisir jargon akademis berat. Jika istilah asing populer diperlukan (misalnya *cognitive bias*, *attention residue*, *flow*), tulis padanan Bahasa Indonesianya lalu sertakan istilah asing di dalam tanda kurung saat pertama kali muncul.
- **Akurasi Substansi:** Setiap poin inti, contoh riset, tokoh, dan konsep harus setia pada isi buku aslinya—jangan mengarang studi fiktif atau menyimpang dari argumen penulis.

---

## 2. Skala Poin Inti & Durasi Baca (Proporsional terhadap Tebal Buku)

Ringkasnya menghitung durasi baca secara dinamis melalui `withCalculatedReadingTimes` di `src/lib/book-constants.ts` dengan kecepatan baca **`WORDS_PER_MINUTE = 200` kata/menit**:

- **Total Kata Mode Kilat (`quickWords`)** = `synopsis` + `whoIsItFor` + `keyConcepts` (`title` + `explanation`) + `quotes` + `conclusion` + seluruh `keyTakeaways` (`title` + `quickSummary` + `keyNote`).
- **Total Kata Mode Mendalam (`totalWords`)** = `quickWords` + seluruh `deepContent` dari semua `keyTakeaways`.
- **Rumus Menit:** `Math.max(1, Math.round(words / 200))`.

### Tabel Skala Wajib Berdasarkan Tebal Halaman Buku Asli

| Kelas Buku | Tebal Halaman Asli | Jumlah Poin Inti | Target Mode Kilat | Total Kata Mode Kilat | Target Mode Mendalam | Total Kata Mode Mendalam |
|---|---|---:|---:|---:|---:|---:|
| **Tipis / Ringkas** | `< 220 hal` | **5 poin** | **4–5 menit** | **~750–1.050 kata** | **15 menit** | **~2.900–3.099 kata** |
| **Sedang / Standar** | `220–380 hal` | **6 poin** | **5–6 menit** | **~950–1.250 kata** | **15–17 menit** | **~2.950–3.450 kata** |
| **Tebal** | `381–520 hal` | **7–8 poin** | **6–7 menit** | **~1.150–1.450 kata** | **18–20 menit** | **~3.550–4.050 kata** |
| **Sangat Tebal / Epik** | `> 520 hal` | **8–9 poin** | **7–8 menit** | **~1.350–1.650 kata** | **20–22 menit** | **~3.950–4.450 kata** |

### Rumus Acuan Cepat (dari `halaman` edisi cetak standar)

- **Poin Inti** = `clamp(round(4 + halaman / 120), 5, 9)`
- **Target Kilat (menit)** = `clamp(round(3.5 + halaman / 130), 4, 8)`
- **Target Mendalam (menit)** = `clamp(round(12 + halaman / 60), 15, 22)`

> Kolom `takeaways_count`, `quick_time_minutes`, dan `reading_time_minutes` di tabel `books` **wajib** diselaraskan dengan hasil perhitungan aktual `withCalculatedReadingTimes` dari konten final.

---

## 3. Aturan Jumlah Kata per Poin Bab & per Paragraf

Agar pengalaman membaca terasa merata dari Bab 1 hingga Bab terakhir (tidak ada bab yang tiba-tiba terlalu pendek atau terlalu panjang), setiap item di dalam `key_takeaways_json` (`BookTakeaway`) wajib mengikuti rentang berikut:

### A. Struktur & Urutan `key_takeaways_json`
Setiap objek dalam array `key_takeaways_json` wajib memiliki 5 properti lengkap:
`{ "number": 1, "title": "...", "quickSummary": "...", "keyNote": "...", "deepContent": ["...", "..."] }`

- **Penomoran (`number`):** Wajib berupa integer berurutan mulai dari `1` hingga `N` (`1, 2, ..., N`) tanpa angka kosong atau loncat.
- **Urutan Alur Buku:** Susunan poin inti wajib mengikuti **alur kronologis atau struktur bab buku aslinya**—fondasi/masalah utama di awal, mekanisme/bukti/studi kasus di tengah, dan implikasi/masa depan/sintesis penutup di posisi terakhir.
- **Judul Bab (`title`):** Ringkas, tajam, dan informatif (**5–11 kata**), menggambarkan gagasan utama bab tanpa terasa seperti judul makalah kaku.

### B. Intisari Bab (`quickSummary` — Mode Kilat)
- **Rentang Ideal:** **55–70 kata** per bab (batas toleransi keras: **50–80 kata**).
- **Struktur:** **1 paragraf utuh terdiri dari 2–4 kalimat** yang merangkum tesis bab, mekanisme/alasan kuncinya, dan dampaknya.
- **Konsistensi Antarbab:** Seluruh bab dalam satu buku harus memiliki panjang `quickSummary` yang setara—jangan biarkan ada bab yang hanya 30 kata sementara bab lain 70 kata.

### C. Catatan Kunci (`keyNote`)
- **Rentang Ideal:** **18–26 kata** (batas toleransi: **15–30 kata**).
- **Struktur:** **1 kalimat padat** berisi prinsip inti atau pelajaran praktis yang mudah diingat. Hindari menyalin ulang mentah kalimat dari `quickSummary`.

### D. Pembahasan Mendalam (`deepContent` — Mode Mendalam)
- **Jumlah Kata `deepContent` per Bab** (disesuaikan jumlah poin agar total buku tepat masuk target):
  - **Buku Tipis (5 poin):** **~390–430 kata** per bab
  - **Buku Sedang (6 poin):** **~330–380 kata** per bab
  - **Buku Tebal (7–8 poin):** **~310–370 kata** per bab
  - **Buku Sangat Tebal (8–9 poin):** **~310–350 kata** per bab
  - *(Total seluruh teks dalam 1 poin bab termasuk `title` + `quickSummary` + `keyNote` + `deepContent` berada di kisaran **~390–520 kata per bab**.)*
- **Keseimbangan Antarbab:** Hindari ketimpangan panjang antarbab di dalam satu buku (usahakan selisih panjang `deepContent` antarbab tidak lebih dari **±25%**).
- **Jumlah Paragraf per Bab:** **5–7 paragraf** utuh (batas toleransi: **4–8 paragraf**). Hindari memecah bab menjadi 10+ paragraf pendek satu kalimat yang terasa terputus-putus.
- **Rentang Kata per Paragraf:** **45–75 kata per paragraf** (batas toleransi keras: **35–90 kata**, sekitar **2–4 kalimat utuh**).
  - Paragraf `< 35 kata` (apalagi hanya 1 kalimat singkat) membuat alur baca terasa patah—gabungkan dengan paragraf terkait.
  - Paragraf `> 90 kata` terasa seperti *wall of text* di layar ponsel—pecah menjadi dua paragraf yang fokus pada satu ide masing-masing.
- **Alur Ideal 5–7 Paragraf dalam 1 Bab:**
  1. **Paragraf 1 (Pembuka / Konteks):** Pengait cerita, fenomena nyata, atau pertanyaan utama bab.
  2. **Paragraf 2–3 (Inti Gagasan & Bukti):** Penjelasan mekanisme, eksperimen, data, atau contoh historis dari buku.
  3. **Paragraf 4–5 (Pendalaman / Nuansa):** Sisi lain, batasan konsep, atau kontras dengan anggapan umum.
  4. **Paragraf Terakhir (Sintesis / Relevansi):** Makna praktis atau refleksi yang menjembatani pemahaman pembaca ke kehidupan nyata.

---

## 4. Aturan Komponen Konten Lainnya

| Komponen | Lokasi Kolom | Jumlah Item | Rentang Kata | Catatan Wajib |
|---|---|---|---|---|
| **Sinopsis** | `books.synopsis` | 1 paragraf | **65–85 kata** (4–7 baris) | Ringkas 1 paragraf saja; jelaskan inti masalah, pendekatan penulis, dan nilai buku. |
| **Untuk Siapa** | `books.who_is_it_for_json` | **Tepat 4 poin** | **12–22 kata** / poin | Spesifik menyebut profil pembaca & kebutuhannya; tanpa tanda titik di akhir bila konsisten. |
| **Konsep Kunci** | `book_contents.key_concepts_json` | **Sama dengan jumlah Poin Inti (`N`)** | Judul **2–6 kata**; Penjelasan **20–35 kata** | Urutan diselaraskan dengan bab (`1:1`). Jelas tanpa jargon berat. |
| **Kutipan** | `book_contents.quotes_json` | **5–6 kutipan** (maks. 6) | **12–25 kata** / kutipan | Bahasa Indonesia luwes dan kuat secara visual untuk Quote Card PNG; jangan bungkus string dengan tanda kutip ekstra di dalam JSON. |
| **Kesimpulan** | `book_contents.conclusion` | 1 paragraf | **75–110 kata** | Merangkum benang merah seluruh buku secara utuh dan natural (hindari menempelkan kalimat berulang demi mengejar jumlah kata). |

---

## 5. Aturan Metadata Katalog & Visual (`books`)

- **`slug`:** Huruf kecil, dipisah tanda hubung (`kebab-case`), ringkas dari judul utama (mis. `sapiens`, `thinking-fast-and-slow`).
- **`title`:** **Judul utama buku saja** tanpa subjudul setelah tanda titik dua (`:`) — mis. `Quiet`, bukan `Quiet: The Power of Introverts...`.
- **`original_title`:** Subjudul/tagline penjelas dalam **Bahasa Indonesia**, **tidak boleh mengulang judul buku** di depannya (tanpa pola `"Judul: ..."`), dan **tidak boleh `NULL`/kosong** — mis. `Kekuatan Orang Introver di Dunia yang Tak Berhenti Bicara`.
- **`tagline`:** 1 kalimat ringkas (**10–18 kata**) yang memikat untuk kartu/preview.
- **`badge_text`:** Label singkat **2–3 kata** (mis. `Klasik Sains Populer`, `Psikologi Kognitif`, `Sejarah Ekonomi`).
- **`category`:** Wajib memilih salah satu dari 11 kategori resmi di `CATEGORIES` (`src/lib/book-constants.ts`).
- **`editorial_tier`:**
  - `1` = Nonfiksi berbasis sains, riset empiris, sejarah ilmiah, atau klasik intelektual.
  - `2` = Nonfiksi populer, finansial praktis, atau refleksi populer.
  - `3` = Kategori `Organisasi & Bisnis`, `Karier & Budaya Kerja`, dan `Produktivitas & Pengembangan Diri`.
- **`goodreads_ratings`:** Angka perkiraan jumlah *ratings* buku di Goodreads (integer) untuk pengurutan katalog.
- **`cover_gradient`:** Kelas gradien Tailwind bernuansa gelap (`800`–`950`) agar teks putih di `BookCard` dan `BookReader` selalu kontras (mis. `from-slate-950 via-indigo-950 to-slate-900`).
- **`cover_accent`:** Wajib menyertakan kelas tema terang **dan** tema gelap (`bg-... text-... dark:bg-... dark:text-...`) agar pill kategori terbaca di Light maupun Dark Mode.
- **`cover_image`:** Format vektor `.svg` (`viewBox="0 0 600 800"`) disimpan di `public/images/covers/<slug>.svg` bergaya editorial datar menyerupai sampul aslinya beserta judul dan nama penulis.

---

## 6. Checklist Validasi Sebelum Migrasi D1

Sebelum menyimpan dan mendorong file migrasi SQL (`migrations/XXXX_*.sql`), wajib jalankan skrip validator otomatis:

```bash
# Validasi file migrasi tertentu
npm run validate:content -- migrations/XXXX_nama_migrasi.sql

# Validasi ketat (peringatan dianggap error)
npm run validate:content -- --strict migrations/XXXX_nama_migrasi.sql

# Validasi seluruh file migrasi
npm run validate:content -- --all
```

Secara ringkas, hal yang diverifikasi mencakup:

1. **JSON Valid & SQL Escaped:** Semua string JSON valid (`JSON.parse` lolos) dan seluruh tanda petik tunggal (`'`) di-escape menjadi `''` di SQL.
2. **Penomoran & Urutan Bab:** Setiap item `key_takeaways_json` punya `number: 1..N` yang berurutan dan alur bab sesuai urutan buku asli.
3. **Keseimbangan Bab & Paragraf:**
   - Setiap `quickSummary` berada di rentang **50–80 kata** (ideal 55–70 kata).
   - Setiap `deepContent` punya **4–8 paragraf** (ideal 5–7), masing-masing **35–90 kata** (ideal 45–75 kata), dengan total **~300–430 kata/bab** yang merata antarbab.
4. **Jumlah Elemen Konsisten:** `who_is_it_for_json.length === 4`, `key_concepts_json.length === key_takeaways_json.length`, `quotes_json.length` antara `5–6`.
5. **Durasi Baca Tepat Sasaran:** Hasil `withCalculatedReadingTimes` (`WORDS_PER_MINUTE = 200`) masuk rentang kelas tebal halaman buku, dan angkanya sama persis dengan `quick_time_minutes`, `reading_time_minutes`, serta `takeaways_count` di tabel `books`.
6. **Sinkronisasi Dokumentasi:** Perbarui daftar di [`BOOKS.md`](./BOOKS.md) jika menambah buku baru atau mengubah durasi/poin buku yang ada.
