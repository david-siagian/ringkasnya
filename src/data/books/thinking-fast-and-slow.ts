import type { BookSummary } from "@/types/book";

export const thinkingFastAndSlow: BookSummary = {
  slug: "thinking-fast-and-slow",
  title: "Thinking, Fast and Slow",
  originalTitle: "Berpikir Cepat dan Lambat",
  author: "Daniel Kahneman",
  year: 2011,
  category: "Psikologi & Perilaku",
  readingTimeMinutes: 17,
  quickTimeMinutes: 6,
  rating: 4.9,
  coverGradient: "from-indigo-950 via-indigo-900 to-blue-900",
  coverAccent: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-300",
  coverImage: "/images/covers/thinking-fast-and-slow.svg",
  badgeText: "Psikologi Kognitif",
  tagline:
    "Mengenali dua sistem kerja otak agar tidak mudah terjebak bias, ilusi, dan keputusan impulsif.",
  synopsis:
    "Mengapa orang cerdas sekalipun sering mengambil keputusan finansial atau hidup yang keliru? Peraih Nobel Ekonomi Daniel Kahneman membedah pikiran manusia menjadi dua sistem: Sistem 1 yang bekerja cepat, otomatis, dan emosional, serta Sistem 2 yang bekerja lambat, logis, dan penuh usaha. Melalui puluhan eksperimen psikologi klasik, buku ini membongkar berbagai bias kognitif tersembunyi sekaligus memberi panduan praktis agar kita tahu kapan harus memercayai intuisi dan kapan wajib mengaktifkan analisis mendalam.",
  whoIsItFor: [
    "Profesional, manajer, dan pemilik usaha yang sering mengambil keputusan strategis di bawah tekanan waktu dan ketidakpastian tinggi.",
    "Investor dan perencana keuangan yang ingin menghindari jebakan emosi seperti panik menjual saat pasar turun atau terlalu percaya diri saat untung.",
    "Pembaca yang ingin memahami mengapa kita mudah terpengaruh iklan, pembingkaian berita (framing), atau angka jangkar saat berbelanja.",
    "Siapa saja yang ingin melatih kemampuan berpikir kritis sehari-hari dan mengurangi penyesalan akibat keputusan impulsif.",
    "Mahasiswa psikologi, ekonomi perilaku, dan desain produk yang ingin memahami cara kerja otak manusia dalam menilai risiko serta peluang.",
  ],
  keyTakeaways: [
    {
      number: 1,
      title: "Sistem 1 vs Sistem 2: Dua Mesin di Dalam Kepala",
      quickSummary:
        "Otak kita memiliki dua mode operasi yang terus berinteraksi. Sistem 1 bekerja sangat cepat, otomatis, tanpa usaha sadar, dan mengandalkan asosiasi serta emosi—misalnya langsung mengenali wajah marah atau menjawab 2 + 2. Sistem 2 bekerja lambat, analitis, membutuhkan konsentrasi penuh, dan mudah lelah—seperti menghitung 17 x 24 atau memeriksa klausul kontrak. Masalahnya, Sistem 2 cenderung malas sehingga terlalu sering menerima mentah-mentah kesimpulan cepat dari Sistem 1 tanpa memeriksanya ulang.",
      deepContent: [
        "Ketika Anda melihat foto seseorang yang berteriak dengan alis berkerut, Anda tidak perlu menganalisis ciri wajahnya satu per satu untuk tahu ia sedang marah. Kesimpulan itu muncul seketika dalam hitungan milidetik berkat kerja Sistem 1. Sebaliknya, jika Anda diminta menghitung hasil perkalian 17 dikali 24 tanpa kalkulator, detak jantung sedikit meningkat, pupil mata melebar, dan Anda harus mengerahkan perhatian penuh. Itulah Sistem 2 yang sedang bekerja keras memproses informasi.",
        "Pembagian tugas ini sebenarnya sangat efisien bagi kelangsungan hidup manusia. Bayangkan jika setiap kali menyetir mobil di jalan ramai atau berjalan di trotoar kita harus menganalisis jarak setiap objek secara matematis; otak kita akan langsung kelelahan dalam beberapa menit. Sistem 1 menangani ribuan tugas rutin setiap hari sehingga energi Sistem 2 bisa dihemat untuk masalah kompleks yang memang membutuhkan ketelitian ekstra serta pertimbangan matang.",
        "Namun efisiensi ini memiliki titik lemah besar yang disebut Kahneman sebagai hukum usaha terkecil. Karena Sistem 2 membutuhkan banyak energi mental, ia cenderung malas dan hanya aktif ketika Sistem 1 benar-benar kebingungan atau ada sinyal bahaya yang jelas. Ketika kita lelah, lapar, kurang tidur, atau terdistraksi banyak notifikasi, kendali Sistem 2 melemah drastis—seperti dibuktikan dalam studi terhadap hakim yang jauh lebih sering menolak permohonan pembebasan bersyarat tepat sebelum jam makan siang.",
        "Kahneman juga menunjukkan betapa mudahnya Sistem 1 tertipu oleh ilusi kognitif, misalnya dalam pertanyaan klasik pemukul dan bola: jika harga pemukul dan bola totalnya Rp110.000, dan pemukul lebih mahal Rp100.000 dari bola, berapa harga bola? Sistem 1 langsung berteriak 'Rp10.000!' karena terasa cepat dan rapi. Padahal jika Sistem 2 mau memeriksa sebentar dengan aljabar sederhana, jawabannya adalah Rp5.000 dan Rp105.000.",
        "Dalam kehidupan sehari-hari, menyadari adanya dua sistem ini membantu kita tidak langsung percaya pada 'kesan pertama' dalam keputusan penting. Saat menerima kabar mengejutkan di grup percakapan atau melihat promo diskon besar-besaran yang hampir berakhir, yang bereaksi pertama kali adalah Sistem 1. Memberi jeda sejenak memberi kesempatan bagi Sistem 2 untuk memeriksa fakta, konteks, dan konsekuensi jangka panjangnya sebelum Anda bertindak.",
      ],
      keyNote:
        "Saat tubuh lelah, lapar, atau terburu-buru, Sistem 2 yang berpikir teliti ikut melemah—sehingga keputusan penting lebih mudah dikendalikan oleh reaksi spontan Sistem 1.",
    },
    {
      number: 2,
      title: "Jebakan Heuristik dan Penggantian Pertanyaan",
      quickSummary:
        "Ketika dihadapkan pada pertanyaan yang sulit dan butuh hitungan matang, Sistem 1 diam-diam menggantinya dengan pertanyaan lain yang jauh lebih mudah tanpa kita sadari. Alih-alih menilai kompetensi seorang kandidat berdasarkan rekam jejak data, kita sering menggantinya dengan pertanyaan mudah: 'Seberapa meyakinkan penampilannya hari ini?' Kebiasaan jalan pintas mental atau heuristik ini memang menghemat waktu, tetapi sering memicu bias sistematis yang menyesatkan penilaian kita dalam karier maupun bisnis.",
      deepContent: [
        "Salah satu contoh paling terkenal adalah heuristik ketersediaan. Ketika orang diminta menilai seberapa besar risiko kecelakaan pesawat dibanding kecelakaan mobil atau risiko serangan hiu dibanding tertimpa kelapa, banyak yang menilai pesawat dan hiu jauh lebih berbahaya hanya karena beritanya sangat dramatis dan mudah diingat. Otak diam-diam mengganti pertanyaan statistik yang sulit dengan pertanyaan mudah: 'Seberapa cepat contoh kejadiannya muncul di ingatan saya saat ini?'",
        "Bentuk jalan pintas lainnya adalah efek halo, yaitu kecenderungan kita menyukai atau membenci segala sesuatu tentang seseorang hanya berdasarkan satu sifat yang menonjol di awal pertemuan. Jika seorang pembicara tampil karismatik, ramah, dan rapi di lima menit pertama, Sistem 1 otomatis menganggap ia juga jujur, cerdas, dan kompeten dalam segala hal, padahal tidak ada bukti objektif yang mendukung lompatan kesimpulan tersebut.",
        "Kahneman juga menyoroti prinsip WYSIATI (What You See Is All There Is): Sistem 1 sangat mahir merangkai cerita yang terdengar koheren dan meyakinkan hanya dari potongan informasi yang kebetulan ada di depan mata, tanpa mempedulikan informasi penting yang tidak terlihat. Akibatnya, sedikit bukti yang dirangkai secara emosional sering terasa lebih benar daripada data statistik yang lengkap tetapi terasa membosankan dan kurang dramatis.",
        "Dalam kasus klasik 'Linda si kasir bank', peserta diberi deskripsi bahwa Linda adalah lulusan filsafat yang vokal memperjuangkan keadilan sosial, lalu diminta menilai mana yang lebih mungkin: Linda seorang kasir bank, atau Linda seorang kasir bank sekaligus aktivis feminis. Mayoritas peserta memilih opsi kedua meski secara logika matematika peluang gabungan dua kondisi selalu lebih kecil daripada satu kondisi—karena cerita tentang aktivis terasa jauh lebih cocok dengan deskripsi awal.",
        "Untuk menangkal jebakan ini, kita perlu membiasakan diri bertanya: 'Informasi penting apa yang belum saya lihat?' Saat menilai peluang bisnis, performa karyawan, atau ulasan produk, jangan hanya mengandalkan satu cerita sukses yang viral di media sosial. Carilah data dasar (base rate) dan sampel kegagalan yang jarang dipublikasikan agar penilaian Anda jauh lebih objektif dan membumi.",
      ],
      keyNote:
        "Otak sangat pandai merangkai cerita meyakinkan hanya dari potongan informasi yang kebetulan terlihat, padahal data yang tidak terlihat dan angka dasar sering kali justru paling menentukan.",
    },
    {
      number: 3,
      title: "Efek Jangkar (Anchoring) yang Mengendalikan Angka",
      quickSummary:
        "Efek jangkar terjadi ketika pikiran kita tanpa sadar terpaku pada angka pertama yang muncul sebelum membuat estimasi atau negosiasi. Bahkan angka yang jelas-jelas acak sekalipun tetap memengaruhi penilaian Sistem 1 secara nyata dan terukur. Itulah sebabnya harga coret di toko, batas donasi yang disarankan, atau penawaran pembuka dalam negosiasi gaji memiliki daya tarik psikologis yang sangat kuat dan sulit diabaikan begitu saja.",
      deepContent: [
        "Dalam sebuah eksperimen klasik, Kahneman dan rekannya Amos Tversky memutar roda keberuntungan yang diam-diam sudah diatur agar hanya berhenti di angka 10 atau 65. Setelah itu, peserta diminta menebak persentase negara-negara Afrika yang menjadi anggota PBB. Peserta yang melihat angka 10 rata-rata menebak 25%, sedangkan yang melihat angka 65 menebak 45%, padahal semua orang tahu roda putar tersebut sepenuhnya acak dan tidak berhubungan dengan geografi dunia.",
        "Mengapa angka acak bisa memengaruhi logika orang terdidik? Sistem 1 bekerja dengan mekanisme asosiasi yang mencari bukti pendukung bagi jangkar tersebut. Ketika mendengar angka tinggi, otak otomatis membayangkan skenario yang membuat angka itu terasa masuk akal. Kemudian Sistem 2 mencoba menyesuaikan angkanya ke bawah, tetapi penyesuaian itu hampir selalu berhenti terlalu cepat begitu menemukan angka pertama yang terasa 'cukup wajar'.",
        "Dalam eksperimen lain di Jerman, para hakim berpengalaman diminta membaca berkas kasus pencurian lalu melempar sepasang dadu yang sudah dimodifikasi sebelum menentukan lama hukuman penjara. Hakim yang melihat dadu bernilai tinggi rata-rata menjatuhkan vonis delapan bulan penjara, sedangkan hakim yang melihat dadu rendah rata-rata menjatuhkan lima bulan—membuktikan bahwa bahkan ahli hukum profesional sekalipun tidak kebal terhadap efek jangkar.",
        "Di dunia ritel, e-commerce, dan properti, efek jangkar dipakai setiap hari secara sadar. Penjual menampilkan harga awal Rp2.000.000 lalu mencoretnya menjadi Rp999.000 sehingga pembeli merasa berhemat satu juta rupiah, padahal nilai wajar barang tersebut memang sekitar satu juta. Dalam negosiasi bisnis atau gaji, pihak yang melempar angka pembuka yang tinggi namun masih masuk akal sering menarik titik temu akhir ke arah yang jauh lebih menguntungkannya.",
        "Cara paling efektif melawan jangkar yang tidak adil bukanlah sekadar berkata 'saya tidak akan terpengaruh', karena jangkar bekerja di bawah sadar. Strategi terbaik adalah secara sadar menolak bernegosiasi di sekitar angka lawan, mengambil jeda untuk menjernihkan pikiran, lalu membangun hitungan Anda sendiri dari nol berdasarkan riset pasar yang independen sebelum merespons tawaran tersebut.",
      ],
      keyNote:
        "Angka pertama yang kita lihat—bahkan harga coret atau tawaran pembuka yang tidak masuk akal—diam-diam menarik perkiraan harga wajar di kepala kita.",
    },
    {
      number: 4,
      title: "Terlalu Percaya Diri dan Kekeliruan Perencanaan",
      quickSummary:
        "Manusia memiliki kecenderungan alami untuk melebih-lebihkan kemampuannya sendiri dan meremehkan peran keberuntungan serta risiko tak terduga. Dalam menyusun proyek atau target bisnis, kita kerap terjebak planning fallacy: membuat jadwal dan anggaran berdasarkan skenario terbaik seolah semuanya akan berjalan mulus tanpa hambatan, sambil mengabaikan catatan historis proyek serupa di dunia nyata yang hampir selalu molor dan melampaui anggaran awal.",
      deepContent: [
        "Kahneman menceritakan pengalamannya sendiri saat memimpin tim penulis kurikulum sekolah di Israel. Ketika ditanya berapa lama proyek itu akan selesai, setiap anggota tim memperkirakan sekitar 1,5 hingga 2,5 tahun. Namun ketika seorang anggota berpengalaman ditanya berapa lama proyek serupa biasanya selesai di lembaga lain, jawabannya mengejutkan semua orang: sekitar 7 hingga 10 tahun, dan 40% di antaranya bahkan tidak pernah rampung.",
        "Perbedaan tajam ini terjadi karena kita hampir selalu menggunakan 'pandangan dari dalam' (inside view): fokus membayangkan rencana ideal tim kita sendiri tanpa melihat data lapangan dari luar. Kita yakin tim kita lebih kompak, lebih pintar, dan lebih beruntung dibanding rata-rata orang lain, padahal hukum probabilitas, kelelahan tim, dan hambatan birokrasi tetap berlaku sama bagi siapa saja.",
        "Rasa terlalu percaya diri juga sering muncul dalam bentuk bias hasil (hindsight bias). Setelah sebuah peristiwa besar terjadi—entah krisis keuangan 2008 atau melejitnya sebuah perusahaan rintisan—otak kita langsung merasa 'sejak awal saya sudah menduga ini akan terjadi'. Ilusi bahwa masa lalu mudah ditebak membuat kita keliru percaya bahwa masa depan juga bisa diprediksi dengan akurat oleh para pakar maupun diri kita sendiri.",
        "Dalam studi terhadap pialang saham dan manajer investasi profesional, Kahneman menemukan bahwa banyak ahli justru gagal mengalahkan lemparan dadu atau indeks pasar acak dalam jangka panjang, namun mereka tetap sangat percaya diri. Hal ini terjadi karena memori selektif hanya menyoroti prediksi mereka yang kebetulan benar sambil melupakan atau merasionalisasi prediksi yang meleset jauh.",
        "Solusi praktis yang ditawarkan Kahneman adalah mengambil 'pandangan dari luar' (outside view) berbasis data pembanding historis serta melakukan teknik premortem. Sebelum meluncurkan proyek baru, kumpulkan tim dan bayangkan satu tahun ke depan proyek tersebut gagal total, lalu minta setiap orang menuliskan penyebab kegagalannya. Teknik sederhana ini melegitimasi keraguan kritis yang sebelumnya tertahan oleh optimisme berlebihan.",
      ],
      keyNote:
        "Rencana hampir selalu dibuat dengan membayangkan semuanya berjalan mulus, padahal melihat catatan nyata dari proyek sejenis memberi gambaran waktu dan biaya yang jauh lebih jujur.",
    },
    {
      number: 5,
      title: "Teori Prospek dan Rasa Sakit Akibat Kehilangan",
      quickSummary:
        "Berbeda dengan teori ekonomi klasik yang menganggap manusia selalu bertindak rasional dan memaksimalkan nilai harapan, Teori Prospek yang dikembangkan Kahneman dan Tversky membuktikan bahwa manusia menilai keuntungan dan kerugian secara asimetris. Secara psikologis, rasa sakit kehilangan Rp1 juta terasa sekitar dua kali lebih menyakitkan daripada rasa senang mendapatkan Rp1 juta, sehingga kita menghindari risiko saat untung tetapi nekat saat sedang rugi.",
      deepContent: [
        "Bayangkan Anda ditawari lemparan koin yang adil: jika muncul gambar, Anda menang Rp1,5 juta; jika muncul angka, Anda kalah Rp1 juta. Secara matematis, tawaran ini sangat menguntungkan karena nilai harapannya positif. Namun mayoritas orang menolaknya karena ketakutan kehilangan Rp1 juta terasa jauh lebih menyakitkan daripada daya tarik menang Rp1,5 juta. Fenomena mendasar ini disebut keengganan terhadap kerugian (loss aversion).",
        "Keengganan terhadap kerugian menjelaskan banyak perilaku tidak rasional dalam keuangan dan bisnis. Investor ritel sering terburu-buru menjual saham yang baru naik sedikit karena takut keuntungannya menguap, tetapi menahan saham yang terus merugi berbulan-bulan karena tidak sanggup mengakui kerugian secara nyata. Ketika sedang rugi, orang justru berubah menjadi pencari risiko demi harapan tipis untuk sekadar 'balik modal' seperti semula.",
        "Hal yang sama terjadi pada bias status quo dan efek kepemilikan (endowment effect). Dalam eksperimen terkenal dengan cangkir kopi kampus, mahasiswa yang diberi cangkir gratis langsung meminta harga jual dua kali lipat lebih tinggi dibanding harga yang bersedia dibayar oleh mahasiswa yang tidak memilikinya. Begitu sesuatu sudah menjadi milik kita, melepaskannya terasa seperti sebuah kerugian yang menyakitkan di hati.",
        "Karena setiap perubahan karier atau strategi pasti mengandung potensi kehilangan sesuatu yang sudah kita miliki saat ini—entah zona nyaman, gaji tetap, atau rutinitas lama—otak menilai kerugian dari perubahan jauh lebih berat daripada potensi keuntungan masa depan, sehingga banyak orang bertahan terlalu lama di situasi pekerjaan atau bisnis yang sebenarnya sudah tidak sehat.",
        "Memahami Teori Prospek membantu kita mengelola emosi saat mengambil keputusan finansial maupun hidup. Alih-alih berfokus pada satu kerugian jangka pendek, lihatlah keputusan Anda sebagai portofolio jangka panjang yang saling melengkapi. Ketika Anda mengevaluasi hasil investasi setiap hari, Anda lebih sering merasakan sakitnya fluktuasi; memperpanjang rentang evaluasi membantu Sistem 2 tetap tenang.",
      ],
      keyNote:
        "Rasa sakit karena kehilangan sesuatu terasa dua kali lebih menusuk daripada rasa senang mendapat nilai yang sama, membuat kita takut ambil risiko saat untung tapi nekat saat rugi.",
    },
    {
      number: 6,
      title: "Diri yang Mengalami vs Diri yang Mengingat",
      quickSummary:
        "Kahneman membedakan dua jenis diri di dalam kesadaran kita: 'experiencing self' yang merasakan momen detik demi detik, dan 'remembering self' yang menyimpan cerita serta mengambil keputusan untuk masa depan. Uniknya, diri yang mengingat tidak menilai pengalaman dari total durasinya, melainkan hanya dari momen puncak (peak) dan momen akhir (end). Karena itulah akhir sebuah pengalaman jauh lebih menentukan kenangan kita daripada seberapa lama waktunya.",
      deepContent: [
        "Dalam sebuah studi terkenal terhadap pasien prosedur kolonoskopi medis yang tidak nyaman, kelompok pertama menjalani prosedur lebih singkat tetapi berakhir tepat pada titik rasa sakit yang tinggi. Kelompok kedua menjalani prosedur jauh lebih lama, namun di bagian akhir intensitas sakitnya diturunkan secara bertahap sebelum selesai. Ketika ditanya belakangan, kelompok kedua justru mengingat pengalaman mereka sebagai jauh lebih tidak menyakitkan.",
        "Fenomena ini disebut aturan puncak-akhir (peak-end rule) dan pengabaian durasi (duration neglect). Diri yang mengingat bertugas menyusun narasi dan memilih apa yang akan kita lakukan lagi di masa depan. Jika Anda berlibur selama sepuluh hari dengan sembilan hari yang sangat menyenangkan lalu bertengkar hebat di bandara saat pulang, kenangan Anda tentang seluruh liburan itu sering kali rusak oleh momen terakhir tersebut.",
        "Bahkan dalam skala kebahagiaan hidup sehari-hari, Kahneman menemukan perbedaan menarik antara kepuasan hidup (penilaian diri yang mengingat) dan kesejahteraan emosional harian (perasaan diri yang mengalami). Uang di atas tingkat kecukupan tertentu ternyata jauh lebih meningkatkan kepuasan saat menilai hidup secara keseluruhan daripada meningkatkan suasana hati kita dari jam ke jam saat menjalani rutinitas harian.",
        "Penemuan ini memiliki implikasi besar dalam cara kita merancang pengalaman pelanggan, memimpin tim, maupun menjalani hidup. Dalam layanan bisnis, menutup interaksi dengan kejutan kecil yang ramah atau penyelesaian masalah yang tuntas di akhir jauh lebih membekas di ingatan pelanggan daripada proses tengah yang biasa saja atau bahkan sedikit lambat.",
        "Dalam kehidupan pribadi, kita sering mengorbankan kebahagiaan 'diri yang mengalami' hari ini demi mengejar foto atau cerita indah untuk 'diri yang mengingat' di masa depan. Keseimbangan terbaik muncul ketika kita mampu hadir menikmati momen kecil yang hadir saat ini sambil tetap merancang akhir yang bermakna pada setiap fase perjalanan hidup.",
      ],
      keyNote:
        "Ingatan kita tentang suatu kejadian tidak ditentukan oleh seberapa lama kejadian itu berlangsung, melainkan oleh momen paling intens dan bagaimana akhirnya ditutup.",
    },
  ],
  keyConcepts: [
    {
      title: "Berpikir Cepat vs. Berpikir Lambat",
      explanation:
        "Otak punya mode serba cepat yang otomatis dan emosional (Sistem 1), serta mode teliti yang butuh tenaga ekstra (Sistem 2). Karena Sistem 2 malas bekerja, kita sering langsung percaya kesan pertama.",
    },
    {
      title: "Apa yang Terlihat Terasa Lengkap (WYSIATI)",
      explanation:
        "Pikiran kita mudah yakin pada sebuah cerita meski buktinya masih sedikit, karena otak otomatis menutup lubang informasi yang hilang agar ceritanya terasa masuk akal.",
    },
    {
      title: "Efek Jangkar Angka Pertama",
      explanation:
        "Angka pertama yang muncul dalam tawaran atau diskon langsung menjadi patokan tak sadar yang memengaruhi penilaian harga wajar setelahnya meski angkanya acak.",
    },
    {
      title: "Jebakan Terlalu Optimis Saat Merencana",
      explanation:
        "Orang cenderung menaksir waktu dan biaya berdasarkan skenario terbaik, alih-alih melihat rata-rata pengalaman nyata dari proyek sejenis di masa lalu.",
    },
    {
      title: "Lebih Takut Rugi daripada Ingin Untung",
      explanation:
        "Secara psikologis, kehilangan Rp1 juta terasa sekitar dua kali lebih menyakitkan dibanding senangnya mendapat Rp1 juta—membuat keputusan finansial sering berat sebelah.",
    },
    {
      title: "Aturan Puncak dan Akhir",
      explanation:
        "Kenangan kita menilai pengalaman bukan dari rata-rata seluruh waktunya, melainkan dari bagian paling berkesan dan bagaimana pengalaman itu berakhir.",
    },
  ],
  quotes: [
    "Tidak ada yang sejelas kelihatannya ketika Anda memikirkannya secara mendalam.",
    "Kepercayaan diri adalah perasaan subjektif, bukan ukuran validitas sebuah penilaian objektif.",
    "Kerugian terasa jauh lebih besar daripada keuntungan dengan nilai yang sama.",
    "Kecerdasan tidak hanya diukur dari kemampuan bernalar, tetapi juga dari seberapa cepat kita mengenali jebakan pikiran sendiri.",
  ],
  conclusion:
    "Thinking, Fast and Slow mengajarkan bahwa otak manusia bukanlah komputer rasional yang dingin, melainkan mesin cerita yang sangat cepat namun rentan terhadap berbagai ilusi dan bias kognitif. Kita tidak bisa mematikan Sistem 1, dan memang tidak perlu melakukannya karena intuisi yang terlatih sangat berharga. Kunci kebijaksanaan praktis adalah mengenali situasi berisiko tinggi di mana intuisi sering meleset, lalu memperlambat langkah untuk mengundang Sistem 2 memeriksa angka, konteks, dan sudut pandang lain sebelum bertindak.",
};
