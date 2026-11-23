-- Migrasi 0002: Ganti nama kategori 'Kesehatan & Medis' menjadi 'Tubuh & Kesehatan'
UPDATE books
SET category = 'Tubuh & Kesehatan',
    updated_at = datetime('now')
WHERE category = 'Kesehatan & Medis';
