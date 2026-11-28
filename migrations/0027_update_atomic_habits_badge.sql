-- Migrasi 0027: Perbarui badge_text buku Atomic Habits dari 'Terpopuler #1' menjadi 'Ilmu Kebiasaan'
UPDATE books
SET badge_text = 'Ilmu Kebiasaan',
    updated_at = datetime('now')
WHERE slug = 'atomic-habits';
