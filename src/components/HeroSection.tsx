import React, { useState } from 'react';
import { 
  User, 
  Scale, 
  Calendar, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  MessageSquare,
  ShieldCheck 
} from 'lucide-react';
import { PatientData } from '../types';

interface HeroSectionProps {
  patient?: PatientData;
  onStartSwamedikasi: (patientData?: PatientData) => void;
  onOpenConsultation: () => void;
  onOpenScanner: () => void;
}

const COMMON_SYMPTOMS = [
  { id: 'demam', label: 'Demam' },
  { id: 'sakit_kepala', label: 'Sakit Kepala' },
  { id: 'flu_bersin', label: 'Batuk & Flu' },
  { id: 'nyeri_lambung', label: 'Maag' },
  { id: 'gatal_alergi', label: 'Alergi' },
  { id: 'diare', label: 'Diare' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  patient,
  onStartSwamedikasi,
  onOpenConsultation,
  onOpenScanner,
}) => {
  const [fullName, setFullName] = useState(patient?.fullName || '');
  const [ageYears, setAgeYears] = useState<number | string>(patient?.ageYears || 24);
  const [weightKg, setWeightKg] = useState<number | string>(patient?.weightKg || 52);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    patient?.symptoms?.length ? patient.symptoms : ['demam']
  );
  const [customSymptom, setCustomSymptom] = useState('');

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalSymptoms = [...selectedSymptoms];
    if (customSymptom.trim() && !finalSymptoms.includes(customSymptom.trim())) {
      finalSymptoms.push(customSymptom.trim());
    }

    const patientPayload: PatientData = {
      fullName: fullName.trim() || 'Pasien Mandiri',
      ageYears: Number(ageYears) || 24,
      weightKg: Number(weightKg) || 50,
      gender: patient?.gender || 'P',
      isPregnantOrLactating: patient?.isPregnantOrLactating || false,
      allergies: patient?.allergies || [],
      existingConditions: patient?.existingConditions || [],
      symptoms: finalSymptoms.length ? finalSymptoms : ['demam'],
      symptomDurationDays: patient?.symptomDurationDays || 1,
      notes: patient?.notes || '',
    };

    onStartSwamedikasi(patientPayload);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0DBFCD]/15 via-[#E4EFE9] to-[#E4EFE9] py-8 sm:py-12">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-[#0DBFCD]/10 via-[#77DBAA]/10 to-[#C2A0DD]/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Compact Header */}
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 shadow-xs border border-[#77DBAA]/60 text-xs sm:text-sm font-extrabold text-[#6E56A9]">
            <Sparkles className="w-4 h-4 text-[#0DBFCD] shrink-0" />
            <span>Akses Pelayanan Obat Melalui Apoteker Terpercaya secara Elektronik</span>
          </div>
        </div>

        {/* Centerpiece: Clean, Login-Style Card Form */}
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-[#0DBFCD]/30 hover:border-[#0DBFCD]/60 transition-all">
            
            {/* Card Header */}
            <div className="text-center pb-4 mb-4 border-b border-[#E4EFE9]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0DBFCD] to-[#77DBAA] flex items-center justify-center text-white shadow-xs mx-auto mb-2 font-bold">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#101D34]">
                Formulir Pasien
              </h2>
              <p className="text-sm sm:text-base text-slate-800 font-semibold mt-1">
                Cepat, aman, tanpa perlu daftar akun
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Nama Pasien */}
              <div>
                <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#0DBFCD]" />
                  <span>Nama Pasien *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#E4EFE9]/40 border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-2 focus:ring-[#0DBFCD]/20 text-base font-bold text-slate-900 focus:outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              {/* Row 2: Umur & Berat Badan Pasien */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#6E56A9]" />
                    <span className="text-[13px]">Umur (Tahun) *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="24"
                    value={ageYears}
                    onChange={(e) => setAgeYears(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#E4EFE9]/40 border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-2 focus:ring-[#0DBFCD]/20 text-base font-bold text-slate-900 focus:outline-none transition-all text-center"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#77DBAA]" />
                    <span className="text-[13px]">Berat (Kg) *</span>
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="200"
                    step="0.5"
                    required
                    placeholder="52"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#E4EFE9]/40 border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-2 focus:ring-[#0DBFCD]/20 text-base font-bold text-slate-900 focus:outline-none transition-all text-center"
                  />
                </div>
              </div>

              {/* Field 3: Gejala / Penyakit (Multi-select Chips + Optional Text) */}
              <div>
                <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#B566C0]" />
                  <span>Gejala / Penyakit *</span>
                </label>

                {/* Multi-select symptom chips */}
                <div className="grid grid-cols-3 gap-1.5">
                  {COMMON_SYMPTOMS.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym.id);
                    return (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => toggleSymptom(sym.id)}
                        className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border text-center truncate ${
                          isSelected
                            ? 'bg-[#6E56A9] text-white border-[#6E56A9] shadow-xs'
                            : 'bg-[#E4EFE9]/50 text-slate-900 border-[#83B3C7]/60 hover:bg-[#E4EFE9]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sym.label}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Keluhan lainnya (misal: batuk kering)..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-[#E4EFE9]/40 border border-[#83B3C7] focus:border-[#0DBFCD] text-sm sm:text-base font-semibold text-slate-900 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              {/* Prominent Primary Button: Lanjut ke Swamedikasi ➔ */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 group"
              >
                <span>Lanjut ke Swamedikasi</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick Secondary Links */}
            <div className="pt-4 mt-3 border-t border-[#E4EFE9] flex items-center justify-center gap-4 text-sm font-bold text-slate-800">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="hover:text-[#6E56A9] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#6E56A9]" />
                <span>Chat Apoteker</span>
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={onOpenScanner}
                className="hover:text-[#0DBFCD] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#0DBFCD]" />
                <span>Scan Kemasan</span>
              </button>
            </div>

          </div>

          {/* Trust Marker under Card */}
          <div className="text-center mt-3 text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#77DBAA]" />
            <span>Standar Dagusibu & Terintegrasi Data Resmi BPOM</span>
          </div>
        </div>

      </div>
    </section>
  );
};
