import { Medicine, DrugInteraction } from '../types';

export const MEDICINES_DATABASE: Medicine[] = [
  {
    id: 'med-paracetamol',
    name: 'Paracetamol 500 mg Kaplet',
    genericName: 'Paracetamol / Acetaminophen',
    category: 'bebas',
    categoryLabel: 'Obat Bebas',
    brand: 'Generik BPOM / Sanbe',
    strength: '500 mg per kaplet',
    form: 'kaplet',
    indications: ['Demam', 'Sakit Kepala', 'Nyeri Ringan hingga Sedang', 'Sakit Gigi'],
    composition: 'Tiap kaplet mengandung Paracetamol 500 mg',
    standardAdultDose: '500 mg – 1000 mg (1-2 kaplet) tiap 4–6 jam bila perlu. Maksimal 4000 mg (8 kaplet) per 24 jam.',
    standardPediatricDose: '10–15 mg/kgBB per kali pemberian, diberikan tiap 4–6 jam bila demam. Maksimal 60 mg/kgBB per hari.',
    directions: 'Dapat diminum sebelum atau sesudah makan dengan segelas air putih.',
    timing: 'bebas',
    maxDurationDays: 3,
    warnings: [
      'Hati-hati pada pasien dengan gangguan fungsi hati atau ginjal.',
      'Jangan mengonsumsi obat batuk/flu lain yang juga mengandung Paracetamol secara bersamaan (risiko overdosis dan toksisitas hepar).',
      'Hindari konsumsi alkohol selama penggunaan parasetamol.',
      'Jika demam berlanjut lebih dari 3 hari, segera periksakan ke dokter.'
    ],
    contraindications: ['Hipersensitivitas terhadap paracetamol', 'Gagal hati berat'],
    sideEffects: ['Jarang terjadi reaksi alergi ruam kulit', 'Kerusakan hati jika melebihi dosis maksimal'],
    storageAdvice: 'Simpan di bawah suhu 30°C di tempat kering, terlindung dari cahaya matahari langsung.',
    dagusibuTip: 'Gunakan saat demam atau nyeri saja. Hentikan bila keluhan telah mereda. Jangan simpan obat kadaluwarsa.',
    sampleBarcode: '8991234567801'
  },
  {
    id: 'med-antasida-doen',
    name: 'Antasida DOEN Suspensi / Tablet Kunyah',
    genericName: 'Aluminium Hidroksida & Magnesium Hidroksida',
    category: 'bebas',
    categoryLabel: 'Obat Bebas',
    brand: 'Kimia Farma / Generik',
    strength: 'Al(OH)3 200 mg + Mg(OH)2 200 mg per sendok takar / tablet',
    form: 'sirup',
    indications: ['Maag / Sakit Lambung', 'Mual & Kembung', 'Nyeri Ulu Hati', 'Hiperasiditas Lambung'],
    composition: 'Aluminium Hidroksida 200 mg, Magnesium Hidroksida 200 mg, Simethicone 20 mg',
    standardAdultDose: '1–2 tablet kunyah atau 1–2 sendok takar (5–10 ml) 3–4 kali sehari.',
    standardPediatricDose: 'Anak 6–12 tahun: 1/2–1 sendok takar (2.5–5 ml) 3–4 kali sehari.',
    directions: 'Diminum 1 jam sebelum makan atau 2 jam setelah makan dan menjelang tidur malam. Tablet harus dikunyah terlebih dahulu sampai halus sebelum ditelan.',
    timing: 'sebelum_makan',
    maxDurationDays: 5,
    warnings: [
      'Beri jeda 1–2 jam bila meminum antibiotik (Ciprofloxacin, Tetrasiklin) atau zat besi karena antasida menghambat penyerapan obat lain.',
      'Tidak dianjurkan digunakan terus menerus lebih dari 2 minggu kecuali atas anjuran dokter.',
      'Hati-hati pada penderita gangguan ginjal berat.'
    ],
    contraindications: ['Gangguan fungsi ginjal berat', 'Hipersensitivitas antasida'],
    sideEffects: ['Sembelit ringan (akibat aluminium) atau diare ringan (akibat magnesium)'],
    storageAdvice: 'Kocok dahulu suspensi sebelum diminum. Simpan di tempat sejuk, botol tertutup rapat.',
    dagusibuTip: 'Untuk sediaan suspensi sirup, jangan disimpan lebih dari 30 hari setelah segel pertama kali dibuka.',
    sampleBarcode: '8991234567802'
  },
  {
    id: 'med-cetirizine',
    name: 'Cetirizine HCl 10 mg Tablet',
    genericName: 'Cetirizine Dihydrochloride',
    category: 'bebas_terbatas',
    categoryLabel: 'Obat Bebas Terbatas (P.No. 1: Awas! Obat Keras. Bacalah aturan memakainya)',
    brand: 'Kalbe / Generik',
    strength: '10 mg per tablet',
    form: 'tablet',
    indications: ['Alergi Kulit (Biduran/Gatal)', 'Rinitis Alergi (Bersin-bersin)', 'Mata Berair Karena Alergi'],
    composition: 'Tiap tablet mengandung Cetirizine HCl 10 mg',
    standardAdultDose: '10 mg (1 tablet) sekali sehari pada malam hari.',
    standardPediatricDose: 'Anak 6–12 tahun: 5 mg (1/2 tablet) dua kali sehari atau 10 mg sekali sehari.',
    directions: 'Dapat diminum sebelum atau sesudah makan dengan bantuan air.',
    timing: 'bebas',
    maxDurationDays: 3,
    warnings: [
      'Peringatan P.No. 1: Awas! Obat Keras. Bacalah aturan memakainya.',
      'Dapat menyebabkan kantuk pada sebagian orang; hindari mengemudi atau mengoperasikan mesin setelah minum obat.',
      'Hindari konsumsi bersamaan dengan alkohol atau obat penenang.'
    ],
    contraindications: ['Ibu hamil trimester 1 (konsultasikan ke dokter)', 'Penderita gagal ginjal stadium akhir'],
    sideEffects: ['Sedasi/mengantuk ringan, mulut kering, pusing'],
    storageAdvice: 'Simpan pada suhu kamar (15–25°C) terlindung dari kelembapan tinggi.',
    dagusibuTip: 'Gunakan antihistamin hanya saat reaksi alergi timbul. Kenali dan hindari pemicu utama alergen Anda.',
    sampleBarcode: '8991234567803'
  },
  {
    id: 'med-ibuprofen',
    name: 'Ibuprofen 200 mg / 400 mg Tablet',
    genericName: 'Ibuprofen (NSAID)',
    category: 'bebas_terbatas',
    categoryLabel: 'Obat Bebas Terbatas (P.No. 1)',
    brand: 'Proris / Generik',
    strength: '200 mg / 400 mg per tablet',
    form: 'tablet',
    indications: ['Nyeri Haid (Dismenore)', 'Nyeri Otot & Sendi', 'Sakit Gigi', 'Demam Tinggi'],
    composition: 'Tiap tablet mengandung Ibuprofen 200 mg / 400 mg',
    standardAdultDose: '200–400 mg tiap 6–8 jam setelah makan bila nyeri/demam. Maksimal 1200 mg/hari untuk swamedikasi.',
    standardPediatricDose: '5–10 mg/kgBB tiap 6–8 jam. Wajib diminum SESUDAH MAKAN.',
    directions: 'MUTLAK diminum SEGERA SESUDAH MAKAN untuk melindungi mukosa lambung dari iritasi.',
    timing: 'sesudah_makan',
    maxDurationDays: 3,
    warnings: [
      'HATI-HATI untuk penderita Maag/Tukak Lambung, Asma, atau riwayat perdarahan saluran cerna.',
      'TIDAK disarankan untuk ibu hamil (terutama trimester ketiga).',
      'Hindari konsumsi bersama aspirin atau antikoagulan tanpa pengawasan dokter.'
    ],
    contraindications: ['Riwayat tukak lambung aktif', 'Kehamilan trimester akhir', 'Alergi NSAID/Aspirin'],
    sideEffects: ['Perih ulu hati, mual, perut kembung, ruam'],
    storageAdvice: 'Simpan di tempat kering dan sejuk di bawah 30°C.',
    dagusibuTip: 'Jangan meminum obat anti-nyeri saat perut kosong untuk mencegah iritasi lambung.',
    sampleBarcode: '8991234567804'
  },
  {
    id: 'med-obh-combi',
    name: 'OBH Sirup Obat Batuk Berdahak & Flu',
    genericName: 'Succus Liquiritae, Paracetamol, Ammonium Chloride, Pseudoephedrine',
    category: 'bebas_terbatas',
    categoryLabel: 'Obat Bebas Terbatas (P.No. 1)',
    brand: 'Combiphar / Generik',
    strength: 'Tiap 15 ml mengandung Succus Liq 500 mg, Paracetamol 150 mg, Amm. Chloride 100 mg, Pseudoephedrine 15 mg',
    form: 'sirup',
    indications: ['Batuk Berdahak', 'Hidung Tersumbat', 'Flu & Bersin Disertai Demam'],
    composition: 'Succus Liquiritae, Paracetamol, Ammonium Chloride, Pseudoephedrine HCl, Chlorphenamine Maleate',
    standardAdultDose: '15 ml (1 sendok makan takar) 3 kali sehari.',
    standardPediatricDose: 'Anak 6–12 tahun: 7.5 ml (1/2 sendok makan takar) 3 kali sehari.',
    directions: 'Diminum sesudah makan. Gunakan sendok takar obat yang tersedia dalam kemasan.',
    timing: 'sesudah_makan',
    maxDurationDays: 3,
    warnings: [
      'Peringatan P.No. 1. Mengandung Pseudoephedrine: hati-hati pada pasien Hipertensi atau Penyakit Jantung.',
      'Dapat menyebabkan kantuk. Jangan berkendara setelah minum sirup ini.',
      'Sudah mengandung Paracetamol; jangan didobel dengan Paracetamol tablet!'
    ],
    contraindications: ['Penderita hipertensi berat', 'Penderita yang sedang terapi MAOI', 'Glaukoma sudut sempit'],
    sideEffects: ['Kantuk, jantung berdebar ringan, mulut kering'],
    storageAdvice: 'Tutup rapat botol setelah dibuka. Simpan pada suhu ruang tidak terpapar sinar matahari.',
    dagusibuTip: 'Gunakan sendok takar berskala mililiter, jangan gunakan sendok makan rumah tangga karena takarannya tidak akurat.',
    sampleBarcode: '8991234567805'
  },
  {
    id: 'med-oralit',
    name: 'Oralit 200 mg Serbuk Sachet',
    genericName: 'Larutan Garam Rehidrasi Oral (Oral Rehydration Salts)',
    category: 'bebas',
    categoryLabel: 'Obat Bebas',
    brand: 'Phapros / Generik',
    strength: 'Sachet larut dalam 200 ml air matang',
    form: 'sachet',
    indications: ['Mencegah dan Mengatasi Dehidrasi Akibat Diare & Muntah'],
    composition: 'Natrium Klorida 0.52 g, Kalium Klorida 0.30 g, Trinatrium Sitrat Dihidrat 0.58 g, Glukosa Anhidrat 2.70 g',
    standardAdultDose: '1–2 gelas (200–400 ml) setiap kali buang air besar cair.',
    standardPediatricDose: 'Anak < 1 tahun: 50–100 ml tiap BAB cair. Anak 1–5 tahun: 100–200 ml tiap BAB cair. Berikan sedikit-sedikit tapi sering.',
    directions: 'Larutkan 1 sachet ke dalam tepat 200 ml air matang (hangat atau dingin). Jangan dimasak. Jangan disimpan lebih dari 24 jam setelah dilarutkan.',
    timing: 'bebas',
    maxDurationDays: 2,
    warnings: [
      'Oralit TIDAK menghentikan diare secara langsung, melainkan menggantikan cairan & elektrolit tubuh yang hilang.',
      'Jika diare disertai darah, lendir, atau demam tinggi, segera ke dokter atau fasilitas kesehatan terdekat.',
      'Perhatikan tanda dehidrasi berat: mata cekung, cubitan kulit kembali sangat lambat, lemas tidak mau minum.'
    ],
    contraindications: ['Obstruksi usus', 'Ketidakmampuan minum cairan karena syok berat'],
    sideEffects: ['Muntah ringan jika diminum terlalu terburu-buru'],
    storageAdvice: 'Simpan sachet dalam keadaan belum robek di tempat kering.',
    dagusibuTip: 'Larutan oralit yang tidak habis dalam 24 jam harus dibuang dan dibuatkan larutan baru.',
    sampleBarcode: '8991234567806'
  },
  {
    id: 'med-amoxicillin',
    name: 'Amoxicillin 500 mg Kaplet (Obat Keras - Butuh Resep)',
    genericName: 'Amoxicillin Trihydrate',
    category: 'keras',
    categoryLabel: 'Obat Keras (Lingkaran Merah Huruf K - Wajib Resep Dokter)',
    brand: 'Sanbe / Bernofarm / Generik',
    strength: '500 mg per kaplet',
    form: 'kaplet',
    indications: ['Infeksi Bakteri Tertentu (Hanya atas diagnosa dokter: ISPA Bakterial, Otitis Media, Infeksi Gigi)'],
    composition: 'Tiap kaplet mengandung Amoxicillin Trihydrate setara dengan Amoxicillin 500 mg',
    standardAdultDose: 'HARUS SESUAI RESEP DOKTER. Umumnya 500 mg tiap 8 jam selama 5–7 hari berturut-turut.',
    standardPediatricDose: 'HARUS SESUAI RESEP DOKTER spesifik berat badan.',
    directions: 'Diminum teratur pada jam yang sama hingga habis sesuai durasi resep dokter.',
    timing: 'sesudah_makan',
    maxDurationDays: 7,
    warnings: [
      'PERINGATAN KERAS: AMBILAH HANYA DENGAN RESEP DOKTER. Dilarang keras swamedikasi antibiotik!',
      'Antibiotik TIDAK mempan terhadap infeksi virus seperti flu, batuk pilek biasa, atau demam biasa.',
      'Penggunaan sembarangan memicu Resistensi Antimikroba (AMR) yang berbahaya bagi diri sendiri dan keluarga.',
      'Wajib dihabiskan jika telah diresepkan oleh dokter.'
    ],
    contraindications: ['Riwayat alergi antibiotik golongan Penicillin atau Sefalosforin'],
    sideEffects: ['Diare, ruam kemerahan, mual'],
    storageAdvice: 'Simpan di tempat kering dan sejuk di bawah 25°C.',
    dagusibuTip: 'Jangan pernah menyimpan sisa antibiotik untuk dipakai di lain waktu, dan jangan membagikannya ke orang lain.',
    sampleBarcode: '8991234567807'
  }
];

export const DRUG_INTERACTIONS_DATA: DrugInteraction[] = [
  {
    drugA: 'Paracetamol',
    drugB: 'OBH Sirup / Obat Flu Komplit',
    severity: 'berat',
    description: 'Banyak sirup flu komplit sudah mengandung Paracetamol (150-500 mg). Meminumnya bersamaan dengan tablet Paracetamol 500mg berisiko menyebabkan overdosis harian (> 4.000 mg) yang merusak organ hati (hepatotoksisitas).',
    clinicalAdvice: 'Pilihlah salah satu saja. Jika sudah minum sirup flu yang ada parasetamolnya, jangan minum parasetamol tablet lagi.'
  },
  {
    drugA: 'Antasida DOEN',
    drugB: 'Ibuprofen / NSAID',
    severity: 'sedang',
    description: 'Antasida dapat mengubah pH lambung dan berpotensi menurunkan atau memperlambat penyerapan ibuprofen jika diminum dalam waktu yang tepat bersamaan.',
    clinicalAdvice: 'Beri jeda minimal 1 hingga 2 jam antara meminum antasida dan obat pereda nyeri/antiinflamasi.'
  },
  {
    drugA: 'Cetirizine',
    drugB: 'Alkohol / Obat Penenang Batuk Dextromethorphan',
    severity: 'berat',
    description: 'Kombinasi obat antihistamin dengan alkohol atau obat depresan sistem saraf pusat memperparah rasa kantuk ekstrem, disorientasi, dan penurunan refleks motorik.',
    clinicalAdvice: 'Hindari minuman beralkohol dan jangan mengemudi setelah mengonsumsi Cetirizine.'
  },
  {
    drugA: 'Ibuprofen',
    drugB: 'Aspirin / Obat Pengencer Darah',
    severity: 'berat',
    description: 'Penggunaan bersamaan meningkatkan risiko perdarahan lambung dan dapat meniadakan efek kardioprotektif dari aspirin dosis rendah.',
    clinicalAdvice: 'Konsultasikan segera dengan apoteker atau dokter sebelum mengonsumsi obat antinyeri bila sedang dalam terapi aspirin.'
  }
];

export const SYMPTOM_OPTIONS = [
  { id: 'demam', label: 'Demam / Panas Tubuh', defaultMedicines: ['med-paracetamol'] },
  { id: 'sakit_kepala', label: 'Sakit Kepala / Pusing', defaultMedicines: ['med-paracetamol', 'med-ibuprofen'] },
  { id: 'batuk_berdahak', label: 'Batuk Berdahak', defaultMedicines: ['med-obh-combi'] },
  { id: 'flu_bersin', label: 'Flu, Pilek & Hidung Tersumbat', defaultMedicines: ['med-obh-combi', 'med-cetirizine'] },
  { id: 'nyeri_lambung', label: 'Maag / Nyeri Ulu Hati / Kembung', defaultMedicines: ['med-antasida-doen'] },
  { id: 'gatal_alergi', label: 'Gatal-gatal / Biduran / Alergi', defaultMedicines: ['med-cetirizine'] },
  { id: 'nyeri_otot', label: 'Nyeri Otot / Pegal Linu / Sakit Gigi', defaultMedicines: ['med-ibuprofen', 'med-paracetamol'] },
  { id: 'diare', label: 'Diare Cair / Buang Air Berulang', defaultMedicines: ['med-oralit'] },
];
