# Implementation Plan: Web Ringkasan Buku (ringkasnya.id)

> [!NOTE]
> Sesuai permintaan Anda, file rencana ini juga telah disimpan langsung di folder kerja Anda:
> - [PLAN.md](file:///E:/MyApp/PLAN.md)
> - [PLAN.md](file:///E:/MyApp/ringkasnya/PLAN.md)

Dokumen ini berisi rancangan pengembangan website **ringkasnya.id** menggunakan pendekatan **ATM (Amati, Tiru, Modifikasi)** terhadap platform ringkasan buku populer (*Headway*, *Booksnap*, dan *ringkaspaham.id*).

---

## 1. Keputusan Arsitektur (Telah Disetujui)
- **Framework**: Next.js (App Router, TypeScript) + Tailwind CSS di dalam `E:\MyApp\ringkasnya`.
- **Penyimpanan Konten Fase 1 (MVP)**: Data/Markdown lokal terstruktur (tanpa ketergantungan database eksternal agar cepat rilis dan mudah diedit).

---

## 2. Proposed Changes (Fase 1: MVP Sederhana)

### Inisialisasi Proyek & Konfigurasi
#### [NEW] `E:\MyApp\ringkasnya\package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- Setup Next.js App Router dengan TypeScript, Tailwind CSS, dan `lucide-react` untuk ikon.

---

### Struktur Data & Konten Buku
#### [NEW] `E:\MyApp\ringkasnya\src\types\book.ts`
```typescript
export interface BookTakeaway {
  number: number;
  title: string;
  quickSummary: string; // Untuk Mode Kilat (3 menit)
  deepContent: string[]; // Paragraf penjelasan untuk Mode Mendalam (10 menit)
}

export interface BookSummary {
  slug: string;
  title: string;
  author: string;
  category: 'Kebiasaan & Produktivitas' | 'Keuangan & Bisnis' | 'Psikologi' | 'Kreativitas & Karier';
  readingTimeMinutes: number;
  quickTimeMinutes: number;
  coverColor: string;
  coverAccent: string;
  tagline: string;
  synopsis: string;
  whoIsItFor: string[];
  keyTakeaways: BookTakeaway[];
  actionChecklist: string[];
  quotes: string[];
  conclusion: string;
}
```

#### [NEW] `E:\MyApp\ringkasnya\src\data\books.ts`
- Berisi 4 ringkasan buku *best-seller* awal dalam Bahasa Indonesia yang mengalir dan aplikatif:
  1. **Atomic Habits** – James Clear
  2. **The Psychology of Money** – Morgan Housel
  3. **Deep Work** – Cal Newport
  4. **Show Your Work!** – Austin Kleon

---

### Halaman & Komponen UI
#### [NEW] `E:\MyApp\ringkasnya\src\components\Navbar.tsx` & `Footer.tsx`
- Navigasi responsif dengan identitas **ringkasnya.id**.

#### [NEW] `E:\MyApp\ringkasnya\src\components\BookCard.tsx`
- Kartu katalog buku dengan visual sampul buku, badge kategori, estimasi waktu baca, judul, penulis, dan *tagline*.

#### [NEW] `E:\MyApp\ringkasnya\src\app\page.tsx`
- Halaman Beranda: Hero section, filter kategori, pencarian instan, dan daftar katalog buku.

#### [NEW] `E:\MyApp\ringkasnya\src\app\buku\[slug]\page.tsx`
- Halaman Baca Ringkasan (*Reader View*):
  - Toggle **Mode Kilat (3 Menit)** vs **Mode Mendalam (10 Menit)**.
  - *Key Takeaways* bab per bab.
  - **Action Checklist** interaktif (tersimpan di `localStorage`).
  - Kartu Kutipan (*Quotes*) dengan fitur salin 1-klik.

---

## 3. Verification Plan

### Automated Verification
- Menjalankan `npm run build` di `E:\MyApp\ringkasnya` untuk memastikan kompilasi TypeScript dan Next.js bebas error.

### Manual Verification
1. Menjalankan `npm run dev` dan membuka `http://localhost:3000`.
2. Menguji filter kategori, pencarian buku, mode baca Kilat vs Mendalam, serta Action Checklist.
