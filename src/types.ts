export type GolonganObat = 'bebas' | 'bebas_terbatas' | 'keras' | 'narkotika_psikotropika';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: GolonganObat;
  categoryLabel: string;
  brand: string;
  strength: string;
  form: 'tablet' | 'kaplet' | 'sirup' | 'kapsul' | 'salep' | 'tetes' | 'sachet';
  indications: string[];
  composition: string;
  standardAdultDose: string;
  standardPediatricDose: string;
  directions: string;
  timing: 'sebelum_makan' | 'sesudah_makan' | 'bersama_makan' | 'bebas';
  maxDurationDays: number;
  warnings: string[];
  contraindications: string[];
  sideEffects: string[];
  storageAdvice: string;
  dagusibuTip: string;
  imageThumbnail?: string;
  sampleBarcode?: string;
}

export interface PatientData {
  fullName: string;
  ageYears: number;
  ageMonths?: number;
  gender: 'L' | 'P';
  weightKg: number;
  isPregnantOrLactating: boolean;
  allergies: string[];
  existingConditions: string[];
  symptoms: string[];
  symptomDurationDays: number;
  notes: string;
}

export interface Pharmacist {
  id: string;
  name: string;
  sipa: string;
  stra: string;
  almaMater: string;
  specialty: string;
  yearsOfExperience: number;
  rating: number;
  consultationCount: number;
  status: 'online' | 'busy' | 'offline';
  avatarUrl: string;
  hospitalOrApotek: string;
  bio: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pharmacist' | 'system';
  pharmacistName?: string;
  text: string;
  timestamp: string;
  sources?: {
    title: string;
    uri: string;
  }[];
  suggestedAction?: {
    label: string;
    actionType: 'view_dosage' | 'call_emergency' | 'schedule_followup';
  };
}

export interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: 'berat' | 'sedang' | 'ringan';
  description: string;
  clinicalAdvice: string;
}

export interface MedicationHistoryItem {
  id: string;
  medicineId: string;
  medicineName: string;
  genericName: string;
  category: GolonganObat;
  categoryLabel: string;
  dosage: string;
  directions: string;
  timing: string;
  symptoms: string[];
  dateAdded: string;
  status: 'active' | 'completed' | 'stopped';
  notes?: string;
  source: 'swamedikasi' | 'manual' | 'scanner';
}
