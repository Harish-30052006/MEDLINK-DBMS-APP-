

import React from 'react';
import type { UserProfile, MedicalRecord, Medication, Allergy, EmergencyContact, Appointment, Vital } from './types';

export const MOCK_USER: UserProfile = {
  id: 'U12345678',
  name: 'Alex Doe',
  dob: '1990-05-15',
  gender: 'Male',
  phone: '+1 (555) 123-4567',
  email: 'alex.doe@example.com',
  address: '123 Health St, Wellness City, 90210',
  bloodGroup: 'O+',
  // FIX: Added missing 'role' property to satisfy UserProfile type.
  role: 'Patient',
};

export const MOCK_MEDICAL_HISTORY: MedicalRecord[] = [
  { id: 'MR001', condition: 'Hypertension', diagnosisDate: '2020-01-10', status: 'Ongoing', doctor: 'Dr. Smith', notes: 'Managed with medication.' },
  { id: 'MR002', condition: 'Asthma', diagnosisDate: '2015-06-22', status: 'Ongoing', doctor: 'Dr. Jones', notes: 'Uses inhaler as needed.' },
  { id: 'MR003', condition: 'Fractured Arm', diagnosisDate: '2022-11-05', status: 'Resolved', doctor: 'Dr. Casey', notes: 'Right radius fracture, fully healed.' },
];

export const MOCK_MEDICATIONS: Medication[] = [
  { id: 'MD001', name: 'Lisinopril', dosage: '10mg daily', startDate: '2020-01-15', endDate: 'Ongoing', prescribingDoctor: 'Dr. Smith' },
  { id: 'MD002', name: 'Albuterol', dosage: '2 puffs as needed', startDate: '2015-06-22', endDate: 'Ongoing', prescribingDoctor: 'Dr. Jones' },
];

export const MOCK_ALLERGIES: Allergy[] = [
  { id: 'AL001', type: 'Peanuts', severity: 'Severe', reaction: 'Anaphylaxis', notes: 'Carries an EpiPen.' },
  { id: 'AL002', type: 'Pollen', severity: 'Moderate', reaction: 'Sneezing, itchy eyes', notes: 'Takes antihistamines during spring.' },
];

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'EC001', name: 'Jane Doe', relation: 'Spouse', phone: '+1 (555) 987-6543', email: 'jane.doe@example.com' },
  { id: 'EC002', name: 'John Doe', relation: 'Father', phone: '+1 (555) 111-2222', email: 'john.doe@example.com' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'AP001', doctorName: 'Dr. Smith', specialization: 'Cardiologist', date: '2024-08-15', time: '10:00 AM', status: 'Scheduled' },
  { id: 'AP002', doctorName: 'Dr. Evans', specialization: 'Dentist', date: '2024-07-25', time: '02:30 PM', status: 'Scheduled' },
  { id: 'AP003', doctorName: 'Dr. Jones', specialization: 'Pulmonologist', date: '2024-06-10', time: '11:00 AM', status: 'Completed' },
];

export const MOCK_VITALS: Vital[] = [
  { date: '2024-07-15', bloodPressure: { systolic: 120, diastolic: 80 }, heartRate: 72, sugarLevel: 95, temperature: 98.6 },
  { date: '2024-07-16', bloodPressure: { systolic: 122, diastolic: 81 }, heartRate: 75, sugarLevel: 98, temperature: 98.7 },
  { date: '2024-07-17', bloodPressure: { systolic: 118, diastolic: 79 }, heartRate: 70, sugarLevel: 92, temperature: 98.5 },
  { date: '2024-07-18', bloodPressure: { systolic: 125, diastolic: 82 }, heartRate: 78, sugarLevel: 105, temperature: 98.8 },
  { date: '2024-07-19', bloodPressure: { systolic: 121, diastolic: 80 }, heartRate: 73, sugarLevel: 96, temperature: 98.6 },
  { date: '2024-07-20', bloodPressure: { systolic: 119, diastolic: 78 }, heartRate: 69, sugarLevel: 94, temperature: 98.4 },
  { date: '2024-07-21', bloodPressure: { systolic: 123, diastolic: 81 }, heartRate: 76, sugarLevel: 101, temperature: 98.7 },
];

export const ICONS: { [key: string]: React.ReactNode } = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  profile: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  records: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  appointments: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  vitals: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  emergency: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  plus: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>,
  info: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
  location: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>,
};