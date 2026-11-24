---
name: review-board
description: >-
  MANDATORY pre-coding gate for ringkasnya.com: ALWAYS read and run this skill
  BEFORE writing or editing any code whenever the user requests a new feature,
  UI/UX change, user flow change, or bug fix (unless the user explicitly says
  "skip review", "no review", or "eksekusi").
---

# Feature & Bugfix Review Board (Wajib Sebelum Coding)

Setiap kali diminta menambahkan **fitur baru**, mengubah **alur pengguna / antarmuka**, atau melakukan **perbaikan bug (fixing)**, **JANGAN** langsung menulis atau mengubah kode terlebih dahulu.

> [!IMPORTANT]
> **Aturan Gerbang Keras (Hard Gate)**:
> 1. Evaluasi di dalam *internal thought* **TIDAK SAH** dan **tidak menggantikan** output tertulis.
> 2. Anda **WAJIB** mencetak hasil Review Board (Format Output Wajib di bawah) secara eksplisit ke chat **sebelum** memanggil `edit_file` atau `write_file` pertama kali pada file kode/konten.
> 3. **Bypass**: Hanya lewati skill ini jika instruksi user secara eksplisit menyertakan `"skip review"`, `"no review"`, atau `"eksekusi"`.

---

## I. Role Wajib (Selalu Aktif untuk Fitur, Perubahan Antarmuka, & Bugfix)

### 1. Product & UX Reviewer (Human-Centric & Tren)
- **Nilai & Kebiasaan Pengguna:** Apakah fitur/perbaikan menjawab kebutuhan pembaca ringkasan buku dan pendengar audio secara nyata, atau menambah beban visual/aliran yang tidak perlu?
- **Ergonomi & Tren Produk:** Evaluasi alur baca, konsep kunci, pemutar audio, dan highlight terhadap pola aplikasi modern (kecepatan *time-to-value*, *mobile-first*, transisi halus, tanpa gangguan berlebih). Sarankan alternatif yang lebih ringan jika diperlukan.

### 2. QA & Edge-Case Skeptic (Keandalan & Akar Masalah)
- **State & Kegagalan:** Periksa *empty state*, *loading state*, jaringan terputus/lambat, teks panjang, audio belum tersedia/gagal dimuat, dan klik ganda cepat.
- **Akar Masalah vs Tambalan:** Pastikan *bug fix* menyentuh akar penyebab, bukan sekadar menyembunyikan *error* di UI.
- **Verifikasi:** Rencanakan skenario pengujian spesifik (termasuk uji browser Playwright untuk alur UI utama jika relevan) agar regresi mudah terdeteksi.

---

## II. Role Kondisional (Aktifkan Hanya Sesuai Konteks Perubahan)

### 3. Growth & Retention Strategist *(Aktifkan jika menyentuh alur utama, onboarding, navigasi, atau pengalaman konsumsi konten)*
- **Dampak pada Retensi & Alur Kembali:** Apakah fitur/perbaikan membantu pengguna kembali menggunakan aplikasi secara alami dan menyelesaikan nilai utamanya, atau justru menambah friksi yang membuat pengguna berhenti di tengah jalan?
- **Nilai Jangka Panjang vs Gimmick:** Apakah efeknya mendorong kebiasaan penggunaan yang sehat dan berkelanjutan, atau sekadar kebaruan sesaat yang cepat diabaikan?

### 4. Cost & Unit Economics Auditor *(Aktifkan HANYA jika menyentuh AI/LLM, TTS, API berbayar, atau storage/egress Cloudflare R2)*
- **Biaya Marginal & Caching:** Pastikan hasil generasi LLM/TTS dan aset audio di Cloudflare R2 di-*cache* atau dideduplikasi agar tidak memicu generasi maupun *request* berulang yang boros.
- **Proteksi Abuse & Kuota:** Cegah *loop* permintaan ulang, eksekusi *batch* tak terkendali, atau pemanggilan API tanpa batas yang dapat membengkakkan tagihan.

### 5. Systems & Reliability Engineer *(Aktifkan HANYA jika mengubah alur data, skema database, batch pipeline, atau logika backend)*
- **Ketahanan & Konsistensi Data:** Bagaimana perilaku sistem saat koneksi terputus, *retry* dijalankan, *payload* besar, atau proses *batch* gagal di tengah jalan (idempotensi dan *rollback*)?
- **Performa & Maintainability:** Apakah *query*, *indexing*, atau manajemen *state* tetap efisien dan mudah di-*debug* seiring bertambahnya jumlah buku dan pengguna?

### 6. Security & Privacy Gatekeeper *(Aktifkan HANYA jika menyentuh auth, data pengguna, RLS, atau endpoint/API route)*
- **Otorisasi & Validasi Server-Side:** Pastikan hak akses diperiksa di sisi *server* dan database, bukan hanya disembunyikan di UI.
- **Proteksi Input & Kebocoran Data:** Validasi seluruh input *endpoint*, cegah eksposur *secret*/kredensial, dan pastikan pengguna hanya dapat mengakses atau mengubah data miliknya sendiri.

---

## Format Output Wajib Sebelum Mengubah Kode

Cetak blok berikut secara ringkas di chat sebelum melakukan perubahan kode:

1. **Role Aktif:** Sebutkan *role* wajib + *role* kondisional mana saja yang diaktifkan (abaikan *role* kondisional yang tidak relevan).
2. **Review Singkat:** Maksimal 2 kalimat per *role* aktif agar padat dan mudah dibaca cepat dari layar ponsel.
3. **Keputusan:** Nyatakan **Layak lanjut apa adanya**, **Lanjut dengan penyesuaian**, atau **Sebaiknya disederhanakan**, disertai alasan utama.
4. **Konfirmasi / Eksekusi:**
   - Jika keputusan **Layak lanjut apa adanya**: tampilkan blok Review Board ini terlebih dahulu (atau di awal respons), lalu langsung terapkan perubahan tanpa perlu menunggu konfirmasi user.
   - Jika keputusan **Lanjut dengan penyesuaian** atau **Sebaiknya disederhanakan**: **berhenti** dan minta persetujuan eksplisit dari user sebelum mulai menulis/mengubah kode.
