import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { UserProfile, MedicalRecord, Medication, Allergy, EmergencyContact, Appointment, Vital } from '../types';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

type PatientData = {
  userProfile: UserProfile | null;
  medicalHistory: MedicalRecord[];
  medications: Medication[];
  allergies: Allergy[];
  emergencyContacts: EmergencyContact[];
  appointments: Appointment[];
  vitals: Vital[];
}

interface DataContextType extends PatientData {
  isLoading: boolean;
  isDoctorViewing: boolean;
  loadPatientData: (patientId: string) => void;
  unloadPatientData: () => void;
  // All CRUD functions
  updateProfile: (profile: UserProfile) => void;
  addAppointment: (item: Omit<Appointment, 'id'>) => void;
  updateAppointment: (item: Appointment) => void;
  deleteAppointment: (id: string) => void;
  addMedicalRecord: (item: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (item: MedicalRecord) => void;
  deleteMedicalRecord: (id: string) => void;
  addMedication: (item: Omit<Medication, 'id'>) => void;
  updateMedication: (item: Medication) => void;
  deleteMedication: (id: string) => void;
  addAllergy: (item: Omit<Allergy, 'id'>) => void;
  updateAllergy: (item: Allergy) => void;
  deleteAllergy: (id: string) => void;
  addEmergencyContact: (item: Omit<EmergencyContact, 'id'>) => void;
  updateEmergencyContact: (item: EmergencyContact) => void;
  deleteEmergencyContact: (id: string) => void;
  addVital: (item: Omit<Vital, 'date'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<PatientData>({
    userProfile: null, medicalHistory: [], medications: [], allergies: [], 
    emergencyContacts: [], appointments: [], vitals: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [viewedPatientId, setViewedPatientId] = useState<string | null>(null);

  const activeUserId = viewedPatientId || user?.id;
  const isDoctorViewing = !!viewedPatientId;

  const loadDataForUser = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setData({ userProfile: null, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [profile, patientData] = await Promise.all([
        apiService.getUser(userId),
        apiService.getPatientData(userId)
      ]);
      setData({
        userProfile: profile,
        ...patientData,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (user?.role === 'Patient') {
      loadDataForUser(user.id);
    } else {
      // For doctors, data is loaded on demand
       setIsLoading(false);
       setData({ userProfile: null, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
    }
  }, [user, loadDataForUser]);

  const loadPatientData = (patientId: string) => {
    setViewedPatientId(patientId);
    loadDataForUser(patientId);
  };
  
  const unloadPatientData = () => {
    setViewedPatientId(null);
    setData({ userProfile: null, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [] });
  };

  // --- Robust CRUD Handlers ---

  const handleUpdateProfile = async (profile: UserProfile) => {
    if (activeUserId) {
      try {
        await apiService.updateUser(activeUserId, profile);
        setData(prev => ({ ...prev, userProfile: profile }));
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  const handleAddAppointment = async (item: Omit<Appointment, 'id'>) => {
    if (activeUserId) {
      try {
        const newItem = await apiService.addAppointment(activeUserId, item);
        setData(prev => ({...prev, appointments: [...prev.appointments, newItem] }));
      } catch (error) {
        console.error('Failed to add appointment:', error);
      }
    }
  };

  const handleUpdateAppointment = async (item: Appointment) => {
    if (activeUserId) {
      try {
        await apiService.updateAppointment(activeUserId, item.id, item);
        setData(prev => ({...prev, appointments: prev.appointments.map(a => a.id === item.id ? item : a)}));
      } catch (error) {
        console.error('Failed to update appointment:', error);
      }
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (activeUserId) {
      try {
        await apiService.deleteAppointment(activeUserId, id);
        setData(prev => ({...prev, appointments: prev.appointments.filter(a => a.id !== id)}));
      } catch (error) {
        console.error('Failed to delete appointment:', error);
      }
    }
  };

  const handleAddMedicalRecord = async (item: Omit<MedicalRecord, 'id'>) => {
    if (activeUserId) {
      try {
        const newItem = await apiService.addMedicalRecord(activeUserId, item);
        setData(prev => ({...prev, medicalHistory: [...prev.medicalHistory, newItem] }));
      } catch (error) {
        console.error('Failed to add medical record:', error);
      }
    }
  };

  const handleUpdateMedicalRecord = async (item: MedicalRecord) => {
    if (activeUserId) {
      try {
        await apiService.updateMedicalRecord(activeUserId, item.id, item);
        setData(prev => ({...prev, medicalHistory: prev.medicalHistory.map(r => r.id === item.id ? item : r)}));
      } catch (error) {
        console.error('Failed to update medical record:', error);
      }
    }
  };

  const handleDeleteMedicalRecord = async (id: string) => {
    if (activeUserId) {
      try {
        await apiService.deleteMedicalRecord(activeUserId, id);
        setData(prev => ({...prev, medicalHistory: prev.medicalHistory.filter(r => r.id !== id)}));
      } catch (error) {
        console.error('Failed to delete medical record:', error);
      }
    }
  };

  const handleAddMedication = async (item: Omit<Medication, 'id'>) => {
    if (activeUserId) {
      try {
        const newItem = await apiService.addMedication(activeUserId, item);
        setData(prev => ({...prev, medications: [...prev.medications, newItem] }));
      } catch (error) {
        console.error('Failed to add medication:', error);
      }
    }
  };

  const handleUpdateMedication = async (item: Medication) => {
    if (activeUserId) {
      try {
        await apiService.updateMedication(activeUserId, item.id, item);
        setData(prev => ({...prev, medications: prev.medications.map(m => m.id === item.id ? item : m)}));
      } catch (error) {
        console.error('Failed to update medication:', error);
      }
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (activeUserId) {
      try {
        await apiService.deleteMedication(activeUserId, id);
        setData(prev => ({...prev, medications: prev.medications.filter(m => m.id !== id)}));
      } catch (error) {
        console.error('Failed to delete medication:', error);
      }
    }
  };

  const handleAddAllergy = async (item: Omit<Allergy, 'id'>) => {
    if (activeUserId) {
      try {
        const newItem = await apiService.addAllergy(activeUserId, item);
        setData(prev => ({...prev, allergies: [...prev.allergies, newItem] }));
      } catch (error) {
        console.error('Failed to add allergy:', error);
      }
    }
  };

  const handleUpdateAllergy = async (item: Allergy) => {
    if (activeUserId) {
      try {
        await apiService.updateAllergy(activeUserId, item.id, item);
        setData(prev => ({...prev, allergies: prev.allergies.map(a => a.id === item.id ? item : a)}));
      } catch (error) {
        console.error('Failed to update allergy:', error);
      }
    }
  };

  const handleDeleteAllergy = async (id: string) => {
    if (activeUserId) {
      try {
        await apiService.deleteAllergy(activeUserId, id);
        setData(prev => ({...prev, allergies: prev.allergies.filter(a => a.id !== id)}));
      } catch (error) {
        console.error('Failed to delete allergy:', error);
      }
    }
  };

  const handleAddEmergencyContact = async (item: Omit<EmergencyContact, 'id'>) => {
    if (activeUserId) {
      try {
        const newItem = await apiService.addEmergencyContact(activeUserId, item);
        setData(prev => ({...prev, emergencyContacts: [...prev.emergencyContacts, newItem] }));
      } catch (error) {
        console.error('Failed to add emergency contact:', error);
      }
    }
  };

  const handleUpdateEmergencyContact = async (item: EmergencyContact) => {
    if (activeUserId) {
      try {
        await apiService.updateEmergencyContact(activeUserId, item.id, item);
        setData(prev => ({...prev, emergencyContacts: prev.emergencyContacts.map(e => e.id === item.id ? item : e)}));
      } catch (error) {
        console.error('Failed to update emergency contact:', error);
      }
    }
  };

  const handleDeleteEmergencyContact = async (id: string) => {
    if (activeUserId) {
      try {
        await apiService.deleteEmergencyContact(activeUserId, id);
        setData(prev => ({...prev, emergencyContacts: prev.emergencyContacts.filter(e => e.id !== id)}));
      } catch (error) {
        console.error('Failed to delete emergency contact:', error);
      }
    }
  };

  const handleAddVital = async (item: Omit<Vital, 'date'>) => {
    if (activeUserId) {
      try {
        const newVital: Vital = { ...item, date: new Date().toISOString().split('T')[0] };
        await apiService.addVital(activeUserId, newVital);
        setData(prev => {
          const updatedVitals = [...prev.vitals, newVital].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          return { ...prev, vitals: updatedVitals };
        });
      } catch (error) {
        console.error('Failed to add vital:', error);
      }
    }
  };


  const value: DataContextType = {
    ...data,
    isLoading,
    isDoctorViewing,
    loadPatientData,
    unloadPatientData,
    updateProfile: handleUpdateProfile,
    addAppointment: handleAddAppointment,
    updateAppointment: handleUpdateAppointment,
    deleteAppointment: handleDeleteAppointment,
    addMedicalRecord: handleAddMedicalRecord,
    updateMedicalRecord: handleUpdateMedicalRecord,
    deleteMedicalRecord: handleDeleteMedicalRecord,
    addMedication: handleAddMedication,
    updateMedication: handleUpdateMedication,
    deleteMedication: handleDeleteMedication,
    addAllergy: handleAddAllergy,
    updateAllergy: handleUpdateAllergy,
    deleteAllergy: handleDeleteAllergy,
    addEmergencyContact: handleAddEmergencyContact,
    updateEmergencyContact: handleUpdateEmergencyContact,
    deleteEmergencyContact: handleDeleteEmergencyContact,
    addVital: handleAddVital,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};