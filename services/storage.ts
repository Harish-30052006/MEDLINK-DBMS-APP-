import { MOCK_USER, MOCK_MEDICAL_HISTORY, MOCK_MEDICATIONS, MOCK_ALLERGIES, MOCK_EMERGENCY_CONTACTS, MOCK_APPOINTMENTS, MOCK_VITALS } from '../constants';
import { UserProfile, MedicalRecord, Medication, Allergy, EmergencyContact, Appointment, Vital } from '../types';

const generateId = (prefix: string) => `${prefix}${Date.now()}${Math.random().toString(16).slice(2, 8)}`;

const DB_KEY = 'medlink_db';
const ACTIVE_USER_KEY = 'medlink_active_user';

type PatientData = {
  profile: UserProfile;
  medicalHistory: MedicalRecord[];
  medications: Medication[];
  allergies: Allergy[];
  emergencyContacts: EmergencyContact[];
  appointments: Appointment[];
  vitals: Vital[];
}

// FIX: Define and export a specific type for keys of PatientData that are arrays of items with an 'id' property.
export type PatientDataListWithIdKey = 'medicalHistory' | 'medications' | 'allergies' | 'emergencyContacts' | 'appointments';


interface Database {
  users: UserProfile[];
  data: {
    [userId: string]: PatientData;
  };
  passwords: { [email: string]: string };
}

const storageService = {
  initializeDB: () => {
    if (!localStorage.getItem(DB_KEY)) {
      const patientUser = { ...MOCK_USER };
      const doctorUser: UserProfile = {
        id: 'D98765',
        name: 'Dr. Jane Smith',
        dob: '1980-08-20',
        gender: 'Female',
        phone: '+1 (555) 555-5555',
        email: 'doctor@medlink.com',
        address: '456 Health Ave, Med Town, 90210',
        bloodGroup: 'A-',
        role: 'Doctor',
      };

      const initialDB: Database = {
        users: [patientUser, doctorUser],
        data: {
          [patientUser.id]: {
            profile: patientUser,
            medicalHistory: MOCK_MEDICAL_HISTORY,
            medications: MOCK_MEDICATIONS,
            allergies: MOCK_ALLERGIES,
            emergencyContacts: MOCK_EMERGENCY_CONTACTS,
            appointments: MOCK_APPOINTMENTS,
            vitals: MOCK_VITALS,
          }
        },
        passwords: {
          [patientUser.email]: 'password123',
          [doctorUser.email]: 'password123',
        },
      };
      localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
    }
  },

  getDB: (): Database => {
    const dbString = localStorage.getItem(DB_KEY);
    if (!dbString) {
      storageService.initializeDB();
      return JSON.parse(localStorage.getItem(DB_KEY)!);
    }
    try {
      return JSON.parse(dbString);
    } catch (error) {
      console.error("Failed to parse DB from localStorage, re-initializing.", error);
      localStorage.removeItem(DB_KEY);
      storageService.initializeDB();
      return JSON.parse(localStorage.getItem(DB_KEY)!);
    }
  },

  saveDB: (db: Database) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },
  
  // --- Auth ---
  authenticateUser: (email: string, password: string): UserProfile | null => {
    const db = storageService.getDB();
    if (db.passwords[email] === password) {
      return db.users.find(u => u.email === email) || null;
    }
    return null;
  },
  
  createUser: (name: string, email: string, password: string): UserProfile => {
    const db = storageService.getDB();
    if (db.users.some(u => u.email === email)) {
      throw new Error('User with this email already exists.');
    }
    
    const newUser: UserProfile = {
      id: generateId('U'), name, email, dob: '', gender: 'Other', phone: '', address: '', bloodGroup: '', role: 'Patient',
    };

    db.users.push(newUser);
    db.passwords[email] = password;
    db.data[newUser.id] = {
      profile: newUser, medicalHistory: [], medications: [], allergies: [], emergencyContacts: [], appointments: [], vitals: [],
    };
    
    storageService.saveDB(db);
    return newUser;
  },

  // --- Active User Session ---
  setActiveUser: (user: UserProfile) => {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
  },

  getActiveUser: (): UserProfile | null => {
    const userString = localStorage.getItem(ACTIVE_USER_KEY);
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Failed to parse active user from localStorage", error);
      localStorage.removeItem(ACTIVE_USER_KEY);
      return null;
    }
  },
  
  clearActiveUser: () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
  },

  // --- Data Retrieval ---
  getDataForUser: (userId: string): PatientData | null => {
    const db = storageService.getDB();
    return db.data[userId] || null;
  },
  
  getAllPatients: (): UserProfile[] => {
      const db = storageService.getDB();
      return db.users.filter(u => u.role === 'Patient');
  },

  // --- Data Manipulation (CRUD) ---
  updateProfile: (userId: string, profile: UserProfile) => {
    const db = storageService.getDB();
    if (db.data[userId]) {
      db.data[userId].profile = profile;
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        db.users[userIndex] = profile;
      }
      storageService.saveDB(db);
    }
  },

  // Generic function to add an item to a list
  // FIX: Constrain `key` to only include keys for arrays of items with an 'id'.
  // FIX: Cast through 'unknown' to fix the conversion error.
  addItem: <T extends { id: string }>(userId: string, key: PatientDataListWithIdKey, item: Omit<T, 'id'>): T => {
    const db = storageService.getDB();
    const newItem = { ...item, id: generateId(key.substring(0,2).toUpperCase()) } as T;
    if (db.data[userId]) {
      const list = db.data[userId][key] as unknown as T[];
      list.push(newItem);
      storageService.saveDB(db);
    }
    return newItem;
  },
  
  // Generic function to update an item in a list
  // FIX: Constrain `key` to only include keys for arrays of items with an 'id'.
  // FIX: Cast through 'unknown' to fix the conversion error.
  updateItem: <T extends { id: string }>(userId: string, key: PatientDataListWithIdKey, updatedItem: T) => {
    const db = storageService.getDB();
    if (db.data[userId]) {
      const list = db.data[userId][key] as unknown as T[];
      const index = list.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        list[index] = updatedItem;
        storageService.saveDB(db);
      }
    }
  },

  // Generic function to delete an item from a list
  // FIX: Constrain `key` to only include keys for arrays of items with an 'id'.
  deleteItem: (userId: string, key: PatientDataListWithIdKey, itemId: string) => {
    const db = storageService.getDB();
    if (db.data[userId]) {
      let list = db.data[userId][key] as { id: string }[];
      db.data[userId][key] = list.filter(item => item.id !== itemId) as any;
      storageService.saveDB(db);
    }
  },

  // FIX: Add a specific function to update the entire vitals array.
  updateVitals: (userId: string, vitals: Vital[]) => {
    const db = storageService.getDB();
    if (db.data[userId]) {
      db.data[userId].vitals = vitals;
      storageService.saveDB(db);
    }
  },
};

export { storageService };