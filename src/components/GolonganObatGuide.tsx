import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Official 2D Flat Vector Drug Logos strictly adhering to Indonesian Ministry of Health (Kemenkes RI)
 * & BPOM RI official standards (No 3D effects, no glossy spheres, accurate regulatory geometry).
 */
export const OfficialKemenkesDrugLogo: React.FC<{
  category: 'bebas' | 'bebas_terbatas' | 'keras' | 'narkotika';
  className?: string;
}> = ({ category, className = 'w-10 h-10' }) => {
  if (category === 'bebas') {
    // Permenkes No. 917/Menkes/Per/X/1993: Lingkaran hijau bulat utuh dengan garis tepi tebal berwarna hitam.
    return (
      <svg
        viewBox="0 0 48 48"
        className={`${className} shrink-0`}
        aria-label="Logo Resmi Obat Bebas Kemenkes RI"
      >
        <circle cx="24" cy="24" r="21" fill="#16A34A" stroke="#000000" strokeWidth="4" />
      </svg>
    );
  }

  if (category === 'bebas_terbatas') {
    // Kepmenkes No. 2380/A/SK/VI/83: Lingkaran biru tua bulat utuh dengan garis tepi tebal berwarna hitam.
    return (
      <svg
        viewBox="0 0 48 48"
        className={`${className} shrink-0`}
        aria-label="Logo Resmi Obat Bebas Terbatas Kemenkes RI"
      >
        <circle cx="24" cy="24" r="21" fill="#0284C7" stroke="#000000" strokeWidth="4" />
      </svg>
    );
  }

  if (category === 'keras') {
    // Kepmenkes No. 197/A/SK/77: Lingkaran merah dengan garis tepi hitam, dan di dalamnya terdapat huruf kapital K hitam yang menyentuh garis tepi.
    return (
      <svg
        viewBox="0 0 48 48"
        className={`${className} shrink-0`}
        aria-label="Logo Resmi Obat Keras Kemenkes RI"
      >
        <circle cx="24" cy="24" r="21" fill="#DC2626" stroke="#000000" strokeWidth="4" />
        <path
          d="M13 8.5 H19 V21.8 L29.5 8.5 H37.5 L25.5 23.5 L38 39.5 H30 L19 25.5 V39.5 H13 Z"
          fill="#000000"
        />
      </svg>
    );
  }

  // Permenkes RI: Lingkaran putih dengan garis tepi merah tebal, di dalamnya terdapat tanda Palang Medali Merah.
  return (
    <svg
      viewBox="0 0 48 48"
      className={`${className} shrink-0`}
      aria-label="Logo Resmi Narkotika Kemenkes RI"
    >
      <circle cx="24" cy="24" r="21" fill="#FFFFFF" stroke="#DC2626" strokeWidth="4" />
      <path
        d="M19 7 H29 V19 H41 V29 H29 V41 H19 V29 H7 V19 H19 Z"
        fill="#DC2626"
      />
    </svg>
  );
};

export const GolonganObatGuide: React.FC = () => {
  const [showPeringatanDetail, setShowPeringatanDetail] = useState(false);

  const categories: Array<{
    id: 'bebas' | 'bebas_terbatas' | 'keras' | 'narkotika';
    name: string;
    colorBadge: string;
    borderAccent: string;
    symbolDesc: string;
    definition: string;
    example: string;
    swamedikasiRule: string;
  }> = [
    {
      id: 'bebas',
      name: 'Obat Bebas',
      colorBadge: 'bg-[#0DBFCD] text-white',
      borderAccent: 'border-[#0DBFCD]',
      symbolDesc: 'Lingkaran hijau solid dengan garis tepi tebal berwarna hitam (Permenkes RI).',
      definition: 'Obat yang dapat dijual secara bebas kepada masyarakat tanpa resep dokter di apotek, toko obat berizin, maupun swalayan.',
      example: 'Paracetamol, Vitamin C, Antasida DOEN, Oralit.',
      swamedikasiRule: 'Aman untuk swamedikasi gejala ringan sesuai aturan pakai pada kemasan.'
    },
    {
      id: 'bebas_terbatas',
      name: 'Obat Bebas Terbatas',
      colorBadge: 'bg-[#77DBAA] text-[#101D34]',
      borderAccent: 'border-[#77DBAA]',
      symbolDesc: 'Lingkaran biru tua dengan garis tepi hitam, wajib disertai kotak tanda peringatan (P.No. 1 s/d P.No. 6).',
      definition: 'Obat keras yang pada jumlah dan takaran tertentu masih dapat dibeli tanpa resep dokter, namun penggunaannya harus mematuhi petunjuk khusus.',
      example: 'Cetirizine tablet, Obat flu kombinasi dekongestan, Obat tetes mata iritasi ringan, Salep antijamur.',
      swamedikasiRule: 'Boleh untuk swamedikasi dengan membaca teliti tanda peringatan dan tidak melebihi dosis anjuran.'
    },
    {
      id: 'keras',
      name: 'Obat Keras',
      colorBadge: 'bg-[#6E56A9] text-white',
      borderAccent: 'border-[#6E56A9]',
      symbolDesc: 'Lingkaran merah bergaris tepi hitam dengan huruf "K" hitam yang menyentuh garis tepi.',
      definition: 'Obat yang hanya boleh diserahkan oleh apoteker dengan resep dokter karena memiliki efek farmakologis kuat dan risiko toksisitas tinggi.',
      example: 'Semua jenis Antibiotik (Amoxicillin, Ciprofloxacin), Antihipertensi (Amlodipine), Antidiabetes (Metformin), Obat Jantung.',
      swamedikasiRule: 'DILARANG SWAMEDIKASI! Wajib konsultasi ke dokter untuk mendapatkan diagnosa dan resep resmi.'
    },
    {
      id: 'narkotika',
      name: 'Narkotika & Psikotropika',
      colorBadge: 'bg-[#B566C0] text-white',
      borderAccent: 'border-[#B566C0]',
      symbolDesc: 'Lingkaran putih bergaris tepi merah dengan simbol Palang Medali Merah di tengahnya.',
      definition: 'Zat atau obat yang dapat menyebabkan penurunan atau perubahan kesadaran, hilangnya rasa, mengurangi hingga menghilangkan rasa nyeri, serta ketergantungan.',
      example: 'Kodein, Morfin, Diazepam, Alprazolam.',
      swamedikasiRule: 'SANGAT DILARANG KERAS untuk swamedikasi. Pengawasan distribusi berjenjang dengan resep dokter spesialis.'
    }
  ];

  const tandaPeringatanList = [
    { code: 'P.No. 1', text: 'Awas! Obat Keras. Bacalah aturan memakainya.', sample: 'Obat batuk & flu, analgesik tertentu' },
    { code: 'P.No. 2', text: 'Awas! Obat Keras. Hanya untuk kumur, jangan ditelan.', sample: 'Obat kumur povidone iodine / gargle' },
    { code: 'P.No. 3', text: 'Awas! Obat Keras. Hanya untuk bagian luar badan.', sample: 'Salep kulit, antiseptik luka' },
    { code: 'P.No. 4', text: 'Awas! Obat Keras. Hanya untuk dibakar.', sample: 'Rokok antiasma (sangat jarang saat ini)' },
    { code: 'P.No. 5', text: 'Awas! Obat Keras. Tidak boleh ditelan.', sample: 'Ammonia cair, bedak salisil' },
    { code: 'P.No. 6', text: 'Awas! Obat Keras. Obat wasir, jangan ditelan.', sample: 'Suppositoria anal wasir' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4EFE9] text-xs sm:text-sm font-extrabold text-[#6E56A9] mb-3 shadow-xs">
            <Shield className="w-4 h-4 text-[#0DBFCD]" />
            <span>Panduan Edukasi Regulasi BPOM RI & Kemenkes RI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101D34] tracking-tight">
            Kenali 4 Golongan Obat & Simbol Resminya
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-semibold mt-2 leading-relaxed">
            Sebelum mengonsumsi obat secara mandiri, selalu periksa tanda lingkaran khusus 2D pada kemasan untuk memastikan obat tersebut legal dan aman digunakan tanpa resep dokter.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-3xl p-6 bg-[#E4EFE9]/60 border-2 ${cat.borderAccent} shadow-sm hover:shadow-lg transition-all flex flex-col justify-between`}
            >
              <div>
                {/* Header Badge & Official Kemenkes 2D Logo */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide ${cat.colorBadge}`}>
                    {cat.name}
                  </span>
                  <div className="p-1 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center shrink-0">
                    <OfficialKemenkesDrugLogo category={cat.id} className="w-9 h-9" />
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-xl font-extrabold text-[#101D34]">{cat.name}</h3>
                  <p className="text-sm text-slate-800 font-bold mt-1 leading-relaxed">{cat.symbolDesc}</p>
                </div>

                <p className="text-sm sm:text-base text-slate-900 leading-relaxed mb-4 font-semibold">
                  {cat.definition}
                </p>

                <div className="p-3.5 rounded-2xl bg-white/95 text-sm sm:text-base mb-4 border border-slate-200 shadow-2xs">
                  <span className="font-extrabold text-[#6E56A9] block mb-1">Contoh Obat:</span>
                  <span className="text-slate-900 font-semibold leading-relaxed">{cat.example}</span>
                </div>
              </div>

              {/* Swamedikasi Rule Flag */}
              <div className="pt-3 border-t border-slate-300 text-sm sm:text-base font-extrabold">
                <span className={cat.id === 'keras' || cat.id === 'narkotika' ? 'text-red-700' : 'text-teal-800'}>
                  {cat.swamedikasiRule}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Section: Tanda Peringatan P.No 1 - 6 */}
        <div className="mt-8 rounded-3xl bg-[#E4EFE9] border border-[#C2A0DD] p-5 sm:p-6">
          <button
            onClick={() => setShowPeringatanDetail(!showPeringatanDetail)}
            className="w-full flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6E56A9] text-white flex items-center justify-center font-bold text-sm shadow">
                P
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-[#101D34] group-hover:text-[#6E56A9] transition-colors">
                  Pahami Kotak Tanda Peringatan P.No. 1 s/d P.No. 6 pada Obat Bebas Terbatas
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  Kotak hitam bergaris putih yang berisi instruksi keselamatan khusus dari Kemenkes RI.
                </p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white group-hover:bg-[#C2A0DD]/40 transition-colors">
              {showPeringatanDetail ? <ChevronUp className="w-5 h-5 text-[#6E56A9]" /> : <ChevronDown className="w-5 h-5 text-[#6E56A9]" />}
            </div>
          </button>

          {showPeringatanDetail && (
            <div className="mt-6 pt-6 border-t border-[#83B3C7]/30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
              {tandaPeringatanList.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-[#5FD4B3] shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-1 rounded bg-black text-white text-xs font-mono font-bold">
                      {item.code}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{item.text}</p>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">Contoh sediaan: <span className="text-slate-900 font-semibold">{item.sample}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
