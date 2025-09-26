# Backend Build and Deployment Plan

## Information Gathered
- Frontend: React/Vite app with localStorage-based auth and data management via AuthContext, DataContext, and storageService.
- Data Types: UserProfile, MedicalRecord, Medication, Allergy, EmergencyContact, Appointment, Vital.
- Auth: Login/signup for patients and doctors, logout.
- CRUD Operations: Full CRUD for profiles, appointments, medical records, medications, allergies, emergency contacts, vitals.
- Doctor Role: Can view and manage patient data.
- No existing backend; all data is mock/local.

## Plan
- Create backend directory with Node.js/Express/MongoDB setup.
- Implement JWT authentication for login/signup.
- Build RESTful APIs for all data types (users, appointments, etc.).
- Add doctor-specific endpoints for patient management.
- Update frontend contexts to use API calls instead of localStorage.
- Deploy backend to Heroku free tier.

## Dependent Files to Edit
- New: backend/ (entire directory with server files).
- Update: context/AuthContext.tsx (replace storageService with API calls).
- Update: context/DataContext.tsx (replace storageService with API calls).
- Update: services/storage.ts (replace with API service or remove).

## Followup Steps
- Install backend dependencies.
- Run backend locally for testing.
- Update frontend to connect to backend.
- Test full app locally.
- Deploy backend to Heroku.
- Update frontend with deployed backend URL.
- Deploy frontend if needed (optional, as task focuses on backend).

## Steps
- [ ] Create backend directory structure.
- [ ] Set up package.json, install deps (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv).
- [ ] Create MongoDB models (User, PatientData).
- [ ] Implement auth routes (/api/auth/login, /api/auth/signup).
- [ ] Implement user routes (/api/users/:id for profile CRUD).
- [ ] Implement data routes (/api/users/:id/appointments, /api/users/:id/records, etc.).
- [ ] Add doctor routes (/api/patients for list, /api/patients/:id/data).
- [ ] Create middleware for JWT auth.
- [ ] Update frontend AuthContext to use API.
- [ ] Update frontend DataContext to use API.
- [ ] Replace storageService with API service.
- [ ] Test locally.
- [ ] Deploy to Heroku.
