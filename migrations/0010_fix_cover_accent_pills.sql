-- Migrasi 0010: Lengkapi kelas background & kontras light/dark mode pada cover_accent (pills tipe buku)
-- untuk 20 buku Batch 1 & Batch 2 serta 3 buku awal yang sebelumnya hanya memakai kelas text-*.

UPDATE books SET cover_accent = 'bg-teal-100 text-teal-900 dark:bg-teal-950/70 dark:text-teal-300', updated_at = datetime('now') WHERE slug = 'hello-world';
UPDATE books SET cover_accent = 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-300', updated_at = datetime('now') WHERE slug = 'life-3-0';
UPDATE books SET cover_accent = 'bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300', updated_at = datetime('now') WHERE slug = 'cosmos';
UPDATE books SET cover_accent = 'bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300', updated_at = datetime('now') WHERE slug = 'pale-blue-dot';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'the-swerve';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'nexus';
UPDATE books SET cover_accent = 'bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300', updated_at = datetime('now') WHERE slug = 'co-intelligence';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'chip-war';
UPDATE books SET cover_accent = 'bg-rose-100 text-rose-900 dark:bg-rose-950/70 dark:text-rose-300', updated_at = datetime('now') WHERE slug = 'the-gene';
UPDATE books SET cover_accent = 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300', updated_at = datetime('now') WHERE slug = 'tiny-habits';
UPDATE books SET cover_accent = 'bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300', updated_at = datetime('now') WHERE slug = 'astrophysics-for-people-in-a-hurry';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'the-order-of-time';
UPDATE books SET cover_accent = 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/70 dark:text-cyan-300', updated_at = datetime('now') WHERE slug = 'breath';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'justice';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'the-sixth-extinction';
UPDATE books SET cover_accent = 'bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300', updated_at = datetime('now') WHERE slug = 'the-coming-wave';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'algorithms-to-live-by';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'humankind';
UPDATE books SET cover_accent = 'bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950/70 dark:text-fuchsia-300', updated_at = datetime('now') WHERE slug = 'the-information';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'the-innovators';

-- 3 buku awal yang sebelumnya juga hanya memiliki kelas text-* tanpa bg-*
UPDATE books SET cover_accent = 'bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300', updated_at = datetime('now') WHERE slug = 'the-lean-startup';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'steal-like-an-artist';
UPDATE books SET cover_accent = 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300', updated_at = datetime('now') WHERE slug = 'start-with-why';
