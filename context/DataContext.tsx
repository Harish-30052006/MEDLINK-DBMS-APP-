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
      const patientData = await apiService.getPatientData(userId);
      setData({
        userProfile: null, // Profile is separate
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

  const handleUpdateItem = <T extends { id: string }>(key: PatientDataListWithIdKey, item: T) => {
    if (activeUserId) {
      storageService.updateItem<T>(activeUserId, key, item);
      setData(prev => ({...prev, [key]: (prev[key] as T[]).map(i => i.id === item.id ? item : i)}));
    }
  };

  const handleDeleteItem = (key: PatientDataListWithIdKey, id: string) => {
    if (activeUserId) {
      storageService.deleteItem(activeUserId, key, id);
      setData(prev => ({...prev, [key]: (prev[key] as {id:string}[]).filter(i => i.id !== id)}));
    }
  };
  
  const handleAddVital = (item: Omit<Vital, 'date'>) => {
      if (activeUserId) {
          const newVital: Vital = { ...item, date: new Date().toISOString().split('T')[0] };
          setData(prev => {
              const updatedVitals = [...prev.vitals, newVital].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              storageService.updateVitals(activeUserId, updatedVitals);
              return { ...prev, vitals: updatedVitals };
          });
      }
  }


  const value: DataContextType = {
    ...data,
    isLoading,
    isDoctorViewing,
    loadPatientData,
    unloadPatientData,
    updateProfile: handleUpdateProfile,
    addAppointment: handleAddAppointment,
    updateAppointment: async (item) => {
      if (activeUserId) {
        try {
          await apiService.updateAppointment(activeUserId, item.id, item);
          setData(prev => ({...prev, appointments: prev.appointments.map(a => a.id === item.id ? item : a)}));
        } catch (error) {
          console.error('Failed to update appointment:', error);
        }
      }
    },
    deleteAppointment: async (id) => {
      if (activeUserId) {
        try {
          await apiService.deleteAppointment(activeUserId, id);
          setData(prev => ({...prev, appointments: prev.appointments.filter(a => a.id !== id)}));
        } catch (error) {
          console.error('Failed to delete appointment:', error);
        }
      }
    },
    // Placeholder for others, implement similarly
    addMedicalRecord: async (item) => { /* implement */ },
    updateMedicalRecord: async (item) => { /* implement */ },
    deleteMedicalRecord: async (id) => { /* implement */ },
    addMedication: async (item) => { /* implement */ },
    updateMedication: async (item) => { /* implement */ },
    deleteMedication: async (id) => { /* implement */ },
    addAllergy: async (item) => { /* implement */ },
    updateAllergy: async (item) => { /* implement */ },
    deleteAllergy: async (id) => { /* implement */ },
    addEmergencyContact: async (item) => { /* implement */ },
    updateEmergencyContact: async (item) => { /* implement */ },
    deleteEmergencyContact: async (id) => { /* implement */ },
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