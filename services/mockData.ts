import { AccountType, FinancialAccount, Receivable, ClinicalRecord } from '../types';

export const MOCK_ACCOUNTS: FinancialAccount[] = [
  // Assets
  { id: '1', code: '1001', name: 'Kas BLU', type: AccountType.ASSET, currentAmount: 1500000000, previousAmount: 1200000000, isLiquid: true },
  { id: '2', code: '1002', name: 'Investasi Jangka Pendek (Deposito 6 bln)', type: AccountType.ASSET, currentAmount: 500000000, previousAmount: 0, investmentTermMonths: 6 },
  { id: '3', code: '1003', name: 'Piutang Pelayanan', type: AccountType.ASSET, currentAmount: 850000000, previousAmount: 700000000 },
  { id: '4', code: '1201', name: 'Aset Tetap - Gedung & Bangunan', type: AccountType.ASSET, currentAmount: 15000000000, previousAmount: 15500000000 },
  
  // Liabilities
  { id: '5', code: '2001', name: 'Utang Usaha', type: AccountType.LIABILITY, currentAmount: 400000000, previousAmount: 350000000 },
  { id: '6', code: '2002', name: 'Pendapatan Diterima Dimuka', type: AccountType.LIABILITY, currentAmount: 100000000, previousAmount: 50000000 },

  // Equity
  { id: '7', code: '3001', name: 'Ekuitas Awal', type: AccountType.EQUITY, currentAmount: 16850000000, previousAmount: 17000000000 },

  // Revenues (Laporan Aktivitas)
  { id: '8', code: '4001', name: 'Pendapatan Jasa Layanan', type: AccountType.REVENUE, currentAmount: 5200000000, previousAmount: 4800000000 },
  { id: '9', code: '4002', name: 'Pendapatan APBN', type: AccountType.REVENUE, currentAmount: 1000000000, previousAmount: 1000000000 },
  
  // Expenses
  { id: '10', code: '5001', name: 'Beban Pegawai', type: AccountType.EXPENSE, currentAmount: 2500000000, previousAmount: 2400000000 },
  { id: '11', code: '5002', name: 'Beban Persediaan', type: AccountType.EXPENSE, currentAmount: 1200000000, previousAmount: 1100000000 },
  { id: '12', code: '5003', name: 'Beban Penyusutan', type: AccountType.EXPENSE, currentAmount: 500000000, previousAmount: 500000000 },
];

// Mixed aging for demonstration of provision logic
export const MOCK_RECEIVABLES: Receivable[] = [
  { id: 'r1', debtorName: 'BPJS Kesehatan', invoiceDate: '2023-11-01', amount: 250000000, status: 'CURRENT' }, // < 3 months
  { id: 'r2', debtorName: 'Asuransi Mandiri', invoiceDate: '2023-06-15', amount: 50000000, status: 'OVERDUE' }, // 6-12 months
  { id: 'r3', debtorName: 'Pasien Umum (Tn. Budi)', invoiceDate: '2022-12-01', amount: 15000000, status: 'OVERDUE' }, // > 1 year
  { id: 'r4', debtorName: 'Kemenkes RI', invoiceDate: '2023-09-01', amount: 100000000, status: 'CURRENT' }, // 3-6 months
];

export const MOCK_CLINICAL_RECORDS: ClinicalRecord[] = [
  {
    patient: {
      resourceType: 'Patient',
      id: 'p001',
      name: [{ use: 'official', family: 'Kusuma', given: ['Budi'] }],
      gender: 'male',
      birthDate: '1975-04-12',
      identifier: [{ system: 'NIK', value: '3201010101010001' }]
    },
    encounters: [
      { resourceType: 'Encounter', id: 'e001', status: 'finished', class: { code: 'AMB' }, period: { start: '2024-01-20T09:00:00Z', end: '2024-01-20T09:30:00Z' }, subject: { reference: 'Patient/p001' } }
    ],
    observations: [
      { resourceType: 'Observation', id: 'o001', code: { text: 'Blood Pressure' }, valueQuantity: { value: 145, unit: 'mmHg' }, effectiveDateTime: '2024-01-20T09:15:00Z' },
      { resourceType: 'Observation', id: 'o002', code: { text: 'Body Temperature' }, valueQuantity: { value: 37.5, unit: 'C' }, effectiveDateTime: '2024-01-20T09:15:00Z' }
    ],
    clinicalNotes: `
      Patient presented with complaints of persistent headache for 3 days, accompanied by mild nausea.
      History of hypertension, irregularly medicated.
      Physical exam: BP 145/95, HR 88, RR 20. Neuro exam intact. No neck stiffness.
      Assessment: Hypertensive urgency vs Tension Headache.
      Plan: Resumed Amlodipine 10mg. Paracetamol 500mg prn. Advice on salt restriction.
    `
  },
  {
    patient: {
      resourceType: 'Patient',
      id: 'p002',
      name: [{ use: 'official', family: 'Wijaya', given: ['Siti', 'Rahma'] }],
      gender: 'female',
      birthDate: '1990-08-25',
      identifier: [{ system: 'NIK', value: '3201010101010002' }]
    },
    encounters: [
      { resourceType: 'Encounter', id: 'e002', status: 'finished', class: { code: 'IMP' }, period: { start: '2024-02-10T10:00:00Z' }, subject: { reference: 'Patient/p002' } }
    ],
    observations: [
       { resourceType: 'Observation', id: 'o003', code: { text: 'Blood Glucose' }, valueQuantity: { value: 210, unit: 'mg/dL' }, effectiveDateTime: '2024-02-10T10:15:00Z' }
    ],
    clinicalNotes: `
      Subjective: Patient reports increased thirst and frequent urination over the last two weeks. Unintentional weight loss of 2kg.
      Objective: Random blood glucose 210 mg/dL. BMI 28.
      Assessment: Suspected Type 2 Diabetes Mellitus.
      Plan: HbA1c test ordered. Lifestyle modification counseling provided (diet/exercise). Follow up in 1 week with lab results.
    `
  }
];