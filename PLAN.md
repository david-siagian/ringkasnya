# Rencana Implementasi: Pivot Ringkasnya ke Nonfiksi Pengetahuan & Konsep Kunci

Rencana final ini mengikuti arahan editorial terbaru:
- **Positioning**: Ringkasan buku nonfiksi berbasis pengetahuan (sains, ekonomi, politik, psikologi, sejarah, masyarakat, perilaku, organisasi, budaya kerja) dengan **bahasa Indonesia yang tetap luwes, jernih, dan ramah pembaca awam** (menghindari jargon akademis yang berat).
- **Tanpa Pertanyaan Kritis & Tanpa Action Checklist**: Pembaca cukup memperoleh pengetahuan inti lewat **Konsep Kunci** (`keyConcepts`) di akhir buku dan **Hal yang Perlu Diingat** (`keyNote`) di setiap bab.
- **Buku Sorotan Utama**: **Sapiens** menggantikan *Atomic Habits* pada CTA Beranda dan urutan sorotan Footer; buku *self-help* populer tetap dipertahankan di katalog dengan format **Konsep Kunci**, namun tidak di-*highlight*.

---

## Rincian Perubahan

1. **Model Data (`src/types/book.ts` & `src/data/books.ts`)**
   - `BookCategory`:
     - `"Sains & Nalar Ilmiah"`
     - `"Sejarah & Masyarakat"`
     - `"Ekonomi & Politik"`
     - `"Psikologi & Perilaku"`
     - `"Organisasi & Budaya Kerja"`
   - `BookTakeaway`: Mengganti `practicalTip: string` menjadi `keyNote: string` (*Hal yang Perlu Diingat*).
   - `BookSummary`: Mengganti `actionChecklist: string[]` menjadi `keyConcepts: { title: string; explanation: string }[]` (*Konsep Kunci*).
   - `withCalculatedReadingTimes`: Menghitung jumlah kata dari `keyNote` dan `keyConcepts` (`title` + `explanation`) agar durasi **Mode Kilat (5–7 menit)** dan **Mode Mendalam (15–20 menit)** tetap akurat.

2. **Komponen Reader (`BookReader.tsx`, `BookReaderSections.tsx`, `BookReaderModals.tsx`)**
   - **`TakeawayCard`**: Mengubah kotak *"Tips Praktis Langsung Coba:"* menjadi **"Hal yang Perlu Diingat:"**.
   - **`KeyConceptsSection`** *(menggantikan `ActionChecklistSection`)*: Menampilkan daftar kartu **Konsep Kunci** (`title` + `explanation`) yang rapi, kontras, dan mudah dipindai tanpa checkbox maupun pertanyaan terbuka.
   - **`QuickKeyConceptsModal`** *(menggantikan `QuickChecklistModal`)*: Modal ringkas untuk membuka ulang daftar **Konsep Kunci** saat buku berstatus *Selesai Dibaca* (`Konsep Kunci (N)`), serta membersihkan logika `localStorage` checklist lama.

3. **Halaman & Positioning Global**
   - `src/layouts/BaseLayout.astro`: Memperbarui default title & meta description.
   - `src/pages/index.astro`:
     - Tagline hero: *"Baca Intinya, Pahami Dunianya."*
     - Pilar kedua: **"2. Konsep Kunci Mudah Dipahami"** (menggantikan *Action Checklist Interaktif*).
     - Tombol CTA: **"Coba Baca: Sapiens"** (`/buku/sapiens`).
   - `src/pages/topik.astro`: Memperbarui `TOPIC_DETAILS` dan ikon ke 5 kategori baru.
   - `src/pages/katalog.astro`, `src/pages/tentang.astro`, `src/components/Footer.tsx`: Menyelaraskan deskripsi ke pengetahuan nonfiksi, **Konsep Kunci**, dan sorotan **Sapiens**.

4. **Migrasi Seluruh Data Buku (`src/data/books/*.ts` — 21 file)**
   - Memigrasikan kategori, `practicalTip` -> `keyNote`, dan `actionChecklist` -> `keyConcepts` pada seluruh 21 file buku di `src/data/books/` dengan gaya bahasa yang mengalir dan mudah dipahami pembaca awam.

5. **Pengujian & Verifikasi**
   - Memperbarui `tests/smoke.spec.ts` (kategori baru, `/buku/sapiens`, verifikasi `KeyConceptsSection` & `QuickKeyConceptsModal`, tanpa checklist).
   - Menjalankan `npx tsc --noEmit` dan `npm run build` (plus verifikasi smoke test jika diperlukan), lalu commit, push ke branch kerja, dan merge ke `dev`.
