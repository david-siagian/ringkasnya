#!/usr/bin/env node
/**
 * Validator Konten Buku Ringkasnya (berdasarkan BOOK_CONTENT.md)
 *
 * Penggunaan:
 *   npm run validate:content -- migrations/0015_add_books_batch_5.sql
 *   npm run validate:content -- --all
 *   npm run validate:content -- --strict migrations/0013_add_books_batch_3.sql
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const MIGRATIONS_DIR = path.join(ROOT_DIR, "migrations");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const WORDS_PER_MINUTE = 200;

const VALID_CATEGORIES = new Set([
  "Sains & Alam Semesta",
  "Teknologi & Masa Depan",
  "Nalar & Berpikir Kritis",
  "Psikologi & Perilaku",
  "Sejarah & Peradaban",
  "Filsafat & Kebijaksanaan",
  "Ekonomi & Keuangan",
  "Organisasi & Bisnis",
  "Tubuh & Kesehatan",
  "Produktivitas & Pengembangan Diri",
]);

const SECONDARY_CATEGORIES = new Set([
  "Organisasi & Bisnis",
  "Produktivitas & Pengembangan Diri",
]);

function countWords(text) {
  if (typeof text !== "string") return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateMinutes(words) {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Memecah isi SQL menjadi daftar statement utuh sambil menghormati
 * string kutip tunggal SQL ('...' dengan escape '') dan komentar (-- ...).
 */
function splitSqlStatements(sql) {
  const statements = [];
  let current = "";
  let inSingleQuote = false;
  let inLineComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        current += ch;
      }
      continue;
    }

    if (!inSingleQuote && ch === "-" && next === "-") {
      inLineComment = true;
      i++;
      continue;
    }

    if (ch === "'") {
      current += ch;
      if (inSingleQuote) {
        if (next === "'") {
          current += next;
          i++;
        } else {
          inSingleQuote = false;
        }
      } else {
        inSingleQuote = true;
      }
      continue;
    }

    if (!inSingleQuote && ch === ";") {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
      continue;
    }

    current += ch;
  }

  const tail = current.trim();
  if (tail) statements.push(tail);
  return statements;
}

/**
 * Memecah daftar argumen yang dipisah koma di dalam VALUES (...) atau SET ...
 */
function splitTopLevelComma(str) {
  const parts = [];
  let current = "";
  let inSingleQuote = false;
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const next = str[i + 1];

    if (ch === "'") {
      current += ch;
      if (inSingleQuote) {
        if (next === "'") {
          current += next;
          i++;
        } else {
          inSingleQuote = false;
        }
      } else {
        inSingleQuote = true;
      }
      continue;
    }

    if (!inSingleQuote) {
      if (ch === "(") parenDepth++;
      else if (ch === ")") parenDepth--;
      else if (ch === "," && parenDepth === 0) {
        parts.push(current.trim());
        current = "";
        continue;
      }
    }

    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parseSqlLiteral(raw) {
  const s = raw.trim();
  if (/^NULL$/i.test(s)) return null;
  if (s.startsWith("'") && s.endsWith("'")) {
    return s.slice(1, -1).replace(/''/g, "'");
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    return Number(s);
  }
  return s;
}

/**
 * Mengekstrak entri `books` dan `book_contents` dari sebuah file migrasi SQL.
 */
function parseMigrationSql(sql) {
  const statements = splitSqlStatements(sql);
  const books = new Map(); // slug -> { meta, content, isInsertMeta, isInsertContent }

  const ensureBook = (slug) => {
    if (!books.has(slug)) {
      books.set(slug, {
        slug,
        meta: {},
        content: {},
        isInsertMeta: false,
        isInsertContent: false,
      });
    }
    return books.get(slug);
  };

  for (const stmt of statements) {
    // 1. INSERT [OR REPLACE] INTO table (cols) VALUES (vals)
    const insertMatch = stmt.match(
      /^INSERT\s+(?:OR\s+(?:REPLACE|IGNORE)\s+)?INTO\s+(books|book_contents)\s*\(([\s\S]*?)\)\s*VALUES\s*\(([\s\S]*)\)$/i
    );
    if (insertMatch) {
      const table = insertMatch[1].toLowerCase();
      const cols = insertMatch[2].split(",").map((c) => c.trim().replace(/[`"]/g, ""));
      const rawVals = splitTopLevelComma(insertMatch[3]);
      const record = {};
      cols.forEach((col, idx) => {
        record[col] = rawVals[idx] !== undefined ? parseSqlLiteral(rawVals[idx]) : undefined;
      });

      const slug = table === "books" ? record.slug : record.book_slug;
      if (typeof slug === "string" && slug) {
        const entry = ensureBook(slug);
        if (table === "books") {
          Object.assign(entry.meta, record);
          entry.isInsertMeta = true;
        } else {
          Object.assign(entry.content, record);
          entry.isInsertContent = true;
        }
      }
      continue;
    }

    // 2. UPDATE table SET col = val, ... WHERE slug/book_slug = '...'
    const updateMatch = stmt.match(
      /^UPDATE\s+(books|book_contents)\s+SET\s+([\s\S]*?)\s+WHERE\s+(?:book_)?slug\s*=\s*'((?:[^']|'')+)'/i
    );
    if (updateMatch) {
      const table = updateMatch[1].toLowerCase();
      const setClause = updateMatch[2];
      const slug = updateMatch[3].replace(/''/g, "'");
      const assignments = splitTopLevelComma(setClause);
      const entry = ensureBook(slug);

      for (const assign of assignments) {
        const eqIdx = assign.indexOf("=");
        if (eqIdx === -1) continue;
        const col = assign.slice(0, eqIdx).trim().replace(/[`"]/g, "");
        const valRaw = assign.slice(eqIdx + 1).trim();
        const val = parseSqlLiteral(valRaw);
        if (table === "books") {
          entry.meta[col] = val;
        } else {
          entry.content[col] = val;
        }
      }
    }
  }

  return [...books.values()];
}

function getExpectedRangesForTakeawaysCount(n) {
  if (n <= 5) {
    return { label: "Tipis (5 poin)", minQm: 4, maxQm: 5, minDm: 15, maxDm: 15 };
  }
  if (n === 6) {
    return { label: "Sedang (6 poin)", minQm: 5, maxQm: 6, minDm: 15, maxDm: 17 };
  }
  if (n === 7) {
    return { label: "Tebal (7 poin)", minQm: 6, maxQm: 7, minDm: 18, maxDm: 20 };
  }
  if (n === 8) {
    return { label: "Tebal / Sangat Tebal (8 poin)", minQm: 6, maxQm: 8, minDm: 18, maxDm: 22 };
  }
  return { label: "Sangat Tebal (9 poin)", minQm: 7, maxQm: 8, minDm: 20, maxDm: 22 };
}

function validateBookEntry(entry) {
  const errors = [];
  const warnings = [];
  const { slug, meta, content, isInsertMeta, isInsertContent } = entry;

  // --- Validasi Metadata (books) ---
  if (meta.title !== undefined) {
    if (typeof meta.title !== "string" || !meta.title.trim()) {
      errors.push("`title` kosong.");
    } else if (meta.title.includes(":")) {
      errors.push(`\`title\` mengandung subjudul (':'): "${meta.title}". Pindahkan subjudul ke \`original_title\`.`);
    }
  }

  if (isInsertMeta || meta.original_title !== undefined) {
    if (typeof meta.original_title !== "string" || !meta.original_title.trim()) {
      errors.push("`original_title` wajib diisi dalam Bahasa Indonesia (tidak boleh NULL/kosong).");
    } else if (
      typeof meta.title === "string" &&
      meta.original_title.toLowerCase().startsWith(meta.title.toLowerCase() + ":")
    ) {
      errors.push(`\`original_title\` mengulang judul buku di depannya: "${meta.original_title}".`);
    }
  }

  if (meta.category !== undefined && !VALID_CATEGORIES.has(meta.category)) {
    errors.push(`\`category\` tidak valid: "${meta.category}".`);
  }

  if (meta.editorial_tier !== undefined) {
    if (![1, 2, 3].includes(meta.editorial_tier)) {
      errors.push(`\`editorial_tier\` harus 1, 2, atau 3 (ditemukan: ${meta.editorial_tier}).`);
    } else if (meta.category && SECONDARY_CATEGORIES.has(meta.category) && meta.editorial_tier !== 3) {
      errors.push(`Kategori "${meta.category}" wajib memiliki \`editorial_tier = 3\`.`);
    }
  }

  if (isInsertMeta && (typeof meta.goodreads_ratings !== "number" || meta.goodreads_ratings <= 0)) {
    warnings.push("`goodreads_ratings` sebaiknya berupa angka positif.");
  }

  if (meta.cover_gradient !== undefined && typeof meta.cover_gradient === "string") {
    if (!/(800|900|950)/.test(meta.cover_gradient)) {
      warnings.push(`\`cover_gradient\` sebaiknya bernuansa gelap (800–950): "${meta.cover_gradient}".`);
    }
  }

  if (meta.cover_accent !== undefined && typeof meta.cover_accent === "string") {
    if (!meta.cover_accent.includes("dark:")) {
      errors.push(`\`cover_accent\` wajib menyertakan kelas tema gelap (\`dark:\`): "${meta.cover_accent}".`);
    }
  }

  if (meta.cover_image !== undefined && typeof meta.cover_image === "string") {
    if (!meta.cover_image.endsWith(".svg")) {
      errors.push(`\`cover_image\` wajib berformat .svg: "${meta.cover_image}".`);
    } else {
      const rel = meta.cover_image.replace(/^\/+/, "");
      const fullPath = path.join(PUBLIC_DIR, rel);
      if (!fs.existsSync(fullPath)) {
        warnings.push(`File sampul SVG tidak ditemukan di public/: ${meta.cover_image}`);
      }
    }
  }

  if (meta.synopsis !== undefined && typeof meta.synopsis === "string") {
    if (meta.synopsis.includes("\n")) {
      warnings.push("`synopsis` mengandung baris baru; standar adalah 1 paragraf ringkas.");
    }
    const sw = countWords(meta.synopsis);
    if (sw < 50 || sw > 105) {
      warnings.push(`\`synopsis\` = ${sw} kata (ideal BOOK_CONTENT.md: 65–85 kata).`);
    }
  }

  let whoIsItFor = null;
  if (meta.who_is_it_for_json !== undefined) {
    try {
      whoIsItFor = JSON.parse(meta.who_is_it_for_json);
      if (!Array.isArray(whoIsItFor)) {
        errors.push("`who_is_it_for_json` bukan array JSON.");
      } else {
        if (whoIsItFor.length !== 4) {
          errors.push(`\`who_is_it_for_json\` harus tepat 4 poin (ditemukan: ${whoIsItFor.length}).`);
        }
        whoIsItFor.forEach((item, i) => {
          const w = countWords(item);
          if (w < 8 || w > 32) {
            warnings.push(`\`who_is_it_for[${i}]\` = ${w} kata (ideal: 12–22 kata).`);
          }
        });
      }
    } catch (e) {
      errors.push(`\`who_is_it_for_json\` JSON tidak valid: ${e.message}`);
    }
  }

  // --- Validasi Konten (book_contents) ---
  let takeaways = null;
  if (content.key_takeaways_json !== undefined) {
    try {
      takeaways = JSON.parse(content.key_takeaways_json);
      if (!Array.isArray(takeaways)) {
        errors.push("`key_takeaways_json` bukan array JSON.");
      } else {
        if (takeaways.length < 5 || takeaways.length > 9) {
          errors.push(`Jumlah poin inti harus 5–9 (ditemukan: ${takeaways.length}).`);
        }
        if (typeof meta.takeaways_count === "number" && meta.takeaways_count !== takeaways.length) {
          errors.push(
            `\`books.takeaways_count\` (${meta.takeaways_count}) tidak cocok dengan jumlah \`key_takeaways_json\` (${takeaways.length}).`
          );
        }

        const deepWordCounts = [];
        takeaways.forEach((t, idx) => {
          const expectedNum = idx + 1;
          if (t.number !== expectedNum) {
            errors.push(`Bab indeks ${idx} memiliki \`number=${t.number}\`, seharusnya \`${expectedNum}\`.`);
          }
          if (typeof t.title !== "string" || !t.title.trim()) {
            errors.push(`Bab #${expectedNum} tidak memiliki \`title\`.`);
          } else if (/^\d+[\.\)]\s/.test(t.title.trim())) {
            errors.push(`Bab #${expectedNum} \`title\` diawali angka manual ("${t.title.slice(0, 25)}..."); angka sudah dirender dari \`number\`.`);
          }

          if (typeof t.quickSummary !== "string" || !t.quickSummary.trim()) {
            errors.push(`Bab #${expectedNum} tidak memiliki \`quickSummary\`.`);
          } else {
            const qsw = countWords(t.quickSummary);
            if (qsw < 45 || qsw > 95) {
              errors.push(`Bab #${expectedNum} \`quickSummary\` = ${qsw} kata (batas aman: 50–80 kata, ideal 55–70).`);
            } else if (qsw < 50 || qsw > 80) {
              warnings.push(`Bab #${expectedNum} \`quickSummary\` = ${qsw} kata (ideal BOOK_CONTENT.md: 55–70 kata).`);
            }
          }

          if (typeof t.keyNote !== "string" || !t.keyNote.trim()) {
            errors.push(`Bab #${expectedNum} tidak memiliki \`keyNote\`.`);
          } else {
            const knw = countWords(t.keyNote);
            if (knw < 12 || knw > 35) {
              warnings.push(`Bab #${expectedNum} \`keyNote\` = ${knw} kata (ideal: 18–26 kata).`);
            }
          }

          if (!Array.isArray(t.deepContent) || t.deepContent.length === 0) {
            errors.push(`Bab #${expectedNum} tidak memiliki array \`deepContent\`.`);
          } else {
            if (t.deepContent.length < 4 || t.deepContent.length > 8) {
              warnings.push(
                `Bab #${expectedNum} memiliki ${t.deepContent.length} paragraf \`deepContent\` (ideal: 5–7, toleransi 4–8).`
              );
            }
            let dcSum = 0;
            t.deepContent.forEach((p, pIdx) => {
              const pw = countWords(p);
              dcSum += pw;
              if (pw === 0) {
                errors.push(`Bab #${expectedNum} paragraf #${pIdx + 1} kosong.`);
              } else if (pw < 30 || pw > 100) {
                warnings.push(
                  `Bab #${expectedNum} paragraf #${pIdx + 1} = ${pw} kata (ideal: 45–75 kata, batas 35–90).`
                );
              }
            });
            deepWordCounts.push(dcSum);
            if (dcSum < 240 || dcSum > 500) {
              warnings.push(`Bab #${expectedNum} total \`deepContent\` = ${dcSum} kata (target: ~300–430 kata).`);
            }
          }
        });

        if (deepWordCounts.length >= 2) {
          const minDc = Math.min(...deepWordCounts);
          const maxDc = Math.max(...deepWordCounts);
          if (minDc > 0 && (maxDc - minDc) / minDc > 0.45) {
            warnings.push(
              `Ketimpangan panjang \`deepContent\` antarbab cukup besar (min=${minDc} kata, max=${maxDc} kata).`
            );
          }
        }
      }
    } catch (e) {
      errors.push(`\`key_takeaways_json\` JSON tidak valid: ${e.message}`);
    }
  }

  let concepts = null;
  if (content.key_concepts_json !== undefined) {
    try {
      concepts = JSON.parse(content.key_concepts_json);
      if (!Array.isArray(concepts)) {
        errors.push("`key_concepts_json` bukan array JSON.");
      } else {
        if (takeaways && concepts.length !== takeaways.length) {
          errors.push(
            `Jumlah \`key_concepts_json\` (${concepts.length}) harus sama dengan jumlah \`key_takeaways_json\` (${takeaways.length}).`
          );
        }
        concepts.forEach((c, i) => {
          if (!c.title || !c.explanation) {
            errors.push(`\`key_concepts[${i}]\` wajib memiliki \`title\` dan \`explanation\`.`);
          } else {
            const ew = countWords(c.explanation);
            if (ew < 14 || ew > 48) {
              warnings.push(`\`key_concepts[${i}].explanation\` = ${ew} kata (ideal: 20–35 kata).`);
            }
          }
        });
      }
    } catch (e) {
      errors.push(`\`key_concepts_json\` JSON tidak valid: ${e.message}`);
    }
  }

  let quotes = null;
  if (content.quotes_json !== undefined) {
    try {
      quotes = JSON.parse(content.quotes_json);
      if (!Array.isArray(quotes)) {
        errors.push("`quotes_json` bukan array JSON.");
      } else {
        if (quotes.length < 5 || quotes.length > 6) {
          errors.push(`Jumlah \`quotes_json\` harus 5–6 kutipan (ditemukan: ${quotes.length}).`);
        }
        quotes.forEach((q, i) => {
          if (typeof q !== "string" || !q.trim()) {
            errors.push(`\`quotes[${i}]\` kosong.`);
          } else {
            if (/^["“]|["”]$/.test(q.trim())) {
              errors.push(`\`quotes[${i}]\` dibungkus tanda kutip ekstra; hapus agar Quote Card PNG rapi.`);
            }
            const qw = countWords(q);
            if (qw < 8 || qw > 35) {
              warnings.push(`\`quotes[${i}]\` = ${qw} kata (ideal: 12–25 kata).`);
            }
          }
        });
      }
    } catch (e) {
      errors.push(`\`quotes_json\` JSON tidak valid: ${e.message}`);
    }
  }

  if (content.conclusion !== undefined && typeof content.conclusion === "string") {
    const cw = countWords(content.conclusion);
    if (cw < 50 || cw > 150) {
      warnings.push(`\`conclusion\` = ${cw} kata (ideal BOOK_CONTENT.md: 75–110 kata).`);
    }
  }

  // --- Validasi Durasi Baca Penuh (jika INSERT lengkap books + book_contents) ---
  if (isInsertMeta && isInsertContent && takeaways && concepts && quotes && whoIsItFor) {
    const quickTexts = [
      meta.synopsis,
      ...whoIsItFor,
      ...concepts.flatMap((c) => [c.title, c.explanation]),
      ...quotes,
      content.conclusion,
      ...takeaways.flatMap((t) => [t.title, t.quickSummary, t.keyNote]),
    ];
    const deepTexts = takeaways.flatMap((t) => t.deepContent);

    const quickWords = quickTexts.reduce((s, t) => s + countWords(t), 0);
    const deepWords = deepTexts.reduce((s, t) => s + countWords(t), 0);
    const totalWords = quickWords + deepWords;

    const calcQuickMin = estimateMinutes(quickWords);
    const calcDeepMin = estimateMinutes(totalWords);

    if (typeof meta.quick_time_minutes === "number" && meta.quick_time_minutes !== calcQuickMin) {
      errors.push(
        `\`quick_time_minutes\` (${meta.quick_time_minutes} mnt) != hasil hitung aktual (${calcQuickMin} mnt dari ${quickWords} kata).`
      );
    }
    if (typeof meta.reading_time_minutes === "number" && meta.reading_time_minutes !== calcDeepMin) {
      errors.push(
        `\`reading_time_minutes\` (${meta.reading_time_minutes} mnt) != hasil hitung aktual (${calcDeepMin} mnt dari ${totalWords} kata).`
      );
    }

    const range = getExpectedRangesForTakeawaysCount(takeaways.length);
    if (calcQuickMin < range.minQm || calcQuickMin > range.maxQm) {
      errors.push(
        `Durasi Kilat aktual ${calcQuickMin} mnt (${quickWords} kata) di luar rentang ${range.label} (${range.minQm}–${range.maxQm} mnt).`
      );
    }
    if (calcDeepMin < range.minDm || calcDeepMin > range.maxDm) {
      errors.push(
        `Durasi Mendalam aktual ${calcDeepMin} mnt (${totalWords} kata) di luar rentang ${range.label} (${range.minDm}–${range.maxDm} mnt).`
      );
    }
  }

  return { slug, errors, warnings };
}

function resolveTargetFiles(args) {
  const strict = args.includes("--strict");
  const all = args.includes("--all");
  const fileArgs = args.filter((a) => !a.startsWith("--"));

  if (fileArgs.length > 0) {
    return {
      strict,
      files: fileArgs.map((f) => (path.isAbsolute(f) ? f : path.resolve(process.cwd(), f))),
    };
  }

  const allSql = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => path.join(MIGRATIONS_DIR, f));

  if (all) {
    return { strict, files: allSql };
  }

  // Default: validasi seluruh migrasi penambahan buku (add_books) terbaru atau semua add_books
  const addBooksSql = allSql.filter((f) => path.basename(f).includes("add_books"));
  return { strict, files: addBooksSql.length > 0 ? addBooksSql : allSql.slice(-1) };
}

function main() {
  const { strict, files } = resolveTargetFiles(process.argv.slice(2));
  if (files.length === 0) {
    console.log("Tidak ada file migrasi SQL yang ditemukan untuk divalidasi.");
    process.exit(0);
  }

  let totalBooks = 0;
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const filePath of files) {
    const relName = path.relative(ROOT_DIR, filePath);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File tidak ditemukan: ${relName}`);
      totalErrors++;
      continue;
    }

    const sql = fs.readFileSync(filePath, "utf8");
    const entries = parseMigrationSql(sql);
    if (entries.length === 0) continue;

    console.log(`\n📄 ${relName} (${entries.length} buku)`);
    for (const entry of entries) {
      totalBooks++;
      const res = validateBookEntry(entry);
      totalErrors += res.errors.length;
      totalWarnings += res.warnings.length;

      if (res.errors.length === 0 && res.warnings.length === 0) {
        console.log(`  ✅ ${res.slug}`);
      } else if (res.errors.length === 0) {
        console.log(`  ⚠️  ${res.slug} (${res.warnings.length} peringatan)`);
        res.warnings.forEach((w) => console.log(`      [WARN] ${w}`));
      } else {
        console.log(`  ❌ ${res.slug} (${res.errors.length} error, ${res.warnings.length} peringatan)`);
        res.errors.forEach((e) => console.log(`      [ERR ] ${e}`));
        res.warnings.forEach((w) => console.log(`      [WARN] ${w}`));
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Ringkasan Validasi Konten Ringkasnya`);
  console.log(`Buku diperiksa : ${totalBooks}`);
  console.log(`Total Error    : ${totalErrors}`);
  console.log(`Total Warning  : ${totalWarnings}${strict ? " (mode --strict aktif)" : ""}`);
  console.log(`========================================`);

  if (totalErrors > 0 || (strict && totalWarnings > 0)) {
    process.exit(1);
  }
}

main();
