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
    readingTimeMinutes: 5,
    shortDefinition:
      "Prinsip yang menyatakan bahwa keberhasilan suatu upaya kompleks menuntut seluruh faktor kunci berjalan serentak, sedangkan kekurangan pada satu faktor saja sudah cukup menggagalkan semuanya. Dipopulerkan Jared Diamond dari kalimat pembuka novel Anna Karenina karya Leo Tolstoy.",
    originLabel: "Leo Tolstoy (1877) → Jared Diamond (1997)",
  },
  {
    slug: "efek-dunning-kruger",
    term: "Efek Dunning-Kruger",
    aliases: ["Efek Dunning-Kruger", "Dunning-Kruger", "Dunning-Kruger effect"],
    category: "Nalar & Berpikir Kritis",
    readingTimeMinutes: 5,
    shortDefinition:
      "Bias kognitif ketika seseorang dengan kemampuan atau pengetahuan rendah pada suatu bidang justru melebih-lebihkan kemampuannya sendiri, karena ia belum memiliki cukup ilmu untuk menyadari batas ketidaktahuannya.",
    originLabel: "David Dunning & Justin Kruger (1999)",
  },
  {
    slug: "destruksi-kreatif",
    term: "Destruksi Kreatif",
    aliases: ["Destruksi Kreatif", "Creative Destruction"],
    category: "Ekonomi & Keuangan",
    readingTimeMinutes: 4,
    shortDefinition:
      "Proses pembaruan ekonomi ketika inovasi teknologi atau model bisnis baru menggantikan cara lama yang sudah mapan, sekaligus menciptakan peluang pertumbuhan baru dan menggeser pemain lama yang enggan beradaptasi.",
    originLabel: "Joseph Schumpeter (1942)",
  },
  {
    slug: "bias-konfirmasi",
    term: "Bias Konfirmasi",
    aliases: ["Bias Konfirmasi", "Confirmation Bias"],
    category: "Nalar & Berpikir Kritis",
    readingTimeMinutes: 4,
    shortDefinition:
      "Kecenderungan alami otak manusia untuk mencari, menafsirkan, dan mengingat informasi yang mendukung keyakinan yang sudah ada, sambil mengabaikan atau meremehkan bukti yang bertentangan dengannya.",
    originLabel: "Peter Wason (1960)",
  },
  {
    slug: "efek-jangkar",
    term: "Efek Jangkar",
    aliases: ["Efek Jangkar", "Anchoring Effect", "Anchoring"],
    category: "Psikologi & Perilaku",
    readingTimeMinutes: 4,
    shortDefinition:
      "Bias kognitif ketika manusia terlalu bergantung pada informasi atau angka pertama yang ia dengar (sang 'jangkar') sebagai patokan saat memperkirakan nilai, bernegosiasi, atau mengambil keputusan—meski angka awal itu acak atau tidak relevan.",
    originLabel: "Amos Tversky & Daniel Kahneman (1974)",
  },
  {
    slug: "adaptasi-hedonis",
    term: "Adaptasi Hedonis",
    aliases: ["Adaptasi Hedonis", "Hedonic Treadmill", "Hedonic Adaptation"],
    category: "Filsafat & Kebijaksanaan",
    readingTimeMinutes: 4,
    shortDefinition:
      "Kecenderungan manusia untuk cepat kembali ke tingkat kebahagiaan dasarnya setelah mengalami peristiwa positif maupun negatif yang besar—seperti berlari di atas treadmill yang membuat kita terus mengejar hal baru namun tetap berada di tempat yang sama.",
    originLabel: "Philip Brickman & Donald Campbell (1971)",
  },
  {
    slug: "eksperimen-invisible-gorilla",
    term: "Kebutaan Tanpa Atensi",
    aliases: [
      "Invisible Gorilla",
      "Inattentional Blindness",
      "Kebutaan Tanpa Atensi",
      "Eksperimen Gorila",
    ],
    category: "Nalar & Berpikir Kritis",
    readingTimeMinutes: 5,
    shortDefinition:
      "Fenomena psikologi kognitif ketika seseorang gagal menyadari stimulus visual yang sangat jelas dan tak terduga tepat di hadapannya, semata-mata karena kapasitas perhatiannya sedang tersedot penuh pada tugas mental lain.",
    originLabel: "Christopher Chabris & Daniel Simons (1999)",
  },
  {
    slug: "fomo-ai-di-dunia-kerja",
    term: "Perbatasan Bergerigi AI",
    aliases: [
      "Perbatasan Bergerigi",
      "Jagged Frontier",
      "Perbatasan Bergerigi AI",
      "Co-Intelligence",
    ],
    category: "Teknologi & Masa Depan",
    readingTimeMinutes: 5,
    shortDefinition:
      "Batas kemampuan kecerdasan buatan yang tidak rata: AI tampak sangat cerdas pada tugas rumit tertentu, namun mendadak keliru pada persoalan yang terlihat sepele bagi manusia sehingga menuntut pengujian dan pengawasan kritis.",
    originLabel: "Ethan Mollick & Tim Riset BCG–Harvard (2023)",
  },
  {
    slug: "manusia-egois-atau-kooperatif",
    term: "Altruisme Timbal Balik",
    aliases: [
      "Altruisme Timbal Balik",
      "Reciprocal Altruism",
      "Gen yang Egois",
      "Selfish Gene",
      "Homo Puppy",
    ],
    category: "Sains & Alam Semesta",
    readingTimeMinutes: 5,
    shortDefinition:
      "Mekanisme evolusi ketika individu membantu pihak lain yang bukan kerabat genetiknya dengan harapan bantuan serupa akan dibalas di kemudian hari, membentuk fondasi kerja sama dan kepercayaan sosial manusia.",
    originLabel:
      "Richard Dawkins (1976) · Yuval Noah Harari (2011) · Rutger Bregman (2019)",
  },
];
