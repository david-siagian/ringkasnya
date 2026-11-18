import { BookSummary, BookCategory } from "@/types/book";

export const CATEGORIES: BookCategory[] = [
  "Kebiasaan & Produktivitas",
  "Keuangan & Bisnis",
  "Psikologi & Mindset",
  "Kreativitas & Karier",
];

export const BOOKS: BookSummary[] = [
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    originalTitle: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    author: "James Clear",
    year: 2018,
    category: "Kebiasaan & Produktivitas",
    readingTimeMinutes: 12,
    quickTimeMinutes: 3,
    rating: 4.9,
    coverGradient: "from-amber-500 via-orange-500 to-red-600",
    coverAccent: "bg-amber-100 text-amber-900",
    badgeText: "Terpopuler #1",
    tagline:
      "Perubahan kecil sebesar 1% setiap hari yang menghasilkan dampak luar biasa dalam jangka panjang.",
    synopsis:
      "Sering kali kita mengira kesuksesan besar membutuhkan tindakan drastis. Lewat Atomic Habits, James Clear membuktikan sebaliknya: perubahan hidup justru lahir dari kebiasaan-kebiasaan kecil (atomik) yang dilakukan secara konsisten. Buku ini membedah cara kerja otak manusia dalam membentuk kebiasaan dan memberikan kerangka praktis 4 Kaidah Perubahan Perilaku.",
    whoIsItFor: [
      "Kamu yang sering membuat resolusi tahun baru tapi berhenti di minggu kedua.",
      "Pekerja atau mahasiswa yang ingin membangun rutinitas produktif tanpa merasa terbebani.",
      "Siapa pun yang ingin menghentikan kebiasaan buruk seperti menunda-nunda (prokrastinasi) atau kecanduan scrolling HP.",
    ],
    keyTakeaways: [
      {
        number: 1,
        title: "Kekuatan Efek Majemuk: Lebih Baik 1% Setiap Hari",
        quickSummary:
          "Perbaikan kecil 1% setiap hari mungkin tidak terlihat hari ini, tetapi dalam setahun Anda akan menjadi 37 kali lebih baik.",
        deepContent: [
          "Manusia cenderung melebih-lebihkan pentingnya satu momen besar dan meremehkan nilai dari perbaikan kecil setiap hari. Jika Anda membaik 1% setiap hari selama satu tahun, pada akhirnya Anda akan 37 kali lebih baik dibandingkan saat memulai.",
          "Sebaliknya, jika kebiasaan buruk membuat Anda menurun 1% saja setiap hari, Anda akan merosot hampir mendekati angka nol. Kebiasaan adalah 'bunga majemuk' dari pengembangan diri: dampaknya baru terasa luar biasa setelah melewati ambang batas waktu tertentu yang disebut Lembah Kekecewaan (Valley of Disappointment).",
        ],
        practicalTip:
          "Jangan langsung menargetkan baca 1 buku seminggu; mulailah dengan membaca 2 halaman saja setiap malam sebelum tidur.",
      },
      {
        number: 2,
        title: "Fokus pada Sistem dan Identitas, Bukan Sekadar Target",
        quickSummary:
          "Target menentukan hasil yang ingin Anda capai, tetapi sistem adalah proses harian yang benar-benar membawa Anda ke sana.",
        deepContent: [
          "Pemenang dan pecundang di sebuah kompetisi memiliki target yang sama: juara. Yang membedakan mereka bukanlah targetnya, melainkan sistem latihan hariannya. Lebih jauh lagi, perubahan perilaku yang paling bertahan lama adalah perubahan berbasis identitas.",
          "Alih-alih berkata 'Saya ingin lari pagi agar turun 5 kg' (berbasis hasil), ubah menjadi 'Saya adalah seorang pelari yang menjaga kesehatan tubuh' (berbasis identitas). Setiap tindakan kecil yang Anda lakukan adalah satu suara (vote) untuk identitas baru Anda.",
        ],
        practicalTip:
          "Tanyakan pada diri sendiri setiap kali akan mengambil keputusan: 'Apa yang akan dilakukan oleh orang yang sehat/produktif di situasi ini?'",
      },
      {
        number: 3,
        title: "Empat Kaidah Perubahan Perilaku",
        quickSummary:
          "Untuk membangun kebiasaan baik: buat jadi terlihat jelas, menarik, mudah, dan memuaskan.",
        deepContent: [
          "Setiap kebiasaan melewati empat tahapan neurologis: Petunjuk (Cue), Gairah (Craving), Tanggapan (Response), dan Ganjaran (Reward). Dari sini lahir 4 kaidah praktis:",
          "1) Menjadikannya Terlihat (Make it obvious): Desain lingkungan Anda agar petunjuk kebiasaan baik langsung terlihat di depan mata. 2) Menjadikannya Menarik (Make it attractive): Gabungkan hal yang perlu Anda lakukan dengan hal yang Anda sukai (Temptation Bundling). 3) Menjadikannya Mudah (Make it easy): Kurangi hambatan sekecil mungkin. 4) Menjadikannya Memuaskan (Make it satisfying): Berikan apresiasi instan setelah menyelesaikan kebiasaan.",
        ],
        practicalTip:
          "Untuk menghentikan kebiasaan buruk, balik keempat kaidah tersebut: buat jadi tak terlihat, tidak menarik, sulit dilakukan, dan mengecewakan.",
      },
      {
        number: 4,
        title: "Aturan Dua Menit & Habit Stacking",
        quickSummary:
          "Setiap kebiasaan baru seharusnya membutuhkan waktu kurang dari dua menit untuk dimulai, dan ditempelkan pada kebiasaan lama.",
        deepContent: [
          "Menumpuk kebiasaan (Habit Stacking) menggunakan rumus sederhana: 'Setelah saya [KEBIASAAN LAMA], saya akan [KEBIASAAN BARU]'. Misalnya: 'Setelah saya menyeduh kopi pagi, saya akan menulis 3 prioritas kerja hari ini.'",
          "Padukan ini dengan Aturan Dua Menit: kecilkan skala kebiasaan baru hingga bisa dimulai dalam 2 menit. 'Olahraga 30 menit' menjadi 'Memakai sepatu lari'. Begitu Anda sudah memulai langkah pertama, melanjutkan ke menit-menit berikutnya jauh lebih mudah.",
        ],
        practicalTip:
          "Jangan pernah bolos dua kali berturut-turut (Never Miss Twice). Gagal sekali adalah kecelakaan; gagal dua kali adalah awal dari kebiasaan baru yang buruk.",
      },
    ],
    actionChecklist: [
      "Tulis 1 identitas baru yang ingin saya bangun bulan ini (contoh: 'Saya adalah pembaca rutin').",
      "Buat 1 rumus Habit Stacking untuk rutinitas pagi saya besok.",
      "Terapkan Aturan 2 Menit: sederhanakan kebiasaan baru saya agar bisa dimulai dalam 120 detik.",
      "Siapkan lingkungan malam ini (misal: taruh buku di atas bantal atau botol minum di meja kerja).",
    ],
    quotes: [
      "Anda tidak naik ke tingkat tujuan Anda. Anda jatuh ke tingkat sistem Anda.",
      "Setiap tindakan yang Anda ambil adalah suara untuk tipe orang yang Anda inginkan.",
      "Kebiasaan adalah bunga majemuk dari perbaikan diri.",
    ],
    conclusion:
      "Kunci perubahan besar bukanlah motivasi yang meledak-ledak di awal, melainkan merancang sistem kecil yang begitu mudah sehingga Anda tetap bisa melakukannya bahkan di hari paling sibuk sekalipun.",
  },
  {
    slug: "psychology-of-money",
    title: "The Psychology of Money",
    originalTitle: "Timeless Lessons on Wealth, Greed, and Happiness",
    author: "Morgan Housel",
    year: 2020,
    category: "Keuangan & Bisnis",
    readingTimeMinutes: 11,
    quickTimeMinutes: 3,
    rating: 4.9,
    coverGradient: "from-emerald-600 via-teal-600 to-cyan-800",
    coverAccent: "bg-emerald-100 text-emerald-900",
    badgeText: "Wajib Baca Finansial",
    tagline:
      "Mengelola uang bukan soal seberapa pintar hitungan matematika Anda, melainkan bagaimana Anda mengendalikan perilaku.",
    synopsis:
      "Mengapa seorang petugas kebersihan sederhana bisa mewariskan tabungan jutaan dolar, sementara lulusan universitas elit di Wall Street justru bangkrut? Morgan Housel menjelaskan bahwa kesuksesan finansial bukanlah ilmu pasti seperti fisika, melainkan keterampilan lunak (soft skill) di mana cara Anda bersikap terhadap keserakahan, rasa takut, dan kesabaran jauh lebih penting daripada kecerdasan teknis.",
    whoIsItFor: [
      "Siapa pun yang ingin mencapai ketenangan pikiran dalam mengatur keuangan pribadi.",
      "Investor pemula maupun berpengalaman yang sering cemas saat pasar naik-turun.",
      "Pekerja yang merasa gajinya selalu habis karena terjebak gaya hidup (lifestyle inflation).",
    ],
    keyTakeaways: [
      {
        number: 1,
        title: "Kaya (Rich) vs. Makmur (Wealthy)",
        quickSummary:
          "Kaya adalah uang yang Anda belanjakan untuk dipamerkan; makmur adalah uang yang tidak terlihat karena disimpan dan diinvestasikan.",
        deepContent: [
          "Saat kita melihat seseorang mengendarai mobil mewah seharga Rp2 miliar, satu-satunya fakta yang kita tahu pasti adalah orang tersebut kini memiliki uang Rp2 miliar lebih sedikit (atau utang Rp2 miliar lebih banyak) dibanding sebelumnya.",
          "Kekayaan sejati (wealth) adalah aset finansial yang belum diubah menjadi barang konsumtif. Kemakmuran memberi Anda pilihan, fleksibilitas, dan kebebasan waktu—sesuatu yang jauh lebih berharga daripada barang mewah apa pun.",
        ],
        practicalTip:
          "Berhentilah menilai kesuksesan dari barang yang tampak di media sosial; fokuslah membangun dana darurat dan aset yang memberi Anda kendali waktu.",
      },
      {
        number: 2,
        title: "Mengetahui Kata 'Cukup'",
        quickSummary:
          "Keterampilan finansial tersulit adalah menghentikan tiang gawang keinginan agar tidak terus bergeser setiap kali penghasilan naik.",
        deepContent: [
          "Banyak orang hancur secara finansial bukan karena kurang uang, melainkan karena tidak punya batas 'cukup'. Membandingkan diri dengan orang yang lebih kaya adalah pertempuran yang mustahil dimenangkan karena langit selalu di atas langit.",
          "Ketika penghasilan Anda naik tetapi gaya hidup Anda ikut melonjak dengan kecepatan yang sama, tabungan Anda tetap nol. Rasa cukup bukanlah hidup pelit, melainkan kesadaran bahwa mempertaruhkan apa yang Anda butuhkan demi mengejar apa yang tidak Anda butuhkan adalah tindakan konyol.",
        ],
        practicalTip:
          "Tetapkan persentase tabungan otomatis setiap kali menerima kenaikan gaji sebelum Anda sempat meningkatkan gaya hidup.",
      },
      {
        number: 3,
        title: "Keajaiban Compounding Butuh Waktu & Ketahanan",
        quickSummary:
          "95% kekayaan bersih Warren Buffett diperoleh setelah ulang tahunnya yang ke-65. Rahasianya adalah bertahan lama di pasar.",
        deepContent: [
          "Warren Buffett memang investor hebat, tapi rahasia utamanya adalah ia mulai berinvestasi sejak usia 10 tahun dan terus bertahan hingga usia 90-an. Investasi yang bagus bukanlah tentang mencari imbal hasil tertinggi sekali waktu, melainkan imbal hasil yang cukup baik yang bisa Anda pertahankan selama puluhan tahun.",
          "Karena itu, kemampuan bertahan hidup (survival mindset)—memiliki dana darurat dan menghindari utang berisiko tinggi—adalah fondasi agar efek bunga majemuk bisa bekerja tanpa terputus.",
        ],
        practicalTip:
          "Pilih strategi investasi yang membuat Anda tetap bisa tidur nyenyak di malam hari saat ekonomi sedang guncang.",
      },
      {
        number: 4,
        title: "Dividen Tertinggi dari Uang adalah Kendali atas Waktu",
        quickSummary:
          "Kebahagiaan sejati dari uang adalah kemampuan bangun pagi dan berkata: 'Hari ini saya bisa melakukan apa pun yang saya mau.'",
        deepContent: [
          "Penelitian psikologi menunjukkan bahwa faktor pendorong kebahagiaan paling universal bukanlah gaji besar atau rumah mewah, melainkan perasaan memegang kendali atas hidup sendiri.",
          "Memiliki tabungan memberi Anda otonomi: Anda tidak panik jika mendadak sakit, berani menolak proyek yang toksik, dan punya waktu berkualitas bersama keluarga.",
        ],
        practicalTip:
          "Hitung dana darurat Anda dalam satuan 'bulan kebebasan hidup' (berapa bulan Anda bisa hidup tenang tanpa pemasukan aktif).",
      },
    ],
    actionChecklist: [
      "Sisihkan tabungan di awal gajian tanpa menunggu uang sisa di akhir bulan.",
      "Tentukan 1 pengeluaran 'gengsi' yang sebenarnya tidak menambah kebahagiaan saya, lalu pangkas.",
      "Pastikan dana darurat tersimpan di instrumen aman dan likuid minimal 3-6 bulan pengeluaran.",
      "Tulis tujuan keuangan jangka panjang agar tidak mudah FOMO pada tren investasi sesaat.",
    ],
    quotes: [
      "Menabung tidak membutuhkan alasan khusus untuk membeli sesuatu. Anda bisa menabung hanya demi ketenangan pikiran.",
      "Kekayaan adalah apa yang tidak Anda lihat.",
      "Mengendalikan waktu Anda adalah dividen tertinggi yang dibayarkan oleh uang.",
    ],
    conclusion:
      "Uang adalah alat untuk membeli kebebasan waktu dan ketenangan batin. Bersikaplah rendah hati saat beruntung, sisakan ruang untuk kesalahan (margin of safety), dan biarkan waktu menggandakan tabungan Anda.",
  },
  {
    slug: "deep-work",
    title: "Deep Work",
    originalTitle: "Rules for Focused Success in a Distracted World",
    author: "Cal Newport",
    year: 2016,
    category: "Kebiasaan & Produktivitas",
    readingTimeMinutes: 10,
    quickTimeMinutes: 3,
    rating: 4.8,
    coverGradient: "from-indigo-600 via-blue-700 to-slate-900",
    coverAccent: "bg-indigo-100 text-indigo-900",
    badgeText: "Fokus Maksimal",
    tagline:
      "Kemampuan fokus tanpa distraksi adalah kekuatan super paling langka dan bernilai tinggi di abad ke-21.",
    synopsis:
      "Di era notifikasi grup chat, email, dan media sosial yang tak pernah tidur, mayoritas pekerja terjebak dalam 'Shallow Work'—pekerjaan dangkal yang membuat kita merasa sibuk seharian namun tidak menghasilkan karya bermakna. Cal Newport memperkenalkan 'Deep Work': aktivitas profesional yang dilakukan dalam konsentrasi penuh bebas gangguan hingga mendorong kemampuan kognitif Anda ke batas maksimal.",
    whoIsItFor: [
      "Pekerja kreatif, programmer, penulis, dan pelajar yang sering kehilangan fokus karena notifikasi HP.",
      "Profesional yang merasa lelah bekerja seharian tetapi tugas utamanya justru belum selesai.",
      "Siapa saja yang ingin menguasai keahlian sulit dalam waktu lebih singkat.",
    ],
    keyTakeaways: [
      {
        number: 1,
        title: "Deep Work vs. Shallow Work",
        quickSummary:
          "Sibuk belum tentu produktif. Pekerjaan dangkal mudah ditiru, sedangkan kerja mendalam menciptakan nilai yang tak tergantikan.",
        deepContent: [
          "Shallow Work adalah tugas-tugas logistik ringan seperti membalas chat singkat, mengecek email berulang kali, atau rapat tanpa agenda jelas. Tugas ini bisa dilakukan sambil terdistraksi dan tidak melahirkan keahlian baru.",
          "Sebaliknya, Deep Work adalah saat Anda mengunci diri selama 90–120 menit penuh untuk merancang strategi, menulis kode kompleks, atau mempelajari topik rumit. Di ekonomi modern, mereka yang menguasai Deep Work akan memimpin.",
        ],
        practicalTip:
          "Pisahkan jam kerja Anda: pagi hari khusus untuk Deep Work sebelum membuka aplikasi chat atau email.",
      },
      {
        number: 2,
        title: "Bahaya Attention Residue (Residu Perhatian)",
        quickSummary:
          "Sekali saja Anda melirik HP saat sedang bekerja, butuh waktu 15–20 menit bagi otak untuk kembali ke fokus penuh.",
        deepContent: [
          "Banyak orang mengira melirik notifikasi WhatsApp selama 10 detik tidak berbahaya. Padahal, riset Sophie Leroy menunjukkan adanya 'Attention Residue': saat Anda berpindah dari Tugas A ke Tugas B (meski sebentar), sebagian kapasitas otak Anda masih tertinggal memikirkan pesan tersebut.",
          "Akibatnya, bekerja sambil bolak-balik mengecek pesan membuat IQ fungsional Anda turun drastis sepanjang hari.",
        ],
        practicalTip:
          "Saat sesi fokus berlangsung, letakkan HP di ruangan berbeda atau aktifkan mode Do Not Disturb.",
      },
      {
        number: 3,
        title: "Bangun Ritual Fokus & Jadwalkan Setiap Menit",
        quickSummary:
          "Jangan menunggu mood datang untuk fokus; buat jadwal blok waktu (time-blocking) dan ritual pembuka yang jelas.",
        deepContent: [
          "Mengandalkan niat saja akan menguras energi mental Anda. Buatlah ritual tetap: tentukan di mana Anda akan bekerja, berapa lama (misal 90 menit), aturan apa yang berlaku (tidak buka browser selain dokumen kerja), dan bagaimana Anda memulainya (misal segelas air hangat dan meja bersih).",
          "Gunakan metode Time-Blocking: rencanakan blok-blok waktu dalam hari Anda sehingga Anda selalu tahu apa yang harus dikerjakan berikutnya.",
        ],
        practicalTip:
          "Mulai dengan 1 blok Deep Work berdurasi 60 menit setiap pagi, lalu tingkatkan bertahap.",
      },
      {
        number: 4,
        title: "Ritual Tutup Hari Kerja (Shutdown Ritual)",
        quickSummary:
          "Istirahat total di malam hari sama pentingnya dengan fokus tinggi di siang hari.",
        deepContent: [
          "Otak manusia hanya mampu melakukan Deep Work murni sekitar 3–4 jam sehari bagi para ahli, dan 1–2 jam bagi pemula. Setelah jam kerja usai, lakukan 'Shutdown Ritual': tinjau daftar tugas, catat rencana untuk esok pagi, lalu tutup laptop sepenuhnya.",
          "Dengan memberi kepastian pada otak bahwa semua urusan kerja sudah tercatat rapi untuk besok, pikiran bawah sadar Anda bisa beristirahat penuh tanpa rasa cemas.",
        ],
        practicalTip:
          "Tentukan jam berhenti kerja yang tegas setiap sore agar energi mental Anda pulih 100% untuk keesokan hari.",
      },
    ],
    actionChecklist: [
      "Blokir 60-90 menit pertama di pagi hari khusus untuk 1 tugas terpenting (tanpa buka chat/medsos).",
      "Jauhkan smartphone dari jangkauan tangan saat sedang berada di sesi fokus.",
      "Kelompokkan urusan balas chat & email pada 2-3 waktu tertentu saja (batching).",
      "Lakukan Shutdown Ritual sore ini: tulis 3 prioritas untuk besok sebelum menutup laptop.",
    ],
    quotes: [
      "Kejelasan tentang apa yang penting memberikan kejelasan tentang apa yang tidak penting.",
      "Upaya memperdalam fokus akan gagal jika Anda tidak sekaligus memangkas ketergantungan pada distraksi.",
      "Sibuk yang tampak di permukaan sering kali hanyalah cara menutupi tidak adanya produktivitas sejati.",
    ],
    conclusion:
      "Fokus mendalam adalah otot mental yang harus dilatih. Kurangi kebisingan digital, lindungi jam-jam terbaik Anda setiap hari, dan hasilkan karya yang membanggakan.",
  },
  {
    slug: "show-your-work",
    title: "Show Your Work!",
    originalTitle: "10 Ways to Share Your Creativity and Get Discovered",
    author: "Austin Kleon",
    year: 2014,
    category: "Kreativitas & Karier",
    readingTimeMinutes: 9,
    quickTimeMinutes: 3,
    rating: 4.8,
    coverGradient: "from-rose-500 via-pink-600 to-purple-700",
    coverAccent: "bg-rose-100 text-rose-900",
    badgeText: "Karier & Personal Branding",
    tagline:
      "Anda tidak perlu menjadi jenius atau pakar dulu untuk mulai berbagi karya dan ditemukan oleh peluang besar.",
    synopsis:
      "Banyak orang enggan membagikan hasil belajar atau karyanya di internet karena takut dianggap pamer atau merasa 'belum ahli'. Austin Kleon membalik pola pikir tersebut: jangan promosi diri secara membosankan, tetapi dokumentasikan proses belajar Anda. Dengan membagikan proses di balik layar, Anda menarik orang-orang yang memiliki minat serupa dan membuka pintu peluang karier yang tak terduga.",
    whoIsItFor: [
      "Kreator pemula, freelancer, developer, atau mahasiswa yang ingin membangun portofolio online.",
      "Orang introvert yang tidak suka 'jualan diri' (self-promotion) tapi ingin karyanya dikenal.",
      "Siapa pun yang sedang mempelajari keahlian baru dan ingin mendokumentasikan perjalanannya.",
    ],
    keyTakeaways: [
      {
        number: 1,
        title: "Jadilah Amatir yang Terbuka (Scenius, Bukan Genius)",
        quickSummary:
          "Karya hebat jarang lahir dari satu orang jenius yang menyendiri, melainkan dari komunitas yang saling berbagi ide.",
        deepContent: [
          "Mitos 'jenius penyendiri' membuat kita takut tampil sebelum karya kita sempurna. Padahal, menjadi seorang amatir yang antusias memiliki keunggulan besar: Anda tidak takut mencoba hal baru, berani bertanya, dan rela belajar di depan umum.",
          "Saat seorang pemula membagikan apa yang baru ia pelajari hari ini, penjelasannya sering kali justru lebih mudah dipahami oleh sesama pemula dibanding penjelasan seorang profesor.",
        ],
        practicalTip:
          "Bagikan apa yang sedang Anda pelajari minggu ini, bukan menunggu sampai Anda meraih gelar master.",
      },
      {
        number: 2,
        title: "Dokumentasikan Proses, Bukan Hanya Produk Jadi",
        quickSummary:
          "Ajak orang melihat dapur tempat Anda berkarya—sketsa awal, kegagalan, catatan belajar, dan eksperimen Anda.",
        deepContent: [
          "Manusia tertarik pada cerita di balik sebuah karya. Alih-alih hanya memamerkan hasil akhir yang sudah dipoles rapi, tunjukkan proses pengerjaannya.",
          "Jadilah dokumentator dari apa yang Anda lakukan setiap hari: ambil tangkapan layar proyek yang sedang Anda bangun, tulis rangkuman buku yang baru Anda baca, atau ceritakan masalah teknis yang baru berhasil Anda pecahkan.",
        ],
        practicalTip:
          "Biasakan menyimpan catatan atau foto singkat dari progres kerja Anda hari ini.",
      },
      {
        number: 3,
        title: "Bagikan Sesuatu yang Kecil Setiap Hari",
        quickSummary:
          "Satu unggahan singkat setiap hari jauh lebih kuat daripada portofolio besar yang tak pernah dipublikasikan.",
        deepContent: [
          "Laporan harian (daily dispatch) tidak harus berupa esai panjang atau video berjam-jam. Saat masih di tahap awal: bagikan inspirasi Anda. Saat di tengah proses: bagikan metode kerja Anda. Saat selesai: bagikan hasil akhir dan pelajaran yang dipetik.",
          "Uji coba pengiriman harian: jika Anda ragu apakah sesuatu layak dibagikan, tanyakan 'Apakah ini bermanfaat atau menarik bagi setidaknya satu orang?' Jika ya, kirimkan!",
        ],
        practicalTip:
          "Tulis 1 paragraf ringkas atau 3 poin pelajaran dari pekerjaan Anda hari ini di blog, LinkedIn, atau X.",
      },
      {
        number: 4,
        title: "Ajarkan Apa yang Anda Ketahui",
        quickSummary:
          "Membagikan ilmu tidak membuat Anda kehilangan daya saing; justru menempatkan Anda sebagai rujukan terpercaya.",
        deepContent: [
          "Ketika seorang koki membagikan resep rahasianya secara gratis di internet, apakah restorannya bangkrut? Justru sebaliknya: orang semakin menghargai keahliannya dan antre datang ke restorannya.",
          "Saat Anda mengajarkan trik, tutorial, atau ringkasan ilmu yang Anda kuasai dengan tulus, Anda sedang membangun kepercayaan (trust) dan jaringan jangka panjang.",
        ],
        practicalTip:
          "Buat panduan singkat 'Cara saya menyelesaikan masalah X' untuk membantu rekan seprofesi Anda.",
      },
    ],
    actionChecklist: [
      "Tulis 1 hal baru yang saya pelajari minggu ini dalam 3-5 kalimat sederhana.",
      "Bagikan 1 cuplikan proses kerja/belajar saya hari ini (bukan hasil sempurna).",
      "Buat halaman profil/portofolio sederhana (atau rapikan bio) agar orang mudah menghubungi saya.",
      "Beri apresiasi dan sebutkan sumber inspirasi dari kreator lain yang membantu saya belajar.",
    ],
    quotes: [
      "Agar mudah ditemukan oleh peluang, Anda harus bisa ditemukan terlebih dahulu.",
      "Ubah alur pikiran Anda dari mempromosikan diri menjadi berbagi nilai.",
      "Ajarkan apa yang Anda tahu. Berbagi ilmu tidak mengurangi nilai Anda, melainkan melipatgandakannya.",
    ],
    conclusion:
      "Berhentilah menunggu sampai merasa 'siap sempurna'. Mulailah mendokumentasikan proses belajar Anda hari ini, bagikan dengan murah hati, dan biarkan karya Anda menjadi magnet bagi peluang masa depan.",
  },
  {
    slug: "filosofi-teras",
    title: "Filosofi Teras",
    originalTitle: "Filsafat Yunani-Romawi Kuno untuk Mental Tangguh Masa Kini",
    author: "Henry Manampiring",
    year: 2018,
    category: "Psikologi & Mindset",
    readingTimeMinutes: 10,
    quickTimeMinutes: 3,
    rating: 4.9,
    coverGradient: "from-sky-600 via-blue-600 to-indigo-800",
    coverAccent: "bg-sky-100 text-sky-900",
    badgeText: "Best-Seller Indonesia",
    tagline:
      "Cara menjaga ketenangan batin dan mengatasi overthinking dengan membedakan apa yang bisa dan tidak bisa kita kendalikan.",
    synopsis:
      "Mengapa kita begitu mudah stres karena macet, komentar orang lain di media sosial, atau masa depan yang belum tentu terjadi? Lewat bahasa yang akrab dan relevan dengan kehidupan sehari-hari di Indonesia, Henry Manampiring memperkenalkan Stoisisme (Filosofi Teras)—sebuah panduan praktis berusia 2.000 tahun untuk melatih ketangguhan mental dan menghentikan emosi negatif yang merusak kebahagiaan.",
    whoIsItFor: [
      "Kamu yang sering overthinking, mudah cemas, atau gampang terpancing emosi oleh ulah orang lain.",
      "Pekerja yang menghadapi tekanan tinggi dan ingin memiliki mental yang tenang.",
      "Siapa pun yang ingin belajar filsafat praktis tanpa istilah rumit yang memusingkan.",
    ],
    keyTakeaways: [
      {
        number: 1,
        title: "Dikotomi Kendali: Kunci Utama Ketenangan Batin",
        quickSummary:
          "Dalam hidup, ada hal yang berada di bawah kendali kita dan ada yang tidak. Fokuslah 100% hanya pada yang bisa Anda kendalikan.",
        deepContent: [
          "Filsuf Epictetus mengajarkan bahwa sumber utama penderitaan batin manusia adalah keingintahuan dan usaha mengontrol hal-hal di luar kendali kita: cuaca, kemacetan, opini orang lain, hasil akhir wawancara kerja, hingga kondisi ekonomi global.",
          "Hal yang sepenuhnya berada di bawah kendali kita hanyalah: pikiran kita, persepsi kita, ucapan kita, dan usaha terbaik kita. Menggantungkan kebahagiaan pada hal di luar kendali sama saja menyerahkan kunci ketenangan hidup Anda kepada orang lain.",
        ],
        practicalTip:
          "Saat mulai stres, tarik napas dan tanyakan: 'Apakah hal ini ada di bawah kendali saya?' Jika tidak, lepaskan.",
      },
      {
        number: 2,
        title: "Peristiwa Itu Netral, Persepsi Kitalah yang Memberi Makna",
        quickSummary:
          "Kita tidak terganggu oleh suatu kejadian, melainkan oleh opini kita sendiri tentang kejadian tersebut.",
        deepContent: [
          "Ketika hujan turun saat Anda hendak pergi, hujan itu sendiri adalah peristiwa alam yang netral. Yang membuat Anda marah adalah persepsi Anda: 'Hujan ini merusak hariku!'",
          "Stoisisme mengajarkan teknik S-T-A-R (Stop, Think & Assess, Respond): berhenti sejenak saat emosi muncul, periksa apakah pikiran kita rasional atau sekadar asumsi berlebihan, baru kemudian memilih respons yang dewasa.",
        ],
        practicalTip:
          "Latih jeda 5 detik sebelum bereaksi terhadap kabar buruk atau pesan yang menjengkelkan.",
      },
      {
        number: 3,
        title: "Premeditatio Malorum: Antisipasi Tanpa Panik",
        quickSummary:
          "Bayangkan skenario terburuk secara rasional agar Anda siap menghadapinya dan lebih bersyukur atas apa yang Anda miliki.",
        deepContent: [
          "Alih-alih berpura-pura semuanya akan selalu berjalan mulus, para filsuf Stoa meluangkan waktu untuk membayangkan kemungkinan kendala yang bisa terjadi hari ini: rapat yang alot, proyek yang ditolak, atau rekan kerja yang tidak kooperatif.",
          "Tujuannya bukan menjadi pesimis, melainkan menyiapkan rencana cadangan (Plan B) serta melatih mental agar tidak kaget ketika masalah benar-benar datang.",
        ],
        practicalTip:
          "Sebelum memulai proyek penting, tulis 2 risiko yang mungkin muncul beserta langkah antisipasinya.",
      },
      {
        number: 4,
        title: "Amor Fati: Mencintai Takdir dan Berfokus pada Solusi",
        quickSummary:
          "Jangan hanya menerima apa yang sudah terjadi, tetapi rangkul kejadian tersebut sebagai bahan bakar untuk bertumbuh.",
        deepContent: [
          "Masa lalu adalah sesuatu yang 100% berada di luar kendali kita. Mengeluhkan apa yang sudah telanjur terjadi hanya menguras energi tanpa mengubah keadaan sedikit pun.",
          "Prinsip Amor Fati mengajak kita melihat setiap rintangan sebagai kesempatan melatih kebajikan: kesabaran, keberanian, dan kebijaksanaan.",
        ],
        practicalTip:
          "Ganti pertanyaan 'Kenapa ini menimpa saya?' menjadi 'Apa langkah terbaik yang bisa saya lakukan sekarang?'",
      },
    ],
    actionChecklist: [
      "Identifikasi 1 masalah yang sedang saya cemaskan, lalu pisahkan mana bagian yang bisa saya kendalikan dan mana yang tidak.",
      "Praktikkan metode S-T-A-R (Stop, Think, Assess, Respond) saat menghadapi situasi menjengkelkan hari ini.",
      "Kurangi kebiasaan mengeluh selama 24 jam penuh dan ganti dengan tindakan solutif.",
      "Tuliskan 3 hal sederhana yang saya syukuri malam ini sebelum tidur.",
    ],
    quotes: [
      "Manusia tidak terganggu oleh peristiwa, tetapi oleh opininya sendiri tentang peristiwa itu.",
      "Kebahagiaan hidupmu bergantung pada kualitas pikiranmu.",
      "Menggantungkan kebahagiaan pada hal di luar kendali adalah resep pasti menuju kekecewaan.",
    ],
    conclusion:
      "Ketenangan batin bukanlah hidup tanpa masalah, melainkan kemampuan memfokuskan energi pada pikiran dan tindakan kita sendiri, sambil berdamai dengan segala hal di luar kendali kita.",
  },
  {
    slug: "essentialism",
    title: "Essentialism",
    originalTitle: "The Disciplined Pursuit of Less",
    author: "Greg McKeown",
    year: 2014,
    category: "Kebiasaan & Produktivitas",
    readingTimeMinutes: 9,
    quickTimeMinutes: 3,
    rating: 4.8,
    coverGradient: "from-stone-700 via-neutral-800 to-zinc-900",
    coverAccent: "bg-stone-200 text-stone-900",
    badgeText: "Seni Memilih Prioritas",
    tagline:
      "Bukan tentang bagaimana menyelesaikan lebih banyak hal, melainkan bagaimana melakukan hal yang tepat secara maksimal.",
    synopsis:
      "Jika Anda tidak menentukan prioritas hidup Anda sendiri, maka orang lain yang akan menentukannya untuk Anda. Greg McKeown menunjukkan bahwa alasan banyak orang pintar gagal mencapai terobosan besar adalah karena mereka mencoba melakukan terlalu banyak hal sekaligus. Essentialism mengajarkan disiplin memangkas 90% kebisingan agar Anda bisa mengerahkan energi terbaik pada 10% hal yang benar-benar esensial.",
    whoIsItFor: [
      "Kamu yang sering merasa 'tidak enak menolak' (people pleaser) hingga kewalahan dengan urusan orang lain.",
      "Pemimpin tim, manajer, atau pengusaha yang ingin menyederhanakan fokus bisnis.",
      "Siapa pun yang memiliki daftar to-do list terlalu panjang namun merasa jalan di tempat.",
    ],
    keyTakeaways: [
      {
        number: 1,
        title: "Lebih Sedikit Namun Lebih Baik (Less, But Better)",
        quickSummary:
          "Mengerahkan 100% energi ke satu arah menghasilkan kemajuan jauh lebih besar daripada memecah energi ke sepuluh arah.",
        deepContent: [
          "Bayangkan Anda memiliki energi sebesar 10 poin. Jika Anda membaginya ke 10 proyek berbeda, setiap proyek hanya maju 1 milimeter. Namun jika Anda memusatkan seluruh 10 poin ke satu tujuan esensial, Anda membuat terobosan besar.",
          "Seorang Esensialis tidak bertanya 'Bagaimana saya bisa melakukan keduanya?', melainkan 'Trade-off (pengorbanan) mana yang siap saya pilih?'",
        ],
        practicalTip:
          "Pilih maksimal 1 prioritas utama (MIT - Most Important Task) yang wajib selesai setiap harinya.",
      },
      {
        number: 2,
        title: "Aturan 90 Persen dalam Mengambil Keputusan",
        quickSummary:
          "Jika sebuah peluang atau ajakan nilainya di bawah 90 dari 100, anggap nilainya 0 dan tolaklah dengan sopan.",
        deepContent: [
          "Kita sering terjebak pada pilihan-pilihan 'tanggung' yang nilainya 60 atau 70—cukup menarik tapi bukan yang benar-benar kita inginkan. Akibatnya, jadwal kita penuh dengan hal biasa-biasa saja hingga tidak ada ruang tersisa ketika peluang bernilai 95 datang.",
          "Gunakan kriteria ketat: jika itu bukan 'Hell Yes!' (Sangat Ya!), maka jawabannya adalah 'Tidak'.",
        ],
        practicalTip:
          "Beri skor 1-100 sebelum menyanggupi komitmen baru; tolak semua yang skornya di bawah 90.",
      },
      {
        number: 3,
        title: "Kekuatan Berkata 'Tidak' dengan Elegan",
        quickSummary:
          "Keberanian menolak permintaan yang tidak esensial adalah syarat mutlak untuk berkata 'Ya' pada hal yang penting.",
        deepContent: [
          "Banyak orang takut berkata 'tidak' karena khawatir merusak hubungan. Padahal, menyanggupi sesuatu dengan setengah hati lalu menyelesaikannya secara buruk justru lebih merusak reputasi.",
          "Anda bisa menolak secara sopan dan profesional, misalnya: 'Terima kasih atas kepercayaannya, namun saat ini saya sedang fokus menyelesaikan proyek X sehingga belum bisa bergabung.'",
        ],
        practicalTip:
          "Pisahkan keputusan dari hubungan: menolak sebuah permintaan bukan berarti menolak orangnya.",
      },
    ],
    actionChecklist: [
      "Coret 3 tugas kurang penting dari daftar pekerjaan saya minggu ini.",
      "Gunakan Aturan 90% saat mengevaluasi ajakan rapat atau proyek baru.",
      "Latih 1 kalimat penolakan sopan untuk menjaga waktu fokus saya.",
      "Sediakan waktu hening 15 menit minggu ini untuk meninjau ulang apa yang benar-benar penting.",
    ],
    quotes: [
      "Jika Anda tidak memprioritaskan hidup Anda, orang lain yang akan melakukannya.",
      "Kebijaksanaan hidup terdiri dari eliminasi hal-hal yang tidak esensial.",
      "Jika jawabannya bukan 'Ya yang tegas', maka jawabannya adalah 'Tidak'.",
    ],
    conclusion:
      "Hidup yang bermakna lahir dari keberanian memilih. Berhentilah mencoba melakukan segalanya untuk semua orang, dan curahkan waktu terbaik Anda pada hal-hal yang benar-benar berarti.",
  },
];

export function getBookBySlug(slug: string): BookSummary | undefined {
  return BOOKS.find((book) => book.slug === slug);
}
