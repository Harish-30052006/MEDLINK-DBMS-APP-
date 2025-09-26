import { UserProfile, MedicalRecord, Medication, Allergy, EmergencyContact, Appointment, Vital } from '../types';

const API_BASE = 'https://medlink-dbms-app.onrender.com/api'; // Deployed URL

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const response = await this.request<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async signup(userData: Omit<UserProfile, 'id'> & { password: string }): Promise<{ token: string; user: UserProfile }> {
    const response = await this.request<{ token: string; user: UserProfile }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(response.token);
    return response;
  }

  // User
  async getUser(id: string): Promise<UserProfile> {
    return this.request<UserProfile>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Data
  async getPatientData(userId: string): Promise<{
    medicalHistory: MedicalRecord[];
    medications: Medication[];
    allergies: Allergy[];
    emergencyContacts: EmergencyContact[];
    appointments: Appointment[];
    vitals: Vital[];
  }> {
    return this.request(`/users/${userId}/data`);
  }

  // Appointments
  async getAppointments(userId: string): Promise<Appointment[]> {
    return this.request(`/users/${userId}/appointments`);
  }

  async addAppointment(userId: string, appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    return this.request(`/users/${userId}/appointments`, {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async updateAppointment(userId: string, appointmentId: string, data: Partial<Appointment>): Promise<Appointment> {
    return this.request(`/users/${userId}/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(userId: string, appointmentId: string): Promise<void> {
    await this.request(`/users/${userId}/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
  }

  // Similar for other data types: records, medications, etc.
  // For brevity, add as needed

  // Patients (for doctors)
  async getPatients(): Promise<UserProfile[]> {
    return this.request('/users');
  }
}

export const apiService = new ApiService();
