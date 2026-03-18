export const AVAILABLE_DRUGS = [
  'Aspirin',
  'Ibuprofen',
  'Acetaminophen',
  'Doxorubicin',
  'Paclitaxel',
  'Cisplatin',
  'Methotrexate',
  'Vincristine'
];

export const ROUTES = [
  'Oral',
  'IV',
  'IM',
  'Subcutaneous',
  'Topical'
];

export const THERAPY_TYPES = [
  'Standard',
  'Chemotherapy',
  'Supportive Care'
];

export const DOSAGE_UNITS = [
  'mg',
  'mg/m²',
  'mcg',
  'units',
  'mL'
];

export const FREQUENCIES = [
  'Once Daily',
  'Twice Daily',
  'Three Times Daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'As Needed'
];
export const CHEMOTHERAPY_DIAGNOSES = [
  'Breast Cancer',
  'Lung Cancer',
  'Leukemia',
  'Lymphoma',
  'Ovarian Cancer',
  'Mera Dil'
];

//  ---------------------------PHYSICIAN DATA------//

export const PHYSICIAN_GROUP = [
  {
    label: 'Doctors',
    options: [
      { name: 'Dr. Ahmed', isDoctor: true },
      { name: 'Dr. Ali', isDoctor: true },
      { name: 'Dr. Sarah', isDoctor: true }
    ]
  },
  {
    label: 'Staff',
    options: [
      { name: 'Nurse John', isDoctor: false },
      { name: 'Assistant Sara', isDoctor: false },
      { name: 'Technician Ali', isDoctor: false }
    ]
  }
];