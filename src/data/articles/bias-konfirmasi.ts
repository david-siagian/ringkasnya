import type { Article } from "@/types/article";

export const biasKonfirmasi: Article = {
  slug: "bias-konfirmasi",
  title: "Bias Konfirmasi",
  subtitle:
    "Mengapa otak kita lebih gemar mencari pembenaran daripada kebenaran—dan bagaimana cara melatih diri agar tetap jernih.",
  term: "Bias Konfirmasi",
  aliases: ["Bias Konfirmasi", "Confirmation Bias"],
  format: "bedah-istilah",
  category: "Nalar & Berpikir Kritis",
  readingTimeMinutes: 4,
  shortDefinition:
    "Kecenderungan alami otak manusia untuk mencari, menafsirkan, dan mengingat informasi yang mendukung keyakinan yang sudah ada, sambil mengabaikan atau meremehkan bukti yang bertentangan dengannya.",
  originLabel: "Peter Wason (1960)",
  coverGradient: "from-slate-950 via-indigo-950 to-slate-900",
  coverImage: "/images/articles/bias-konfirmasi.svg",
  accentBadge: "Bedah Istilah",
  publishedAt: "2026-11-22",
  relatedBookSlugs: [
    "the-joy-of-science",
    "the-death-of-expertise",
    "thinking-fast-and-slow",
    "think-again",
  ],
  leadParagraph:
    "Saat Anda sudah naksir satu merek ponsel lalu membuka internet untuk \"riset objektif\", ulasan mana yang lebih dulu Anda klik: yang memuji kelebihannya atau yang membongkar kekurangannya? Tanpa sadar, manusia lebih sering bertindak seperti pengacara yang membela kesimpulan awal daripada ilmuwan yang menguji fakta.",
  sections: [
    {
      heading: "Eksperimen Deret Angka Peter Wason (1960)",
      paragraphs: [
        "Istilah Bias Konfirmasi diperkenalkan psikolog Inggris Peter Wason pada 1960 lewat eksperimen sederhana. Ia memberi peserta deret angka 2, 4, 6 yang mengikuti aturan rahasia, lalu mengizinkan peserta mengajukan deret lain sebanyak mungkin sebelum menebak aturannya.",
        "Hampir semua peserta menduga aturannya adalah \"bilangan genap bertambah dua\" dan hanya menguji deret seperti 8-10-12 atau 14-16-18. Begitu dijawab cocok, mereka langsung yakin—dan ternyata salah! Aturan sebenarnya cukup \"tiga angka apa saja yang nilainya meningkat\" (seperti 1-2-3 atau 5-19-100). Hampir tak ada peserta yang mencoba menguji deret yang berpotensi menyangkal tebakannya sendiri.",
      ],
      highlightBox: {
        label: "Pola Kerja Otak",
        text: "Saat informasi cocok dengan keyakinan kita, otak bertanya: \"Bolehkah saya memercayai ini?\" Saat bertentangan, otak langsung defensif dan bertanya: \"Haruskah saya memercayai ini?\"",
      },
    },
    {
      heading: "Mengapa Orang Cerdas Tidak Kebal?",
      paragraphs: [
        "Riset psikologi menunjukkan kecerdasan tinggi tidak otomatis membebaskan kita dari Bias Konfirmasi—bahkan orang yang pandai berargumen sering lebih mahir merangkai alasan logis untuk mempertahankan kekeliruannya. Itulah mengapa sains mewajibkan tinjauan sejawat dan uji buta ganda sebagai pagar pengaman dari tipuan otak sendiri.",
        "Di media sosial, bias ini diperkuat algoritma. Setiap kali kita menyukai satu sudut pandang, sistem menyodorkan puluhan konten serupa hingga kita duduk di dalam ruang gema buatan sendiri. Dalam investasi, wawancara kerja, hingga pesan viral di grup keluarga, Bias Konfirmasi membuat satu cerita yang cocok terasa jauh lebih meyakinkan daripada ratusan data pembanding.",
        "Fenomena yang menarik pun sering terjadi di ruang diskusi publik: dua orang yang membaca artikel atau data statistik yang persis sama justru kerap keluar dengan keyakinan awal yang makin kuat. Masing-masing hanya memungut kalimat yang menguntungkan posisinya dan melabeli bagian yang bertentangan sebagai tidak lengkap atau berat sebelah.",
        "Hal serupa kerap muncul di ruang kerja saat menilai orang lain: begitu seorang manajer memiliki kesan pertama negatif terhadap satu anggota tim, ia cenderung lebih mudah mengingat kesalahan kecil orang itu dan menganggap keberhasilannya sekadar kebetulan, padahal kesan pertama tersebut belum tentu mencerminkan kinerja sebenarnya.",
      ],
    },
    {
      heading: "Cara Praktis Melatih Kejernihan Berpikir",
      paragraphs: [
        "Kita tidak bisa menghapus Bias Konfirmasi sepenuhnya karena ia tertanam dalam cara otak menghemat energi, tetapi kita bisa membangun kebiasaan sederhana agar tidak mudah disetir olehnya. Sebelum mengambil keputusan penting—membeli aset, merekrut tim, atau membagikan berita—ajukan satu pertanyaan jujur: \"Bukti apa yang bisa membuat saya mengubah pikiran?\" Jika kita tidak bisa menyebut satu pun, mungkin kita sedang mempertahankan ego, bukan kebenaran.",
        "Biasakan juga mencari argumen terbaik dari pihak yang berbeda pendapat (bukan versi paling konyolnya untuk diejek), serta bangun lingkaran kecil rekan yang cukup jujur untuk mengkritik gagasan kita secara sehat. Sesekali menuliskan prediksi pribadi lalu mengeceknya beberapa bulan kemudian juga membantu ingatan kita tetap jujur pada fakta.",
      ],
    },
  ],
  keyTakeaways: [
    "Bias Konfirmasi membuat otak mencari bukti pembenar dan menerapkan standar bukti jauh lebih ketat pada informasi yang tidak kita sukai.",
    "Orang cerdas tetap rentan terhadap bias ini bila tidak melatih disiplin verifikasi terhadap keyakinannya sendiri.",
    "Cara paling ampuh melawannya adalah secara aktif mencari bukti penyangkal sebelum mengambil keputusan besar.",
  ],
};
