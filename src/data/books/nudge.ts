import type { BookSummary } from "@/types/book";

export const nudge: BookSummary = {
  slug: "nudge",
  title: "Nudge",
  originalTitle: "Improving Decisions About Health, Wealth, and Happiness",
  author: "Richard H. Thaler & Cass R. Sunstein",
  year: 2008,
  category: "Keuangan & Bisnis",
  readingTimeMinutes: 22,
  quickTimeMinutes: 8,
  rating: 4.8,
  coverGradient: "from-sky-950 via-sky-900 to-cyan-900",
  coverAccent: "bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-300",
  coverImage: "/images/covers/nudge.svg",
  badgeText: "Ekonomi Perilaku",
  tagline:
    "Merancang lingkungan pilihan agar orang lebih mudah mengambil keputusan terbaik tanpa paksaan.",
  synopsis:
    "Manusia bukanlah makhluk rasional sempurna ('Econ') seperti asumsi buku teks ekonomi klasik; kita pelupa, mudah tergoda, dan sering menunda hal penting. Peraih Nobel Ekonomi Richard Thaler bersama pakar hukum Cass Sunstein memperkenalkan konsep 'Nudge' (dorongan halus) dan arsitektur pilihan: cara menata lingkungan, opsi bawaan (default), dan penyajian informasi agar orang lebih mudah memilih hidup sehat, rajin menabung, dan ramah lingkungan tanpa melarang kebebasan memilih mereka.",
  whoIsItFor: [
    "Desainer produk, UX researcher, dan manajer produk yang merancang antarmuka aplikasi, formulir, dan alur keputusan pengguna.",
    "Pemimpin organisasi, HR, dan pembuat kebijakan publik yang ingin mendorong kepatuhan dan kebiasaan positif tanpa aturan kaku.",
    "Pelaku bisnis dan pemasar yang ingin memahami psikologi di balik opsi bawaan (default), framing harga, dan loyalitas pelanggan.",
    "Individu yang ingin menata lingkungan rumah, keuangan pribadi, dan aplikasi ponselnya agar otomatis mendorong kebiasaan baik.",
    "Pembaca yang menyukai Thinking, Fast and Slow dan ingin melihat bagaimana ilmu ekonomi perilaku diterapkan di dunia nyata.",
  ],
  keyTakeaways: [
    {
      number: 1,
      title: "Humans vs Econs dan Konsep Paternalisme Libertarian",
      quickSummary:
        "Teori ekonomi tradisional mengasumsikan manusia sebagai 'Econ' yang selalu menghitung semua informasi secara sempurna dan memilih yang terbaik bagi dirinya. Kenyataannya, kita adalah 'Human' yang terbatas perhatiannya, malas, dan rentan bias. Karena tidak ada lingkungan pilihan yang benar-benar netral, Thaler dan Sunstein mengusulkan 'paternalisme libertarian': menata pilihan agar mendorong keputusan sehat sambil tetap membebaskan orang memilih opsi lain jika mau.",
      deepContent: [
        "Bayangkan seorang pengelola kantin sekolah yang harus menata letak makanan di etalase. Apakah ia meletakkan buah-buahan segar dan salad di rak sejajar mata lalu menaruh kue manis di sudut belakang, atau sebaliknya? Bagaimana pun ia menatanya, susunan itu pasti memengaruhi apa yang lebih banyak dipilih siswa. Tidak ada tata letak yang 'netral' tanpa pengaruh sama sekali.",
        "Pengelola kantin tersebut adalah seorang 'arsitek pilihan'. Jika ia menaruh makanan sehat di tempat paling mudah dijangkau tanpa melarang siswa membeli kue atau soda yang tetap tersedia, ia sedang melakukan 'nudge' atau dorongan halus. Prinsip inilah yang disebut paternalisme libertarian: 'paternalistik' karena berupaya membantu orang hidup lebih baik menurut penilaian mereka sendiri, dan 'libertarian' karena tetap menjaga kebebasan memilih tanpa paksaan atau larangan.",
        "Sebuah intervensi disebut nudge yang sah jika mudah dan murah untuk dihindari. Melarang penjualan minuman manis bukanlah nudge, melainkan larangan. Sebaliknya, meletakkan air mineral di baris depan kulkas atau mengingatkan informasi kalori di menu adalah nudge.",
        "Konsep ini mengubah cara kita memandang desain produk maupun tata kelola tim. Daripada terus mengomel menyalahkan pengguna atau karyawan yang 'kurang disiplin', arsitek pilihan yang cerdas memperbaiki tata letak sistemnya sehingga pilihan terbaik menjadi pilihan paling mudah dilakukan.",
      ],
      practicalTip:
        "Perhatikan cara Anda menata layar utama ponsel dan meja kerja hari ini—posisikan aplikasi atau alat produktif di tempat paling mudah dijangkau seperti etalase kantin yang sehat.",
    },
    {
      number: 2,
      title: "Kekuatan Luar Biasa Opsi Bawaan (Default)",
      quickSummary:
        "Manusia memiliki kecenderungan kuat untuk mempertahankan apa pun yang sudah terpilih secara otomatis karena kemalasan, rasa takut salah memilih, dan kesibukan sehari-hari. Karena itu, opsi bawaan (default) sering menjadi alat arsitektur pilihan paling ampuh di dunia. Mengubah status dari 'harus mendaftar secara aktif' menjadi 'otomatis terdaftar kecuali memilih keluar' dapat melonjakkan partisipasi dari di bawah 30% menjadi di atas 85%.",
      deepContent: [
        "Salah satu bukti paling dramatis dari kekuatan opsi default terlihat pada perbandingan tingkat donor organ di negara-negara Eropa yang berdekatan dan berbudaya mirip. Di negara yang memakai sistem opt-in (warga harus mengisi formulir untuk menjadi pendonor), tingkat persetujuan hanya sekitar 12–28%. Sementara di negara tetangga yang memakai sistem opt-out (warga otomatis menjadi pendonor kecuali menyatakan menolak), tingkat persetujuannya melampaui 85–99%!",
        "Dalam dunia keuangan pribadi, banyak karyawan berniat menyisihkan gaji untuk dana pensiun, namun selalu menunda mengisi formulir pendaftarannya karena rumit. Ketika perusahaan mengubah sistem menjadi pendaftaran otomatis (auto-enrollment) di mana karyawan langsung ikut program tabungan pensiun sejak hari pertama kerja dan bebas berhenti kapan saja, tingkat kepesertaan melonjak drastis dan membantu jutaan pekerja memiliki tabungan hari tua.",
        "Tentu saja, kekuatan default ini juga bisa disalahgunakan menjadi 'sludge'—yaitu gesekan atau jebakan bisnis yang sengaja menyulitkan pengguna, seperti langganan gratis yang otomatis menagih biaya bulanan setelah 7 hari dan tombol berhentinya disembunyikan di menu berlapis-lapis.",
        "Sebagai pengguna, kita harus waspada memeriksa opsi bawaan pada kontrak keuangan, privasi aplikasi, dan langganan digital. Sebagai pembuat sistem atau pemimpin, gunakan opsi bawaan secara etis untuk membantu orang mencapai tujuan jangka panjang mereka.",
      ],
      practicalTip:
        "Buat 'default' positif bagi keuangan Anda sendiri dengan mengatur autodebet otomatis ke tabungan atau reksa dana tepat di hari gajian sebelum uang terpakai.",
    },
    {
      number: 3,
      title: "Mengantisipasi Kesalahan Manusia dan Memberi Umpan Balik",
      quickSummary:
        "Arsitek pilihan yang baik sadar bahwa manusia pasti sesekali lalai, lupa, dan salah pencet. Sistem yang tangguh tidak menghukum kelalaian dengan kerugian besar, melainkan merancang pengaman otomatis (forcing function) dan umpan balik langsung yang jelas—seperti bunyi alarm sabuk pengaman di mobil atau peringatan saat Anda mengirim email tanpa lampiran yang sudah disebut di teks.",
      deepContent: [
        "Dulu, banyak pengguna mesin ATM sering meninggalkan kartu ATM mereka tertinggal di dalam mesin setelah mengambil uang tunai karena mereka sudah mendapat apa yang diinginkan terlebih dahulu. Solusi arsitektur pilihan yang jenius sangat sederhana: mesin ATM modern memaksa Anda mengambil kartu ATM terlebih dahulu sebelum uang tunai keluar dari slot. Dengan satu perubahan urutan itu, kasus kartu tertinggal anjlok nyaris nol.",
        "Prinsip serupa diterapkan pada tutup tangki bahan bakar mobil yang diikat tali kecil agar tidak tertinggal di SPBU, atau fitur pengingat di Gmail yang mendeteksi kata 'terlampir' namun belum ada file lampiran lalu bertanya sebelum email terkirim. Sistem ini menerima kenyataan bahwa manusia bisa ceroboh saat sedang banyak pikiran.",
        "Selain mencegah kesalahan, sistem yang baik juga memberi umpan balik langsung ketika tindakan berjalan benar atau melenceng. Bola lampu pintar yang berubah warna saat konsumsi listrik rumah sedang tinggi membuat biaya energi yang tadinya tak kasatmata menjadi langsung terlihat dan mendorong penghematan secara alami.",
        "Dalam pekerjaan sehari-hari, alih-alih mengandalkan ingatan sempurna tim Anda, bangun checklist pra-peluncuran, templat otomatis, dan validasi sistem yang langsung memberi tahu jika ada langkah penting yang terlewat.",
      ],
      practicalTip:
        "Identifikasi satu kesalahan berulang yang paling sering terjadi di tim atau rutinitas Anda, lalu tambahkan 'pengaman otomatis' atau checklist agar kesalahan itu sulit terjadi lagi.",
    },
    {
      number: 4,
      title: "Menyederhanakan Pilihan Kompleks lewat Pemetaan yang Jelas",
      quickSummary:
        "Ketika dihadapkan pada puluhan pilihan paket asuransi, pinjaman, atau menu investasi yang penuh istilah rumit, manusia cenderung kewalahan, menunda keputusan, atau memilih secara acak. Arsitek pilihan yang baik membantu menjembatani informasi teknis dengan kehidupan nyata lewat pemetaan (mapping) yang menerjemahkan angka abstrak menjadi dampak konkret yang mudah dibandingkan.",
      deepContent: [
        "Bayangkan Anda memilih paket kamera berdasarkan angka 'megapiksel' tanpa tahu apakah Anda hanya butuh mencetak foto ukuran dompet atau poster dinding raksasa. Di industri telekomunikasi, perbankan, dan asuransi, pilihan sering kali dibuat sangat membingungkan dengan puluhan kombinasi biaya administrasi, bunga efektif, dan denda tersembunyi.",
        "Pemetaan yang baik menerjemahkan spesifikasi teknis menjadi manfaat praktis bagi pengguna. Misalnya, label efisiensi energi pada kulkas yang langsung menampilkan estimasi biaya listrik per tahun dalam Rupiah jauh lebih mudah dipahami daripada sekadar angka watt teknis.",
        "Ketika pilihan memang sangat banyak—seperti ribuan film di layanan streaming atau ratusan produk investasi—pengelompokan terstruktur dan fitur penyaringan sederhana membantu pengguna mempersempit pilihan tanpa merasa tersesat.",
        "Dalam bisnis atau komunikasi ke klien, hindari membombardir pelanggan dengan sepuluh paket harga sekaligus. Sajikan maksimal 3–4 pilihan yang jelas perbedaannya, lengkapi dengan panduan 'paling cocok untuk siapa', agar pelanggan merasa terbantu dan cepat mengambil keputusan.",
      ],
      practicalTip:
        "Jika Anda menawarkan produk, jasa, atau laporan ke atasan, sederhanakan opsi menjadi maksimal 3 pilihan jelas lengkap dengan dampak praktis masing-masing.",
    },
    {
      number: 5,
      title: "Save More Tomorrow: Menabung Tanpa Terasa Sakit",
      quickSummary:
        "Salah satu penerapan nudge paling sukses di dunia adalah program 'Save More Tomorrow' yang dirancang Richard Thaler dan Shlomo Benartzi. Program ini mengatasi tiga bias sekaligus—kemalasan, keengganan kehilangan gaji saat ini, dan bias masa kini—dengan mengajak pekerja berkomitmen menaikkan porsi tabungan secara otomatis hanya ketika mereka menerima kenaikan gaji di masa depan.",
      deepContent: [
        "Mengapa sulit sekali menyuruh orang menyisihkan tambahan 5% dari gaji bulan ini untuk masa pensiun? Karena dari sudut pandang loss aversion, melihat gaji bersih yang dibawa pulang bulan ini berkurang terasa menyakitkan. Selain itu, manusia lebih mudah berjanji melakukan hal baik 'besok' atau 'tahun depan' daripada memotong kenikmatan hari ini.",
        "Program Save More Tomorrow memanfaatkan kelemahan psikologis ini menjadi kekuatan. Karyawan diajak menandatangani komitmen hari ini bahwa porsi tabungan mereka akan naik sebesar 3% setiap kali mereka mendapat kenaikan gaji tahunan di masa depan. Karena kenaikan tabungan bertepatan dengan kenaikan gaji, gaji bersih yang mereka terima tetap naik—tidak pernah terasa berkurang sama sekali.",
        "Selain itu, karena kenaikan tersebut berjalan otomatis setiap tahun hingga mencapai batas target tertentu, sifat malas atau inersia manusia justru menjaga mereka tetap berada di jalur menabung yang disiplin. Hasilnya luar biasa: jutaan pekerja yang sebelumnya nyaris tidak punya tabungan berhasil meningkatkan rasio tabungan mereka berkali-kali lipat.",
        "Anda dapat menerapkan prinsip ini secara pribadi mulai hari ini: buat aturan pribadi bahwa setiap kali mendapat bonus, THR, atau kenaikan penghasilan, minimal 50% dari selisih kenaikannya langsung dialihkan ke pos investasi atau pelunasan utang sebelum gaya hidup Anda sempat menyesuaikan diri.",
      ],
      practicalTip:
        "Terapkan prinsip Save More Tomorrow pada keuangan Anda: tetapkan komitmen sekarang bahwa 50% dari kenaikan gaji atau bonus berikutnya langsung masuk ke tabungan/investasi.",
    },
    {
      number: 6,
      title: "Pengaruh Norma Sosial dalam Mendorong Perubahan Perilaku",
      quickSummary:
        "Manusia adalah makhluk sosial yang sangat memperhatikan apa yang dilakukan mayoritas orang di sekitarnya. Memberi informasi sederhana tentang norma sosial—seperti '9 dari 10 tetangga Anda sudah membayar pajak tepat waktu' atau membandingkan pemakaian listrik rumah Anda dengan tetangga yang hemat—sering kali jauh lebih efektif mengubah perilaku daripada ancaman denda atau ceramah moral.",
      deepContent: [
        "Dalam sebuah uji coba di Inggris, pemerintah mengirim surat pengingat kepada warga yang terlambat membayar pajak. Surat standar yang hanya berisi ancaman denda dan penjelasan hukum menghasilkan tingkat kepatuhan yang biasa saja. Namun ketika satu kalimat sederhana ditambahkan—'Sembilan dari sepuluh orang di kota Anda sudah membayar pajak tepat waktu'—tingkat pembayaran langsung melonjak signifikan dan mendatangkan miliaran rupiah penerimaan negara lebih cepat.",
        "Uji coba terkenal lainnya dilakukan pada tagihan listrik rumah tangga di California. Warga yang mendapat grafik perbandingan pemakaian listrik mereka dengan rata-rata tetangga yang hemat energi—disertai ikon wajah tersenyum bagi yang hemat—menurunkan konsumsi listriknya secara nyata. Menariknya, warga yang sudah sangat hemat sempat sedikit menaikkan pemakaian saat tahu mereka jauh di bawah rata-rata, namun ikon senyum berhasil mencegah efek balik tersebut.",
        "Namun Thaler dan Sunstein mengingatkan agar tidak keliru menggunakan norma sosial secara terbalik. Jika Anda memasang papan pengumuman 'Setiap tahun ribuan pengunjung mencuri kayu dari taman nasional ini', Anda justru memberi sinyal bahwa mencuri itu hal yang umum dilakukan orang dan malah meningkatkan pencurian.",
        "Karena itu, saat ingin mendorong kebiasaan baik di tim atau komunitas, sorotlah perilaku positif mayoritas yang sudah melakukannya, bukan menormalisasi perilaku buruk segelintir orang.",
      ],
      practicalTip:
        "Saat mengajak tim atau komunitas mengadopsi kebiasaan baru, tampilkan contoh nyata rekan-rekan yang sudah berhasil melakukannya agar tercipta norma sosial positif.",
    },
  ],
  actionChecklist: [
    "Aktifkan transfer otomatis tabungan atau investasi di hari gajian agar menabung menjadi opsi default.",
    "Periksa langganan aplikasi dan pengaturan privasi Anda bulan ini untuk memastikan tidak ada jebakan default berbayar.",
    "Tata ulang layar ponsel Anda: pindahkan aplikasi hiburan penguras waktu ke folder tersembunyi dan taruh aplikasi belajar di halaman depan.",
    "Terapkan aturan 'Save More Tomorrow' pribadi dengan mengalokasikan sebagian besar kenaikan penghasilan masa depan ke aset produktif.",
    "Tambahkan satu checklist atau pengaman otomatis pada alur kerja tim untuk mencegah kesalahan berulang.",
    "Sajikan pilihan maksimal 3 opsi terstruktur setiap kali menawarkan solusi kepada klien atau atasan.",
  ],
  quotes: [
    "Jika Anda ingin mendorong seseorang melakukan sesuatu, buatlah hal itu menjadi mudah.",
    "Tidak ada yang namanya desain yang netral; setiap arsitektur pilihan pasti memengaruhi keputusan orang.",
    "Sebuah dorongan halus (nudge) tetap menjaga kebebasan memilih, namun membantu orang tidak tersandung oleh keterbatasannya sendiri.",
    "Pilihan bawaan (default) ada di mana-mana dan kekuatannya sangat luar biasa.",
  ],
  conclusion:
    "Nudge mengajarkan bahwa perubahan perilaku skala besar tidak selalu membutuhkan larangan keras atau ceramah panjang yang melelahkan. Dengan memahami keterbatasan manusia—pelupa, cenderung mengikuti arus, dan menyukai kemudahan—kita dapat merancang lingkungan, produk, dan sistem keuangan yang diam-diam membantu kita menjadi versi diri yang lebih sehat, lebih hemat, dan lebih bijaksana tanpa kehilangan kebebasan memilih.",
};
