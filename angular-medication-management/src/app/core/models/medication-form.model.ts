// ===============================
// Dosage Model
// ===============================
export interface DosageModel {
  value: number | null;
  unit: string | null;
}

// ===============================
// Medication Model
// ===============================
export interface MedicationModel {
  id?: string | null;        // optional unique id
  drugName: string | null;
  dosage: DosageModel;
  route: string | null;
  frequency: string | null;
  instructions?: string | null;
}

// ===============================
// Prescribing Info Model
// ===============================
export interface PrescribingInfoModel {
  physician: string | null;
  diagnosis?: string | null;
  therapyType: string | null;
}

// ===============================
// Patient Info Model
// ===============================
export interface PatientInfoModel {
  patientId: string | null;
  orderDate: string | null;   // ISO string
}

// ===============================
// Main Medication Order Form Model
// ===============================
export interface MedicationOrderFormModel {
  patientInfo: PatientInfoModel;
  prescribingInfo: PrescribingInfoModel;
  medications: MedicationModel[];
}


