import React, { useState } from 'react';
import { 
  Pill, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  Repeat, 
  MessageSquare, 
  AlertCircle, 
  Check, 
  Filter,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { MedicationHistoryItem, Medicine, PatientData } from '../types';
import { MEDICINES_DATABASE, SYMPTOM_OPTIONS } from '../data/medicines';

interface MedicationHistoryProps {
  history: MedicationHistoryItem[];
  patient: PatientData;
  onAddHistoryItem: (item: Omit<MedicationHistoryItem, 'id' | 'dateAdded'>) => void;
  onUpdateStatus: (id: string, status: 'active' | 'completed' | 'stopped') => void;
  onDeleteHistoryItem: (id: string) => void;
  onSelectForSwamedikasi: (medicineId: string) => void;
  onConsultPharmacistWithMedicine: (medicine: Medicine) => void;
}

export const MedicationHistory: React.FC<MedicationHistoryProps> = ({
  history,
  patient,
  onAddHistoryItem,
  onUpdateStatus,
  onDeleteHistoryItem,
  onSelectForSwamedikasi,
  onConsultPharmacistWithMedicine,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New medication form state
  const [selectedMedId, setSelectedMedId] = useState<string>(MEDICINES_DATABASE[0].id);
  const [customMedName, setCustomMedName] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['demam']);
  const [customDosage, setCustomDosage] = useState('');
  const [customTiming, setCustomTiming] = useState('Sesudah makan bila perlu');
  const [personalNotes, setPersonalNotes] = useState('');
  const [treatmentStatus, setTreatmentStatus] = useState<'active' | 'completed'>('active');

  // Filtered list
  const filteredList = history.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const activeCount = history.filter((i) => i.status === 'active').length;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenDbMed = MEDICINES_DATABASE.find((m) => m.id === selectedMedId);

    const medName = chosenDbMed ? chosenDbMed.name : (customMedName || 'Obat Swamedikasi Mandiri');
    const generic = chosenDbMed ? chosenDbMed.genericName : 'Zat aktif mandiri';
    const category = chosenDbMed ? chosenDbMed.category : 'bebas';
    const categoryLabel = chosenDbMed ? chosenDbMed.categoryLabel : 'Obat Bebas';

    onAddHistoryItem({
      medicineId: chosenDbMed ? chosenDbMed.id : `custom-${Date.now()}`,
      medicineName: medName,
      genericName: generic,
      category,
      categoryLabel,
      dosage: customDosage || (chosenDbMed ? chosenDbMed.standardAdultDose : 'Sesuai petunjuk kemasan'),
      directions: chosenDbMed ? chosenDbMed.directions : 'Diminum dengan air putih',
      timing: customTiming,
      symptoms: selectedSymptoms,
      status: treatmentStatus,
      notes: personalNotes,
      source: 'manual',
    });

    setIsAddingNew(false);
    setPersonalNotes('');
    setCustomDosage('');
  };

  return (
    <div className="space-y-5">
      {/* Quick Summary Bar */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#E4EFE9] border border-[#5FD4B3]/40 text-center">
        <div>
          <span className="text-[10px] font-bold text-[#6E56A9] uppercase block">Total Riwayat</span>
          <span className="text-base font-extrabold text-[#101D34]">{history.length} Obat</span>
        </div>
        <div className="border-x border-[#83B3C7]/30">
          <span className="text-[10px] font-bold text-[#0DBFCD] uppercase block">Sedang Aktif</span>
          <span className="text-base font-extrabold text-[#101D34]">{activeCount} Terapi</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#77DBAA] uppercase block">Selesai/Sembuh</span>
          <span className="text-base font-extrabold text-[#101D34]">
            {history.filter((i) => i.status === 'completed').length} Obat
          </span>
        </div>
      </div>

      {/* Action Bar: Filter Segmented Control & "Tambah Obat" Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 p-1 bg-[#E4EFE9] rounded-2xl border border-[#83B3C7]/30 text-xs">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-[#101D34] shadow-sm'
                : 'text-[#83B3C7] hover:text-[#101D34]'
            }`}
          >
            Semua ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'active'
                ? 'bg-[#0DBFCD] text-white shadow-sm'
                : 'text-[#83B3C7] hover:text-[#101D34]'
            }`}
          >
            Aktif ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-[#77DBAA] text-[#101D34] shadow-sm'
                : 'text-[#83B3C7] hover:text-[#101D34]'
            }`}
          >
            Selesai
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] text-white font-extrabold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingNew ? 'Tutup Formulir' : 'Catat Obat Baru'}</span>
        </button>
      </div>

      {/* Drawer / Collapse: Form Tambah Riwayat Obat Swamedikasi */}
      {isAddingNew && (
        <form
          onSubmit={handleCreateItem}
          className="p-5 rounded-3xl bg-[#E4EFE9]/60 border-2 border-[#0DBFCD] space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#83B3C7]/30">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#6E56A9]">
              <Sparkles className="w-4 h-4 text-[#0DBFCD]" />
              <span>Catat Kebutuhan Swamedikasi Rutin Anda</span>
            </div>
            <span className="text-[10px] text-[#83B3C7]">Pengingat & Rekam Medis</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#101D34] uppercase mb-1">
              Pilih Obat dari Katalog Terdaftar BPOM:
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => {
                setSelectedMedId(e.target.value);
                const med = MEDICINES_DATABASE.find((m) => m.id === e.target.value);
                if (med) {
                  setCustomDosage(med.standardAdultDose);
                  setCustomTiming(med.timing === 'sebelum_makan' ? 'Sebelum makan' : 'Sesudah makan');
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] text-xs font-bold text-[#101D34] focus:outline-none"
            >
              {MEDICINES_DATABASE.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.categoryLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Keluhan / Alasan Minum Obat */}
          <div>
            <label className="block text-[11px] font-bold text-[#101D34] uppercase mb-1">
              Keluhan / Indikasi yang Ditangani:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        if (selectedSymptoms.length > 1) {
                          setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym.id));
                        }
                      } else {
                        setSelectedSymptoms([...selectedSymptoms, sym.id]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#6E56A9] text-white border-[#6E56A9]'
                        : 'bg-white text-[#101D34] border-[#83B3C7] hover:border-[#6E56A9]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {sym.label.split('/')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#101D34] uppercase text-[10px] mb-1">
                Catatan Dosis / Aturan Pakai:
              </label>
              <input
                type="text"
                placeholder="Cth: 1 kaplet tiap 6 jam"
                value={customDosage}
                onChange={(e) => setCustomDosage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] text-xs font-semibold text-[#101D34]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#101D34] uppercase text-[10px] mb-1">
                Status Saat Ini:
              </label>
              <select
                value={treatmentStatus}
                onChange={(e) => setTreatmentStatus(e.target.value as 'active' | 'completed')}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] text-xs font-semibold text-[#101D34]"
              >
                <option value="active">Sedang Aktif Dikonsumsi</option>
                <option value="completed">Riwayat / Sudah Sembuh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#101D34] uppercase text-[10px] mb-1">
              Catatan Pengingat Mandiri (Opsional):
            </label>
            <input
              type="text"
              placeholder="Cth: Hanya diminum bila pusing kambuh; sedia di kotak P3K tas kerja"
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#83B3C7] focus:border-[#0DBFCD] text-xs font-semibold text-[#101D34]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#83B3C7]/30">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl bg-white text-[#101D34] font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#6E56A9] hover:bg-[#883EA9] text-white font-extrabold text-xs shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan ke Riwayat</span>
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {filteredList.length === 0 && (
        <div className="text-center py-8 px-4 rounded-3xl bg-[#E4EFE9]/40 border-2 border-dashed border-[#83B3C7]/50">
          <div className="w-12 h-12 rounded-2xl bg-white shadow mx-auto flex items-center justify-center text-[#6E56A9] mb-3">
            <Pill className="w-6 h-6 text-[#0DBFCD]" />
          </div>
          <h4 className="text-sm font-extrabold text-[#101D34]">
            Belum Ada Riwayat Obat Tercatat
          </h4>
          <p className="text-xs text-[#83B3C7] mt-1 max-w-sm mx-auto">
            Gunakan tombol "Catat Obat Baru" di atas atau lakukan pemeriksaan swamedikasi untuk otomatis merekam obat Anda di sini.
          </p>
        </div>
      )}

      {/* Medication History Cards List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredList.map((item) => {
          const matchedMed = MEDICINES_DATABASE.find((m) => m.id === item.medicineId);

          const badgeColor =
            item.category === 'bebas'
              ? 'bg-[#0DBFCD] text-white'
              : item.category === 'bebas_terbatas'
              ? 'bg-[#77DBAA] text-[#101D34]'
              : 'bg-[#6E56A9] text-white';

          const statusColor =
            item.status === 'active'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : item.status === 'completed'
              ? 'bg-blue-50 text-blue-800 border-blue-300'
              : 'bg-slate-100 text-slate-700 border-slate-300';

          const statusLabel =
            item.status === 'active'
              ? 'Sedang Aktif'
              : item.status === 'completed'
              ? 'Selesai / Sembuh'
              : 'Dihentikan';

          return (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-white border border-[#83B3C7]/40 hover:border-[#0DBFCD] shadow-sm hover:shadow-md transition-all space-y-3"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase ${badgeColor}`}>
                      {item.categoryLabel.split('(')[0].trim()}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${statusColor}`}>
                      {statusLabel}
                    </span>
                    <span className="text-xs text-slate-800 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0DBFCD]" />
                      {item.dateAdded}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-extrabold text-[#101D34] leading-snug">
                    {item.medicineName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold">{item.genericName}</p>
                </div>

                {/* Status Toggle Selector */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      onUpdateStatus(item.id, e.target.value as 'active' | 'completed' | 'stopped')
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-[#E4EFE9] border border-[#83B3C7] text-xs font-bold text-[#101D34] focus:outline-none cursor-pointer"
                  >
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="stopped">Dihentikan</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus dari riwayat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dosage & Timing details */}
              <div className="p-3.5 rounded-2xl bg-[#E4EFE9]/60 text-xs sm:text-sm space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <span className="font-extrabold text-[#6E56A9] text-xs sm:text-sm shrink-0">Dosis Acuan:</span>
                  <span className="text-slate-900 text-xs sm:text-sm font-bold leading-relaxed">{item.dosage}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-900 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#0DBFCD] shrink-0" />
                  <span>{item.timing}</span>
                </div>
                {item.notes && (
                  <div className="pt-1.5 border-t border-[#83B3C7]/30 text-xs sm:text-sm text-[#883EA9] font-medium italic leading-relaxed">
                    Catatan: "{item.notes}"
                  </div>
                )}
              </div>

              {/* Quick Actions for Recurring Swamedikasi Needs */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {/* Symptoms treated */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <span className="text-slate-800 font-bold shrink-0">Keluhan:</span>
                  {item.symptoms.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-[#83B3C7] text-slate-900 font-semibold">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {matchedMed && (
                    <button
                      type="button"
                      onClick={() => onConsultPharmacistWithMedicine(matchedMed)}
                      className="px-3 py-1.5 rounded-xl bg-[#883EA9]/15 hover:bg-[#883EA9]/25 text-[#883EA9] font-extrabold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title="Konsultasikan obat ini ke Apoteker"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tanya Apoteker</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectForSwamedikasi(item.medicineId)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] text-white font-extrabold text-[11px] flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Ulangi Swamedikasi</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
