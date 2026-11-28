# Standar Penulisan Konten Artikel — Ringkasnya

Dokumen ini adalah panduan resmi (**single source of truth**) untuk menulis, menyunting, dan mendaftarkan seluruh konten artikel editorial di **Ringkasnya** (`ringkasnya.com`).

Setiap pembuatan atau pembaruan artikel **wajib** mengikuti struktur tipe `Article` (`src/types/article.ts`), durasi baca, serta aturan visual di bawah ini agar pengalaman membaca tetap seragam, mendalam, dan terhubung erat dengan katalog buku ([`BOOKS_LIST.md`](./BOOKS_LIST.md)).

---

## 1. Rubrik Resmi & Arah Editorial

Ringkasnya menggunakan **4 rubrik resmi** (`ARTICLE_FORMATS` di `src/types/article.ts`):

| ID Format (`format`) | Label (`accentBadge`) | Fokus Editorial |
|---|---|---|
| `bedah-istilah` | `Bedah Istilah` | Membedah satu prinsip ilmiah, efek psikologis, atau konsep kunci yang sering muncul di buku-buku Ringkasnya. |
| `lintas-buku` | `Lintas Buku` | Sintesis gagasan yang mempertemukan dan membandingkan sudut pandang dari beberapa buku sekaligus untuk satu tema besar. |
| `sains-aktual` | `Sains Aktual` | Membaca fenomena sehari-hari dan isu terkini lewat kacamata sains, ekonomi perilaku, dan riset ilmiah. |
| `kisah-eksperimen` | `Kisah Eksperimen` | Cerita di balik eksperimen legendaris atau pemikir klasik yang mengubah cara manusia memahami dunia. |

- **Gaya Bahasa:** Bahasa Indonesia editorial yang luwes, hangat, naratif, dan mudah dipahami pembaca awam—hindari gaya akademis kaku atau terjemahan literal.
- **Berbasis Bukti:** Setiap studi, nama peneliti, tahun eksperimen, dan kaitan ke buku di katalog harus akurat secara faktual.

---

## 2. Durasi Baca & Rentang Jumlah Kata

Durasi baca artikel dihitung otomatis melalui `withCalculatedReadingTime` di `src/data/articles.ts` dengan kecepatan baca **`WORDS_PER_MINUTE = 200` kata/menit** dari gabungan:
`title` + `subtitle` + `leadParagraph` + seluruh `sections` (`heading`, `paragraphs`, `highlightBox.label`, `highlightBox.text`) + seluruh `keyTakeaways`.

- **Target Durasi Baca:** **4–6 menit** per artikel (**~750–1.250 kata** total).
  - Ideal: **~850–1.100 kata** (**4–5 menit**).
  - Selaraskan properti `readingTimeMinutes` di file artikel (serta `src/data/article-terms.ts`) dengan hasil perhitungan aktual `Math.max(1, Math.round(totalWords / 200))`.

---

## 3. Struktur Artikel & Rentang Kata per Bagian

| Komponen (`Article`) | Jumlah / Format | Rentang Kata | Pedoman Penulisan |
|---|---|---|---|
| **`title`** | 1 judul | **3–8 kata** | Ringkas, tajam, mudah dipindai pada kartu feed maupun beranda. |
| **`subtitle`** | 1 kalimat | **10–20 kata** | Menjelaskan sudut pandang menarik atau paradoks utama artikel tanpa mengulang judul. |
| **`leadParagraph`** | 1 paragraf pembuka | **65–110 kata** | Pengait cerita, skenario keseharian, atau pertanyaan tajam yang langsung menarik pembaca masuk. |
| **`sections`** | **3–5 subbagian** (ideal **4**) | — | Tiap subbagian memiliki `heading` ringkas (**4–10 kata**) yang menggambarkan alur logis cerita. |
| **`section.paragraphs`** | **2–4 paragraf** / subbagian (ideal **3**) | **45–85 kata** / paragraf (batas 35–100) | 2–4 kalimat utuh per paragraf; hindari paragraf 1 kalimat yang terputus maupun tembok teks >100 kata. |
| **`section.highlightBox`** | Opsional (**1–2 kotak** / artikel) | `label`: 2–5 kata · `text`: **25–45 kata** | Sorotan definisi kunci, kutipan prinsip, atau ringkasan konsep penting agar halaman mudah dipindai. |
| **`keyTakeaways`** | **3–5 poin** (ideal **4**) | **15–30 kata** / poin | 1 kalimat utuh per poin berisi inti pelajaran praktis yang mudah diingat. |

### Alur Ideal 4 Subbagian Artikel
1. **Subbagian 1 (Asal-Usul / Konteks):** Cerita eksperimen, sejarah konsep, atau fenomena pemicu.
2. **Subbagian 2 (Mekanisme Ilmiah):** Penjelasan mengapa fenomena itu terjadi, dikaitkan dengan teori atau buku terkait.
3. **Subbagian 3 (Dampak Dunia Nyata):** Contoh konkret dalam keseharian, pengambilan keputusan, ekonomi, kesehatan, atau dunia kerja.
4. **Subbagian 4 (Pelajaran Praktis & Refleksi):** Cara mengenali dan menyikapi konsep tersebut secara bijak bersama rujukan lintas buku.

---

## 4. Integrasi Istilah Popover di BookReader (`article-terms.ts`)

Artikel di Ringkasnya terhubung langsung ke pembaca buku melalui fitur *auto-highlight* istilah di `BookReader`:

- **`term`:** Nama istilah utama dalam Bahasa Indonesia yang ringkas (**2–4 kata**, mis. `Kebutaan Tanpa Atensi`, `Efek Jangkar`).
- **`aliases`:** Array frasa/variasi istilah (Bahasa Indonesia & istilah Inggris populer) yang dicocokkan secara *case-insensitive* pada batas kata (*word-boundary*). Hindari kata umum tunggal yang terlalu luas agar tidak memicu *highlight* keliru di luar konteks.
- **`shortDefinition`:** Definisi ringkas **25–45 kata (1–2 kalimat)** yang tampil di popover/drawer pratinjau cepat saat pembaca mengetuk istilah di dalam ringkasan buku.
- **`originLabel`:** Rujukan singkat pencetus & tahun (mis. `Amos Tversky & Daniel Kahneman (1974)` atau `Leo Tolstoy (1877) → Jared Diamond (1997)`).

---

## 5. Keterkaitan Katalog Buku & Standar Visual

- **`slug`:** Huruf kecil `kebab-case` yang ringkas (mis. `eksperimen-invisible-gorilla`).
- **`category`:** Wajib memilih salah satu dari 10 kategori resmi `BookCategory` (`src/lib/book-constants.ts`).
- **`publishedAt`:** Format tanggal ISO `YYYY-MM-DD` (mis. `2026-11-24`), diformat otomatis menjadi `24 Nov 2026` di UI.
- **`relatedBookSlugs`:** Wajib mencantumkan **2–4 `slug` buku** yang benar-benar tersedia di katalog Ringkasnya ([`BOOKS_LIST.md`](./BOOKS_LIST.md)) dan relevan dengan isi artikel.
- **`coverGradient`:** Gradien Tailwind bernuansa gelap (`800`–`950`, mis. `from-slate-950 via-amber-950 to-slate-900`) yang serasi dengan palet ilustrasi SVG agar teks putih di header selalu kontras.
- **`coverImage` (Ilustrasi Sampul Artikel `.svg`):**
  - Wajib format vektor `.svg` persegi kompak **`viewBox="0 0 240 240"`**, disimpan di `public/images/articles/<slug>.svg`.
  - Bergaya editorial datar/ikonik dengan metafora visual yang mewakili gagasan artikel.
  - **Tanpa teks panjang di dalam ilustrasi**, karena gambar ini juga tampil dalam ukuran thumbnail kecil pada daftar feed artikel dan blok *Artikel Lainnya*.

---

## 6. Alur Pendaftaran & Checklist Sebelum Commit

Setiap penambahan artikel baru wajib menyelesaikan langkah berikut:

1. **Buat File Artikel:** Simpan di `src/data/articles/<slug>.ts` mengikuti tipe `Article`.
2. **Daftarkan ke Indeks Artikel:** Impor dan tambahkan ke array `RAW_ARTICLES` di `src/data/articles.ts`.
3. **Daftarkan ke Registri Istilah Ringan:** Tambahkan entri `ArticleTermEntry` yang selaras (`slug`, `term`, `aliases`, `category`, `readingTimeMinutes`, `shortDefinition`, `originLabel`) ke `src/data/article-terms.ts` agar `BookReader` tetap ringan tanpa membundel isi penuh artikel.
4. **Buat Ilustrasi SVG:** Simpan di `public/images/articles/<slug>.svg` (`viewBox="0 0 240 240"`).
5. **Verifikasi Akhir:**
   - Total kata berada di kisaran **750–1.250 kata** (**4–6 menit**).
   - Seluruh `relatedBookSlugs` valid dan ada di [`BOOKS_LIST.md`](./BOOKS_LIST.md).
   - Jalankan `npm run typecheck` untuk memastikan tidak ada kesalahan tipe TypeScript.
