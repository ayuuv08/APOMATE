import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRightLeft, Sparkles } from 'lucide-react';
import { DRUG_INTERACTIONS_DATA, MEDICINES_DATABASE } from '../data/medicines';

export const DrugInteractionChecker: React.FC = () => {
  const [firstDrug, setFirstDrug] = useState<string>('Paracetamol');
  const [secondDrug, setSecondDrug] = useState<string>('OBH Sirup / Obat Flu Komplit');

  // Find if pair exists in interaction database
  const detectedInteraction = DRUG_INTERACTIONS_DATA.find(
    (item) =>
      (item.drugA.toLowerCase().includes(firstDrug.toLowerCase()) &&
        item.drugB.toLowerCase().includes(secondDrug.toLowerCase())) ||
      (item.drugB.toLowerCase().includes(firstDrug.toLowerCase()) &&
        item.drugA.toLowerCase().includes(secondDrug.toLowerCase()))
  );

  const drugOptions = [
    'Paracetamol',
    'OBH Sirup / Obat Flu Komplit',
    'Antasida DOEN',
    'Ibuprofen / NSAID',
    'Cetirizine',
    'Aspirin / Obat Pengencer Darah',
    'Alkohol / Obat Penenang Batuk Dextromethorphan',
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4EFE9] text-xs sm:text-sm font-extrabold text-[#6E56A9] mb-2 shadow-xs">
            <ShieldAlert className="w-4 h-4 text-[#B566C0]" />
            <span>Skrining Keamanan Polifarmasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101D34] tracking-tight">
            Cek Interaksi Obat Mandiri
          </h2>
          <p className="text-base sm:text-lg text-slate-900 font-semibold mt-2 leading-relaxed max-w-xl mx-auto text-justify">
            Jangan sembarang mencampur dua jenis obat! Banyak obat bebas dan flu memiliki zat aktif yang saling bertumpuk atau menurunkan efektivitas penyerapan di dalam tubuh.
          </p>
        </div>

        {/* Interaction Picker Box */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#E4EFE9] border-2 border-[#5FD4B3] shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
            {/* Drug A */}
            <div className="sm:col-span-5">
              <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase mb-2">
                Obat Pertama:
              </label>
              <select
                value={firstDrug}
                onChange={(e) => setFirstDrug(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 focus:border-[#0DBFCD] text-base font-bold text-slate-900 focus:outline-none"
              >
                {drugOptions.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Middle Icon */}
            <div className="sm:col-span-1 flex justify-center py-2">
              <div className="w-11 h-11 rounded-2xl bg-[#0DBFCD] text-white flex items-center justify-center shadow">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
            </div>

            {/* Drug B */}
            <div className="sm:col-span-5">
              <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase mb-2">
                Obat Kedua:
              </label>
              <select
                value={secondDrug}
                onChange={(e) => setSecondDrug(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 focus:border-[#0DBFCD] text-base font-bold text-slate-900 focus:outline-none"
              >
                {drugOptions.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Banner */}
          {detectedInteraction ? (
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
              detectedInteraction.severity === 'berat' 
                ? 'bg-red-50 border-red-300 text-red-950' 
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg mb-2.5">
                <AlertTriangle className={`w-5 h-5 shrink-0 ${detectedInteraction.severity === 'berat' ? 'text-red-600' : 'text-amber-600'}`} />
                <span className="text-justify">
                  Interaksi Terdeteksi ({detectedInteraction.severity.toUpperCase()}): {detectedInteraction.drugA} + {detectedInteraction.drugB}
                </span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed mb-3.5 font-semibold text-slate-900 text-justify">
                {detectedInteraction.description}
              </p>
              <div className="p-4 rounded-2xl bg-white/95 text-sm sm:text-base font-semibold border border-slate-300 shadow-xs">
                <strong className="text-[#6E56A9] font-extrabold block sm:inline">Saran Klinis Apoteker: </strong>
                <span className="text-slate-900 font-semibold text-justify leading-relaxed">{detectedInteraction.clinicalAdvice}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-400 flex items-center gap-3.5">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-sm sm:text-base text-slate-900 space-y-1">
                <p className="font-extrabold text-slate-900">Tidak ditemukan interaksi bahaya mayor secara langsung.</p>
                <p className="text-slate-800 font-semibold text-justify leading-relaxed">Tetap berikan jeda waktu 1–2 jam bila mengonsumsi beberapa obat berbeda untuk penyerapan optimal.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
