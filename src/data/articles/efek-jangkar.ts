import type { Article } from "@/types/article";

export const efekJangkar: Article = {
  slug: "efek-jangkar",
  title: "Efek Jangkar",
  subtitle:
    "Bagaimana satu angka pertama yang bahkan tak masuk akal bisa diam-diam membajak penilaian dan keputusan finansial kita.",
  term: "Efek Jangkar",
  aliases: ["Efek Jangkar", "Anchoring Effect", "Anchoring"],
  format: "bedah-istilah",
  category: "Psikologi & Perilaku",
  readingTimeMinutes: 3,
  shortDefinition:
    "Bias kognitif ketika manusia terlalu bergantung pada informasi atau angka pertama yang ia dengar (sang 'jangkar') sebagai patokan saat memperkirakan nilai, bernegosiasi, atau mengambil keputusan—meski angka awal itu acak atau tidak relevan.",
  originLabel: "Amos Tversky & Daniel Kahneman (1974)",
  coverGradient: "from-slate-950 via-sky-950 to-slate-900",
  coverImage: "/images/articles/efek-jangkar.svg",
  accentBadge: "Bedah Istilah",
  publishedAt: "2026-11-22",
  relatedBookSlugs: [
    "thinking-fast-and-slow",
    "predictably-irrational",
    "influence",
    "never-split-the-difference",
  ],
  leadParagraph:
    "Mengapa label \"Rp499.000 (dicoret dari Rp1.200.000)\" terasa jauh lebih menggoda dibanding barang yang sama yang langsung ditulis \"Rp499.000\"? Padahal uang yang keluar dari dompet persis sama. Jawabannya ada pada salah satu penemuan paling berpengaruh dalam psikologi modern: Efek Jangkar.",
  sections: [
    {
      heading: "Eksperimen Roda Keberuntungan (1974)",
      paragraphs: [
        "Pada 1974, psikolog Amos Tversky dan Daniel Kahneman memutar roda keberuntungan yang diam-diam dimodifikasi agar hanya berhenti di angka 10 atau 65 di depan mahasiswa. Setelah itu, peserta diminta menebak persentase negara Afrika di PBB.",
        "Secara logika, angka roda undian yang acak harusnya diabaikan. Namun peserta yang melihat angka 10 rata-rata menebak 25%, sedangkan yang melihat angka 65 rata-rata menebak 45%! Bahkan angka yang jelas-jelas tak relevan pun berhasil menarik perkiraan otak seperti jangkar kapal.",
      ],
      highlightBox: {
        label: "Mengapa Otak Terjebak?",
        text: "Sistem 1 secara otomatis membayangkan skenario yang membuat angka pertama tampak masuk akal, lalu Sistem 2 terlalu malas menyesuaikan perkiraan cukup jauh dari titik awalnya.",
      },
    },
    {
      heading: "Dari Meja Hakim hingga Harga Coret",
      paragraphs: [
        "Studi di Jerman menunjukkan hakim berpengalaman pun terpengaruh: untuk berkas kasus pencurian yang identik, hakim yang sebelumnya melempar dadu rekayasa bernilai 9 menjatuhkan vonis rata-rata 8 bulan, sementara yang melempar angka 3 hanya menjatuhkan 5 bulan. Efek ini bekerja di bawah alam sadar, sehingga hampir semua orang yang terpengaruh tetap merasa keputusannya murni objektif.",
        "Di keseharian, Efek Jangkar hadir di mana-mana: satu menu super mahal di daftar restoran agar menu lain terasa terjangkau, harga coret saat festival diskon, paket \"Pro Tahunan\" di aplikasi langganan, pilihan nominal bawaan di laman donasi daring, hingga investor yang enggan melepas saham merugi hanya karena terpaku pada harga beli awalnya.",
        "Di meja negosiasi kerja maupun jual-beli properti, angka pembuka yang disebut pertama kali langsung menjadi pusat gravitasi seluruh percakapan. Bahkan tulisan sederhana di rak supermarket seperti \"Maksimal 4 kaleng per pelanggan\" terbukti membuat pembeli mengambil lebih banyak dibanding tanpa batas, karena angka 4 diam-diam menjadi jangkar di kepala mereka.",
      ],
    },
    {
      heading: "Cara Melindungi Diri dari Jangkar Menyesatkan",
      paragraphs: [
        "Kahneman mengingatkan bahwa sekadar tahu tentang Efek Jangkar tidak otomatis membuat kita kebal, tetapi kita bisa memakai strategi penangkal yang konkret. Sebelum masuk negosiasi gaji atau membeli barang mahal, tentukan angka patokan Anda sendiri secara tertulis berdasarkan riset pasar sebelum mendengar penawaran pihak lawan. Jika lawan melempar angka pembuka yang ekstrem, jangan langsung menawar di dekat angka itu—mulai ulang percakapan dari data pembanding objektif.",
        "Saat berbelanja promo, tutup mata dari harga coret dan tanyakan: \"Tanpa melihat diskonnya, apakah barang ini memang sepadan dengan uang yang saya keluarkan hari ini?\" Untuk keputusan besar seperti membeli properti atau menyetujui proyek kerja, memberi jeda satu hari untuk membandingkan tiga referensi independen sangat efektif melepaskan tarikan angka pertama di kepala agar penilaian kita kembali jernih dan proporsional.",
      ],
    },
  ],
  keyTakeaways: [
    "Angka pertama yang kita dengar—meski acak atau tak relevan—diam-diam menjadi patokan penilaian kita selanjutnya.",
    "Efek Jangkar memengaruhi semua orang, dari pembeli ritel hingga hakim dan negosiator berpengalaman.",
    "Siapkan acuan nilai objektif sendiri sebelum bernegosiasi dan abaikan harga coret saat mengambil keputusan finansial.",
  ],
};
