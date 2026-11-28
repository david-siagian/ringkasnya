import type { Article } from "@/types/article";
import { prinsipAnnaKarenina } from "./articles/prinsip-anna-karenina";
import { efekDunningKruger } from "./articles/efek-dunning-kruger";
import { destruksiKreatif } from "./articles/destruksi-kreatif";
import { biasKonfirmasi } from "./articles/bias-konfirmasi";
import { efekJangkar } from "./articles/efek-jangkar";
import { adaptasiHedonis } from "./articles/adaptasi-hedonis";
import { eksperimenInvisibleGorilla } from "./articles/eksperimen-invisible-gorilla";
import { fomoAiDiDuniaKerja } from "./articles/fomo-ai-di-dunia-kerja";
import { manusiaEgoisAtauKooperatif } from "./articles/manusia-egois-atau-kooperatif";

const WORDS_PER_MINUTE = 200;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function withCalculatedReadingTime(article: Article): Article {
  const texts: string[] = [
    article.title,
    article.subtitle,
    article.leadParagraph,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      section.highlightBox?.label ?? "",
      section.highlightBox?.text ?? "",
    ]),
    ...article.keyTakeaways,
  ];

  const totalWords = texts.reduce((sum, text) => sum + countWords(text), 0);
  const readingTimeMinutes = Math.max(
    1,
    Math.round(totalWords / WORDS_PER_MINUTE)
  );

  return {
    ...article,
    readingTimeMinutes,
  };
}

const RAW_ARTICLES: Article[] = [
  prinsipAnnaKarenina,
  efekDunningKruger,
  destruksiKreatif,
  biasKonfirmasi,
  efekJangkar,
  adaptasiHedonis,
  eksperimenInvisibleGorilla,
  fomoAiDiDuniaKerja,
  manusiaEgoisAtauKooperatif,
];

export const ARTICLES: Article[] = RAW_ARTICLES.map((article, index) => ({
  article: withCalculatedReadingTime(article),
  index,
}))
  .sort((a, b) => {
    if (a.article.publishedAt !== b.article.publishedAt) {
      return b.article.publishedAt.localeCompare(a.article.publishedAt);
    }
    return b.index - a.index;
  })
  .map(({ article }) => article);

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getArticlesForBook(bookSlug: string): Article[] {
  return ARTICLES.filter((article) =>
    article.relatedBookSlugs.includes(bookSlug)
  );
}
