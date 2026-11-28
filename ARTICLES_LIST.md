# Daftar Katalog Artikel — Ringkasnya

Dokumen ini mencatat seluruh artikel editorial yang telah terbit di Ringkasnya (`ringkasnya.com`) dan dimigrasikan ke Cloudflare D1, beserta rubrik, istilah kunci, durasi baca, tanggal terbit, dan buku terkait sesuai standar [`ARTICLE_CONTENT.md`](./ARTICLE_CONTENT.md).

## Ringkasan Progres

| Tahap / Migrasi | Jumlah | Status di Cloudflare D1 | Keterangan |
|---|---|---|---|
| **Batch Awal (`0028` & `0029`)** | **12 artikel** | **Sudah dimigrasikan** | Artikel `#1–#12` lengkap di tabel `articles` & `article_contents` |
| **Batch 2 (`0030`)** | **12 artikel** | **Siap dimigrasikan** | Artikel `#13–#24` memperkaya `Sains Aktual`, `Lintas Buku`, `Kisah Eksperimen`, & `Bedah Istilah` |
| **Total Katalog Artikel** | **24 artikel** | **12 Sudah + 12 Siap Dimigrasikan** | **Seluruh konten mengikuti standar [`ARTICLE_CONTENT.md`](./ARTICLE_CONTENT.md)** |

### Sebaran per Rubrik

| Rubrik | Jumlah |
|---|---:|
| `Bedah Istilah` | 9 artikel |
| `Lintas Buku` | 5 artikel |
| `Kisah Eksperimen` | 5 artikel |
| `Sains Aktual` | 5 artikel |

---

## Daftar Artikel Terbit (Sudah Dimigrasikan ke D1)

### Batch Awal (`0029_seed_articles.sql` — 12 Artikel)

| No | Judul | Rubrik | Istilah Kunci | Durasi | Terbit | Buku Terkait | Slug |
|---:|---|---|---|---:|---|---|---|
| 1 | *Residu Atensi: Harga Mahal Multitasking* | `Bedah Istilah` | `Residu Atensi` | 4 mnt | 2026-11-28 | `deep-work`, `make-time`, `essentialism` | `residu-atensi` |
| 2 | *MVP vs Obsesi Kesempurnaan dalam Bisnis* | `Lintas Buku` | `Produk Minimum Layak` | 4 mnt | 2026-11-28 | `the-lean-startup`, `good-to-great`, `the-innovators-dilemma` | `mvp-vs-obsesi-kesempurnaan` |
| 3 | *Hipoksia Intermiten dan Bahaya Bernapas Lewat Mulut* | `Kisah Eksperimen` | `Hipoksia Intermiten` | 5 mnt | 2026-11-28 | `breath`, `the-body`, `outlive` | `hipoksia-intermiten-dan-pernapasan` |
| 4 | *Apakah Manusia Pada Dasarnya Egois atau Kooperatif?* | `Lintas Buku` | `Altruisme Timbal Balik` | 5 mnt | 2026-11-28 | `the-selfish-gene`, `humankind`, `sapiens` | `manusia-egois-atau-kooperatif` |
| 5 | *FOMO AI di Kantor dan Jebakan Nalar* | `Sains Aktual` | `Perbatasan Bergerigi AI` | 5 mnt | 2026-11-28 | `co-intelligence`, `hello-world`, `deep-work` | `fomo-ai-di-dunia-kerja` |
| 6 | *Invisible Gorilla: Batas Tersembunyi Fokus Manusia* | `Kisah Eksperimen` | `Kebutaan Tanpa Atensi` | 4 mnt | 2026-11-23 | `thinking-fast-and-slow`, `the-demon-haunted-world`, `predictably-irrational` | `eksperimen-invisible-gorilla` |
| 7 | *Adaptasi Hedonis: Jebakan Treadmill Kebahagiaan* | `Bedah Istilah` | `Adaptasi Hedonis` | 4 mnt | 2026-11-22 | `a-guide-to-the-good-life`, `psychology-of-money`, `sapiens`, `meditations` | `adaptasi-hedonis` |
| 8 | *Efek Jangkar: Terperangkap Kesan Pertama* | `Bedah Istilah` | `Efek Jangkar` | 4 mnt | 2026-11-22 | `thinking-fast-and-slow`, `predictably-irrational`, `influence`, `never-split-the-difference` | `efek-jangkar` |
| 9 | *Bias Konfirmasi: Ilusi Objektivitas Pikiran* | `Bedah Istilah` | `Bias Konfirmasi` | 4 mnt | 2026-11-22 | `the-joy-of-science`, `the-death-of-expertise`, `thinking-fast-and-slow`, `think-again` | `bias-konfirmasi` |
| 10 | *Destruksi Kreatif: Mesin Kejam Kemajuan Ekonomi* | `Bedah Istilah` | `Destruksi Kreatif` | 4 mnt | 2026-11-22 | `why-nations-fail`, `the-lean-startup`, `guns-germs-and-steel` | `destruksi-kreatif` |
| 11 | *Efek Dunning-Kruger: Jebakan Percaya Diri Berlebih* | `Bedah Istilah` | `Efek Dunning-Kruger` | 5 mnt | 2026-11-22 | `the-death-of-expertise`, `think-again`, `the-joy-of-science` | `efek-dunning-kruger` |
| 12 | *Prinsip Anna Karenina: Rapuhnya Sebuah Keberhasilan* | `Bedah Istilah` | `Prinsip Anna Karenina` | 5 mnt | 2026-11-22 | `guns-germs-and-steel`, `why-nations-fail`, `sapiens` | `prinsip-anna-karenina` |

### Batch 2 (`0030_seed_articles_batch_2.sql` — 12 Artikel)

| No | Judul | Rubrik | Istilah Kunci | Durasi | Terbit | Buku Terkait | Slug |
|---:|---|---|---|---:|---|---|---|
| 13 | *Utang Tidur: Mengapa Begadang Tak Bisa Dilunasi* | `Sains Aktual` | `Ritme Sirkadian` | 4 mnt | 2026-11-28 | `why-we-sleep`, `outlive`, `the-body`, `make-time` | `utang-tidur-dan-ritme-sirkadian` |
| 14 | *Mengapa Kita Kalah Melawan Algoritma Doomscrolling?* | `Sains Aktual` | `Ekonomi Atensi` | 4 mnt | 2026-11-28 | `digital-minimalism`, `the-shallows`, `nexus`, `predictably-irrational` | `algoritma-doomscrolling-dan-ekonomi-atensi` |
| 15 | *Geopolitik Silikon: Sebutir Cip Pengatur Dunia* | `Sains Aktual` | `Rantai Pasok Semikonduktor` | 5 mnt | 2026-11-28 | `chip-war`, `the-coming-wave`, `nexus`, `life-3-0` | `geopolitik-cip-dan-semikonduktor` |
| 16 | *Olahraga sebagai Pupuk Otak: Sains Gerak dan Fokus* | `Sains Aktual` | `Neuroplastisitas` | 4 mnt | 2026-11-28 | `spark`, `outlive`, `why-we-sleep`, `the-body-keeps-the-score` | `olahraga-dan-neuroplastisitas` |
| 17 | *Spesialis vs Generalis: Jalan Mana yang Unggul?* | `Lintas Buku` | `Aturan 10.000 Jam` | 5 mnt | 2026-11-28 | `range`, `outliers`, `grit`, `barking-up-the-wrong-tree` | `spesialis-vs-generalis` |
| 18 | *Uang, Kebebasan, dan Kelangkaan: Apa yang Kita Kejar?* | `Lintas Buku` | `Biaya Peluang` | 5 mnt | 2026-11-28 | `psychology-of-money`, `the-almanack-of-naval-ravikant`, `poor-economics`, `a-guide-to-the-good-life` | `uang-kebebasan-dan-kelangkaan` |
| 19 | *Mengapa Manusia Mudah Terpecah oleh Politik dan Moralitas?* | `Lintas Buku` | `Fondasi Moral` | 5 mnt | 2026-11-28 | `the-righteous-mind`, `justice`, `behave`, `think-again` | `mengapa-manusia-terpecah-soal-moral` |
| 20 | *Dilema Troli: Mengapa Moralitas Manusia Tak Konsisten?* | `Kisah Eksperimen` | `Dilema Troli` | 4 mnt | 2026-11-28 | `justice`, `the-righteous-mind`, `thinking-fast-and-slow`, `behave` | `eksperimen-dilema-troli` |
| 21 | *Penjara Stanford: Fakta Sains atau Teater Populer?* | `Kisah Eksperimen` | `Efek Lucifer` | 5 mnt | 2026-11-28 | `humankind`, `influence`, `behave`, `the-righteous-mind` | `eksperimen-penjara-stanford` |
| 22 | *Efek Kupu-Kupu: Kesalahan Desimal Melahirkan Teori Chaos* | `Kisah Eksperimen` | `Efek Kupu-Kupu` | 4 mnt | 2026-11-28 | `chaos`, `the-signal-and-the-noise`, `superforecasting`, `the-information` | `efek-kupu-kupu-teori-chaos` |
| 23 | *Umwelt: Dunia Tersembunyi di Balik Indra Hewan* | `Bedah Istilah` | `Umwelt` | 4 mnt | 2026-11-28 | `an-immense-world`, `i-contain-multitudes`, `the-body`, `cosmos` | `umwelt-dunia-indra-hewan` |
| 24 | *Jendela Overton: Cara Ide Gila Menjadi Kebijakan* | `Bedah Istilah` | `Jendela Overton` | 4 mnt | 2026-11-28 | `sapiens`, `enlightenment-now`, `nexus`, `the-death-of-expertise` | `jendela-overton` |
