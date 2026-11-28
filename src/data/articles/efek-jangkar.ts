import type { Article } from "@/types/article";

export const efekJangkar: Article = {
  slug: "efek-jangkar",
  title: "Efek Jangkar: Terperangkap Kesan Pertama",
  subtitle:
    "Bagaimana satu angka pertama yang bahkan tak masuk akal bisa diam-diam membajak penilaian dan keputusan finansial kita.",
  term: "Efek Jangkar",
  aliases: ["Efek Jangkar", "Anchoring Effect", "Anchoring"],
  format: "bedah-istilah",
  category: "Psikologi & Perilaku",
  readingTimeMinutes: 5,
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
    "Mengapa label \"Rp499.000 (dicoret dari Rp1.200.000)\" terasa jauh lebih menggoda dibanding barang yang persis sama namun langsung ditulis \"Rp499.000\"? Padahal uang yang keluar dari dompet kita tidak berbeda sepeser pun. Jawabannya ada pada salah satu penemuan paling berpengaruh dalam psikologi modern: Efek Jangkar.",
  sections: [
    {
      heading: "Eksperimen Roda Keberuntungan (1974)",
      paragraphs: [
        "Pada 1974, dua psikolog perintis ekonomi perilaku, Amos Tversky dan Daniel Kahneman, merancang eksperimen sederhana yang mengguncang anggapan bahwa manusia selalu mengambil keputusan secara rasional. Di depan para mahasiswa, mereka memutar roda keberuntungan bernomor 0 sampai 100. Tanpa sepengetahuan peserta, roda itu telah dimodifikasi agar hanya bisa berhenti di dua angka: 10 atau 65.",
        "Begitu roda berhenti, peserta diminta menuliskan angka tersebut, lalu menjawab dua pertanyaan: apakah persentase negara-negara Afrika di PBB lebih tinggi atau lebih rendah dari angka roda itu? Lalu, berapa perkiraan persentase tepatnya?",
        "Secara logika murni, angka dari roda undian yang jelas-jelas acak seharusnya diabaikan sepenuhnya karena sama sekali tidak berhubungan dengan geografi dunia. Namun hasilnya mencengangkan: peserta yang melihat roda berhenti di angka 10 rata-rata menebak 25 persen, sedangkan peserta yang melihat angka 65 rata-rata menebak 45 persen! Bahkan angka acak yang tidak masuk akal pun sanggup menarik perkiraan otak manusia seperti jangkar kapal di dasar laut.",
      ],
      highlightBox: {
        label: "Mengapa Otak Terjebak?",
        text: "Menurut Daniel Kahneman, ada dua mekanisme yang bekerja bersamaan: Sistem 1 secara otomatis membayangkan skenario yang membuat angka pertama tampak masuk akal, lalu Sistem 2 yang analitis terlalu malas menyesuaikan perkiraan cukup jauh dari titik awalnya.",
      },
    },
    {
      heading: "Dari Meja Hakim hingga Negosiasi Properti",
      paragraphs: [
        "Jangan mengira Efek Jangkar hanya bekerja pada mahasiswa di ruang laboratorium. Dalam studi terkenal di Jerman, para hakim berpengalaman diminta membaca berkas kasus pencurian yang identik lalu menentukan lama hukuman penjara. Sebelum memutuskan, mereka diminta melempar sepasang dadu yang diam-diam telah direkayasa agar hanya memunculkan jumlah 3 atau 9.",
        "Hasilnya mengagetkan dunia hukum: hakim yang baru saja melempar angka 9 menjatuhkan vonis rata-rata 8 bulan penjara, sementara hakim yang melempar angka 3 hanya menjatuhkan rata-rata 5 bulan untuk kasus yang sama persis! Karena efek ini bekerja di bawah alam sadar, hampir seluruh hakim tetap yakin bahwa putusan mereka murni objektif dan tidak tersentuh oleh lemparan dadu.",
        "Di dunia nyata, hal serupa terjadi setiap hari di meja negosiasi gaji maupun transaksi properti. Pihak yang pertama kali menyebut angka pembuka langsung menciptakan pusat gravitasi bagi seluruh percakapan. Dalam riset terhadap agen properti berpengalaman, mengubah harga penawaran awal di brosur rumah terbukti menggeser taksiran \"nilai wajar\" para agen secara drastis—meski mereka bersikeras menilai rumah itu semata dari luas tanah dan lokasinya.",
      ],
    },
    {
      heading: "Jejak Halus di Dunia Belanja dan Keuangan",
      paragraphs: [
        "Industri ritel dan pemasaran memahami Efek Jangkar dengan sangat baik. Perhatikan buku menu di banyak restoran: sering kali ada satu hidangan super mahal yang jarang dipesan orang. Kehadirannya bukan semata untuk dijual, melainkan untuk menjadi jangkar tinggi sehingga menu-menu lain di bawahnya mendadak terasa sangat terjangkau.",
        "Strategi serupa muncul dalam harga coret saat festival diskon, paket \"Pro Tahunan\" yang diletakkan di sebelah paket reguler pada aplikasi langganan, hingga pilihan nominal bawaan pada halaman donasi daring. Bahkan tulisan sederhana di rak supermarket seperti \"Maksimal 4 kaleng per pelanggan\" terbukti membuat pembeli mengambil lebih banyak dibanding rak tanpa batasan, karena angka 4 diam-diam menjadi jangkar baru di kepala mereka.",
        "Di pasar keuangan, Efek Jangkar juga sering menjebak investor ritel. Banyak orang enggan menjual saham yang fundamentalnya sudah memburuk hanya karena mereka terpaku pada \"harga beli awal\" atau \"harga tertinggi tahun lalu\", lalu terus berharap nilainya kembali ke angka jangkar tersebut meski kondisi perusahaan sudah berubah total.",
      ],
    },
    {
      heading: "Cara Melindungi Diri dari Jangkar Menyesatkan",
      paragraphs: [
        "Kahneman mengingatkan satu kenyataan penting: sekadar mengetahui keberadaan Efek Jangkar tidak otomatis membuat kita kebal terhadapnya. Karena bias ini bekerja otomatis, kita membutuhkan langkah penangkal yang konkret sebelum angka pertama sempat membajak kepala kita.",
        "Pertama, dalam negosiasi gaji, jasa, atau jual-beli barang bernilai besar, selalu siapkan angka patokan Anda sendiri secara tertulis berdasarkan riset pasar sebelum mendengar penawaran pihak lawan. Jika lawan melempar angka pembuka yang terasa ekstrem atau tidak masuk akal, jangan langsung menawar di dekat angka tersebut. Tolak jangkar itu secara sopan dan mulai ulang percakapan dari data pembanding objektif.",
        "Kedua, saat berbelanja promo atau diskon besar, latih diri menutup mata dari harga coret. Ajukan satu pertanyaan sederhana: \"Tanpa melihat potongan harganya, apakah barang ini memang sepadan dengan uang yang saya keluarkan hari ini?\" Untuk keputusan finansial besar, memberi jeda minimal satu hari sambil membandingkan tiga referensi independen sangat efektif melepaskan tarikan angka pertama agar penilaian kita kembali jernih dan proporsional.",
      ],
    },
  ],
  keyTakeaways: [
    "Efek Jangkar terjadi ketika angka atau informasi pertama yang kita dengar—meski acak atau tidak relevan—menjadi patokan bawah sadar bagi penilaian selanjutnya.",
    "Bias ini memengaruhi semua orang, dari pembeli di pusat perbelanjaan hingga hakim, agen properti, dan negosiator berpengalaman.",
    "Harga coret, menu termahal di restoran, dan batas pembelian promo adalah contoh penerapan Efek Jangkar yang paling sering kita temui sehari-hari.",
    "Tentukan acuan nilai objektif secara tertulis sebelum bernegosiasi, abaikan harga coret, dan bandingkan beberapa referensi independen sebelum memutuskan.",
  ],
};
