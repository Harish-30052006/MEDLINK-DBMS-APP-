export enum View {
  Dashboard = 'DASHBOARD',
  Profile = 'PROFILE',
  MedicalRecords = 'MEDICAL_RECORDS',
  Appointments = 'APPOINTMENTS',
  Vitals = 'VITALS',
  Emergency = 'EMERGENCY',
}

export interface UserProfile {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  role: 'Patient' | 'Doctor';
}

export interface MedicalRecord {
  id: string;
  condition: string;
  diagnosisDate: string;
  status: 'Ongoing' | 'Resolved';
  doctor: string;
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
  prescribingDoctor: string;
}

export interface Allergy {
  id: string;
  type: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
  notes: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
}

export interface Vital {
  date: string; // "YYYY-MM-DD"
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  sugarLevel: number;
  temperature: number;
}
