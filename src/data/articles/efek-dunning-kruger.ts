import type { Article } from "@/types/article";

export const efekDunningKruger: Article = {
  slug: "efek-dunning-kruger",
  title: "Efek Dunning-Kruger",
  subtitle:
    "Mengapa orang yang baru tahu sedikit justru sering merasa paling yakin, sementara para ahli cenderung lebih berhati-hati.",
  term: "Efek Dunning-Kruger",
  aliases: ["Efek Dunning-Kruger", "Dunning-Kruger", "Dunning-Kruger effect"],
  format: "bedah-istilah",
  category: "Nalar & Berpikir Kritis",
  readingTimeMinutes: 4,
  shortDefinition:
    "Bias kognitif ketika seseorang dengan kemampuan atau pengetahuan rendah pada suatu bidang justru melebih-lebihkan kemampuannya sendiri, karena ia belum memiliki cukup ilmu untuk menyadari batas ketidaktahuannya.",
  originLabel: "David Dunning & Justin Kruger (1999)",
  coverGradient: "from-slate-950 via-amber-950 to-stone-900",
  coverImage: "/images/articles/efek-dunning-kruger.svg",
  accentBadge: "Bedah Istilah",
  publishedAt: "2026-11-22",
  relatedBookSlugs: [
    "the-death-of-expertise",
    "think-again",
    "the-joy-of-science",
  ],
  leadParagraph:
    "Pada 1995 di Pittsburgh, seorang pria bernama McArthur Wheeler merampok dua bank di siang bolong tanpa topeng sambil tersenyum ke kamera pengawas. Saat ditangkap malam itu juga, ia benar-benar terkejut karena yakin olesan air perasan lemon di wajahnya akan membuatnya tak terlihat di kamera—seperti tinta rahasia di atas kertas.",
  sections: [
    {
      heading: "Beban Ganda Ketidaktahuan (Riset 1999)",
      paragraphs: [
        "Kisah nyata itu memicu psikolog Universitas Cornell, David Dunning dan Justin Kruger, meneliti pada 1999 bagaimana seseorang bisa keliru parah namun tetap sangat percaya diri. Mereka menguji mahasiswa dalam tata bahasa, logika, dan penilaian humor, lalu meminta peserta menebak peringkat skornya sendiri.",
        "Hasilnya konsisten: kelompok dengan skor terbawah (25% paling rendah) rata-rata mengira kemampuan mereka berada di atas rata-rata—sekitar persentil ke-62. Dunning dan Kruger menyebut penyebabnya sebagai \"beban ganda\": keterampilan yang dibutuhkan untuk mengerjakan tugas dengan benar adalah keterampilan yang sama yang dibutuhkan untuk menyadari kesalahan sendiri.",
      ],
      highlightBox: {
        label: "Salah Kaprah Populer",
        text: "Efek Dunning-Kruger bukan berarti orang bodoh lebih percaya diri daripada ahli. Dalam data aslinya, para ahli tetap menilai diri mereka lebih tinggi—hanya saja pemula melebih-lebihkan skornya jauh di atas kenyataan, sementara ahli cenderung sedikit meremehkan keunggulannya.",
      },
    },
    {
      heading: "Mengapa Makin Terasa di Era Internet?",
      paragraphs: [
        "Video berdurasi satu menit dan mesin pencari menciptakan ilusi pengetahuan cepat. Seseorang yang baru menonton tiga klip pendek tentang investasi, nutrisi, atau ekonomi makro langsung merasa paham gambaran besarnya—karena ia belum melihat ribuan variabel dan pengecualian di balik topik tersebut.",
        "Sebaliknya, dokter atau peneliti yang belajar belasan tahun justru terdengar lebih berhati-hati dengan kalimat seperti \"tergantung konteksnya\" atau \"berdasarkan data sejauh ini\". Di ruang rapat maupun media sosial, suara yang paling lantang dan sederhana sering tampak lebih meyakinkan daripada kehati-hatian seorang ahli.",
        "Bayangkan rapat proyek lintas divisi di kantor: orang yang baru membaca ringkasan satu halaman bisa dengan ringan menyarankan \"tinggal ganti sistemnya minggu depan\", sementara tim teknis yang paham kerumitan migrasi data dan risikonya justru tampak lebih tenang serta penuh pertimbangan. Tanpa disadari, kesederhanaan palsu sering terasa lebih menggoda daripada kenyataan yang bernuansa.",
      ],
    },
    {
      heading: "Cermin untuk Diri Kita Sendiri",
      paragraphs: [
        "Dunning menegaskan bahwa efek ini bukan ciri orang bodoh, melainkan jebakan universal yang dialami semua orang setiap kali melangkah ke luar bidang keahliannya. Insinyur hebat pun bisa terlalu yakin saat baru belajar gizi atau hukum, dan pebisnis sukses bisa terlalu percaya diri saat mengomentari kebijakan moneter.",
        "Menariknya, ketika peserta berskor rendah diberi pelatihan logika singkat, kemampuan sekaligus kesadaran mereka atas kesalahan masa lalu ikut meningkat. Artinya, obat paling manjur bagi rasa terlalu percaya diri yang keliru justru adalah belajar lebih dalam.",
        "Cara paling sehat menjaga diri adalah memisahkan pendapat dari ego, menguji pemahaman dengan menjelaskannya secara runtut tanpa catatan, serta membiasakan bertanya pada diri sendiri: \"Apa saja yang belum saya ketahui tentang topik ini?\" sebelum mengambil kesimpulan tegas.",
      ],
    },
  ],
  keyTakeaways: [
    "Efek Dunning-Kruger terjadi karena keterampilan untuk bekerja dengan benar sama dengan keterampilan untuk mendeteksi kesalahan sendiri.",
    "Bias ini bukan milik 'orang bodoh', melainkan titik buta alami siapa saja ketika baru menyentuh bidang di luar keahliannya.",
    "Melatih kerendahan hati intelektual dan mendengarkan umpan balik praktisi adalah cara paling efektif menjaga penilaian tetap akurat.",
  ],
};
