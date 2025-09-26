import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { View } from './types';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import MedicalRecords from './components/MedicalRecords';
import Appointments from './components/Appointments';
import Vitals from './components/Vitals';
import Emergency from './components/Emergency';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DoctorDashboard from './components/DoctorDashboard';
import Welcome from './components/Welcome';
import DoctorLogin from './components/DoctorLogin';

type AuthFlowState = 'welcome' | 'patientLogin' | 'patientSignup' | 'doctorLogin';

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [authFlow, setAuthFlow] = useState<AuthFlowState>('welcome');

  const renderPatientView = () => {
    switch (currentView) {
      case View.Dashboard: return <Dashboard />;
      case View.Profile: return <Profile />;
      case View.MedicalRecords: return <MedicalRecords />;
      case View.Appointments: return <Appointments />;
      case View.Vitals: return <Vitals />;
      case View.Emergency: return <Emergency />;
      default: return <Dashboard />;
    }
  };
  
  const renderAuthFlow = () => {
      switch (authFlow) {
          case 'welcome':
              return <Welcome onSelectPatient={() => setAuthFlow('patientLogin')} onSelectDoctor={() => setAuthFlow('doctorLogin')} />;
          case 'patientLogin':
              return <Login onSwitchToSignUp={() => setAuthFlow('patientSignup')} onBack={() => setAuthFlow('welcome')} />;
          case 'patientSignup':
              return <SignUp onSwitchToLogin={() => setAuthFlow('patientLogin')} onBack={() => setAuthFlow('welcome')} />;
          case 'doctorLogin':
              return <DoctorLogin onBack={() => setAuthFlow('welcome')} />;
          default:
              return <Welcome onSelectPatient={() => setAuthFlow('patientLogin')} onSelectDoctor={() => setAuthFlow('doctorLogin')} />;
      }
  }

  if (!isAuthenticated) {
    return renderAuthFlow();
  }

  if (user?.role === 'Doctor') {
      return <DoctorDashboard />;
  }

  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <li>
      <button
        onClick={() => setCurrentView(view)}
        className={`flex items-center w-full p-3 my-1 rounded-lg transition-all duration-300 transform hover:translate-x-1 ${
          currentView === view
            ? 'bg-primary text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
        }`}
      >
        {icon}
        <span className="ml-4 font-medium tracking-wide">{label}</span>
      </button>
    </li>
  );

  return (
    <div className="flex h-screen bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface shadow-xl flex flex-col z-10">
        <div className="p-5 border-b flex items-center justify-center space-x-2">
           <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
          </svg>
          <h1 className="text-2xl font-bold text-primary">MedLink</h1>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul>
            <NavItem view={View.Dashboard} label="Dashboard" icon={ICONS.dashboard} />
            <NavItem view={View.Profile} label="Profile" icon={ICONS.profile} />
            <NavItem view={View.MedicalRecords} label="Records" icon={ICONS.records} />
            <NavItem view={View.Appointments} label="Appointments" icon={ICONS.appointments} />
            <NavItem view={View.Vitals} label="Vitals" icon={ICONS.vitals} />
            <NavItem view={View.Emergency} label="Emergency" icon={ICONS.emergency} />
          </ul>
        </nav>
        <div className="p-4 border-t bg-gray-50">
           <div className="flex items-center mb-4">
              <img className="h-11 w-11 rounded-full mr-3 object-cover border-2 border-primary" src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="User avatar" />
              <div>
                  <p className="font-semibold text-gray-800 leading-tight">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
           </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-full p-3 rounded-lg text-danger bg-red-50 hover:bg-red-100 transition-colors"
          >
            {ICONS.logout}
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-background">
        {renderPatientView()}
      </main>
    </div>
  );
};

export default App;