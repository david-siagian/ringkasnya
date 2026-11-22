import type { Article } from "@/types/article";

export const prinsipAnnaKarenina: Article = {
  slug: "prinsip-anna-karenina",
  title: "Prinsip Anna Karenina",
  subtitle:
    "Mengapa keberhasilan sebuah sistem butuh semua syarat terpenuhi sekaligus, sementara kegagalan cukup dipicu oleh satu celah saja.",
  term: "Prinsip Anna Karenina",
  aliases: ["Prinsip Anna Karenina", "Anna Karenina principle"],
  format: "bedah-istilah",
  category: "Sejarah & Peradaban",
  readingTimeMinutes: 4,
  shortDefinition:
    "Prinsip yang menyatakan bahwa keberhasilan suatu upaya kompleks menuntut seluruh faktor kunci berjalan serentak, sedangkan kekurangan pada satu faktor saja sudah cukup menggagalkan semuanya. Dipopulerkan Jared Diamond dari kalimat pembuka novel Anna Karenina karya Leo Tolstoy.",
  originLabel: "Leo Tolstoy (1877) → Jared Diamond (1997)",
  coverGradient: "from-stone-950 via-stone-900 to-amber-950",
  coverImage: "/images/articles/prinsip-anna-karenina.svg",
  accentBadge: "Bedah Istilah",
  publishedAt: "2026-11-22",
  relatedBookSlugs: ["guns-germs-and-steel", "why-nations-fail", "sapiens"],
  leadParagraph:
    "Mengapa kuda berhasil dijinakkan manusia ribuan tahun lalu, tetapi zebra—yang fisiknya sangat mirip—tidak pernah berhasil dijadikan hewan tunggangan? Untuk menjawab teka-teki ini, ahli biologi evolusioner Jared Diamond meminjam kalimat pembuka paling terkenal dalam sejarah sastra dunia.",
  sections: [
    {
      heading: "Dari Novel Klasik Rusia ke Sains",
      paragraphs: [
        "Pada 1877, sastrawan Rusia Leo Tolstoy membuka novel Anna Karenina dengan satu kalimat tajam: \"Semua keluarga yang bahagia itu serupa; setiap keluarga yang tidak bahagia menderita dengan caranya sendiri.\" Agar sebuah keluarga bahagia, banyak unsur harus selaras sekaligus—kepercayaan, komunikasi, nilai bersama, dan kestabilan hidup. Bila satu pilar penting itu runtuh, kebahagiaan keluarga bisa langsung goyah.",
        "Dalam Guns, Germs, and Steel (1997), Jared Diamond menamai pola ini Prinsip Anna Karenina. Ia melihat banyak fenomena alam dan sejarah bekerja dengan logika asimetris yang sama: ada banyak cara berbeda untuk gagal, tetapi hanya ada satu jalur sempit untuk berhasil.",
      ],
      highlightBox: {
        label: "Inti Rumusan",
        text: "Keberhasilan adalah hasil perkalian semua syarat penting. Bila ada enam syarat dan lima di antaranya sempurna, satu syarat yang bernilai nol tetap membuat hasil akhirnya nol.",
      },
    },
    {
      heading: "Mengapa Zebra Gagal Dijinakkan?",
      paragraphs: [
        "Dari 148 spesies mamalia darat pemakan tumbuhan berukuran besar di dunia, hanya 14 spesies yang berhasil didomestikasi sebelum abad ke-20. Bukan karena manusia di Afrika atau Amerika kurang terampil, melainkan karena hewan liar harus lolos enam syarat ketat sekaligus.",
        "Hewan itu tidak boleh terlalu boros pakan, harus cepat tumbuh dewasa (gajah butuh 15 tahun), mau berkembang biak di ruang terbatas (cheetah gagal di sini), tidak terlalu ganas seperti zebra yang suka menggigit tanpa melepas, tidak mudah panik seperti rusa saat dipagari, serta punya struktur kawanan hierarkis yang menerima manusia sebagai pemimpin.",
        "Zebra lulus soal pola makan dan kecepatan tumbuh, tetapi gagal fatal di watak agresif. Hanya segelintir hewan seperti kuda, sapi, domba, dan kambing yang lulus keenam syarat sekaligus—dan 13 dari 14 spesies itu kebetulan berasal dari Eurasia.",
        "Ketimpangan alam itulah yang memicu efek bola salju sejarah: benua yang lebih dulu punya hewan ternak besar otomatis lebih cepat memiliki tenaga pembajak sawah, pupuk alami, transportasi jarak jauh, hingga kekebalan tubuh terhadap kuman yang berasal dari hewan ternak.",
      ],
    },
    {
      heading: "Jejak di Dunia Kerja dan Kehidupan Sehari-hari",
      paragraphs: [
        "Pola yang sama bekerja pada bisnis maupun proyek tim. Sebuah rumah makan bisa punya rasa lezat dan tempat estetik, tetapi tetap sepi bila pelayanannya lambat atau arus kasnya bocor. Sebuah aplikasi dengan desain memukau pun akan ditinggalkan pengguna jika servernya sering lambat atau proses pendaftarannya membingungkan.",
        "Hal serupa tampak dalam program berskala besar seperti distribusi vaksin: keberhasilannya menuntut ketersediaan stok, rantai dingin penyimpanan yang terjaga hingga daerah terpencil, tenaga kesehatan terlatih, sekaligus kepercayaan masyarakat. Cukup satu mata rantai terputus, seluruh dampaknya langsung merosot drastis.",
        "Prinsip Anna Karenina mengajarkan kita berhenti meniru satu rahasia tunggal dari kisah sukses. Sebelum memulai proyek penting, tanyakan lebih dulu: \"Satu celah paling rapuh apa yang jika terjadi akan meruntuhkan keseluruhan rencana ini?\" Menutup satu lubang fatal sering kali jauh lebih berdampak daripada terus memoles bagian yang sudah bagus.",
      ],
    },
  ],
  keyTakeaways: [
    "Keberhasilan sistem kompleks menuntut seluruh syarat kunci terpenuhi serentak, sedangkan kegagalan cukup dipicu oleh satu celah.",
    "Hanya 14 dari 148 mamalia besar yang lolos enam syarat domestikasi sekaligus, menjelaskan timpangnya keunggulan pertanian awal antarbenua.",
    "Dalam bisnis dan proyek tim, prioritaskan menemukan dan menutup titik paling rapuh sebelum memoles kelebihan lain.",
  ],
};
