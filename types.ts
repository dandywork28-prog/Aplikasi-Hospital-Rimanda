// FHIR R4 Simulation Types
export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  name: Array<{ use: string; family: string; given: string[] }>;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  identifier: Array<{ system: string; value: string }>;
}

export interface FHIREncounter {
  resourceType: 'Encounter';
  id: string;
  status: 'finished' | 'in-progress';
  class: { code: string };
  subject: { reference: string };
  period: { start: string; end?: string };
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  code: { text: string };
  valueQuantity?: { value: number; unit: string };
  valueString?: string;
  effectiveDateTime: string;
}

// Custom Clinical Record Wrapper
export interface ClinicalRecord {
  patient: FHIRPatient;
  encounters: FHIREncounter[];
  observations: FHIRObservation[];
  clinicalNotes: string; // Unstructured text for AI processing
}

// BLU Financial Types
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export interface FinancialAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  currentAmount: number; // In IDR
  previousAmount: number; // For comparative reporting
  isLiquid?: boolean; // For Cash & Cash Equivalents
  investmentTermMonths?: number; // For classifying investments
}

export interface Receivable {
  id: string;
  debtorName: string;
  invoiceDate: string;
  amount: number;
  status: 'CURRENT' | 'OVERDUE';
}

export enum Role {
  ADMIN = 'Administrator',
  CLINICIAN = 'Clinician',
  ACCOUNTANT = 'Accountant'
}