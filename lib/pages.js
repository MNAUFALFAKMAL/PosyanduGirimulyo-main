export const navItems = [
  { href: "/", label: "Home", pageKey: "home", publicTab: true },
  { href: "/", label: "Penyebab & Pencegahan", pageKey: "penyebab", publicTab: true },
  { href: "/", label: "Dampak", pageKey: "dampak", publicTab: true },
  { href: "/kalkulator", label: "Kalkulator" },
];

export const infoPages = {
  home: {
    title: "Masa Depan Anak Sehat, Indonesia Hebat",
    paragraphs: [
      "Stunting adalah ancaman nyata bagi potensi generasi penerus bangsa. Ini bukan hanya tentang tinggi badan, tetapi tentang perkembangan otak, kecerdasan, dan kesehatan jangka panjang anak. Portal ini hadir untuk memberikan informasi akurat dan alat praktis bagi orang tua dan kader kesehatan untuk bersama-sama mencegah stunting.",
      "Mari kenali penyebabnya, pahami dampaknya, dan terapkan langkah pencegahan yang tepat. Gunakan kalkulator gizi kami untuk memantau tumbuh kembang buah hati Anda secara berkala.",
    ],
    highlights: [
      {
        value: "1.000 HPK",
        label: "Periode paling penting sejak kehamilan sampai anak berusia 2 tahun.",
      },
      {
        value: "Rutin",
        label: "Pemantauan berat, tinggi, dan status gizi perlu dilakukan setiap sesi Posyandu.",
      },
      {
        value: "Terpadu",
        label: "Keluarga, kader, Posyandu, dan pemerintah desa perlu bergerak bersama.",
      },
    ],
    sections: [
      {
        title: "Informasi Penting untuk Kader dan Orang Tua",
        eyebrow: "Prioritas Layanan",
        tone: "teal",
        points: [
          {
            title: "Catat Data Anak dengan Konsisten",
            description:
              "Gunakan nama, NIK, tanggal lahir, berat, dan tinggi yang benar agar histori pertumbuhan dapat dibaca dari waktu ke waktu.",
          },
          {
            title: "Perhatikan Tren, Bukan Sekali Ukur",
            description:
              "Satu hasil pengukuran perlu dilihat bersama riwayat sebelumnya. Penurunan tren berat atau tinggi perlu segera ditindaklanjuti.",
          },
          {
            title: "Rujuk Jika Ada Tanda Risiko",
            description:
              "Jika hasil menunjukkan risiko gizi atau indikasi stunting, arahkan keluarga untuk konsultasi ke tenaga kesehatan.",
          },
          {
            title: "Edukasi Gizi Praktis",
            description:
              "Dorong konsumsi protein hewani, ASI eksklusif, MPASI bergizi, imunisasi, sanitasi, dan perilaku hidup bersih.",
          },
        ],
      },
    ],
    villageGovernment: {
      title: "Struktur Pemerintahan Desa Girimulyo",
      subtitle: "Kecamatan Marga Sekampung, Kabupaten Lampung Timur",
      root: {
        title: "Desa Girimulyo",
        description: "Akar koordinasi layanan masyarakat dan dukungan Posyandu.",
      },
      groups: [
        {
          title: "Pimpinan Utama",
          layout: "leaders",
          members: [
            { position: "Kepala Desa", name: "Echwanudin", photo: "" },
            { position: "Sekretaris Desa", name: "Sanyoto Hermawan, S.Ap", photo: "" },
          ],
        },
        {
          title: "Kepala Seksi (Kasi)",
          layout: "division",
          members: [
            { position: "Kasi Pemerintahan", name: "Kristiana Putra", photo: "" },
            {
              position: "Kasi Kesejahteraan",
              name: "Widada",
              note: "Penanggung jawab alur koordinasi kesehatan & Posyandu",
              photo: "",
            },
            { position: "Kasi Pelayanan", name: "Juridno", photo: "" },
          ],
        },
        {
          title: "Kepala Urusan (Kaur)",
          layout: "division",
          members: [
            { position: "Kaur Tata Usaha & Umum", name: "Tri Hartono", photo: "" },
            { position: "Kaur Perencanaan", name: "Edy Sukarno", photo: "" },
            { position: "Kaur Keuangan", name: "Muksin", photo: "" },
          ],
        },
        {
          title: "Tim Teknis & Administrasi (Operator Desa)",
          layout: "operators",
          members: [
            { name: "Dieky Mahindra", photo: "" },
            { name: "Intan Agustin Lies Saputri", photo: "" },
          ],
        },
        {
          title: "Kepala Dusun (Kadus) / Penguasa Wilayah Posyandu",
          layout: "territory",
          members: [
            { name: "Eko Supriyadi", photo: "" },
            { name: "Abdul Jahidin", photo: "" },
            { name: "Fujar", photo: "" },
            { name: "Jiyanto", photo: "" },
            { name: "Marjaka", photo: "" },
            { name: "Ngatimin", photo: "" },
            { name: "Nuryadi", photo: "" },
            { name: "Rusnan", photo: "" },
            { name: "Saepudin", photo: "" },
          ],
        },
      ],
    },
  },
  penyebab: {
    title: "Penyebab dan Pencegahan Stunting",
    paragraphs: [
      "Stunting tidak terjadi secara tiba-tiba, melainkan akibat dari berbagai faktor yang saling terkait, terutama pada 1.000 Hari Pertama Kehidupan (HPK). Memahami akar masalahnya membantu keluarga, kader, dan pemerintah desa menentukan langkah pencegahan yang lebih tepat.",
      "Pencegahan perlu dilakukan dari hulu ke hilir: mulai dari kesehatan remaja putri dan ibu hamil, pemenuhan gizi bayi dan balita, kebersihan lingkungan, sampai pencatatan pertumbuhan anak secara rutin di Posyandu.",
    ],
    highlights: [
      {
        value: "0-23 bln",
        label: "Masa paling kritis untuk mencegah gangguan pertumbuhan jangka panjang.",
      },
      {
        value: "Protein",
        label: "Sumber protein hewani membantu pertumbuhan jaringan tubuh dan otak anak.",
      },
      {
        value: "Pantau",
        label: "Berat dan tinggi anak perlu dicatat berkala agar risiko cepat terlihat.",
      },
    ],
    sections: [
      {
        title: "Penyebab Utama Stunting",
        eyebrow: "Akar Masalah",
        tone: "blue",
        icon: "fa-magnifying-glass-chart",
        summary:
          "Penyebab stunting biasanya tidak berdiri sendiri. Anak bisa mengalami risiko lebih tinggi ketika asupan makan kurang, sering sakit, dan lingkungan rumah tidak mendukung perilaku hidup bersih.",
        points: [
          {
            title: "Kekurangan Gizi Kronis",
            icon: "fa-bowl-food",
            description:
              "Asupan gizi yang tidak memadai dalam waktu lama, baik pada ibu selama kehamilan maupun pada anak setelah lahir, dapat menghambat pertumbuhan.",
            tip: "Perhatikan kecukupan karbohidrat, protein, lemak sehat, vitamin, dan mineral.",
          },
          {
            title: "Pola Asuh Kurang Tepat",
            icon: "fa-hands-holding-child",
            description:
              "Kurangnya pengetahuan tentang ASI eksklusif, MPASI bergizi, dan pola makan anak dapat membuat kebutuhan gizi tidak terpenuhi.",
            tip: "Jadwal makan, variasi menu, dan respons orang tua saat anak sulit makan ikut berpengaruh.",
          },
          {
            title: "Infeksi Berulang",
            icon: "fa-virus-covid",
            description:
              "Diare, infeksi pernapasan, dan penyakit berulang dapat mengurangi nafsu makan serta menghambat penyerapan nutrisi.",
            tip: "Anak yang sering sakit perlu dipantau lebih dekat di Posyandu atau fasilitas kesehatan.",
          },
          {
            title: "Sanitasi dan Higiene Buruk",
            icon: "fa-hand-sparkles",
            description:
              "Akses air bersih dan sanitasi yang terbatas meningkatkan risiko penyakit, sehingga status gizi anak semakin mudah terganggu.",
            tip: "Cuci tangan pakai sabun, jamban sehat, dan air minum aman adalah bagian dari pencegahan.",
          },
          {
            title: "Kesehatan Ibu Saat Hamil",
            icon: "fa-person-pregnant",
            description:
              "Ibu hamil yang mengalami kurang energi kronis, anemia, atau jarang memeriksakan kehamilan berisiko melahirkan bayi dengan kondisi awal yang kurang optimal.",
            tip: "Pemeriksaan kehamilan rutin membantu mendeteksi anemia, tekanan darah, dan risiko lain lebih cepat.",
          },
          {
            title: "Berat Badan Lahir Rendah",
            icon: "fa-baby",
            description:
              "Bayi dengan berat lahir rendah membutuhkan pemantauan lebih intensif karena cadangan gizinya lebih terbatas dan pertumbuhannya lebih rentan tertinggal.",
            tip: "Catat hasil timbang dan ukur setiap bulan agar tren pertumbuhan tidak terlewat.",
          },
        ],
      },
      {
        title: "Langkah Pencegahan yang Disarankan",
        eyebrow: "Pencegahan",
        tone: "teal",
        icon: "fa-shield-heart",
        summary:
          "Pencegahan terbaik adalah kombinasi antara gizi cukup, layanan kesehatan rutin, pola asuh responsif, dan lingkungan yang bersih.",
        points: [
          {
            title: "Penuhi Gizi Ibu dan Anak",
            icon: "fa-plate-wheat",
            description:
              "Pastikan ibu hamil memperoleh gizi seimbang, tablet tambah darah sesuai arahan tenaga kesehatan, serta pemantauan kehamilan rutin.",
            tip: "Kader dapat mengingatkan jadwal pemeriksaan dan konsumsi tablet tambah darah.",
          },
          {
            title: "ASI Eksklusif dan MPASI Bergizi",
            icon: "fa-bottle-droplet",
            description:
              "Berikan ASI eksklusif selama 6 bulan, lalu lanjutkan MPASI yang kaya protein hewani, energi, dan mikronutrien.",
            tip: "Contoh protein hewani: telur, ikan, ayam, hati ayam, daging, dan susu sesuai usia.",
          },
          {
            title: "Pantau Pertumbuhan Berkala",
            icon: "fa-chart-simple",
            description:
              "Datang ke Posyandu untuk mengukur berat dan tinggi anak, mencatat hasil, serta membaca tren pertumbuhan dari waktu ke waktu.",
            tip: "Pengukuran yang konsisten membantu kader menentukan perlu edukasi, kunjungan rumah, atau rujukan.",
          },
          {
            title: "Jaga Sanitasi dan Imunisasi",
            icon: "fa-soap",
            description:
              "Biasakan cuci tangan, gunakan air bersih, lengkapi imunisasi, dan segera konsultasi jika anak sering sakit atau sulit makan.",
            tip: "Imunisasi dan kebersihan menurunkan risiko infeksi yang mengganggu tumbuh kembang.",
          },
          {
            title: "Stimulasi dan Kasih Sayang",
            icon: "fa-puzzle-piece",
            description:
              "Ajak anak berbicara, bermain, membaca, dan bergerak sesuai usia. Stimulasi membantu perkembangan otak berjalan bersama pertumbuhan fisik.",
            tip: "Aktivitas sederhana di rumah bisa menjadi latihan bahasa, motorik, dan sosial anak.",
          },
          {
            title: "Koordinasi Kader dan Keluarga",
            icon: "fa-people-arrows",
            description:
              "Jika ada anak dengan risiko, kader dapat mencatat, mengedukasi keluarga, melakukan pemantauan ulang, dan mengarahkan ke tenaga kesehatan.",
            tip: "Tindak lanjut cepat membuat masalah gizi tidak menunggu sampai berat.",
          },
        ],
      },
      {
        title: "Tanda Risiko yang Perlu Ditindaklanjuti",
        eyebrow: "Kewaspadaan",
        tone: "warm",
        icon: "fa-triangle-exclamation",
        summary:
          "Keluarga tidak perlu panik, tetapi perlu segera bertanya ke kader atau tenaga kesehatan bila muncul tanda-tanda berikut.",
        points: [
          {
            title: "Berat Badan Tidak Naik",
            icon: "fa-weight-scale",
            description:
              "Berat badan yang stagnan atau turun beberapa kali penimbangan berturut-turut bisa menjadi tanda awal masalah asupan atau penyakit.",
          },
          {
            title: "Anak Sering Sakit",
            icon: "fa-kit-medical",
            description:
              "Diare, batuk pilek berulang, demam, atau infeksi lain dapat membuat anak sulit makan dan nutrisi tidak terserap optimal.",
          },
          {
            title: "Sulit Makan Berkepanjangan",
            icon: "fa-utensils",
            description:
              "Anak yang terus menolak makan, muntah, atau hanya mau sedikit jenis makanan membutuhkan pendekatan makan yang lebih terarah.",
          },
          {
            title: "Tinggi Tidak Sesuai Usia",
            icon: "fa-ruler-vertical",
            description:
              "Jika tinggi badan terlihat jauh lebih pendek dibanding anak seusianya, lakukan pengukuran ulang dan konsultasikan hasilnya.",
          },
        ],
      },
    ],
  },
  dampak: {
    title: "Konsekuensi Serius dari Stunting",
    paragraphs: [
      "Stunting bukanlah sekadar masalah fisik (tubuh pendek), tetapi membawa dampak merugikan yang bersifat permanen hingga dewasa.",
      "Dampak stunting dapat muncul pada kesehatan, kemampuan belajar, daya tahan tubuh, sampai produktivitas saat anak tumbuh dewasa. Karena itu, pencegahan dan deteksi dini jauh lebih baik daripada menunggu masalah menjadi berat.",
    ],
    highlights: [
      {
        value: "Belajar",
        label: "Perkembangan otak yang terganggu dapat memengaruhi konsentrasi dan prestasi sekolah.",
      },
      {
        value: "Imunitas",
        label: "Anak lebih rentan sakit sehingga pemulihan gizi bisa semakin lambat.",
      },
      {
        value: "Masa Depan",
        label: "Risiko kesehatan dan produktivitas dapat terbawa hingga usia dewasa.",
      },
    ],
    points: [
      {
        title: "Gangguan Perkembangan Kognitif",
        icon: "fa-brain",
        description:
          "Perkembangan otak anak terganggu secara permanen, yang mengakibatkan penurunan kemampuan belajar, memori, dan konsentrasi. Ini berdampak langsung pada prestasi akademik anak.",
      },
      {
        title: "Melemahnya Sistem Kekebalan Tubuh",
        icon: "fa-shield-virus",
        description:
          "Anak stunting lebih sering sakit karena daya tahan tubuhnya tidak optimal. Mereka lebih rentan terhadap infeksi, yang semakin memperburuk status gizi mereka.",
      },
      {
        title: "Peningkatan Risiko Penyakit Kronis",
        icon: "fa-heart-pulse",
        description:
          "Saat dewasa, anak yang mengalami stunting lebih berisiko menderita penyakit tidak menular seperti obesitas, diabetes tipe 2, penyakit jantung, dan stroke.",
      },
      {
        title: "Menurunnya Produktivitas Ekonomi",
        icon: "fa-chart-line",
        description:
          "Akibat kemampuan kognitif yang terbatas, individu yang stunting saat kecil cenderung memiliki produktivitas kerja dan pendapatan yang lebih rendah saat dewasa.",
      },
    ],
    sections: [
      {
        title: "Dampak pada Tahap Kehidupan Anak",
        eyebrow: "Perjalanan Dampak",
        tone: "blue",
        icon: "fa-timeline",
        summary:
          "Dampak stunting bisa terlihat berbeda di setiap usia, sehingga pemantauan perlu dilakukan terus menerus.",
        points: [
          {
            title: "Bayi dan Balita",
            icon: "fa-baby-carriage",
            description:
              "Pertumbuhan berat dan tinggi bisa melambat, anak lebih mudah sakit, dan perkembangan motorik seperti duduk, berdiri, atau berjalan dapat tertunda.",
          },
          {
            title: "Usia Pra Sekolah",
            icon: "fa-child-reaching",
            description:
              "Anak dapat mengalami keterlambatan bicara, kurang aktif bermain, atau lebih sulit mengikuti instruksi sederhana.",
          },
          {
            title: "Usia Sekolah",
            icon: "fa-school",
            description:
              "Konsentrasi, daya ingat, dan kemampuan memahami pelajaran dapat menurun sehingga anak membutuhkan dukungan belajar lebih intensif.",
          },
          {
            title: "Usia Dewasa",
            icon: "fa-briefcase",
            description:
              "Dampak jangka panjang dapat memengaruhi kesehatan, kapasitas kerja, dan kesempatan ekonomi ketika anak tumbuh dewasa.",
          },
        ],
      },
      {
        title: "Apa yang Bisa Dilakukan Setelah Risiko Terlihat?",
        eyebrow: "Tindak Lanjut",
        tone: "teal",
        icon: "fa-clipboard-check",
        summary:
          "Jika hasil pengukuran menunjukkan risiko, langkah berikutnya adalah memastikan data benar, membaca tren, dan melibatkan tenaga kesehatan.",
        points: [
          {
            title: "Ukur Ulang dengan Benar",
            icon: "fa-ruler-combined",
            description:
              "Pastikan alat ukur rata, posisi anak sesuai, dan angka berat atau tinggi dicatat dengan benar sebelum mengambil kesimpulan.",
          },
          {
            title: "Lihat Riwayat Pertumbuhan",
            icon: "fa-chart-area",
            description:
              "Bandingkan hasil bulan ini dengan bulan sebelumnya. Tren yang menurun lebih penting ditindaklanjuti daripada satu angka saja.",
          },
          {
            title: "Edukasi Menu Harian",
            icon: "fa-kitchen-set",
            description:
              "Bantu keluarga menyusun contoh menu lokal yang terjangkau, tinggi protein, dan sesuai usia anak.",
          },
          {
            title: "Rujuk Bila Perlu",
            icon: "fa-user-doctor",
            description:
              "Anak dengan tanda gizi buruk, sakit berulang, atau hasil pengukuran yang mengkhawatirkan perlu diarahkan ke fasilitas kesehatan.",
          },
        ],
      },
    ],
  },
  pencegahan: {
    title: "Kunci Pencegahan Stunting",
    paragraphs: [
      "Pencegahan stunting paling efektif jika dilakukan sedini mungkin, dengan fokus pada 1.000 Hari Pertama Kehidupan (HPK).",
    ],
    points: [
      {
        title: "Intervensi Gizi Spesifik",
        description:
          "Ini adalah intervensi yang berhubungan langsung dengan asupan gizi, meliputi pemenuhan gizi seimbang bagi ibu hamil, pemberian ASI eksklusif selama 6 bulan, dilanjutkan dengan MPASI yang kaya protein hewani, serta pemantauan pertumbuhan rutin.",
      },
      {
        title: "Intervensi Gizi Sensitif",
        description:
          "Ini adalah intervensi pendukung yang tidak kalah penting, seperti menyediakan akses terhadap air bersih dan sanitasi layak, meningkatkan edukasi tentang pola asuh dan gizi, serta memastikan akses mudah ke layanan kesehatan berkualitas.",
      },
    ],
  },
};
