-- Migrasi 0025: Hapus kategori 'Karier & Budaya Kerja'; pindahkan The Design of Everyday Things ke 'Psikologi & Perilaku' dan sisanya ke 'Produktivitas & Pengembangan Diri'

UPDATE books
SET category = 'Psikologi & Perilaku',
    editorial_tier = 1,
    updated_at = datetime('now')
WHERE slug = 'the-design-of-everyday-things';

UPDATE books
SET category = 'Produktivitas & Pengembangan Diri',
    updated_at = datetime('now')
WHERE category = 'Karier & Budaya Kerja';
