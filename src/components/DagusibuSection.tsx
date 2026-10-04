import React from 'react';
import { ShoppingBag, HeartPulse, Archive, Trash2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const DagusibuSection: React.FC = () => {
  const dagusibuSteps = [
    {
      letter: 'DA',
      title: 'DAPATKAN',
      subtitle: 'Dapatkan Obat di Sarana Resmi',
      color: 'from-[#0DBFCD] to-[#5FD4B3]',
      icon: ShoppingBag,
      points: [
        'Beli obat hanya di Apotek resmi, Instalasi Farmasi RS, atau Toko Obat berizin.',
        'Pastikan ada Apoteker Pengelola Apotek (APA) dengan nomor SIPA yang terpasang.',
        'Perhatikan nomor izin edar BPOM (misal: DKL/GBL) dan segel kemasan tidak rusak.',
        'Waspada membeli obat keras online di toko non-farmasi tanpa resep dokter.'
      ]
    },
    {
      letter: 'GU',
      title: 'GUNAKAN',
      subtitle: 'Gunakan Obat Secara Rasional & Tepat',
      color: 'from-[#77DBAA] to-[#42CEB8]',
      icon: HeartPulse,
      points: [
        'Gunakan obat sesuai indikasi dan takaran dosis yang dianjurkan.',
        'Patuhi aturan minum: sebelum makan (perut kosong) atau sesudah makan.',
        'Gunakan sendok takar obat berskala mililiter, bukan sendok makan makan rumah.',
        'Antibiotik WAJIB dihabiskan sesuai anjuran untuk mencegah resistensi kuman.'
      ]
    },
    {
      letter: 'SI',
      title: 'SIMPAN',
      subtitle: 'Simpan Obat Sesuai Karakteristik Sediaan',
      color: 'from-[#6E56A9] to-[#883EA9]',
      icon: Archive,
      points: [
        'Simpan di tempat sejuk (< 30°C), kering, dan terlindung dari sinar matahari langsung.',
        'Obat tetes mata atau sirup antibiotik tertentu memerlukan pendinginan (bukan freezer).',
        'Tuliskan tanggal pertama kali botol sirup dibuka (maksimal 30 hari pemakaian).',
        'Jauhkan seluruh kotak obat dari jangkauan anak-anak dan balita.'
      ]
    },
    {
      letter: 'BU',
      title: 'BUANG',
      subtitle: 'Buang Obat Rusak / Kadaluwarsa Secara Aman',
      color: 'from-[#883EA9] to-[#B566C0]',
      icon: Trash2,
      points: [
        'Lepaskan label/etiket nama dan nomor resep untuk menjaga kerahasiaan data.',
        'Keluarkan tablet/kapsul dari blister, hancurkan, lalu campur dengan tanah/kopi.',
        'Cairan sirup diencerkan dengan air lalu dibuang ke saluran air/kloset.',
        'Gunting atau rusak kemasan botol/dus sebelum dibuang agar tidak didaur ulang oknum.'
      ]
    }
  ];

  return (
    <section className="py-16 bg-[#E4EFE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs sm:text-sm font-extrabold text-[#6E56A9] shadow-xs mb-3">
            <ShieldCheck className="w-4 h-4 text-[#0DBFCD]" />
            <span>Gerakan Masyarakat Cerdas Menggunakan Obat (GeMa CerMat)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101D34] tracking-tight">
            Prinsip <span className="text-[#6E56A9]">DAGUSIBU</span> untuk Swamedikasi Aman
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-semibold mt-2 leading-relaxed">
            Panduan resmi Ikatan Apoteker Indonesia (IAI) & Kementerian Kesehatan RI agar masyarakat terhindar dari bahaya salah guna obat.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dagusibuSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:border-[#0DBFCD] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center font-extrabold text-base shadow`}>
                      {step.letter}
                    </div>
                    <Icon className="w-6 h-6 text-[#0DBFCD]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#101D34] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base font-extrabold text-[#6E56A9] mb-4">
                    {step.subtitle}
                  </p>

                  <ul className="space-y-3.5 text-sm sm:text-base text-slate-900 font-semibold">
                    {step.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <span className="text-xs sm:text-sm font-extrabold text-teal-800 uppercase tracking-wide">
                    Pedoman Nasional IAI
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
