import type { ArticleTermEntry } from "@/types/article";

export type TextSegment =
  | { type: "text"; value: string }
  | { type: "term"; value: string; entry: ArticleTermEntry };

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface CompiledAlias {
  aliasLower: string;
  entry: ArticleTermEntry;
}

interface CompiledMatcher {
  regex: RegExp;
  aliasMap: Map<string, ArticleTermEntry>;
}

const matcherCache = new WeakMap<readonly ArticleTermEntry[], CompiledMatcher | null>();

function getMatcher(terms: readonly ArticleTermEntry[]): CompiledMatcher | null {
  if (matcherCache.has(terms)) {
    return matcherCache.get(terms) ?? null;
  }

  const compiled: CompiledAlias[] = [];
  for (const entry of terms) {
    const candidates = [entry.term, ...entry.aliases]
      .map((item) => item.trim())
      .filter(Boolean);

    for (const candidate of candidates) {
      compiled.push({
        aliasLower: candidate.toLowerCase(),
        entry,
      });
    }
  }

  if (compiled.length === 0) {
    matcherCache.set(terms, null);
    return null;
  }

  // Urutkan dari frasa terpanjang agar pencocokan spesifik menang atas frasa pendek
  compiled.sort((a, b) => b.aliasLower.length - a.aliasLower.length);

  const aliasMap = new Map<string, ArticleTermEntry>();
  const uniquePatterns: string[] = [];
  for (const item of compiled) {
    if (!aliasMap.has(item.aliasLower)) {
      aliasMap.set(item.aliasLower, item.entry);
      uniquePatterns.push(escapeRegExp(item.aliasLower));
    }
  }

  const pattern = `(?<![\\p{L}\\p{N}])(${uniquePatterns.join("|")})(?![\\p{L}\\p{N}])`;
  const matcher: CompiledMatcher = {
    regex: new RegExp(pattern, "giu"),
    aliasMap,
  };

  matcherCache.set(terms, matcher);
  return matcher;
}

/**
 * Memecah teks biasa menjadi segmen teks dan tautan istilah artikel.
 * Hanya menyorot kemunculan pertama untuk tiap slug di dalam satu cakupan (`matchedSlugs`)
 * agar paragraf tetap bersih dan nyaman dibaca.
 */
export function segmentTextWithArticleTerms(
  text: string,
  terms: readonly ArticleTermEntry[],
  matchedSlugs?: Set<string>
): TextSegment[] {
  if (!text || terms.length === 0) {
    return [{ type: "text", value: text }];
  }

  const matcher = getMatcher(terms);
  if (!matcher) {
    return [{ type: "text", value: text }];
  }

  const seen = matchedSlugs ?? new Set<string>();
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  matcher.regex.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = matcher.regex.exec(text)) !== null) {
    const matchedText = match[0];
    const startIndex = match.index;
    const entry = matcher.aliasMap.get(matchedText.toLowerCase());

    if (!entry || seen.has(entry.slug)) {
      continue;
    }

    if (startIndex > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, startIndex),
      });
    }

    seen.add(entry.slug);
    segments.push({
      type: "term",
      value: matchedText,
      entry,
    });

    lastIndex = startIndex + matchedText.length;
  }

  if (lastIndex === 0) {
    return [{ type: "text", value: text }];
  }

  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return segments;
}
