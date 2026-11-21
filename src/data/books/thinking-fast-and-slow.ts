import type { BookSummary } from "@/types/book";

export const thinkingFastAndSlow: BookSummary = {
  slug: "thinking-fast-and-slow",
  title: "Thinking, Fast and Slow",
  originalTitle: "Berpikir Cepat dan Lambat",
  author: "Daniel Kahneman",
  year: 2011,
  category: "Psikologi & Mindset",
  readingTimeMinutes: 23,
  quickTimeMinutes: 8,
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
    "Profesional, manajer, dan pemilik usaha yang sering mengambil keputusan strategis di bawah tekanan waktu dan ketidakpastian.",
    "Investor dan perencana keuangan yang ingin menghindari jebakan emosi seperti panik saat pasar turun atau terlalu percaya diri saat untung.",
    "Pembaca yang ingin memahami mengapa kita mudah terpengaruh iklan, framing berita, atau angka jangkar saat berbelanja.",
    "Siapa saja yang ingin melatih kemampuan berpikir kritis dan mengurangi penyesalan akibat keputusan impulsif.",
    "Mahasiswa psikologi, ekonomi perilaku, dan desain produk yang ingin memahami cara kerja otak manusia dalam menilai risiko.",
  ],
  keyTakeaways: [
    {
      number: 1,
      title: "Sistem 1 vs Sistem 2: Dua Mesin di Dalam Kepala",
      quickSummary:
        "Otak kita memiliki dua mode operasi. Sistem 1 bekerja sangat cepat, otomatis, tanpa usaha sadar, dan mengandalkan asosiasi serta emosi—misalnya langsung mengenali wajah marah atau menjawab 2 + 2. Sistem 2 bekerja lambat, analitis, membutuhkan konsentrasi penuh, dan mudah lelah—seperti menghitung 17 x 24 atau mengisi formulir pajak. Masalahnya, Sistem 2 cenderung malas sehingga terlalu sering menerima mentah-mentah kesimpulan cepat dari Sistem 1.",
      deepContent: [
        "Ketika Anda melihat foto seseorang yang berteriak dengan alis berkerut, Anda tidak perlu menganalisis ciri wajahnya satu per satu untuk tahu ia sedang marah. Kesimpulan itu muncul seketika dalam hitungan milidetik berkat kerja Sistem 1. Sebaliknya, jika Anda diminta menghitung hasil perkalian 17 dikali 24 tanpa kalkulator, detak jantung sedikit meningkat, pupil mata melebar, dan Anda harus mengerahkan perhatian penuh. Itulah Sistem 2 yang sedang bekerja keras.",
        "Pembagian tugas ini sebenarnya sangat efisien bagi kelangsungan hidup manusia. Bayangkan jika setiap kali menyetir mobil atau berjalan di trotoar kita harus menganalisis jarak setiap objek secara matematis; otak kita akan langsung kelelahan dalam beberapa menit. Sistem 1 menangani ribuan tugas rutin setiap hari sehingga Sistem 2 bisa dihemat untuk masalah kompleks yang memang butuh ketelitian.",
        "Namun efisiensi ini memiliki titik lemah besar yang disebut Kahneman sebagai hukum usaha terkecil. Karena Sistem 2 butuh banyak energi mental, ia cenderung malas dan hanya aktif ketika Sistem 1 benar-benar kebingungan atau ada sinyal bahaya yang jelas. Ketika kita lelah, lapar, terburu-buru, atau terdistraksi banyak notifikasi, kendali Sistem 2 melemah drastis dan kita makin mudah bertindak berdasarkan impuls serta prasangka cepat.",
        "Dalam kehidupan sehari-hari, menyadari adanya dua sistem ini membantu kita tidak langsung percaya pada 'kesan pertama' dalam mengambil keputusan penting. Saat menerima kabar mengejutkan di grup percakapan atau melihat promo diskon besar-besaran, yang bereaksi pertama kali adalah Sistem 1. Memberi jeda sejenak memberi kesempatan bagi Sistem 2 untuk memeriksa fakta, konteks, dan konsekuensi jangka panjangnya.",
      ],
      practicalTip:
        "Hindari mengambil keputusan besar (finansial, kontrak kerja, atau konflik pribadi) saat Anda sedang lelah, lapar, atau terburu-buru karena Sistem 2 Anda sedang lemah.",
    },
    {
      number: 2,
      title: "Jebakan Heuristik dan Penggantian Pertanyaan",
      quickSummary:
        "Ketika dihadapkan pada pertanyaan sulit, Sistem 1 diam-diam menggantinya dengan pertanyaan yang jauh lebih mudah tanpa kita sadari. Alih-alih menilai seberapa kompeten seorang kandidat berdasarkan rekam jejak data, kita sering menggantinya dengan pertanyaan mudah: 'Seberapa meyakinkan penampilannya hari ini?' Kebiasaan mencari jalan pintas mental atau heuristik ini menghemat waktu, tetapi sering memicu bias sistematis yang menyesatkan.",
      deepContent: [
        "Salah satu contoh paling terkenal adalah heuristik ketersediaan. Ketika orang diminta menilai seberapa besar risiko kecelakaan pesawat dibanding kecelakaan mobil, banyak yang merasa pesawat jauh lebih berbahaya hanya karena berita kecelakaan pesawat sangat dramatis dan mudah diingat di kepala. Otak mengganti pertanyaan statistik yang sulit dengan pertanyaan mudah: 'Seberapa cepat contoh kejadiannya muncul di ingatan saya?'",
        "Bentuk jalan pintas lainnya adalah efek halo, yaitu kecenderungan kita menyukai atau membenci segala sesuatu tentang seseorang hanya berdasarkan satu sifat yang menonjol. Jika seorang pembicara tampil karismatik dan rapi di lima menit pertama, Sistem 1 otomatis menganggap ia juga jujur, cerdas, dan kompeten dalam segala hal, padahal tidak ada bukti objektif yang mendukung lompatan kesimpulan tersebut.",
        "Kahneman juga menyoroti prinsip WYSIATI (What You See Is All There Is): Sistem 1 sangat mahir merangkai cerita yang terdengar masuk akal hanya dari potongan informasi yang kebetulan ada di depan mata, tanpa mempedulikan informasi penting yang tidak terlihat. Akibatnya, sedikit bukti yang dirangkai secara meyakinkan sering kali terasa lebih benar daripada data statistik yang lengkap tetapi membosankan.",
        "Untuk menangkal jebakan ini, kita perlu membiasakan diri bertanya: 'Informasi apa yang belum saya lihat?' Saat menilai peluang bisnis, performa karyawan, atau ulasan produk, jangan hanya mengandalkan satu cerita sukses yang viral. Carilah data dasar (base rate) dan sampel kegagalan yang jarang dipublikasikan agar penilaian Anda jauh lebih objektif.",
      ],
      practicalTip:
        "Sebelum menilai sebuah peluang atau kandidat, tuliskan 3 informasi penting yang belum Anda miliki agar tidak terjebak pada kesan pertama.",
    },
    {
      number: 3,
      title: "Efek Jangkar (Anchoring) yang Mengendalikan Angka",
      quickSummary:
        "Efek jangkar terjadi ketika pikiran kita tanpa sadar terpaku pada angka pertama yang muncul sebelum membuat estimasi atau negosiasi. Bahkan angka yang jelas-jelas acak sekalipun tetap memengaruhi penilaian Sistem 1. Itulah sebabnya harga coret di toko atau penawaran pembuka dalam negosiasi gaji memiliki daya tarik psikologis yang sangat kuat.",
      deepContent: [
        "Dalam sebuah eksperimen klasik, Kahneman dan rekannya Amos Tversky memutar roda keberuntungan yang sudah diatur agar hanya berhenti di angka 10 atau 65. Setelah itu, peserta diminta menebak persentase negara-negara Afrika yang menjadi anggota PBB. Peserta yang melihat angka 10 rata-rata menebak 25%, sedangkan yang melihat angka 65 menebak 45%, padahal semua orang tahu roda putar tersebut sepenuhnya acak.",
        "Mengapa angka acak bisa memengaruhi logika orang terdidik? Sistem 1 bekerja dengan mencari bukti yang mendukung jangkar tersebut. Ketika mendengar angka tinggi, otak otomatis membayangkan skenario yang membuat angka itu terasa masuk akal. Kemudian Sistem 2 mencoba menyesuaikan angkanya, tetapi penyesuaian itu hampir selalu kurang jauh karena kita berhenti begitu menemukan angka yang terasa 'cukup wajar'.",
        "Dalam dunia ritel dan properti, efek jangkar dipakai secara luas. Penjual menampilkan harga awal Rp2.000.000 lalu mencoretnya menjadi Rp999.000 sehingga pembeli merasa berhemat satu juta rupiah, padahal harga wajar barang tersebut memang sekitar satu juta. Dalam negosiasi bisnis atau gaji, pihak yang melempar angka pertama yang masuk akal tetapi tinggi sering kali menarik titik temu akhir ke arah yang lebih menguntungkannya.",
        "Cara paling efektif melawan jangkar yang tidak adil bukanlah sekadar berkata 'saya tidak akan terpengaruh', karena jangkar bekerja di bawah sadar. Strategi terbaik adalah secara sadar membuang angka lawan dari meja, mengambil jeda, lalu membangun hitungan Anda sendiri dari nol berdasarkan riset pasar yang independen sebelum merespons.",
      ],
      practicalTip:
        "Saat bernegosiasi atau berbelanja promo, abaikan 'harga coret' dan tentukan batas nilai wajar Anda sendiri berdasarkan riset sebelum melihat penawaran penjual.",
    },
    {
      number: 4,
      title: "Terlalu Percaya Diri dan Kekeliruan Perencanaan",
      quickSummary:
        "Manusia memiliki kecenderungan alami untuk melebih-lebihkan kemampuannya sendiri dan meremehkan peran keberuntungan serta risiko tak terduga. Dalam menyusun proyek atau target bisnis, kita kerap terjebak planning fallacy: membuat jadwal dan anggaran berdasarkan skenario terbaik seolah semuanya akan berjalan mulus, sambil mengabaikan catatan historis proyek serupa yang hampir selalu molor.",
      deepContent: [
        "Kahneman menceritakan pengalamannya sendiri saat memimpin tim penulis kurikulum sekolah. Ketika ditanya berapa lama proyek itu akan selesai, setiap anggota tim memperkirakan sekitar 1,5 hingga 2,5 tahun. Namun ketika seorang anggota yang berpengalaman ditanya berapa lama proyek serupa biasanya selesai di lembaga lain, jawabannya mengejutkan: sekitar 7 hingga 10 tahun, dan 40% di antaranya bahkan tidak pernah rampung.",
        "Perbedaan tajam ini terjadi karena kita hampir selalu menggunakan 'pandangan dari dalam' (inside view): fokus membayangkan rencana ideal tim kita sendiri tanpa melihat data lapangan dari luar. Kita yakin tim kita lebih kompak, lebih pintar, dan lebih beruntung dibanding rata-rata orang lain, padahal hukum probabilitas tetap berlaku bagi siapa saja.",
        "Overconfidence juga sering muncul dalam bentuk bias hasil (hindsight bias). Setelah sebuah peristiwa besar terjadi—entah krisis ekonomi atau suksesnya sebuah startup—otak kita langsung merasa 'sejak awal saya sudah menduga ini akan terjadi'. Ilusi bahwa masa lalu mudah ditebak membuat kita keliru percaya bahwa masa depan juga bisa diprediksi dengan akurat.",
        "Solusi yang ditawarkan Kahneman adalah mengambil 'pandangan dari luar' (outside view) dan melakukan teknik premortem. Sebelum meluncurkan proyek baru, kumpulkan tim dan bayangkan satu tahun ke depan proyek tersebut gagal total, lalu minta setiap orang menuliskan penyebab kegagalannya. Teknik sederhana ini melegitimasi keraguan kritis yang sebelumnya sering tertahan oleh optimisme berlebihan.",
      ],
      practicalTip:
        "Untuk proyek penting berikutnya, tambahkan cadangan waktu minimal 30-50% dari perkiraan optimis Anda dan lakukan sesi premortem selama 15 menit bersama tim.",
    },
    {
      number: 5,
      title: "Teori Prospek dan Rasa Sakit Akibat Kehilangan",
      quickSummary:
        "Berbeda dengan teori ekonomi klasik yang menganggap manusia selalu rasional, Teori Prospek yang dikembangkan Kahneman dan Tversky membuktikan bahwa manusia menilai keuntungan dan kerugian secara asimetris. Secara psikologis, rasa sakit kehilangan Rp1 juta terasa sekitar dua kali lebih menyakitkan daripada rasa senang mendapatkan Rp1 juta. Akibatnya, kita menghindari risiko saat sudah untung, tetapi nekat mengambil risiko besar saat sedang rugi.",
      deepContent: [
        "Bayangkan Anda ditawari lemparan koin: jika muncul gambar, Anda menang Rp1,5 juta; jika angka, Anda kalah Rp1 juta. Secara matematis, tawaran ini sangat menguntungkan. Namun mayoritas orang menolaknya karena ketakutan kehilangan Rp1 juta jauh lebih besar daripada daya tarik menang Rp1,5 juta. Fenomena ini disebut loss aversion atau keengganan terhadap kerugian.",
        "Keengganan terhadap kerugian menjelaskan banyak perilaku tidak rasional dalam keuangan dan bisnis. Investor ritel sering buru-buru menjual saham yang baru naik sedikit karena takut keuntungannya menguap, tetapi menahan saham yang terus merugi berbulan-bulan karena tidak sanggup mengakui kerugian secara nyata. Mereka rela menanggung risiko lebih besar demi peluang tipis untuk sekadar 'balik modal'.",
        "Hal yang sama terjadi pada bias status quo. Karena setiap perubahan pasti mengandung potensi kehilangan sesuatu yang sudah kita miliki saat ini—entah zona nyaman, gaji tetap, atau rutinitas lama—otak cenderung menilai kerugian dari perubahan jauh lebih berat daripada potensi keuntungan di masa depan, sehingga banyak orang bertahan di situasi yang sebenarnya sudah tidak ideal.",
        "Memahami Teori Prospek membantu kita mengelola emosi saat mengambil keputusan finansial maupun karier. Alih-alih berfokus pada satu kerugian jangka pendek, lihatlah keputusan Anda sebagai portofolio jangka panjang. Ketika Anda mengevaluasi hasil investasi atau proyek setiap hari, Anda lebih sering merasakan sakitnya fluktuasi; memperpanjang rentang evaluasi membantu Sistem 2 tetap tenang.",
      ],
      practicalTip:
        "Kurangi frekuensi mengecek portofolio investasi atau metrik harian yang fluktuatif agar tidak memicu reaksi panik akibat loss aversion.",
    },
    {
      number: 6,
      title: "Diri yang Mengalami vs Diri yang Mengingat",
      quickSummary:
        "Kahneman membedakan dua jenis diri di dalam kita: 'experiencing self' yang merasakan momen detik demi detik, dan 'remembering self' yang menyimpan cerita dan mengambil keputusan untuk masa depan. Uniknya, diri yang mengingat tidak menilai pengalaman dari durasinya, melainkan hanya dari momen puncak (peak) dan momen akhir (end). Karena itulah akhir dari sebuah pengalaman jauh lebih menentukan kenangan kita daripada total waktunya.",
      deepContent: [
        "Dalam sebuah studi terkenal terhadap pasien prosedur medis yang tidak nyaman, kelompok pertama menjalani prosedur lebih singkat tetapi berakhir pada titik rasa sakit yang tinggi. Kelompok kedua menjalani prosedur lebih lama, namun di bagian akhir intensitas sakitnya diturunkan secara bertahap sebelum selesai. Ketika ditanya belakangan, kelompok kedua justru mengingat pengalaman mereka sebagai jauh lebih tidak menyakitkan meskipun durasi total penderitaannya lebih lama.",
        "Fenomena ini disebut aturan puncak-akhir (peak-end rule) dan pengabaian durasi (duration neglect). Diri yang mengingat bertugas menyusun narasi dan memilih apa yang akan kita lakukan lagi di masa depan. Jika Anda berlibur selama sepuluh hari dengan sembilan hari menyenangkan lalu bertengkar hebat di bandara saat pulang, kenangan Anda tentang seluruh liburan itu sering kali rusak oleh momen terakhir tersebut.",
        "Penemuan ini memiliki implikasi besar dalam cara kita merancang pengalaman pelanggan, memimpin tim, maupun menjalani hidup. Dalam layanan bisnis, menutup interaksi dengan kejutan kecil yang ramah atau penyelesaian masalah yang tuntas di akhir jauh lebih membekas di ingatan pelanggan daripada proses tengah yang biasa saja.",
        "Dalam kehidupan pribadi, kita sering mengorbankan kebahagiaan 'diri yang mengalami' hari ini demi mengejar foto atau cerita indah untuk 'diri yang mengingat' di masa depan. Keseimbangan terbaik muncul ketika kita mampu menikmati momen kecil yang hadir saat ini sambil tetap merancang akhir yang bermakna pada setiap fase perjalanan.",
      ],
      practicalTip:
        "Dalam acara, presentasi, atau layanan ke pelanggan, pastikan momen penutup dirancang paling berkesan dan hangat karena bagian itulah yang paling diingat.",
    },
  ],
  actionChecklist: [
    "Terapkan jeda 24 jam sebelum melakukan pembelian besar atau merespons pesan yang memancing emosi.",
    "Dalam setiap rapat keputusan penting, tunjuk satu orang untuk mengajukan skenario premortem (membayangkan proyek gagal).",
    "Saat menerima penawaran harga atau gaji, riset nilai pasar secara independen sebelum terpengaruh angka jangkar pertama.",
    "Evaluasi keputusan rutin berdasarkan data historis (outside view), bukan sekadar optimisme rencana ideal.",
    "Periksa apakah Anda menahan proyek atau aset yang merugi hanya karena enggan mengakui kerugian (sunk cost & loss aversion).",
    "Rancang penutup hari atau penutup interaksi kerja dengan satu momen positif yang jelas.",
  ],
  quotes: [
    "Tidak ada yang sejelas kelihatannya ketika Anda memikirkannya secara mendalam.",
    "Kepercayaan diri adalah perasaan, bukan ukuran validitas sebuah penilaian.",
    "Kerugian terasa jauh lebih besar daripada keuntungan dengan nilai yang sama.",
    "Kecerdasan tidak hanya diukur dari kemampuan bernalar, tetapi juga dari seberapa cepat kita mengenali jebakan pikiran sendiri.",
  ],
  conclusion:
    "Thinking, Fast and Slow mengajarkan bahwa otak manusia bukanlah komputer rasional yang dingin, melainkan mesin cerita yang sangat cepat namun rentan terhadap ilusi dan bias. Kita tidak bisa mematikan Sistem 1, dan memang tidak perlu melakukannya karena intuisi yang terlatih sangat berharga. Kunci kebijaksanaan praktis adalah mengenali situasi berisiko tinggi di mana intuisi sering meleset, lalu memperlambat langkah untuk mengundang Sistem 2 memeriksa angka, konteks, dan sudut pandang lain sebelum kita bertindak.",
};
