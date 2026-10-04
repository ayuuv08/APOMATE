import { Pharmacist } from '../types';

export const PHARMACISTS_DATABASE: Pharmacist[] = [
  {
    id: 'apt-savitri',
    name: 'Apt. Savitri Swandewi, S.Farm',
    sipa: '19960412/SIPA_3171/2023/1021',
    stra: '19960412/STRA-IAI/2022/4482',
    almaMater: 'Universitas Indonesia (UI) - Farmasi Klinis',
    specialty: 'Konseling Swamedikasi & Edukasi Dagusibu',
    yearsOfExperience: 6,
    rating: 4.9,
    consultationCount: 1420,
    status: 'online',
    avatarUrl: '/src/assets/images/apomate_pharmacist_avatar_1790862990916.jpg',
    hospitalOrApotek: 'Apotek Sehat Mandiri & Telefarmasi Apomate',
    bio: 'Fokus mendampingi masyarakat dalam swamedikasi yang rasional, mencegah penyalahgunaan obat keras, dan memastikan perhitungan dosis tepat terutama bagi keluarga.'
  },
  {
    id: 'apt-rizky',
    name: 'Apt. Rizky Pratama, S.Farm',
    sipa: '19940822/SIPA_3172/2022/0984',
    stra: '19940822/STRA-IAI/2021/3190',
    almaMater: 'Institut Teknologi Bandung (ITB)',
    specialty: 'Farmakoterapi & Skrining Interaksi Obat',
    yearsOfExperience: 7,
    rating: 4.9,
    consultationCount: 1890,
    status: 'online',
    avatarUrl: '/src/assets/images/apomate_pharmacist_avatar_1790862990916.jpg',
    hospitalOrApotek: 'Instalasi Farmasi RS Hermina & Konsultan Apomate',
    bio: 'Ahli dalam evaluasi polifarmasi, interaksi obat antihipertensi, obat lambung, dan pengawasan swamedikasi obat bebas terbatas.'
  },
  {
    id: 'apt-nabila',
    name: 'Apt. Nabila Putri, S.Farm',
    sipa: '19970115/SIPA_3173/2024/2045',
    stra: '19970115/STRA-IAI/2023/5102',
    almaMater: 'Universitas Gadjah Mada (UGM)',
    specialty: 'Dosis Pediatrik (Anak) & Ibu Menyusui',
    yearsOfExperience: 5,
    rating: 4.8,
    consultationCount: 960,
    status: 'online',
    avatarUrl: '/src/assets/images/apomate_pharmacist_avatar_1790862990916.jpg',
    hospitalOrApotek: 'Pusat Layanan Kesehatan Ibu & Anak Yogyakarta',
    bio: 'Membantu para orang tua menghitung dosis sirup anak berdasarkan bobot tubuh nyata (mg/kgBB) serta keamanan obat pada masa laktasi.'
  },
  {
    id: 'apt-dimas',
    name: 'Apt. Dimas Wicaksono, M.Clin.Pharm',
    sipa: '19920310/SIPA_3170/2021/0451',
    stra: '19920310/STRA-IAI/2020/2201',
    almaMater: 'Universitas Airlangga (UNAIR)',
    specialty: 'Farmasi Klinis Geriatri & Penyakit Kronis',
    yearsOfExperience: 9,
    rating: 5.0,
    consultationCount: 2310,
    status: 'busy',
    avatarUrl: '/src/assets/images/apomate_pharmacist_avatar_1790862990916.jpg',
    hospitalOrApotek: 'RSUP Dr. Sardjito & Dosen Praktisi Farmasi',
    bio: 'Menelaah keamanan swamedikasi bagi lansia yang memiliki komorbid seperti diabetes, ginjal, atau hipertensi.'
  }
];
