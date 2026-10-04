import React, { useState } from 'react';
import { User, X, Clock, ShieldCheck, HeartPulse, CheckCircle, Pill, Sparkles, TrendingUp } from 'lucide-react';
import { PatientData, MedicationHistoryItem, Medicine } from '../types';
import { MedicationHistory } from './MedicationHistory';
import { MedicationTrendsChart } from './MedicationTrendsChart';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData;
  onUpdatePatient: (data: PatientData) => void;
  medicationHistory: MedicationHistoryItem[];
  onAddHistoryItem: (item: Omit<MedicationHistoryItem, 'id' | 'dateAdded'>) => void;
  onUpdateHistoryStatus: (id: string, status: 'active' | 'completed' | 'stopped') => void;
  onDeleteHistoryItem: (id: string) => void;
  onSelectForSwamedikasi: (medicineId: string) => void;
  onConsultPharmacistWithMedicine: (medicine: Medicine) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  patient,
  onUpdatePatient,
  medicationHistory,
  onAddHistoryItem,
  onUpdateHistoryStatus,
  onDeleteHistoryItem,
  onSelectForSwamedikasi,
  onConsultPharmacistWithMedicine,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'trends' | 'profile'>('history');
  const [formData, setFormData] = useState<PatientData>(patient);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when patient changes
  React.useEffect(() => {
    setFormData(patient);
  }, [patient]);

  if (!isOpen) return null;

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePatient(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container: Max-height 85vh on mobile, 88vh on desktop, flex column, overflow hidden */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-[#C2A0DD] relative max-h-[85vh] sm:max-h-[88vh] flex flex-col overflow-hidden">
        
        {/* Sticky Header: Always fixed at top */}
        <div className="sticky top-0 z-30 shrink-0 bg-white px-5 sm:px-7 pt-5 pb-3 border-b border-[#E4EFE9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#0DBFCD] to-[#77DBAA] text-white flex items-center justify-center font-bold shadow shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#101D34] truncate">
                  Profil & Manajemen Swamedikasi
                </h3>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#E4EFE9] text-[#6E56A9] text-xs font-extrabold shrink-0 border border-[#6E56A9]/30">
                  BB: {patient.weightKg} kg
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium truncate mt-0.5">
                Rekam data medis pribadi & pantau pengobatan mandiri berkala
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-[#E4EFE9] hover:bg-slate-200 text-[#101D34] transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticky Tab Controls: Fixed directly under header */}
        <div className="sticky top-0 z-20 shrink-0 bg-white/95 backdrop-blur-sm px-4 sm:px-7 py-2.5 border-b border-[#E4EFE9]">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`py-2 px-2 sm:px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'history'
                  ? 'bg-[#0DBFCD] text-white border-[#0DBFCD] shadow-sm'
                  : 'bg-[#E4EFE9] text-[#101D34] border-transparent hover:bg-slate-200'
              }`}
            >
              <Pill className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Riwayat Obat</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono shrink-0 ${
                activeTab === 'history' ? 'bg-white text-[#0DBFCD]' : 'bg-[#6E56A9] text-white'
              }`}>
                {medicationHistory.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`py-2 px-2 sm:px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'trends'
                  ? 'bg-[#6E56A9] text-white border-[#6E56A9] shadow-sm'
                  : 'bg-[#E4EFE9] text-[#101D34] border-transparent hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#77DBAA] shrink-0" />
              <span className="truncate">Tren & Grafik</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-2 sm:px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'profile'
                  ? 'bg-[#B566C0] text-white border-[#B566C0] shadow-sm'
                  : 'bg-[#E4EFE9] text-[#101D34] border-transparent hover:bg-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Data Pasien</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body: Content scrolls smoothly inside without cutting off */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-4 space-y-4">
          {/* TAB 1: MEDICATION HISTORY */}
          {activeTab === 'history' && (
            <MedicationHistory
              history={medicationHistory}
              patient={patient}
              onAddHistoryItem={onAddHistoryItem}
              onUpdateStatus={onUpdateHistoryStatus}
              onDeleteHistoryItem={onDeleteHistoryItem}
              onSelectForSwamedikasi={(medId) => {
                onSelectForSwamedikasi(medId);
                onClose();
              }}
              onConsultPharmacistWithMedicine={(med) => {
                onConsultPharmacistWithMedicine(med);
                onClose();
              }}
            />
          )}

          {/* TAB 2: MEDICATION TRENDS CHART (RECHARTS) */}
          {activeTab === 'trends' && (
            <MedicationTrendsChart history={medicationHistory} />
          )}

          {/* TAB 3: PATIENT PROFILE FORM */}
          {activeTab === 'profile' && (
            <form id="profile-edit-form" onSubmit={handleSubmitProfile} className="space-y-4 text-xs pt-1">
              {savedSuccess && (
                <div className="p-3 rounded-2xl bg-[#77DBAA]/25 border border-[#77DBAA] text-xs font-bold text-[#101D34] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#77DBAA]" />
                  <span>Data profil & bobot badan berhasil disimpan!</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#101D34] uppercase text-[11px] mb-1">
                  Nama Lengkap Pasien *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#83B3C7] focus:border-[#0DBFCD] text-sm font-semibold text-[#101D34]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#101D34] uppercase text-[11px] mb-1">
                    Usia (Tahun) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    required
                    value={formData.ageYears}
                    onChange={(e) => setFormData({ ...formData, ageYears: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#83B3C7] focus:border-[#0DBFCD] text-sm font-semibold text-[#101D34]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#101D34] uppercase text-[11px] mb-1">
                    Berat Badan (kg) *
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="200"
                    step="0.5"
                    required
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#83B3C7] focus:border-[#0DBFCD] text-sm font-semibold text-[#101D34]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#101D34] uppercase text-[11px] mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#83B3C7] focus:border-[#0DBFCD] text-sm font-semibold text-[#101D34]"
                  >
                    <option value="P">Perempuan</option>
                    <option value="L">Laki-laki</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#101D34] uppercase text-[11px] mb-1">
                  Riwayat Alergi Obat (Sangat Penting):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Amoxicillin, Paracetamol, Ibuprofen (pisahkan koma)"
                  value={formData.allergies.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#83B3C7] focus:border-[#0DBFCD] text-sm font-semibold text-[#101D34]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#101D34] uppercase text-[11px] mb-1">
                  Riwayat Penyakit Penyerta (Komorbid):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'maag', label: 'Maag/GERD' },
                    { id: 'hipertensi', label: 'Hipertensi' },
                    { id: 'asma', label: 'Asma' },
                    { id: 'ginjal', label: 'Gangguan Ginjal' },
                  ].map((cond) => {
                    const isChecked = formData.existingConditions.includes(cond.id);
                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setFormData({
                              ...formData,
                              existingConditions: formData.existingConditions.filter((c) => c !== cond.id),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              existingConditions: [...formData.existingConditions, cond.id],
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#883EA9] text-white border-[#883EA9]'
                            : 'bg-white text-[#101D34] border-[#83B3C7]'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '}
                        {cond.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Action Footer: Stays pinned at bottom, never cut off */}
        <div className="sticky bottom-0 z-30 shrink-0 bg-white/95 backdrop-blur-md px-4 sm:px-7 py-3 border-t border-[#E4EFE9] flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#83B3C7] font-medium hidden sm:inline">
            Status: Tersimpan Lokal
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-[#E4EFE9] hover:bg-slate-200 text-[#101D34] font-bold text-xs cursor-pointer transition-colors"
            >
              Tutup
            </button>
            {activeTab === 'profile' && (
              <button
                type="submit"
                form="profile-edit-form"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
              >
                Simpan Profil
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
