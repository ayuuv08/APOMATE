import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Phone, 
  Video, 
  Sparkles, 
  CheckCheck, 
  Download, 
  UserCheck, 
  Stethoscope, 
  Clock, 
  HelpCircle,
  AlertCircle,
  Globe
} from 'lucide-react';
import { Pharmacist, PatientData, Medicine, ChatMessage } from '../types';
import { PHARMACISTS_DATABASE } from '../data/pharmacists';

interface TelepharmacyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatient?: PatientData | null;
  initialMedicine?: Medicine | null;
}

export const TelepharmacyChatModal: React.FC<TelepharmacyChatModalProps> = ({
  isOpen,
  onClose,
  initialPatient,
  initialMedicine,
}) => {
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist>(PHARMACISTS_DATABASE[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVerifiedSummary, setShowVerifiedSummary] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize or reset chat when opened or context changes
  useEffect(() => {
    if (isOpen) {
      const patientInfo = initialPatient?.fullName 
        ? `${initialPatient.fullName} (${initialPatient.ageYears} th, BB ${initialPatient.weightKg} kg)` 
        : 'Pasien';
      const medInfo = initialMedicine ? initialMedicine.name : 'swamedikasi obat';

      const initialGreeting: ChatMessage = {
        id: 'msg-init-1',
        sender: 'pharmacist',
        pharmacistName: selectedPharmacist.name,
        text: `Halo, salam sehat! Saya ${selectedPharmacist.name} (SIPA: ${selectedPharmacist.sipa}). Saya siap membantu konsultasi ${medInfo} untuk ${patientInfo}. Ada hal khusus atau keluhan yang ingin Anda tanyakan?`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([initialGreeting]);
    }
  }, [isOpen, selectedPharmacist, initialPatient, initialMedicine]);

  if (!isOpen) return null;

  // Generate automated clinical response with Gemini 3.5 Flash & Google Search grounding
  const generatePharmacistResponse = async (userQuestion: string, currentHistory: ChatMessage[]) => {
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentHistory.map(m => ({ sender: m.sender, text: m.text })),
          patientContext: initialPatient,
          medicineContext: initialMedicine,
          pharmacistName: selectedPharmacist.name,
          pharmacistSipa: selectedPharmacist.sipa,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'pharmacist',
            pharmacistName: selectedPharmacist.name,
            text: data.reply,
            sources: data.sources || [],
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
    } catch (err) {
      console.warn('Backend chat API unavailable, falling back to local clinical engine:', err);
    }

    // Local clinical fallback
    const qLower = userQuestion.toLowerCase();
    const weight = initialPatient?.weightKg || 50;
    const isChild = (initialPatient?.ageYears || 22) < 12;

    setTimeout(() => {
      let reply = '';
      if (qLower.includes('paracetamol') || qLower.includes('dosis') || qLower.includes('bb') || qLower.includes('berat')) {
        if (isChild) {
          const minMg = Math.round(10 * weight);
          const maxMg = Math.round(15 * weight);
          const minMl = ((10 * weight) / 24).toFixed(1);
          const maxMl = ((15 * weight) / 24).toFixed(1);
          reply = `Dosis Parasetamol untuk BB ${weight} kg (Pediatri):\n• Takaran per kali: ${minMg} – ${maxMg} mg (setara ${minMl} – ${maxMl} ml sirup 120mg/5ml)\n• Frekuensi: Tiap 4–6 jam, hanya bila demam/nyeri\n• Batas maksimal: 4 kali dalam 24 jam\n• Alat takar: Gunakan sendok/pipet takar obat resmi (bukan sendok makan rumah)`;
        } else {
          reply = `Dosis Parasetamol untuk BB ${weight} kg (Dewasa):\n• Takaran: 500 mg (1 kaplet) atau 1.000 mg bila nyeri berat\n• Interval: Tiap 4–6 jam bila diperlukan\n• Batas maksimal: 4.000 mg (8 kaplet) per 24 jam\n• Catatan: Aman untuk lambung, dapat diminum sebelum atau sesudah makan`;
        }
      } else if (qLower.includes('efek samping') || qLower.includes('bahaya') || qLower.includes('kantuk') || qLower.includes('alergi')) {
        reply = `Efek Samping & Hal yang Perlu Diwaspadai:\n• Parasetamol: Sangat jarang, aman bila tidak melebihi 4.000 mg/hari (kelebihan dosis berisiko ke fungsi hati)\n• Cetirizine: Dapat menyebabkan kantuk ringan; hindari menyetir kendaraan\n• Ibuprofen: Dapat memicu perih lambung/mual; wajib diminum segera sesudah makan\n• Tanda bahaya: Jika timbul ruam kemerahan, bengkak bibir/kelopak mata, segera hentikan obat`;
      } else if (qLower.includes('maag') || qLower.includes('lambung') || qLower.includes('mual') || qLower.includes('perut')) {
        reply = `Aturan Minum untuk Pasien Riwayat Maag:\n• Antasida DOEN: Minum 1 jam sebelum makan atau 2 jam sesudah makan (kunyah halus tablet)\n• Pereda Nyeri/Demam: Pilih Parasetamol (ramah lambung)\n• Hindari: Ibuprofen, Aspirin, atau Asam Mefenamat tanpa perlindungan obat lambung`;
      } else if (qLower.includes('susu') || qLower.includes('teh') || qLower.includes('kopi')) {
        reply = `Panduan Cairan Pendamping Obat:\n• Rekomendasi: Gunakan air putih matang suhu ruang\n• Mengapa bukan susu/teh: Kalsium dalam susu dan tanin dalam teh mengikat zat aktif obat sehingga tidak terserap tubuh\n• Jeda aman: Beri jarak minimal 2 jam jika ingin mengonsumsi susu atau teh manis`;
      } else if (qLower.includes('berapa lama') || qLower.includes('durasi') || qLower.includes('hari')) {
        reply = `Batas Maksimal Pengobatan Mandiri (Swamedikasi):\n• Demam & Sakit Kepala: Maksimal 3 hari\n• Batuk & Pilek (Flu): Maksimal 3–5 hari\n• Diare Ringan (Oralit): Maksimal 2 hari\n• Rujukan: Bila gejala tidak reda dalam 3 hari atau demam > 39°C, segera periksa ke dokter faskes`;
      } else if (qLower.includes('amoxicillin') || qLower.includes('antibiotik') || qLower.includes('radang')) {
        reply = `PERINGATAN RESMI APOTEKER:\n• Golongan: Obat Keras (Lingkaran Merah Huruf K)\n• Regulasi: Dilarang keras dibeli/digunakan untuk swamedikasi tanpa resep dokter\n• Risiko: Penggunaan antibiotik yang tidak tepat dapat menyebabkan resistensi bakteri berbahaya`;
      } else if (qLower.includes('simpan') || qLower.includes('kulkas') || qLower.includes('kadaluwarsa') || qLower.includes('rusak')) {
        reply = `Cara Penyimpanan Obat yang Benar:\n• Tablet & Kaplet: Simpan suhu ruang (< 30°C), kering, dan terlindung dari sinar matahari\n• Sirup yang Telah Dibuka: Maksimal disimpan 30 hari (beri label tanggal buka)\n• Jangan Simpan: Di dashboard mobil atau tempat lembap seperti kamar mandi`;
      } else {
        reply = `Ringkasan Rekomendasi Apoteker:\n• Indikasi: Gunakan obat hanya saat gejala masih dirasakan\n• Aturan Pakai: Patuhi dosis tertera dan gunakan air putih saat minum obat\n• Keamanan: Jangan menggabungkan dua obat dengan zat aktif serupa untuk mencegah overdosis\n• Pertanyaan spesifik: Silakan tanyakan dosis, efek samping, atau interaksi obat`;
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'pharmacist',
          pharmacistName: selectedPharmacist.name,
          text: reply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 700);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    const query = inputText.trim();
    setInputText('');
    generatePharmacistResponse(query, newHistory);
  };

  const quickQuestions = [
    'Bolehkah obat diminum bersama susu/teh?',
    'Apakah obat ini aman untuk lambung/maag?',
    'Berapa dosis sirup tepat untuk berat badan anak?',
    'Berapa hari batas maksimal swamedikasi?',
    'Bagaimana cara menyimpan sirup setelah dibuka?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container: Max-height 85vh on mobile, 88vh on desktop, flex column, overflow hidden */}
      <div className="bg-white w-full max-w-4xl h-[85vh] sm:h-[88vh] max-h-[85vh] sm:max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-[#C2A0DD] relative">
        
        {/* Sticky Header: Fixed at top */}
        <div className="sticky top-0 z-30 shrink-0 bg-gradient-to-r from-[#6E56A9] via-[#883EA9] to-[#B566C0] text-white p-3.5 sm:p-4 sm:px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0DBFCD] to-[#77DBAA] flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow border-2 border-white">
                {selectedPharmacist.name.replace('Apt. ', '').split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
                selectedPharmacist.status === 'online' ? 'bg-[#77DBAA]' : 'bg-amber-400'
              }`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight truncate">
                  {selectedPharmacist.name}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-white shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[#77DBAA]" /> SIPA Resmi
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E4EFE9]/90 font-medium truncate">
                {selectedPharmacist.specialty}
              </p>
              <p className="text-[9px] sm:text-[10px] text-[#C2A0DD] font-mono truncate">
                SIPA: {selectedPharmacist.sipa}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => setShowVerifiedSummary(!showVerifiedSummary)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Lihat Resume Rekomendasi Obat"
            >
              <FileTextIcon className="w-3.5 h-3.5 text-[#77DBAA]" />
              <span className="hidden md:inline">Lembar Rekomendasi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="Tutup Dialog Konsultasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Layout: Responsive Split (Sidebar + Chat Area) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#E4EFE9]/40 min-h-0">
          
          {/* Pharmacist Switcher Sidebar: Constrained height on mobile so it doesn't crush the chat */}
          <div className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-[#83B3C7]/30 p-2.5 sm:p-3 overflow-y-auto shrink-0 max-h-32 md:max-h-none space-y-2">
            <div className="text-[10px] font-extrabold text-[#6E56A9] uppercase tracking-wider">
              Apoteker Siaga:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
              {PHARMACISTS_DATABASE.map((pharm) => {
                const isSelected = pharm.id === selectedPharmacist.id;
                return (
                  <button
                    key={pharm.id}
                    onClick={() => setSelectedPharmacist(pharm)}
                    className={`w-full p-2 rounded-2xl text-left transition-all flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#E4EFE9] border-[#0DBFCD] shadow-xs ring-1 ring-[#0DBFCD]'
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-xl shrink-0 bg-gradient-to-tr from-[#6E56A9] to-[#0DBFCD] flex items-center justify-center text-white font-extrabold text-[11px] shadow-xs">
                      {pharm.name.replace('Apt. ', '').split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold text-[#101D34] truncate">{pharm.name}</p>
                      <p className="text-[9px] text-[#83B3C7] truncate">{pharm.specialty}</p>
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pharm.status === 'online' ? 'bg-[#77DBAA]' : 'bg-amber-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Patient Context Tag */}
            {initialPatient && (
              <div className="hidden md:block p-3 rounded-2xl bg-white border border-[#C2A0DD] text-xs space-y-0.5 shadow-xs">
                <span className="text-xs font-bold text-[#6E56A9] uppercase block tracking-wider">Pasien:</span>
                <p className="font-extrabold text-[#101D34] text-sm truncate">{initialPatient.fullName || 'Pasien Umum'}</p>
                <p className="text-slate-700 font-semibold text-xs">
                  {initialPatient.ageYears} th · {initialPatient.weightKg} kg
                </p>
                {initialMedicine && (
                  <div className="mt-1 pt-1 border-t border-slate-200 text-xs text-[#0DBFCD] font-bold truncate">
                    Obat: {initialMedicine.name}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white min-h-0">
            
            {/* Scrollable Message History Area */}
            <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3.5 min-h-0 scroll-smooth">
              <div className="p-2.5 rounded-2xl bg-[#E4EFE9] border border-[#5FD4B3] text-center text-xs sm:text-sm text-slate-800 font-medium flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0DBFCD] shrink-0" />
                <span>Konsultasi diawasi Apoteker berlisensi STRA/SIPA aktif.</span>
              </div>

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    {!isUser && msg.pharmacistName && (
                      <span className="text-xs font-extrabold text-[#6E56A9] mb-1 pl-1">
                        {msg.pharmacistName}
                      </span>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[90%] sm:max-w-[78%] text-sm sm:text-base leading-relaxed shadow-xs whitespace-pre-line ${
                        isUser
                          ? 'bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] text-white font-medium rounded-br-none'
                          : 'bg-[#E4EFE9] text-slate-900 font-medium border border-[#C2A0DD]/60 rounded-bl-none'
                      }`}
                    >
                      {msg.text}

                      {/* Google Search Grounding Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-black/10 text-xs space-y-1">
                          <div className="flex items-center gap-1 text-[#6E56A9] font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-[#0DBFCD]" />
                            <span>Referensi Google Search & BPOM:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {msg.sources.map((s, idx) => (
                              <a
                                key={idx}
                                href={s.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-white/80 text-slate-900 text-xs font-semibold transition-colors border border-[#0DBFCD]/40 max-w-xs truncate shadow-2xs"
                              >
                                <Globe className="w-3 h-3 text-[#0DBFCD] shrink-0" />
                                <span className="truncate">{s.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-[#E4EFE9] px-3.5 py-2 rounded-2xl w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0DBFCD] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#77DBAA] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B566C0] animate-bounce [animation-delay:0.4s]" />
                  <span className="font-bold text-[#6E56A9] text-xs">Apoteker sedang mengetik...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Ribbon */}
            <div className="shrink-0 p-2 sm:px-3 bg-[#E4EFE9]/60 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-extrabold text-[#6E56A9] uppercase shrink-0">
                Tanya:
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(q)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#C2A0DD]/30 border border-slate-300 text-xs font-semibold text-slate-900 whitespace-nowrap cursor-pointer transition-colors shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Sticky Input Bar at Bottom */}
            <form onSubmit={handleSendMessage} className="sticky bottom-0 z-20 shrink-0 p-3 sm:p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Tulis pertanyaan untuk apoteker..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#E4EFE9]/40 border border-slate-300 focus:border-[#0DBFCD] focus:ring-2 focus:ring-[#0DBFCD]/20 text-sm sm:text-base font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] text-white font-extrabold text-sm shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Kirim</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Modal Lembar Rekomendasi Overlay */}
        {showVerifiedSummary && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto z-40 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#83B3C7]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0DBFCD] to-[#77DBAA] flex items-center justify-center text-white font-bold">
                    ℞
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#101D34]">Lembar Rekomendasi Apoteker (APOMATE)</h4>
                    <p className="text-[10px] text-[#83B3C7]">Surat Informasi Konseling Swamedikasi Resmi</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVerifiedSummary(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#101D34]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-[#E4EFE9] border border-[#5FD4B3] text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#83B3C7]/30">
                  <p><strong>Pasien:</strong> {initialPatient?.fullName || 'Pasien Mandiri'}</p>
                  <p><strong>Berat Badan:</strong> {initialPatient?.weightKg || 50} kg</p>
                  <p><strong>Apoteker:</strong> {selectedPharmacist.name}</p>
                  <p><strong>No. SIPA:</strong> {selectedPharmacist.sipa}</p>
                </div>
                <p><strong>Obat Direkomendasikan:</strong> {initialMedicine?.name || 'Paracetamol 500 mg'}</p>
                <p><strong>Aturan Pakai:</strong> Diminum sesudah makan dengan segelas air putih, maksimal 3 hari.</p>
                <p><strong>Prinsip Dagusibu:</strong> Dapatkan di apotek berizin resmi, simpan suhu kamar, jangan gunakan jika fisik obat berubah warna.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-[#83B3C7]/30 sticky bottom-0 bg-white">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#6E56A9] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cetak Lembar</span>
              </button>
              <button
                onClick={() => setShowVerifiedSummary(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-[#101D34] font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
