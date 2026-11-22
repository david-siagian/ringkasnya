# Implementation Plan: Penyesuaian Nama Proyek & Tipografi `ringkasnya.com`

Mengubah nama aplikasi dan proyek dari `Ringkasnya` / `ringkasnya.id` menjadi `ringkasnya.com` dengan tipografi modern yang serasi di seluruh komponen aplikasi.

## 1. Feature & Bugfix Review Board

### I. Role Aktif
1. **Product & UX Reviewer (Human-Centric & Tren)**: Tipografi domain lowercase `ringkasnya` dengan penekanan aksen dot-domain `.com` (`text-emerald-600 dark:text-emerald-400 font-bold`) menciptakan visual lockup yang seimbang, modern, dan tidak monoton.
2. **QA & Edge-Case Skeptic (Keandalan & Akar Masalah)**: Penyesuaian nama harus konsisten dari metadata HTML, OpenGraph/title, header desktop & mobile, footer, kartu kutipan canvas, hingga health endpoint & skrip tes smoke.
3. **Growth & Retention Strategist (Kondisional: Branding)**: Domain `.com` memperkuat persepsi kredibilitas platform dan mempermudah pembaca mengingat tautan saat kutipan dibagikan ke media sosial.

### II. Keputusan
**Layak lanjut apa adanya**. Perubahan langsung diimplementasikan ke branch kerja `chore/rebrand-ringkasnya-com`.

---

## 2. Rincian Perubahan

### A. Tipografi & Identitas Brand (`Navbar.tsx` & `Footer.tsx`)
- **Navbar (Desktop & Mobile Drawer)**:
  Mengubah teks judul brand dari `Ringkasnya` menjadi:
  `ringkasnya`<span class="text-emerald-600 dark:text-emerald-400 font-bold">.com</span>
  dengan `tracking-tight font-extrabold`.
- **Footer**:
  Mengubah teks judul brand menjadi:
  `ringkasnya`<span class="text-emerald-400 font-bold">.com</span>
  dan teks copyright menjadi `© {new Date().getFullYear()} ringkasnya.com`.

### B. Kartu Kutipan & Generator Canvas (`QuoteCardModal.tsx` & `BookReader.tsx`)
- Update `brandLabel` di canvas ekspor kartu kutipan menjadi `ringkasnya.com`.
- Update teks kutipan yang disalin di reader (`via ringkasnya.com`).

### C. Halaman & Layout (`BaseLayout.astro`, `index.astro`, `tentang.astro`, `buku/[slug].astro`, dll.)
- Update default title: `ringkasnya.com — Baca Intinya, Pahami Dunianya`.
- Update judul halaman katalog, topik, 404, dan halaman buku menjadi `... — ringkasnya.com`.
- Update teks di beranda ("Mengapa ringkasnya.com?") dan halaman tentang ("Tentang ringkasnya.com", "Cara Kerja ringkasnya.com").

### D. Konfigurasi Proyek & API
- `package.json`: `"name": "ringkasnya-com"`.
- `src/pages/api/health.ts`: `service: "ringkasnya.com"`.
- `tests/smoke.spec.ts`: update verifikasi service name.
- `.agents/skills/release-pipeline/SKILL.md`: selaraskan referensi domain.

---

## 3. Rencana Verifikasi
1. `npx tsc --noEmit` untuk memastikan tidak ada kesalahan tipe TypeScript.
2. `npm run build` (BypassSandbox: true) untuk memastikan seluruh halaman Astro ter-build sempurna.
3. Review hasil diff git sebelum commit.
