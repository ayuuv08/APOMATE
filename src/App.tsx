import React, { useState, useEffect } from 'react';
import { ArrowRight, Cloud, CheckCircle, ShieldCheck, MessageSquare } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceMenuGrid } from './components/ServiceMenuGrid';
import { SwamedikasiFlow } from './components/SwamedikasiFlow';
import { MedicineScanner } from './components/MedicineScanner';
import { GolonganObatGuide } from './components/GolonganObatGuide';
import { DrugInteractionChecker } from './components/DrugInteractionChecker';
import { DagusibuSection } from './components/DagusibuSection';
import { ApotekerDirectory } from './components/ApotekerDirectory';
import { TelepharmacyChatModal } from './components/TelepharmacyChatModal';
import { PatientProfileModal } from './components/PatientProfileModal';
import { Footer } from './components/Footer';
import { PatientData, Medicine, Pharmacist, MedicationHistoryItem } from './types';
import { MEDICINES_DATABASE } from './data/medicines';
import { 
  auth, 
  googleProvider, 
  db, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot,
  deleteDoc 
} from './firebase';
import type { User } from 'firebase/auth';

const INITIAL_MEDICATION_HISTORY: MedicationHistoryItem[] = [
  {
    id: 'hist-1',
    medicineId: 'med-paracetamol',
    medicineName: 'Paracetamol 500 mg Kaplet',
    genericName: 'Paracetamol / Acetaminophen',
    category: 'bebas',
    categoryLabel: 'Obat Bebas',
    dosage: '500 mg (1 kaplet) tiap 4–6 jam bila demam/nyeri',
    directions: 'Dapat diminum sebelum atau sesudah makan dengan air putih',
    timing: 'Sesudah makan bila perlu',
    symptoms: ['Demam', 'Sakit Kepala'],
    dateAdded: '28 Sep 2026',
    status: 'completed',
    notes: 'Diminum 2 hari saat flu ringan, demam sudah reda',
    source: 'swamedikasi',
  },
  {
    id: 'hist-2',
    medicineId: 'med-antasida-doen',
    medicineName: 'Antasida DOEN Suspensi / Tablet Kunyah',
    genericName: 'Aluminium Hidroksida & Magnesium Hidroksida',
    category: 'bebas',
    categoryLabel: 'Obat Bebas',
    dosage: '1–2 tablet kunyah halus atau 1–2 sendok takar suspensi',
    directions: '1 jam sebelum makan atau 2 jam sesudah makan dan menjelang tidur',
    timing: 'Sebelum makan saat perut kosong',
    symptoms: ['Maag / Nyeri Ulu Hati', 'Mual & Kembung'],
    dateAdded: '1 Okt 2026',
    status: 'active',
    notes: 'Kebutuhan swamedikasi rutin bila telat makan siang / tugas larut malam',
    source: 'manual',
  },
  {
    id: 'hist-3',
    medicineId: 'med-cetirizine',
    medicineName: 'Cetirizine HCl 10 mg Tablet',
    genericName: 'Cetirizine Dihydrochloride',
    category: 'bebas_terbatas',
    categoryLabel: 'Obat Bebas Terbatas (P.No. 1)',
    dosage: '10 mg (1 tablet) sekali sehari malam hari',
    directions: 'Diminum malam hari menjelang tidur',
    timing: 'Malam hari sebelum tidur',
    symptoms: ['Alergi Kulit (Biduran/Gatal)', 'Bersin-bersin'],
    dateAdded: '20 Sep 2026',
    status: 'completed',
    notes: 'Bila alergi debu kambuh; hindari menyetir karena efek kantuk',
    source: 'swamedikasi',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'swamedikasi' | 'scan' | 'apoteker' | 'profil' | 'dagusibu' | 'interaksi'
  >('home');

  // Active Patient Information State
  const [patient, setPatient] = useState<PatientData>(() => {
    try {
      const saved = localStorage.getItem('apomate_patient_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return {
      fullName: 'Savitri Swandewi',
      ageYears: 22,
      gender: 'P',
      weightKg: 50,
      isPregnantOrLactating: false,
      allergies: ['Amoxicillin'],
      existingConditions: ['maag'],
      symptoms: ['demam', 'nyeri_lambung'],
      symptomDurationDays: 1,
      notes: 'Konseling mandiri swamedikasi terpandu',
    };
  });

  // Medication History State
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('apomate_medication_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_MEDICATION_HISTORY;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apomate_patient_profile', JSON.stringify(patient));
    } catch (e) {}
  }, [patient]);

  useEffect(() => {
    try {
      localStorage.setItem('apomate_medication_history', JSON.stringify(medicationHistory));
    } catch (e) {}
  }, [medicationHistory]);

  // Selected Medicine for Swamedikasi
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(MEDICINES_DATABASE[0]);
  const [swamedikasiStep, setSwamedikasiStep] = useState<1 | 2 | 3>(1);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsCloudSyncing(true);
        try {
          // Fetch or initialize user profile in Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setPatient((prev) => ({
              ...prev,
              fullName: data.fullName || user.displayName || prev.fullName,
              ageYears: data.ageYears ?? prev.ageYears,
              gender: data.gender || prev.gender,
              weightKg: data.weightKg ?? prev.weightKg,
              isPregnantOrLactating: data.isPregnantOrLactating ?? prev.isPregnantOrLactating,
              allergies: data.allergies || prev.allergies,
              existingConditions: data.existingConditions || prev.existingConditions,
              symptoms: data.symptoms || prev.symptoms,
              symptomDurationDays: data.symptomDurationDays ?? prev.symptomDurationDays,
              notes: data.notes || prev.notes,
            }));
          } else {
            // First time sign-in: sync current profile to Firestore
            await setDoc(userDocRef, {
              fullName: user.displayName || patient.fullName,
              ageYears: patient.ageYears,
              gender: patient.gender,
              weightKg: patient.weightKg,
              isPregnantOrLactating: patient.isPregnantOrLactating,
              allergies: patient.allergies,
              existingConditions: patient.existingConditions,
              symptoms: patient.symptoms,
              symptomDurationDays: patient.symptomDurationDays,
              notes: patient.notes,
              email: user.email,
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Firestore initial user profile load warning:', e);
        } finally {
          setIsCloudSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time medication history if user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const medHistoryRef = collection(db, 'users', currentUser.uid, 'medicationHistory');
    const unsubscribe = onSnapshot(medHistoryRef, (snapshot) => {
      if (!snapshot.empty) {
        const items: MedicationHistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as MedicationHistoryItem);
        });
        setMedicationHistory(items);
      }
    }, (error) => {
      console.warn('Medication history sync warning:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign-Out Error:', err);
    }
  };

  // Telepharmacy Live Chat State
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationContextPatient, setConsultationContextPatient] = useState<PatientData | null>(patient);
  const [consultationContextMedicine, setConsultationContextMedicine] = useState<Medicine | null>(selectedMedicine);

  // Profile Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Medication History Handlers
  const handleAddHistoryItem = async (newItem: Omit<MedicationHistoryItem, 'id' | 'dateAdded'>) => {
    const created: MedicationHistoryItem = {
      ...newItem,
      id: `hist-${Date.now()}`,
      dateAdded: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setMedicationHistory((prev) => [created, ...prev]);

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'medicationHistory', created.id), created);
      } catch (e) {
        console.warn('Failed to save to Firestore:', e);
      }
    }
  };

  const handleUpdateHistoryStatus = async (id: string, status: 'active' | 'completed' | 'stopped') => {
    setMedicationHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'medicationHistory', id), { status }, { merge: true });
      } catch (e) {
        console.warn('Failed to update status in Firestore:', e);
      }
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    setMedicationHistory((prev) => prev.filter((item) => item.id !== id));

    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'medicationHistory', id));
      } catch (e) {
        console.warn('Failed to delete from Firestore:', e);
      }
    }
  };

  const handleSaveFromSwamedikasi = async (med: Medicine, calculatedDose: string, patientData: PatientData) => {
    const item: MedicationHistoryItem = {
      id: `hist-${Date.now()}`,
      medicineId: med.id,
      medicineName: med.name,
      genericName: med.genericName,
      category: med.category,
      categoryLabel: med.categoryLabel,
      dosage: calculatedDose,
      directions: med.directions,
      timing: med.timing === 'sebelum_makan' ? 'Sebelum makan (perut kosong)' : 'Sesudah makan',
      symptoms: patientData.symptoms,
      dateAdded: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'active',
      notes: `Dianalisis untuk BB ${patientData.weightKg} kg (Keluhan: ${patientData.symptoms.join(', ')})`,
      source: 'swamedikasi',
    };
    setMedicationHistory((prev) => [item, ...prev]);

    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'medicationHistory', item.id), item);
      } catch (e) {
        console.warn('Failed to save swamedikasi record to Firestore:', e);
      }
    }
  };

  const handleUpdatePatientProfile = async (updated: PatientData) => {
    setPatient(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          ...updated,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.warn('Failed to update patient profile in Firestore:', e);
      }
    }
  };

  const handleSelectForSwamedikasi = (medicineId: string) => {
    const target = MEDICINES_DATABASE.find((m) => m.id === medicineId);
    if (target) {
      setSelectedMedicine(target);
      setCurrentTab('swamedikasi');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConsultPharmacistWithMedicine = (med: Medicine) => {
    setConsultationContextPatient(patient);
    setConsultationContextMedicine(med);
    setIsConsultationOpen(true);
  };

  // Handler to open live chat with contextual patient & drug data
  const handleOpenConsultationWithContext = (patientData: PatientData, medicine?: Medicine) => {
    setConsultationContextPatient(patientData);
    setConsultationContextMedicine(medicine || null);
    setIsConsultationOpen(true);
  };

  // Handler from Medicine Scanner to auto-select and move to swamedikasi result
  const handleSelectMedicineFromScanner = (med: Medicine) => {
    setSelectedMedicine(med);
    setCurrentTab('swamedikasi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPharmacistFromDirectory = (pharm: Pharmacist) => {
    setConsultationContextPatient(patient);
    setConsultationContextMedicine(selectedMedicine);
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E4EFE9] text-[#101D34] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar adhering to the 1-row 3-zone contract */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'profil') {
            setIsProfileModalOpen(true);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenConsultation={() => {
          setConsultationContextPatient(patient);
          setConsultationContextMedicine(selectedMedicine);
          setIsConsultationOpen(true);
        }}
        hasActivePatient={Boolean(patient.fullName)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentTab === 'home' && (
          <div>
            <HeroSection
              patient={patient}
              onStartSwamedikasi={(updatedPatient?: PatientData) => {
                if (updatedPatient) {
                  setPatient(updatedPatient);
                }
                setSwamedikasiStep(2);
                setCurrentTab('swamedikasi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenConsultation={() => {
                setConsultationContextPatient(patient);
                setConsultationContextMedicine(selectedMedicine);
                setIsConsultationOpen(true);
              }}
              onOpenScanner={() => {
                setCurrentTab('scan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Interactive Service Menu Grid Section */}
            <ServiceMenuGrid
              onNavigateTab={(tab) => {
                if (tab === 'swamedikasi') {
                  setSwamedikasiStep(1);
                }
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onOpenConsultation={() => {
                setConsultationContextPatient(patient);
                setConsultationContextMedicine(selectedMedicine);
                setIsConsultationOpen(true);
              }}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />

            {/* Interactive Polipharmacy Check */}
            <DrugInteractionChecker />
          </div>
        )}

        {/* VIEW: SWAMEDIKASI (3-Step Flow) */}
        {currentTab === 'swamedikasi' && (
          <SwamedikasiFlow
            initialStep={swamedikasiStep}
            initialPatient={patient}
            selectedMedicineFromScanner={selectedMedicine}
            onOpenConsultationWithContext={handleOpenConsultationWithContext}
            onOpenScanner={() => setCurrentTab('scan')}
            onSaveToMedicationHistory={handleSaveFromSwamedikasi}
            onViewMedicationHistory={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* VIEW: SCAN OBAT (Dedicated 2-Step Page: Page 1 Scanner, Page 2 Result) */}
        {currentTab === 'scan' && (
          <div className="py-6">
            <MedicineScanner
              patient={patient}
              onSelectMedicineForSwamedikasi={handleSelectMedicineFromScanner}
              onConsultPharmacist={handleConsultPharmacistWithMedicine}
              onSaveToHistory={(med, calculatedDose) => handleSaveFromSwamedikasi(med, calculatedDose, patient)}
            />
          </div>
        )}

        {/* VIEW: APOTEKER DIRECTORY */}
        {currentTab === 'apoteker' && (
          <div>
            <ApotekerDirectory onSelectPharmacist={handleSelectPharmacistFromDirectory} />
          </div>
        )}

        {/* VIEW: DAGUSIBU */}
        {currentTab === 'dagusibu' && (
          <div>
            <DagusibuSection />
            <GolonganObatGuide />
          </div>
        )}

        {/* VIEW: CEK INTERAKSI OBAT */}
        {currentTab === 'interaksi' && (
          <div className="py-6">
            <DrugInteractionChecker />
          </div>
        )}
      </main>

      {/* Floating Action Button for Live Consultation */}
      <button
        onClick={() => {
          setConsultationContextPatient(patient);
          setConsultationContextMedicine(selectedMedicine);
          setIsConsultationOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-3xl bg-gradient-to-r from-[#0DBFCD] to-[#77DBAA] hover:from-[#1EC5C2] hover:to-[#5FD4B3] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer border-2 border-white/60 group"
        aria-label="Konsultasi Apoteker Sekarang"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#883EA9] animate-ping" />
        </div>
        <div className="text-left hidden sm:block pr-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#101D34]/80">Apoteker Siaga</p>
          <p className="text-xs font-extrabold text-[#101D34]">Tanya Obat Sekarang</p>
        </div>
      </button>

      {/* Telepharmacy Live Chat Modal Dialog */}
      <TelepharmacyChatModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialPatient={consultationContextPatient}
        initialMedicine={consultationContextMedicine}
      />

      {/* Patient Profile Modal with Medication History */}
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        patient={patient}
        onUpdatePatient={handleUpdatePatientProfile}
        medicationHistory={medicationHistory}
        onAddHistoryItem={handleAddHistoryItem}
        onUpdateHistoryStatus={handleUpdateHistoryStatus}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onSelectForSwamedikasi={handleSelectForSwamedikasi}
        onConsultPharmacistWithMedicine={handleConsultPharmacistWithMedicine}
      />

      {/* Quiet Footer */}
      <Footer
        onNavigate={(tab) => {
          if (tab === 'profil') {
            setIsProfileModalOpen(true);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenConsultation={() => {
          setConsultationContextPatient(patient);
          setConsultationContextMedicine(selectedMedicine);
          setIsConsultationOpen(true);
        }}
      />
    </div>
  );
}
