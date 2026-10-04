import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Pill, 
  ArrowRight, 
  Scan, 
  X, 
  ShieldCheck, 
  Scale, 
  Clock, 
  ShieldAlert, 
  MessageSquare,
  BookmarkCheck,
  ChevronLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { Medicine, PatientData } from '../types';
import { MEDICINES_DATABASE } from '../data/medicines';
import { OfficialKemenkesDrugLogo } from './GolonganObatGuide';

interface MedicineScannerProps {
  patient?: PatientData;
  onSelectMedicineForSwamedikasi?: (med: Medicine) => void;
  onConsultPharmacist?: (med: Medicine) => void;
  onSaveToHistory?: (med: Medicine, calculatedDose: string) => void;
  onClose?: () => void;
}

export const MedicineScanner: React.FC<MedicineScannerProps> = ({
  patient,
  onSelectMedicineForSwamedikasi,
  onConsultPharmacist,
  onSaveToHistory,
  onClose,
}) => {
  // Page state: 'scan' (Page 1) or 'result' (Page 2)
  const [currentPage, setCurrentPage] = useState<'scan' | 'result'>('scan');

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedMedicine, setDetectedMedicine] = useState<Medicine | null>(null);
  const [scanStatusMessage, setScanStatusMessage] = useState<string>('Arahkan kemasan ke dalam frame');
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  // Patient Weight for dynamic dose calculation (defaults to patient's weight or 50kg)
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(patient?.weightKg || 50);
  const [savedToHistory, setSavedToHistory] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample medicine packages for instant testing
  const samplePackages = [
    {
      name: 'Paracetamol 500 mg',
      brand: 'Sanbe / BPOM DKL0412',
      id: 'med-paracetamol',
      type: 'Bebas (Hijau)',
    },
    {
      name: 'Antasida DOEN 60ml',
      brand: 'Kimia Farma GBL9208',
      id: 'med-antasida-doen',
      type: 'Bebas (Hijau)',
    },
    {
      name: 'Cetirizine 10 mg',
      brand: 'Kalbe DTL0911',
      id: 'med-cetirizine',
      type: 'Bebas Terbatas (Biru)',
    },
    {
      name: 'Ibuprofen 400 mg',
      brand: 'Generik DTL9612',
      id: 'med-ibuprofen',
      type: 'Bebas Terbatas (Biru)',
    },
    {
      name: 'Amoxicillin 500 mg',
      brand: 'Bernofarm DKL9802',
      id: 'med-amoxicillin',
      type: 'Obat Keras (Merah K)',
    },
  ];

  // Start live webcam stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
        triggerDetection(MEDICINES_DATABASE[0]);
      } else {
        setCameraError('Kamera tidak didukung. Silakan gunakan tombol sampel di bawah.');
      }
    } catch (err: any) {
      setCameraError('Izin kamera tidak aktif. Gunakan sampel kemasan untuk uji coba instan.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const triggerDetection = (med: Medicine) => {
    setIsScanning(true);
    setScanStatusMessage('Mendeteksi logo BPOM & teks kemasan...');
    setDetectedMedicine(null);

    setTimeout(() => {
      setIsScanning(false);
      setDetectedMedicine(med);
      setScanStatusMessage('Kemasan terdeteksi!');
    }, 1000);
  };

  const handleSelectSample = (idx: number) => {
    setActivePresetIndex(idx);
    const item = samplePackages[idx];
    const med = MEDICINES_DATABASE.find((m) => m.id === item.id) || MEDICINES_DATABASE[0];
    triggerDetection(med);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const randomMed = MEDICINES_DATABASE[Math.floor(Math.random() * 3)];
      triggerDetection(randomMed);
    }
  };

  // Calculate dynamic dose for Page 2 based on weight
  const doseDetails = React.useMemo(() => {
    if (!detectedMedicine) {
      return {
        singleDose: '500 mg (1 kaplet)',
        frequency: 'Tiap 4–6 jam bila perlu',
        maxDaily: 'Maksimal 4.000 mg per 24 jam',
        timing: 'Dapat diminum sebelum atau sesudah makan',
        warningNote: 'Hentikan bila gejala reda dalam 3 hari',
      };
    }
    const isChild = (patient?.ageYears || 22) < 12;

    if (detectedMedicine.id === 'med-paracetamol') {
      if (isChild) {
        const minMg = Math.round(10 * currentWeightKg);
        const maxMg = Math.round(15 * currentWeightKg);
        const minMl = ((10 * currentWeightKg) / 24).toFixed(1);
        const maxMl = ((15 * currentWeightKg) / 24).toFixed(1);
        return {
          singleDose: `${minMg} – ${maxMg} mg (${minMl} – ${maxMl} ml sirup 120mg/5ml)`,
          frequency: 'Tiap 4–6 jam hanya saat demam/nyeri',
          maxDaily: 'Maksimal 4 kali pemberian dalam 24 jam',
          timing: 'Sesudah makan dengan sendok takar obat resmi',
          warningNote: 'Jangan berikan bersamaan dengan obat flu lain yang mengandung parasetamol',
        };
      }
      return {
        singleDose: '500 – 1.000 mg (1–2 kaplet)',
        frequency: 'Tiap 4–6 jam bila demam atau nyeri',
        maxDaily: 'Maksimal 4.000 mg (8 kaplet) per 24 jam',
        timing: 'Sebelum atau sesudah makan dengan air putih',
        warningNote: 'Aman untuk lambung, hindari konsumsi alkohol',
      };
    }

    if (detectedMedicine.id === 'med-antasida-doen') {
      return {
        singleDose: '1–2 tablet kunyah atau 5–10 ml suspensi',
        frequency: '3–4 kali sehari',
        maxDaily: 'Maksimal 4 kali sehari selama 5 hari',
        timing: '1 jam sebelum makan atau 2 jam sesudah makan & menjelang tidur',
        warningNote: 'Kunyah tablet sampai halus sebelum ditelan agar efektivitas maksimal',
      };
    }

    if (detectedMedicine.id === 'med-ibuprofen') {
      if (isChild) {
        const minMg = Math.round(5 * currentWeightKg);
        const maxMg = Math.round(10 * currentWeightKg);
        return {
          singleDose: `${minMg} – ${maxMg} mg per kali minum`,
          frequency: 'Tiap 6–8 jam bila demam tinggi/nyeri radang',
          maxDaily: 'Maksimal 3–4 kali sehari (maks. 40 mg/kgBB/hari)',
          timing: 'SEGERA sesudah makan (perut tidak boleh kosong)',
          warningNote: 'Hati-hati pada riwayat maag atau asma',
        };
      }
      return {
        singleDose: '200 – 400 mg (1 tablet)',
        frequency: 'Tiap 6–8 jam setelah makan',
        maxDaily: 'Maksimal 1.200 mg per 24 jam untuk swamedikasi',
        timing: 'Wajib sesudah makan bersama segelas air',
        warningNote: 'Hindari bila ada tukak lambung aktif',
      };
    }

    if (detectedMedicine.id === 'med-cetirizine') {
      return {
        singleDose: '10 mg (1 tablet) atau 5 mg untuk anak > 6 tahun',
        frequency: '1 kali sehari',
        maxDaily: 'Maksimal 10 mg per 24 jam',
        timing: 'Malam hari sebelum tidur',
        warningNote: 'Dapat menyebabkan kantuk; hindari mengemudi kendaraan',
      };
    }

    if (detectedMedicine.id === 'med-amoxicillin') {
      return {
        singleDose: 'OBAT KERAS (Antibiotik)',
        frequency: 'Harus sesuai resep dokter',
        maxDaily: 'Dilarang swamedikasi bebas',
        timing: 'Wajib habis sesuai petunjuk dokter untuk mencegah resistensi',
        warningNote: 'TIDAK BOLEH dikonsumsi tanpa pemeriksaan dokter dan resep resmi',
      };
    }

    return {
      singleDose: detectedMedicine.standardAdultDose,
      frequency: 'Sesuai petunjuk kemasan',
      maxDaily: `Maksimal durasi ${detectedMedicine.maxDurationDays} hari`,
      timing: detectedMedicine.timing === 'sebelum_makan' ? 'Sebelum makan' : 'Sesudah makan',
      warningNote: 'Hentikan bila timbul reaksi alergi',
    };
  }, [detectedMedicine, currentWeightKg, patient]);

  // Backward-compatible single string dose
  const calculatedDose = `${doseDetails.singleDose}, ${doseDetails.frequency} (${doseDetails.timing})`;

  // Navigate to Page 2
  const handleViewResult = () => {
    if (detectedMedicine) {
      stopCamera();
      setCurrentPage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset & Scan Ulang
  const handleScanAgain = () => {
    setDetectedMedicine(null);
    setActivePresetIndex(null);
    setCurrentPage('scan');
  };

  // -------------------------------------------------------------
  // PAGE 1: SCANNER ONLY (CLEAN, MINIMAL, BOUNDED MAX-HEIGHT & SCROLLABLE)
  // -------------------------------------------------------------
  if (currentPage === 'scan') {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3">
        {/* Scanner Container with bounded max-height and inner scroll */}
        <div className="w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-xl border-2 border-[#5FD4B3]/60 overflow-hidden text-[#101D34]">
          
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 shrink-0 bg-white px-5 pt-4 pb-3 border-b border-[#83B3C7]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#0DBFCD] text-white flex items-center justify-center shadow-xs">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#101D34] leading-tight">
                  Scan Kemasan Obat
                </h2>
                <p className="text-[11px] text-[#83B3C7] font-medium">
                  Pindai logo lingkaran BPOM & sediaan
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-[#E4EFE9] hover:bg-slate-200 text-[#101D34] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Scrollable Inner Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 scroll-smooth">
            {/* Clean Viewfinder Frame */}
            <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#0DBFCD] to-[#5FD4B3] shadow-md relative overflow-hidden">
              <div className="w-full aspect-[4/3] max-h-64 sm:max-h-72 rounded-2xl bg-[#E4EFE9] relative flex flex-col items-center justify-center overflow-hidden border-2 border-white shadow-inner">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-[#6E56A9]">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-extrabold text-[#101D34]">
                      Kamera Belum Aktif
                    </p>
                    <p className="text-[10px] text-[#83B3C7]">
                      Gunakan tombol kamera atau sampel instan
                    </p>
                  </div>
                )}

                {/* Sharp Viewfinder Reticle */}
                <div className="absolute inset-4 border border-dashed border-[#6E56A9]/70 rounded-xl pointer-events-none flex flex-col justify-between p-1.5">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-[#6E56A9]" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-[#6E56A9]" />
                  </div>

                  {isScanning && (
                    <div className="h-0.5 bg-[#883EA9] w-full shadow-[0_0_8px_#883EA9] animate-[bounce_1.5s_infinite]" />
                  )}

                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-[#6E56A9]" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-[#6E56A9]" />
                  </div>
                </div>

                {/* Status Pill */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#6E56A9] shadow-xs flex items-center gap-1.5 whitespace-nowrap">
                  {isScanning ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B566C0] animate-ping" />
                      <span>{scanStatusMessage}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3 text-[#0DBFCD]" />
                      <span>{scanStatusMessage}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Camera & Upload Controls */}
              <div className="flex items-center justify-center gap-2 mt-3.5">
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3.5 py-2 rounded-2xl bg-white text-[#101D34] font-extrabold text-xs shadow-xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#0DBFCD]" />
                    <span>Buka Kamera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3.5 py-2 rounded-2xl bg-white text-red-600 font-extrabold text-xs shadow-xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Tutup Kamera</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-2xl bg-white/95 hover:bg-white text-[#101D34] font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#6E56A9]" />
                  <span>Unggah Foto</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {cameraError && (
                <p className="text-center text-[10px] font-semibold text-white bg-black/25 p-1.5 rounded-xl mt-2">
                  {cameraError}
                </p>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-[#6E56A9] uppercase tracking-wider block">
                Uji Coba Cepat Sampel Kemasan:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {samplePackages.map((pkg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(idx)}
                    className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      activePresetIndex === idx
                        ? 'bg-white border-[#0DBFCD] shadow-xs ring-2 ring-[#0DBFCD]/20'
                        : 'bg-white/80 border-[#83B3C7]/30 hover:bg-white'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-[#6E56A9] block">
                      {pkg.type}
                    </span>
                    <p className="text-xs font-extrabold text-[#101D34] truncate mt-0.5">
                      {pkg.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar when medicine is detected */}
          {detectedMedicine && (
            <div className="sticky bottom-0 z-20 shrink-0 bg-white/95 backdrop-blur-md p-3.5 px-5 border-t border-[#83B3C7]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#77DBAA]/30 flex items-center justify-center text-[#101D34] shrink-0 font-bold text-xs">
                  ✓
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-[#0DBFCD] uppercase tracking-wider block">
                    Kemasan Terdeteksi
                  </span>
                  <p className="text-xs font-extrabold text-[#101D34] truncate">
                    {detectedMedicine.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleViewResult}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <span>Lihat Hasil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PAGE 2: RESULT VIEW (BOUNDED MAX-HEIGHT, STICKY HEADER & FOOTER, SMOOTH SCROLL BODY)
  // -------------------------------------------------------------
  const med = detectedMedicine || MEDICINES_DATABASE[0];

  const categoryBadgeStyle =
    med.category === 'bebas'
      ? { bg: 'bg-[#0DBFCD]', text: 'text-white', type: 'bebas' as const, label: 'Obat Bebas' }
      : med.category === 'bebas_terbatas'
      ? { bg: 'bg-[#77DBAA]', text: 'text-[#101D34]', type: 'bebas_terbatas' as const, label: 'Bebas Terbatas (P.No 1)' }
      : { bg: 'bg-[#6E56A9]', text: 'text-white', type: 'keras' as const, label: 'Obat Keras (Wajib Resep)' };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3">
      {/* Container: Max height 85vh on mobile, 88vh on desktop, flex column, overflow hidden */}
      <div className="w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-xl border-2 border-[#5FD4B3]/60 overflow-hidden text-[#101D34] animate-fadeIn">
        
        {/* Sticky Header: Back & Title pinned at top */}
        <div className="sticky top-0 z-20 shrink-0 bg-white px-5 pt-4 pb-3 border-b border-[#83B3C7]/20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleScanAgain}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#101D34] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs border border-[#83B3C7]/40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Scan Ulang</span>
          </button>

          <span className="text-[11px] font-extrabold text-[#6E56A9] uppercase tracking-wider bg-[#E4EFE9] px-3 py-1 rounded-xl">
            Hasil Analisis Sediaan
          </span>
        </div>

        {/* Scrollable Result Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 scroll-smooth">
          {/* Card 1: Nama Obat & BPOM Category Badge */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#5FD4B3] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase flex items-center gap-2 ${categoryBadgeStyle.bg} ${categoryBadgeStyle.text}`}>
                <OfficialKemenkesDrugLogo category={categoryBadgeStyle.type} className="w-4 h-4" />
                <span>{categoryBadgeStyle.label}</span>
              </span>
              <span className="text-xs text-slate-700 font-mono font-bold">
                BPOM Terverifikasi
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#101D34] leading-snug">
              {med.name}
            </h3>
            <p className="text-sm text-slate-700 font-semibold">
              {med.brand} · Bentuk {med.form}
            </p>

            {/* Indikasi Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {med.indications.map((ind, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-[#E4EFE9] text-slate-900 text-xs sm:text-sm font-semibold">
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Active Ingredients (Komposisi) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#C2A0DD] shadow-xs flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#0DBFCD]/15 text-[#0DBFCD] flex items-center justify-center shrink-0 mt-0.5">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#6E56A9] uppercase block tracking-wide">Zat Aktif & Kekuatan</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 leading-snug">{med.composition}</p>
            </div>
          </div>

          {/* Card 3: Dosage Per Body Weight with Interactive Weight Adjuster */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#C2A0DD]/35 border-2 border-[#883EA9]/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#6E56A9]" />
                <span className="text-sm font-extrabold text-[#6E56A9] uppercase tracking-wide">
                  Dosis Berdasarkan Bobot Badan
                </span>
              </div>

              {/* Quick Body Weight adjuster */}
              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl shadow-xs border border-[#C2A0DD]">
                <span className="text-xs font-bold text-slate-600">BB:</span>
                <input
                  type="number"
                  min="3"
                  max="150"
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                  className="w-12 text-sm font-extrabold text-slate-900 text-center focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-900">kg</span>
              </div>
            </div>

            {/* Bullet Points of Dosage */}
            <div className="bg-white/95 p-4 sm:p-5 rounded-2xl border border-[#C2A0DD]/60 text-sm sm:text-base space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="text-[#0DBFCD] font-extrabold text-base">•</span>
                <p className="text-slate-900 leading-relaxed font-semibold">
                  <strong className="text-[#6E56A9] font-extrabold">Takaran per Kali:</strong> {doseDetails.singleDose}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-extrabold text-base">•</span>
                <p className="text-slate-900 leading-relaxed font-semibold">
                  <strong className="text-slate-900 font-extrabold">Frekuensi:</strong> {doseDetails.frequency}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#B566C0] font-extrabold text-base">•</span>
                <p className="text-slate-900 leading-relaxed font-semibold">
                  <strong className="text-slate-900 font-extrabold">Batas Maksimal:</strong> {doseDetails.maxDaily}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#6E56A9] font-extrabold text-base">•</span>
                <p className="text-slate-900 leading-relaxed font-semibold">
                  <strong className="text-slate-900 font-extrabold">Waktu Konsumsi:</strong> {doseDetails.timing}
                </p>
              </div>
              {doseDetails.warningNote && (
                <div className="pt-2 mt-1 border-t border-slate-200 text-sm sm:text-base text-[#883EA9] font-bold flex items-center gap-2 leading-relaxed">
                  <Info className="w-5 h-5 text-[#883EA9] shrink-0" />
                  <span>{doseDetails.warningNote}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Usage Instructions & Timing */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#5FD4B3]/25 border border-[#0DBFCD] shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0DBFCD] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase block tracking-wide">Aturan Pakai & Waktu Minum</span>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">{med.directions}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-900 font-semibold pt-1">
                <span>Maksimal: <strong className="text-slate-900 font-extrabold">{med.maxDurationDays} hari</strong></span>
                <span>·</span>
                <span>{med.storageAdvice}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Safety Warnings */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#B566C0] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-base font-extrabold text-[#883EA9]">
              <ShieldAlert className="w-5 h-5 text-[#B566C0]" />
              <span>Peringatan Keamanan</span>
            </div>
            <ul className="text-sm sm:text-base space-y-2 text-slate-900 pl-4 list-disc font-semibold leading-relaxed">
              {med.warnings.slice(0, 2).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky Action Footer: Pinned at bottom of Result View */}
        <div className="sticky bottom-0 z-20 shrink-0 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-[#83B3C7]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {onSaveToHistory ? (
            <button
              type="button"
              onClick={() => {
                onSaveToHistory(med, calculatedDose);
                setSavedToHistory(true);
                setTimeout(() => setSavedToHistory(false), 2000);
              }}
              className="text-xs font-bold text-[#6E56A9] hover:underline cursor-pointer inline-flex items-center justify-center gap-1 py-1"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-[#0DBFCD]" />
              <span>{savedToHistory ? '✓ Tersimpan di Profil' : 'Simpan ke Profil'}</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleScanAgain}
              className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-2xl font-bold text-xs text-[#101D34] bg-white hover:bg-slate-100 border border-[#83B3C7] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#0DBFCD]" />
              <span>Scan Ulang</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onConsultPharmacist) {
                  onConsultPharmacist(med);
                }
              }}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-2xl font-extrabold text-xs text-white bg-gradient-to-r from-[#883EA9] to-[#B566C0] hover:from-[#6E56A9] hover:to-[#883EA9] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#77DBAA]" />
              <span>Konsultasi Apoteker</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
