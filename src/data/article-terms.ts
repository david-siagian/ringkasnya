import type { ArticleTermEntry } from "@/types/article";

/**
 * Registri ringan istilah artikel untuk dipakai di BookReader (client bundle),
 * sehingga BookReader tidak perlu mengimpor seluruh isi paragraf artikel.
 */
export const ARTICLE_TERMS: readonly ArticleTermEntry[] = [
  {
    slug: "prinsip-anna-karenina",
    term: "Prinsip Anna Karenina",
    aliases: ["Prinsip Anna Karenina", "Anna Karenina principle"],
    category: "Sejarah & Peradaban",
    readingTimeMinutes: 3,
    shortDefinition:
      "Prinsip yang menyatakan bahwa keberhasilan suatu upaya kompleks menuntut seluruh faktor kunci berjalan serentak, sedangkan kekurangan pada satu faktor saja sudah cukup menggagalkan semuanya. Dipopulerkan Jared Diamond dari kalimat pembuka novel Anna Karenina karya Leo Tolstoy.",
    originLabel: "Leo Tolstoy (1877) → Jared Diamond (1997)",
  },
  {
    slug: "efek-dunning-kruger",
    term: "Efek Dunning-Kruger",
    aliases: ["Efek Dunning-Kruger", "Dunning-Kruger", "Dunning-Kruger effect"],
    category: "Nalar & Berpikir Kritis",
    readingTimeMinutes: 3,
    shortDefinition:
      "Bias kognitif ketika seseorang dengan kemampuan atau pengetahuan rendah pada suatu bidang justru melebih-lebihkan kemampuannya sendiri, karena ia belum memiliki cukup ilmu untuk menyadari batas ketidaktahuannya.",
    originLabel: "David Dunning & Justin Kruger (1999)",
  },
  {
    slug: "destruksi-kreatif",
    term: "Destruksi Kreatif",
    aliases: ["Destruksi Kreatif", "Creative Destruction"],
    category: "Ekonomi & Keuangan",
    readingTimeMinutes: 3,
    shortDefinition:
      "Proses pembaruan ekonomi ketika inovasi teknologi atau model bisnis baru menggantikan cara lama yang sudah mapan, sekaligus menciptakan peluang pertumbuhan baru dan menggeser pemain lama yang enggan beradaptasi.",
    originLabel: "Joseph Schumpeter (1942)",
  },
  {
    slug: "bias-konfirmasi",
    term: "Bias Konfirmasi",
    aliases: ["Bias Konfirmasi", "Confirmation Bias"],
    category: "Nalar & Berpikir Kritis",
    readingTimeMinutes: 3,
    shortDefinition:
      "Kecenderungan alami otak manusia untuk mencari, menafsirkan, dan mengingat informasi yang mendukung keyakinan yang sudah ada, sambil mengabaikan atau meremehkan bukti yang bertentangan dengannya.",
    originLabel: "Peter Wason (1960)",
  },
  {
    slug: "efek-jangkar",
    term: "Efek Jangkar",
    aliases: ["Efek Jangkar", "Anchoring Effect", "Anchoring"],
    category: "Psikologi & Perilaku",
    readingTimeMinutes: 3,
    shortDefinition:
      "Bias kognitif ketika manusia terlalu bergantung pada informasi atau angka pertama yang ia dengar (sang 'jangkar') sebagai patokan saat memperkirakan nilai, bernegosiasi, atau mengambil keputusan—meski angka awal itu acak atau tidak relevan.",
    originLabel: "Amos Tversky & Daniel Kahneman (1974)",
  },
  {
    slug: "adaptasi-hedonis",
    term: "Adaptasi Hedonis",
    aliases: ["Adaptasi Hedonis", "Hedonic Treadmill", "Hedonic Adaptation"],
    category: "Filsafat & Kebijaksanaan",
    readingTimeMinutes: 3,
    shortDefinition:
      "Kecenderungan manusia untuk cepat kembali ke tingkat kebahagiaan dasarnya setelah mengalami peristiwa positif maupun negatif yang besar—seperti berlari di atas treadmill yang membuat kita terus mengejar hal baru namun tetap berada di tempat yang sama.",
    originLabel: "Philip Brickman & Donald Campbell (1971)",
  },
];
