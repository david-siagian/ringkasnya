-- Migrasi 0008: Sesuaikan kolom original_title 20 buku Batch 1 & Batch 2 dengan aturan GEMINI.md
-- (Bahasa Indonesia, tanpa mengulang judul buku di depannya, dan tidak kosong)

UPDATE books SET original_title = 'Menjadi Manusia di Era Algoritma', updated_at = datetime('now') WHERE slug = 'hello-world';
UPDATE books SET original_title = 'Menjadi Manusia di Era Kecerdasan Buatan', updated_at = datetime('now') WHERE slug = 'life-3-0';
UPDATE books SET original_title = 'Perjalanan Menjelajahi Alam Semesta dan Asal-Usul Kita', updated_at = datetime('now') WHERE slug = 'cosmos';
UPDATE books SET original_title = 'Visi Masa Depan Umat Manusia di Luar Angkasa', updated_at = datetime('now') WHERE slug = 'pale-blue-dot';
UPDATE books SET original_title = 'Bagaimana Dunia Menjadi Modern Lewat Satu Naskah Kuno', updated_at = datetime('now') WHERE slug = 'the-swerve';
UPDATE books SET original_title = 'Sejarah Singkat Jaringan Informasi dari Zaman Batu hingga AI', updated_at = datetime('now') WHERE slug = 'nexus';
UPDATE books SET original_title = 'Hidup dan Bekerja Berdampingan dengan Kecerdasan Buatan', updated_at = datetime('now') WHERE slug = 'co-intelligence';
UPDATE books SET original_title = 'Pertarungan Memperebutkan Teknologi Paling Kritis di Dunia', updated_at = datetime('now') WHERE slug = 'chip-war';
UPDATE books SET original_title = 'Sejarah Intim tentang Kode Kehidupan dan Warisan Genetik', updated_at = datetime('now') WHERE slug = 'the-gene';
UPDATE books SET original_title = 'Perubahan Kecil yang Mengubah Segalanya', updated_at = datetime('now') WHERE slug = 'tiny-habits';

UPDATE books SET original_title = 'Astrofisika Ringkas untuk Pembaca Sibuk', updated_at = datetime('now') WHERE slug = 'astrophysics-for-people-in-a-hurry';
UPDATE books SET original_title = 'Menyingkap Misteri Hakikat Waktu di Alam Semesta', updated_at = datetime('now') WHERE slug = 'the-order-of-time';
UPDATE books SET original_title = 'Sains Baru tentang Seni Bernapas yang Terlupakan', updated_at = datetime('now') WHERE slug = 'breath';
UPDATE books SET original_title = 'Apa Hal yang Benar untuk Dilakukan?', updated_at = datetime('now') WHERE slug = 'justice';
UPDATE books SET original_title = 'Sebuah Sejarah Kepunahan yang Tak Alami', updated_at = datetime('now') WHERE slug = 'the-sixth-extinction';
UPDATE books SET original_title = 'Teknologi, Kekuasaan, dan Dilema Terbesar Abad ke-21', updated_at = datetime('now') WHERE slug = 'the-coming-wave';
UPDATE books SET original_title = 'Ilmu Komputer di Balik Keputusan Manusia', updated_at = datetime('now') WHERE slug = 'algorithms-to-live-by';
UPDATE books SET original_title = 'Sejarah Penuh Harapan tentang Kebaikan Manusia', updated_at = datetime('now') WHERE slug = 'humankind';
UPDATE books SET original_title = 'Sejarah, Teori, dan Banjir Informasi', updated_at = datetime('now') WHERE slug = 'the-information';
UPDATE books SET original_title = 'Kisah Para Peretas, Jenius, dan Perintis Revolusi Digital', updated_at = datetime('now') WHERE slug = 'the-innovators';
