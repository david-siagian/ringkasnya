-- Migrasi 0023: Selaraskan cover_gradient pada tabel books dengan warna latar sampul .svg masing-masing
-- agar banner header pembaca (BookReader), kartu pratinjau (BookPreviewModal), dan kartu pilihan (CatalogSection)
-- konsisten dengan sampul bukunya, tetap dalam nuansa gelap Tailwind (800-950) untuk kontras teks putih.

-- 1. Penyelarasan famili warna (hue) yang sebelumnya berbeda dari sampul .svg
UPDATE books SET cover_gradient = 'from-slate-950 via-slate-900 to-slate-800', updated_at = datetime('now') WHERE slug = 'a-short-history-of-nearly-everything';
UPDATE books SET cover_gradient = 'from-slate-950 via-indigo-950 to-slate-900', updated_at = datetime('now') WHERE slug = 'behave';
UPDATE books SET cover_gradient = 'from-zinc-950 via-red-950 to-zinc-900', updated_at = datetime('now') WHERE slug = 'calling-bullshit';
UPDATE books SET cover_gradient = 'from-slate-950 via-indigo-950 to-rose-950', updated_at = datetime('now') WHERE slug = 'chaos';
UPDATE books SET cover_gradient = 'from-stone-900 via-indigo-950 to-slate-900', updated_at = datetime('now') WHERE slug = 'four-thousand-weeks';
UPDATE books SET cover_gradient = 'from-slate-900 via-rose-950 to-slate-800', updated_at = datetime('now') WHERE slug = 'how-emotions-are-made';
UPDATE books SET cover_gradient = 'from-zinc-950 via-violet-950 to-zinc-900', updated_at = datetime('now') WHERE slug = 'incognito';
UPDATE books SET cover_gradient = 'from-teal-950 via-teal-900 to-slate-900', updated_at = datetime('now') WHERE slug = 'poor-economics';
UPDATE books SET cover_gradient = 'from-violet-900 via-pink-800 to-rose-800', updated_at = datetime('now') WHERE slug = 'show-your-work';
UPDATE books SET cover_gradient = 'from-slate-950 via-sky-900 to-slate-900', updated_at = datetime('now') WHERE slug = 'superforecasting';
UPDATE books SET cover_gradient = 'from-slate-900 via-teal-950 to-slate-800', updated_at = datetime('now') WHERE slug = 'the-body';
UPDATE books SET cover_gradient = 'from-slate-900 via-cyan-950 to-slate-800', updated_at = datetime('now') WHERE slug = 'the-body-keeps-the-score';
UPDATE books SET cover_gradient = 'from-slate-900 via-slate-800 to-amber-950', updated_at = datetime('now') WHERE slug = 'the-design-of-everyday-things';
UPDATE books SET cover_gradient = 'from-slate-900 via-orange-950 to-slate-800', updated_at = datetime('now') WHERE slug = 'the-innovators-dilemma';
UPDATE books SET cover_gradient = 'from-amber-950 via-blue-900 to-slate-900', updated_at = datetime('now') WHERE slug = 'the-richest-man-in-babylon';
UPDATE books SET cover_gradient = 'from-slate-900 via-slate-800 to-amber-950', updated_at = datetime('now') WHERE slug = 'the-righteous-mind';
UPDATE books SET cover_gradient = 'from-slate-950 via-blue-950 to-slate-900', updated_at = datetime('now') WHERE slug = 'the-signal-and-the-noise';

-- 2. Penyelarasan tingkat kecerahan & urutan stop gradasi agar lebih presisi dengan .svg
UPDATE books SET cover_gradient = 'from-orange-900 via-orange-800 to-amber-800', updated_at = datetime('now') WHERE slug = 'atomic-habits';
UPDATE books SET cover_gradient = 'from-rose-950 via-rose-900 to-amber-900', updated_at = datetime('now') WHERE slug = 'barking-up-the-wrong-tree';
UPDATE books SET cover_gradient = 'from-slate-900 via-cyan-800 to-cyan-900', updated_at = datetime('now') WHERE slug = 'breath';
UPDATE books SET cover_gradient = 'from-zinc-900 via-red-900 to-zinc-950', updated_at = datetime('now') WHERE slug = 'chip-war';
UPDATE books SET cover_gradient = 'from-slate-900 via-blue-900 to-indigo-900', updated_at = datetime('now') WHERE slug = 'co-intelligence';
UPDATE books SET cover_gradient = 'from-indigo-950 via-blue-900 to-slate-900', updated_at = datetime('now') WHERE slug = 'deep-work';
UPDATE books SET cover_gradient = 'from-red-900 via-red-800 to-red-950', updated_at = datetime('now') WHERE slug = 'everybody-lies';
UPDATE books SET cover_gradient = 'from-cyan-950 via-cyan-800 to-sky-800', updated_at = datetime('now') WHERE slug = 'factfulness';
UPDATE books SET cover_gradient = 'from-emerald-900 via-emerald-800 to-teal-800', updated_at = datetime('now') WHERE slug = 'freakonomics';
UPDATE books SET cover_gradient = 'from-red-950 via-red-800 to-zinc-900', updated_at = datetime('now') WHERE slug = 'good-to-great';
UPDATE books SET cover_gradient = 'from-stone-900 via-stone-800 to-stone-900', updated_at = datetime('now') WHERE slug = 'guns-germs-and-steel';
UPDATE books SET cover_gradient = 'from-amber-950 via-orange-800 to-stone-900', updated_at = datetime('now') WHERE slug = 'humankind';
UPDATE books SET cover_gradient = 'from-indigo-950 via-indigo-900 to-slate-900', updated_at = datetime('now') WHERE slug = 'justice';
UPDATE books SET cover_gradient = 'from-slate-800 via-slate-800 to-indigo-950', updated_at = datetime('now') WHERE slug = 'mans-search-for-meaning';
UPDATE books SET cover_gradient = 'from-stone-900 via-stone-800 to-amber-900', updated_at = datetime('now') WHERE slug = 'meditations';
UPDATE books SET cover_gradient = 'from-sky-900 via-blue-900 to-teal-800', updated_at = datetime('now') WHERE slug = 'mindset';
UPDATE books SET cover_gradient = 'from-sky-900 via-sky-800 to-sky-800', updated_at = datetime('now') WHERE slug = 'nudge';
UPDATE books SET cover_gradient = 'from-slate-950 via-slate-900 to-slate-800', updated_at = datetime('now') WHERE slug = 'pale-blue-dot';
UPDATE books SET cover_gradient = 'from-slate-900 via-rose-900 to-amber-900', updated_at = datetime('now') WHERE slug = 'predictably-irrational';
UPDATE books SET cover_gradient = 'from-purple-950 via-purple-900 to-amber-950', updated_at = datetime('now') WHERE slug = 'rich-dad-poor-dad';
UPDATE books SET cover_gradient = 'from-slate-900 via-red-950 to-slate-800', updated_at = datetime('now') WHERE slug = 'spark';
UPDATE books SET cover_gradient = 'from-orange-950 via-orange-900 to-orange-800', updated_at = datetime('now') WHERE slug = 'the-7-habits-of-highly-effective-people';
UPDATE books SET cover_gradient = 'from-slate-950 via-slate-900 to-blue-900', updated_at = datetime('now') WHERE slug = 'the-coming-wave';
UPDATE books SET cover_gradient = 'from-zinc-950 via-zinc-800 to-red-900', updated_at = datetime('now') WHERE slug = 'the-death-of-expertise';
UPDATE books SET cover_gradient = 'from-slate-900 via-rose-900 to-rose-950', updated_at = datetime('now') WHERE slug = 'the-gene';
UPDATE books SET cover_gradient = 'from-slate-800 via-slate-800 to-slate-900', updated_at = datetime('now') WHERE slug = 'the-innovators';
UPDATE books SET cover_gradient = 'from-slate-900 via-slate-800 to-indigo-900', updated_at = datetime('now') WHERE slug = 'the-order-of-time';
UPDATE books SET cover_gradient = 'from-stone-900 via-amber-950 to-orange-900', updated_at = datetime('now') WHERE slug = 'the-origin-of-humankind';
UPDATE books SET cover_gradient = 'from-teal-950 via-teal-800 to-teal-800', updated_at = datetime('now') WHERE slug = 'the-selfish-gene';
UPDATE books SET cover_gradient = 'from-emerald-900 via-teal-800 to-slate-800', updated_at = datetime('now') WHERE slug = 'the-sixth-extinction';
UPDATE books SET cover_gradient = 'from-orange-900 via-orange-800 to-stone-900', updated_at = datetime('now') WHERE slug = 'the-subtle-art-of-not-giving-a-fck';
UPDATE books SET cover_gradient = 'from-violet-950 via-purple-900 to-pink-900', updated_at = datetime('now') WHERE slug = 'why-is-sex-fun';
