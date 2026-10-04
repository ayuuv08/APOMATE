import React, { useState, useMemo } from 'react';
import { 
  User, 
  Pill, 
  ClipboardCheck, 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Camera, 
  Info, 
  Clock, 
  ShieldAlert, 
  MessageSquare, 
  Scale, 
  Sparkles,
  HeartPulse,
  RotateCcw
} from 'lucide-react';
import { PatientData, Medicine, GolonganObat } from '../types';
import { MEDICINES_DATABASE, SYMPTOM_OPTIONS } from '../data/medicines';

interface SwamedikasiFlowProps {
  onOpenConsultationWithContext: (patient: PatientData, medicine?: Medicine) => void;
  onOpenScanner: () => void;
  selectedMedicineFromScanner?: Medicine | null;
  onClearScannerSelection?: () => void;
  onSaveToMedicationHistory?: (med: Medicine, calculatedDose: string, patient: PatientData) => void;
  onViewMedicationHistory?: () => void;
  initialStep?: 1 | 2 | 3;
  initialPatient?: PatientData;
}

export const SwamedikasiFlow: React.FC<SwamedikasiFlowProps> = ({
  onOpenConsultationWithContext,
  onOpenScanner,
  selectedMedicineFromScanner,
  onClearScannerSelection,
  onSaveToMedicationHistory,
  onViewMedicationHistory,
  initialStep = 1,
  initialPatient,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(initialStep);
  const [isSavedToHistory, setIsSavedToHistory] = useState(false);

  // Sync initialStep if passed from parent
  React.useEffect(() => {
    if (initialStep) {
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  // Patient Form State
  const [patient, setPatient] = useState<PatientData>(
    initialPatient || {
      fullName: '',
      ageYears: 24,
      gender: 'P',
      weightKg: 52,
      isPregnantOrLactating: false,
      allergies: [],
      existingConditions: [],
      symptoms: ['demam'],
      symptomDurationDays: 1,
      notes: '',
    }
  );

  React.useEffect(() => {
    if (initialPatient && initialPatient.fullName) {
      setPatient(initialPatient);
    }
  }, [initialPatient]);

  // Medicine Selection State
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>(
    selectedMedicineFromScanner?.id || 'med-paracetamol'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GolonganObat>('all');

  // If a medicine comes from camera scanner, auto-select and step ahead if patient filled
  React.useEffect(() => {
    if (selectedMedicineFromScanner) {
      setSelectedMedicineId(selectedMedicineFromScanner.id);
      setCurrentStep(2);
    }
  }, [selectedMedicineFromScanner]);

  // Selected Medicine Object
  const selectedMedicine = useMemo(() => {
    return MEDICINES_DATABASE.find((m) => m.id === selectedMedicineId) || MEDICINES_DATABASE[0];
  }, [selectedMedicineId]);

  // Filtered medicines list
  const filteredMedicines = useMemo(() => {
    return MEDICINES_DATABASE.filter((med) => {
      const matchQuery =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.indications.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = categoryFilter === 'all' || med.category === categoryFilter;
      return matchQuery && matchCat;
    });
  }, [searchQuery, categoryFilter]);

  // Personalized dosage calculation logic based on patient's age and weight
  const calculatedDose = useMemo(() => {
    if (!selectedMedicine) return '';

    const isChild = patient.ageYears < 12;
    const isBaby = patient.ageYears < 2;

    if (selectedMedicine.id === 'med-paracetamol') {
      if (isBaby) {
        return `Perhatian: Bayi di bawah 2 tahun membutuhkan pengawasan dokter/apoteker. Dosis acuan 10-15 mg/kgBB (${(10 * patient.weightKg).toFixed(0)} - ${(15 * patient.weightKg).toFixed(0)} mg) gunakan sediaan drops per oral bila dianjurkan apoteker.`;
      }
      if (isChild) {
        const minSingleDose = Math.round(10 * patient.weightKg);
        const maxSingleDose = Math.round(15 * patient.weightKg);
        return `Dosis Anak (BB: ${patient.weightKg} kg): Dosis sekali minum adalah ${minSingleDose} – ${maxSingleDose} mg (Gunakan sendok takar sirup 120mg/5ml atau 250mg/5ml), diminum tiap 4-6 jam jika demam/nyeri. Maksimal 4 kali sehari.`;
      }
      return `Dosis Dewasa (BB: ${patient.weightKg} kg): 500 mg (1 kaplet) tiap 4–6 jam bila demam/nyeri. Jika nyeri berat dapat 1.000 mg (2 kaplet). Maksimal 4.000 mg (8 kaplet) per 24 jam.`;
    }

    if (selectedMedicine.id === 'med-antasida-doen') {
      if (isChild) {
        return `Dosis Anak (Usia ${patient.ageYears} th): 2,5 ml - 5 ml (1/2 – 1 sendok takar) suspensi, 3–4 kali sehari 1 jam sebelum makan atau 2 jam setelah makan.`;
      }
      return `Dosis Dewasa: 1–2 tablet kunyah (kunyah sampai halus) atau 1–2 sendok takar (5–10 ml) 3–4 kali sehari, diminum 1 jam sebelum makan atau saat perut kosong dan menjelang tidur.`;
    }

    if (selectedMedicine.id === 'med-ibuprofen') {
      if (isChild) {
        const minDose = Math.round(5 * patient.weightKg);
        const maxDose = Math.round(10 * patient.weightKg);
        return `Dosis Anak (BB: ${patient.weightKg} kg): ${minDose} – ${maxDose} mg per kali minum, diberikan tiap 6–8 jam SESUDAH MAKAN. Maksimal 30 mg/kgBB/hari.`;
      }
      return `Dosis Dewasa (BB: ${patient.weightKg} kg): 200–400 mg (1 tablet) diminum tiap 6–8 jam SEGERA SESUDAH MAKAN. Maksimal 1.200 mg per hari untuk pengobatan mandiri.`;
    }

    if (selectedMedicine.id === 'med-cetirizine') {
      if (isChild) {
        return `Dosis Anak 6–12 tahun: 5 mg (1/2 tablet) dua kali sehari atau 10 mg sekali sehari malam hari.`;
      }
      return `Dosis Dewasa: 10 mg (1 tablet) sekali sehari diminum pada malam hari menjelang tidur untuk meminimalkan efek kantuk.`;
    }

    if (selectedMedicine.id === 'med-oralit') {
      if (patient.ageYears < 1) {
        return `Anak < 1 tahun: Berikan 50–100 ml larutan oralit setiap kali buang air besar cair, disuapi perlahan dengan sendok bersih.`;
      }
      if (patient.ageYears <= 5) {
        return `Anak 1–5 tahun: Berikan 100–200 ml larutan oralit tiap kali BAB cair.`;
      }
      return `Dewasa & Anak > 5 tahun: 200–400 ml (1–2 gelas) setiap kali selesai BAB cair untuk mengganti cairan tubuh.`;
    }

    if (selectedMedicine.id === 'med-amoxicillin') {
      return `PERINGATAN: Sediaan Amoxicillin adalah OBAT KERAS yang HARUS diresepkan dokter berdasarkan pemeriksaan fisik. Dosis tidak boleh disesuaikan sendiri tanpa resep!`;
    }

    return selectedMedicine.standardAdultDose;
  }, [selectedMedicine, patient]);

  // Warning checks for patient specific conditions (e.g. maag + ibuprofen, pregnancy + contraindications)
  const patientWarnings = useMemo(() => {
    const list: string[] = [];

    if (selectedMedicine.category === 'keras') {
      list.push('OBAT KERAS (Lingkaran Merah K): Obat ini memerlukan resep dokter. Jangan melakukan swamedikasi antibiotik sembarangan.');
    }

    if (patient.existingConditions.includes('maag') && selectedMedicine.id === 'med-ibuprofen') {
      list.push('PERINGATAN LAMBUNG: Pasien memiliki riwayat Maag/GERD. Ibuprofen adalah golongan NSAID yang dapat memicu iritasi lambung berat. Disarankan menggunakan Paracetamol untuk pereda nyeri/demam, atau konsultasikan ke apoteker.');
    }

    if (patient.isPregnantOrLactating && (selectedMedicine.id === 'med-ibuprofen' || selectedMedicine.id === 'med-cetirizine')) {
      list.push('PERINGATAN KEHAMILAN/MENYUSUI: Pasien sedang hamil atau menyusui. Obat ini membutuhkan konfirmasi keamanan trimester dari Apoteker atau Dokter Obgyn.');
    }

    if (patient.existingConditions.includes('hipertensi') && selectedMedicine.id === 'med-obh-combi') {
      list.push('PERINGATAN HIPERTENSI: Sirup flu ini mengandung dekongestan Pseudoephedrine yang dapat menaikkan tekanan darah.');
    }

    if (patient.allergies.length > 0) {
      list.push(`RIWAYAT ALERGI: Pasien tercatat alergi terhadap: ${patient.allergies.join(', ')}. Pastikan obat yang dipilih tidak memiliki cross-reactivity.`);
    }

    if (patient.symptomDurationDays > 3) {
      list.push('PERINGATAN DURASI KELUHAN: Gejala sudah berlangsung lebih dari 3 hari. Batas aman swamedikasi mandiri adalah maksimal 3 hari. Segera jadwalkan konsultasi dokter atau apoteker.');
    }

    return list;
  }, [selectedMedicine, patient]);

  // Step 1 Validation
  const isStep1Valid = patient.fullName.trim().length > 0 && patient.weightKg > 0 && patient.ageYears > 0;

  return (
    <section id="swamedikasi-flow" className="py-12 bg-[#E4EFE9] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#6E56A9] shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0DBFCD]" />
            <span>TAP Obat dengan Tepat</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101D34] tracking-tight">
            {currentStep === 1 && 'Kenali Kondisi Anda'}
            {currentStep === 2 && 'Pilih & Identifikasi Obat'}
            {currentStep === 3 && 'Hasil Analisis & Rekomendasi Dosis'}
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium mt-2 max-w-2xl mx-auto leading-relaxed">
            {currentStep === 1 && 'Isi data pasien agar sistem dan apoteker dapat menghitung dosis yang aman sesuai usia dan berat badan.'}
            {currentStep === 2 && 'Pilih obat dari katalog terdaftar BPOM atau gunakan kamera untuk scan kemasan secara instan.'}
            {currentStep === 3 && 'Tinjau dosis spesifik, aturan minum, peringatan interaksi, dan konsultasikan langsung ke apoteker.'}
          </p>
        </div>

        {/* Progress Indicator: 01 Data Pasien -> 02 Obat -> 03 Hasil */}
        {/* Colors: active = #0DBFCD, completed = #77DBAA, inactive = #C2A0DD */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Background connecting bar */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-[#C2A0DD] z-0 rounded-full" />
            
            {/* Progress fill */}
            <div 
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] z-0 rounded-full transition-all duration-300"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : 'calc(100% - 3rem)'
              }}
            />

            {/* Step 1 Item */}
            <button
              onClick={() => setCurrentStep(1)}
              className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm transition-all shadow-md ${
                  currentStep === 1 
                    ? 'bg-[#0DBFCD] text-white ring-4 ring-[#0DBFCD]/25 scale-105' 
                    : currentStep > 1 
                      ? 'bg-[#77DBAA] text-white' 
                      : 'bg-white text-[#C2A0DD] border-2 border-[#C2A0DD]'
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : '01'}
              </div>
              <span className={`text-xs font-bold mt-2 ${currentStep === 1 ? 'text-[#0DBFCD]' : currentStep > 1 ? 'text-[#77DBAA]' : 'text-[#83B3C7]'}`}>
                Data Pasien
              </span>
            </button>

            {/* Step 2 Item */}
            <button
              onClick={() => isStep1Valid && setCurrentStep(2)}
              disabled={!isStep1Valid}
              className={`relative z-10 flex flex-col items-center group focus:outline-none opacity-100 ${!isStep1Valid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm transition-all shadow-md opacity-100 ${
                  currentStep === 2 
                    ? 'bg-[#0DBFCD] text-white ring-4 ring-[#0DBFCD]/25 scale-105' 
                    : currentStep > 2 
                      ? 'bg-[#77DBAA] text-white' 
                      : 'bg-white text-[#6E56A9] border-2 border-[#C2A0DD]'
                }`}
              >
                {currentStep > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : '02'}
              </div>
              <span className={`text-xs font-bold mt-2 opacity-100 ${currentStep === 2 ? 'text-[#0DBFCD]' : currentStep > 2 ? 'text-[#77DBAA]' : 'text-[#6E56A9]'}`}>
                Obat & Golongan
              </span>
            </button>

            {/* Step 3 Item */}
            <button
              onClick={() => isStep1Valid && setCurrentStep(3)}
              disabled={!isStep1Valid}
              className={`relative z-10 flex flex-col items-center group focus:outline-none opacity-100 ${!isStep1Valid ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm transition-all shadow-md opacity-100 ${
                  currentStep === 3 
                    ? 'bg-[#0DBFCD] text-white ring-4 ring-[#0DBFCD]/25 scale-105' 
                    : 'bg-white text-[#6E56A9] border-2 border-[#C2A0DD]'
                }`}
              >
                03
              </div>
              <span className={`text-xs font-bold mt-2 opacity-100 ${currentStep === 3 ? 'text-[#0DBFCD]' : 'text-[#6E56A9]'}`}>
                Hasil & Dosis
              </span>
            </button>
          </div>
        </div>

        {/* ================= STEP 01: DATA PASIEN ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C2A0DD]/60 max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4EFE9] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0DBFCD]/15 flex items-center justify-center text-[#0DBFCD]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#101D34]">Biodata & Skrining Pasien</h3>
                  <p className="text-sm sm:text-base text-slate-800 font-semibold mt-0.5 leading-relaxed">Perhitungan dosis yang tepat memerlukan usia dan bobot badan nyata.</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#6E56A9] bg-[#E4EFE9] px-3 py-1.5 rounded-xl">
                Langkah 1 dari 3
              </span>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (isStep1Valid) setCurrentStep(2);
              }}
              className="space-y-6"
            >
              {/* Row 1: Nama Lengkap */}
              <div>
                <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  Nama Lengkap Pasien *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Melati / Ananda Dimas"
                  value={patient.fullName}
                  onChange={(e) => setPatient({ ...patient, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-4 focus:ring-[#0DBFCD]/20 focus:outline-none transition-all text-base font-bold text-slate-900"
                />
              </div>

              {/* Row 2: Usia, Jenis Kelamin, Berat Badan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                    Usia (Tahun) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    required
                    value={patient.ageYears}
                    onChange={(e) => setPatient({ ...patient, ageYears: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-4 focus:ring-[#0DBFCD]/20 focus:outline-none transition-all text-sm font-semibold text-[#101D34]"
                  />
                  {patient.ageYears < 12 && (
                    <span className="text-[11px] font-bold text-[#6E56A9] mt-1 block">
                      👶 Kategori Pediatrik (Anak)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101D34] uppercase tracking-wider mb-2">
                    Jenis Kelamin *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPatient({ ...patient, gender: 'P' })}
                      className={`py-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                        patient.gender === 'P'
                          ? 'bg-[#6E56A9] text-white border-[#6E56A9] shadow-sm'
                          : 'bg-[#E4EFE9] text-[#101D34] border-transparent hover:border-[#83B3C7]'
                      }`}
                    >
                      Perempuan
                    </button>
                    <button
                      type="button"
                      onClick={() => setPatient({ ...patient, gender: 'L' })}
                      className={`py-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                        patient.gender === 'L'
                          ? 'bg-[#6E56A9] text-white border-[#6E56A9] shadow-sm'
                          : 'bg-[#E4EFE9] text-[#101D34] border-transparent hover:border-[#83B3C7]'
                      }`}
                    >
                      Laki-laki
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101D34] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Berat Badan (kg) *</span>
                    <Scale className="w-3.5 h-3.5 text-[#0DBFCD]" />
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="200"
                    step="0.5"
                    required
                    value={patient.weightKg}
                    onChange={(e) => setPatient({ ...patient, weightKg: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-4 focus:ring-[#0DBFCD]/20 focus:outline-none transition-all text-sm font-semibold text-[#101D34]"
                  />
                  <span className="text-[10px] text-[#83B3C7] mt-1 block">Wajib untuk akurasi dosis sirup/kaplet</span>
                </div>
              </div>

              {/* Status Kehamilan/Menyusui (Khusus Perempuan) */}
              {patient.gender === 'P' && (
                <div className="p-4 rounded-2xl bg-[#C2A0DD]/20 border border-[#C2A0DD] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#6E56A9]">Status Khusus Wanita</p>
                    <p className="text-xs text-[#101D34]/80">Apakah saat ini sedang hamil atau menyusui bayi?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patient.isPregnantOrLactating}
                      onChange={(e) => setPatient({ ...patient, isPregnantOrLactating: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B566C0]"></div>
                  </label>
                </div>
              )}

              {/* Keluhan Utama (Pill / Chip Multi-selection) */}
              <div>
                <label className="block text-xs font-bold text-[#101D34] uppercase tracking-wider mb-2">
                  Keluhan / Gejala yang Dirasakan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SYMPTOM_OPTIONS.map((sym) => {
                    const isSelected = patient.symptoms.includes(sym.id);
                    return (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (patient.symptoms.length > 1) {
                              setPatient({
                                ...patient,
                                symptoms: patient.symptoms.filter((s) => s !== sym.id),
                              });
                            }
                          } else {
                            setPatient({
                              ...patient,
                              symptoms: [...patient.symptoms, sym.id],
                            });
                          }
                        }}
                        className={`p-3 rounded-2xl text-xs font-bold text-left border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0DBFCD] text-white border-[#0DBFCD] shadow-sm'
                            : 'bg-[#E4EFE9] text-[#101D34] border-transparent hover:border-[#83B3C7]'
                        }`}
                      >
                        <span className="line-clamp-2">{sym.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Durasi Gejala & Riwayat Penyakit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#101D34] uppercase tracking-wider mb-2">
                    Lama Gejala Berlangsung
                  </label>
                  <select
                    value={patient.symptomDurationDays}
                    onChange={(e) => setPatient({ ...patient, symptomDurationDays: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-4 focus:ring-[#0DBFCD]/20 focus:outline-none text-sm font-semibold text-[#101D34]"
                  >
                    <option value={1}>Baru hari ini / 1 hari</option>
                    <option value={2}>2 hari yang lalu</option>
                    <option value={3}>3 hari (Batas Swamedikasi Mandiri)</option>
                    <option value={4}>4-7 hari (Perlu Konsultasi Dokter)</option>
                    <option value={8}>Lebih dari 1 minggu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101D34] uppercase tracking-wider mb-2">
                    Riwayat Penyakit Penyerta (Komorbid)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'maag', label: 'Maag/GERD' },
                      { id: 'hipertensi', label: 'Hipertensi' },
                      { id: 'asma', label: 'Asma' },
                      { id: 'ginjal', label: 'Gangguan Ginjal' },
                    ].map((cond) => {
                      const isChecked = patient.existingConditions.includes(cond.id);
                      return (
                        <button
                          key={cond.id}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setPatient({
                                ...patient,
                                existingConditions: patient.existingConditions.filter((c) => c !== cond.id),
                              });
                            } else {
                              setPatient({
                                ...patient,
                                existingConditions: [...patient.existingConditions, cond.id],
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#883EA9] text-white border-[#883EA9]'
                              : 'bg-white text-[#101D34] border-[#83B3C7] hover:border-[#6E56A9]'
                          }`}
                        >
                          {isChecked ? '✓ ' : '+ '}
                          {cond.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E4EFE9]">
                <button
                  type="submit"
                  disabled={!isStep1Valid}
                  className="px-8 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Lanjut: Pilih & Cek Obat</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 02: PILIH & IDENTIFIKASI OBAT ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Top Toolbar: Search + Category Filter + Scan Trigger */}
            <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-[#5FD4B3]/50 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#83B3C7]" />
                  <input
                    type="text"
                    placeholder="Cari obat (cth: Paracetamol, Maag, Flu)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#E4EFE9]/50 border border-[#83B3C7] focus:border-[#0DBFCD] focus:ring-2 focus:ring-[#0DBFCD]/20 text-xs sm:text-sm font-semibold text-[#101D34] focus:outline-none"
                  />
                </div>

                {/* Scan Kemasan Obat Button */}
                <button
                  onClick={onOpenScanner}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0DBFCD] to-[#5FD4B3] hover:from-[#1EC5C2] hover:to-[#42CEB8] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <span>Scan Kemasan / Kamera</span>
                </button>
              </div>

              {/* Golongan Obat Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-[#83B3C7] shrink-0 mr-1">Golongan:</span>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-[#101D34] text-white'
                      : 'bg-[#E4EFE9] text-[#101D34] hover:bg-slate-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setCategoryFilter('bebas')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    categoryFilter === 'bebas'
                      ? 'bg-[#0DBFCD] text-white shadow-sm'
                      : 'bg-[#0DBFCD]/15 text-[#0DBFCD] hover:bg-[#0DBFCD]/25'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0DBFCD] border border-black/30" />
                  Obat Bebas
                </button>
                <button
                  onClick={() => setCategoryFilter('bebas_terbatas')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    categoryFilter === 'bebas_terbatas'
                      ? 'bg-[#77DBAA] text-[#101D34] shadow-sm'
                      : 'bg-[#77DBAA]/20 text-[#101D34] hover:bg-[#77DBAA]/30'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#77DBAA] border border-black/30" />
                  Bebas Terbatas (P.No 1-6)
                </button>
                <button
                  onClick={() => setCategoryFilter('keras')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    categoryFilter === 'keras'
                      ? 'bg-[#6E56A9] text-white shadow-sm'
                      : 'bg-[#6E56A9]/15 text-[#6E56A9] hover:bg-[#6E56A9]/25'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black/30 text-[8px] text-white flex items-center justify-center font-bold">K</span>
                  Obat Keras (Wajib Resep)
                </button>
              </div>
            </div>

            {/* Medicine Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((med) => {
                const isSelected = med.id === selectedMedicineId;
                
                // Color badges per user specification
                const badgeColor =
                  med.category === 'bebas'
                    ? 'bg-[#0DBFCD] text-white'
                    : med.category === 'bebas_terbatas'
                    ? 'bg-[#77DBAA] text-[#101D34]'
                    : med.category === 'keras'
                    ? 'bg-[#6E56A9] text-white'
                    : 'bg-[#B566C0] text-white';

                return (
                  <div
                    key={med.id}
                    onClick={() => setSelectedMedicineId(med.id)}
                    className={`p-5 rounded-3xl cursor-pointer transition-all duration-200 border-2 relative ${
                      isSelected
                        ? 'bg-white border-[#0DBFCD] shadow-xl ring-4 ring-[#0DBFCD]/20'
                        : 'bg-white/90 border-[#5FD4B3]/40 hover:border-[#0DBFCD] hover:shadow-md'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide mb-1.5 ${badgeColor}`}>
                          {med.category === 'bebas' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          {med.category === 'bebas_terbatas' && <span className="w-1.5 h-1.5 rounded-full bg-[#101D34]" />}
                          {med.category === 'keras' && <span className="font-extrabold">K</span>}
                          {med.categoryLabel.split('(')[0].trim()}
                        </span>
                        <h4 className="text-base font-extrabold text-[#101D34] leading-snug">
                          {med.name}
                        </h4>
                        <p className="text-xs text-[#83B3C7] font-medium">{med.genericName}</p>
                      </div>

                      {/* Selection radio visual */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                          isSelected ? 'bg-[#0DBFCD] border-[#0DBFCD] text-white' : 'border-[#83B3C7]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Indications tags */}
                    <div className="flex flex-wrap gap-1.5 my-3">
                      {med.indications.slice(0, 3).map((ind, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#E4EFE9] text-[#101D34] text-[11px] font-semibold">
                          {ind}
                        </span>
                      ))}
                    </div>

                    {/* Quick Strength & Directions */}
                    <div className="text-xs text-[#101D34]/75 space-y-1 pt-2 border-t border-[#E4EFE9]">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#0DBFCD]" />
                        <span className="font-medium">Kekuatan: {med.strength}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#6E56A9]" />
                        <span>Maksimal swamedikasi: <strong className="text-[#101D34]">{med.maxDurationDays} hari</strong></span>
                      </div>
                    </div>

                    {/* Warning callout for Obat Keras */}
                    {med.category === 'keras' && (
                      <div className="mt-3 p-2 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-700 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Perhatian: Memerlukan resep dokter!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="bg-white rounded-3xl p-4 shadow-md flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-[#101D34] hover:bg-[#E4EFE9] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Ubah Data Pasien</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-7 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Lihat Hasil Analisis Dosis</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 03: HASIL & ANALISIS LENGKAP ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Patient Header Summary Bar */}
            <div className="p-4 rounded-3xl bg-white border border-[#5FD4B3] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0DBFCD] to-[#77DBAA] flex items-center justify-center text-white font-bold">
                  {patient.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-extrabold text-[#101D34] text-base">{patient.fullName}</p>
                  <p className="text-slate-700 font-semibold text-xs sm:text-sm">
                    {patient.ageYears} tahun · BB {patient.weightKg} kg · {patient.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                    {patient.isPregnantOrLactating && ' · Sedang Hamil/Menyusui'}
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                {onSaveToMedicationHistory && (
                  <button
                    type="button"
                    onClick={() => {
                      onSaveToMedicationHistory(selectedMedicine, calculatedDose, patient);
                      setIsSavedToHistory(true);
                      setTimeout(() => setIsSavedToHistory(false), 2500);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                      isSavedToHistory
                        ? 'bg-[#77DBAA] text-[#101D34] shadow-sm'
                        : 'bg-[#6E56A9] text-white hover:bg-[#883EA9]'
                    }`}
                  >
                    {isSavedToHistory ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Tersimpan di Riwayat!</span>
                      </>
                    ) : (
                      <>
                        <Pill className="w-3.5 h-3.5" />
                        <span>Simpan ke Riwayat Obat</span>
                      </>
                    )}
                  </button>
                )}
                {onViewMedicationHistory && (
                  <button
                    type="button"
                    onClick={onViewMedicationHistory}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#C2A0DD] text-[#6E56A9] hover:bg-[#E4EFE9] font-bold text-xs transition-colors cursor-pointer"
                  >
                    Lihat Riwayat ({patient.fullName ? 'Aktif' : 'Semua'})
                  </button>
                )}
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1.5 rounded-xl bg-[#E4EFE9] hover:bg-slate-200 text-[#101D34] font-bold transition-colors cursor-pointer"
                >
                  Ubah Data
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1.5 rounded-xl bg-[#E4EFE9] hover:bg-slate-200 text-[#101D34] font-bold transition-colors cursor-pointer"
                >
                  Ganti Obat
                </button>
              </div>
            </div>

            {/* Warning Callouts if conditions exist */}
            {patientWarnings.length > 0 && (
              <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-400 text-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-base font-extrabold text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Peringatan Khusus Pasien Terdeteksi</span>
                </div>
                <ul className="text-xs sm:text-sm space-y-2 font-medium pl-6 list-disc text-slate-800">
                  {patientWarnings.map((warn, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {warn}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Grid of Results per User Specification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Nama Obat (Gradient #0DBFCD -> #77DBAA) */}
              <div className="rounded-3xl p-6 text-white shadow-lg bg-gradient-to-br from-[#0DBFCD] to-[#77DBAA] relative overflow-hidden">
                <div className="absolute top-2 right-2 p-3 bg-white/10 rounded-full blur-md" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#101D34] bg-white/90 px-3 py-1 rounded-xl inline-block mb-3 shadow-xs">
                  {selectedMedicine.categoryLabel}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
                  {selectedMedicine.name}
                </h3>
                <p className="text-base text-white/95 font-semibold mb-3">
                  Zat Aktif: {selectedMedicine.genericName}
                </p>
                <div className="pt-3 border-t border-white/20 text-sm sm:text-base space-y-1">
                  <p className="font-bold text-white">Produsen / Bentuk: {selectedMedicine.brand} ({selectedMedicine.form})</p>
                  <p className="text-white font-medium">Indikasi: {selectedMedicine.indications.join(', ')}</p>
                </div>
              </div>

              {/* Card 2: Komposisi (Background #E4EFE9) */}
              <div className="rounded-3xl p-6 bg-[#E4EFE9] border-2 border-[#5FD4B3] shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#6E56A9] uppercase tracking-wider mb-2">
                    <Info className="w-4 h-4 text-[#0DBFCD]" />
                    <span>Komposisi & Kekuatan Sediaan</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#101D34] mb-2">
                    {selectedMedicine.strength}
                  </h4>
                  <p className="text-base text-slate-900 leading-relaxed font-semibold">
                    {selectedMedicine.composition}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-300 text-sm sm:text-base text-slate-900 font-medium">
                  <span className="font-extrabold text-slate-900">Penyimpanan: </span>
                  {selectedMedicine.storageAdvice}
                </div>
              </div>

              {/* Card 3: Dosis Sesuai Usia & BB (Background #C2A0DD) */}
              <div className="rounded-3xl p-6 bg-[#C2A0DD]/60 border-2 border-[#883EA9]/40 shadow-md">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#6E56A9] uppercase tracking-wider mb-2">
                  <Scale className="w-4 h-4 text-[#6E56A9]" />
                  <span>Kalkulasi Dosis Sesuai Pasien ({patient.weightKg} kg)</span>
                </div>
                <p className="text-lg sm:text-xl font-extrabold text-[#101D34] leading-relaxed mb-3">
                  {calculatedDose}
                </p>
                <div className="p-3.5 rounded-2xl bg-white/95 text-sm sm:text-base text-[#6E56A9] font-bold shadow-xs">
                  Catatan Apoteker: Jangan melipatgandakan dosis bila terlupa minum obat.
                </div>
              </div>

              {/* Card 4: Aturan Pakai (Background #5FD4B3) */}
              <div className="rounded-3xl p-6 bg-[#5FD4B3]/70 border-2 border-[#0DBFCD] shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#101D34] uppercase tracking-wider mb-2">
                    <Clock className="w-4 h-4 text-[#101D34]" />
                    <span>Aturan Pakai & Waktu Minum</span>
                  </div>
                  <p className="text-lg font-extrabold text-[#101D34] leading-relaxed mb-2">
                    {selectedMedicine.directions}
                  </p>
                  <div className="inline-block px-3.5 py-2 rounded-xl bg-white/95 text-sm font-bold text-[#101D34] mt-1 shadow-xs">
                    Waktu: {selectedMedicine.timing === 'sebelum_makan' ? 'Sebelum Makan (Perut Kosong)' : selectedMedicine.timing === 'sesudah_makan' ? 'Sesudah Makan (Perut Terisi)' : 'Bebas (Sebelum/Sesudah Makan)'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 text-sm font-extrabold text-[#101D34]">
                  Batas Maksimal Konsumsi: {selectedMedicine.maxDurationDays} Hari
                </div>
              </div>
            </div>

            {/* Card 5: Peringatan & Kontraindikasi (Background #B566C0 dengan teks kontras tinggi) */}
            <div className="rounded-3xl p-6 bg-[#B566C0] text-white shadow-xl border-2 border-[#883EA9]">
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-extrabold uppercase tracking-wider text-white mb-3">
                <ShieldAlert className="w-5 h-5 text-white" />
                <span>Peringatan Penting & Efek Samping Obat</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm sm:text-base">
                <div>
                  <h5 className="font-extrabold text-white text-base mb-2 underline decoration-white/40">Hal yang Perlu Diperhatikan:</h5>
                  <ul className="space-y-2 list-disc pl-4 text-white font-medium leading-relaxed">
                    {selectedMedicine.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-extrabold text-white text-base mb-2 underline decoration-white/40">Kontraindikasi & Efek Samping:</h5>
                  <p className="text-white mb-2 font-medium leading-relaxed">
                    <strong className="text-white font-bold">Kontraindikasi:</strong> {selectedMedicine.contraindications.join(', ')}
                  </p>
                  <p className="text-white font-medium leading-relaxed">
                    <strong className="text-white font-bold">Efek Samping Umum:</strong> {selectedMedicine.sideEffects.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* ================= HIGHLIGHT: HUBUNGI APOTEKER SECTION ================= */}
            {/* Specification:
                Card besar dengan gradient #883EA9 -> #B566C0
                Judul: "Masih Bingung dengan Obatmu?"
                Subjudul: "Konsultasikan penggunaan obat dengan apoteker secara langsung."
                Button: "💬 Hubungi Apoteker" (Gradient #77DBAA -> #0DBFCD)
            */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#883EA9] to-[#B566C0] text-white shadow-2xl relative overflow-hidden border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold text-[#77DBAA]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Layanan Telefarmasi Interaktif</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Masih Bingung dengan Obatmu?
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
                    Konsultasikan penggunaan obat dengan apoteker secara langsung. Dapatkan kepastian takaran sirup untuk anak, konfirmasi interaksi dengan obat rutin Anda, dan panduan aman lainnya.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onOpenConsultationWithContext(patient, selectedMedicine)}
                      className="px-8 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-[#101D34] bg-gradient-to-r from-[#77DBAA] to-[#0DBFCD] hover:from-[#5FD4B3] hover:to-[#1EC5C2] shadow-xl hover:shadow-2xl hover:scale-102 active:scale-98 transition-all flex items-center gap-2.5 cursor-pointer border border-white/40"
                    >
                      <MessageSquare className="w-5 h-5 text-[#101D34]" />
                      <span>💬 Hubungi Apoteker</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-36 h-36 rounded-3xl bg-white/15 border-2 border-white/40 flex flex-col items-center justify-center p-4 text-center shadow-lg">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#77DBAA] to-[#0DBFCD] flex items-center justify-center text-white mb-2 shadow-md">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] font-extrabold text-white">Telefarmasi Langsung</span>
                    <span className="text-[10px] text-[#77DBAA]">Apoteker Ber-SIPA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper Footer actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-[#101D34] bg-white hover:bg-slate-100 border border-[#83B3C7] shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali ke Pilihan Obat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-[#6E56A9] bg-[#E4EFE9] hover:bg-slate-200 border border-[#C2A0DD] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mulai Swamedikasi Baru</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
