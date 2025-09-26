import React from 'react';

interface WelcomeProps {
  onSelectPatient: () => void;
  onSelectDoctor: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSelectPatient, onSelectDoctor }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block bg-primary p-4 rounded-full mb-4 shadow-lg">
          <svg className="w-12 h-12 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-gray-800">Welcome to MedLink</h1>
        <p className="mt-4 text-lg text-gray-600">Your connected health hub. Please select your role to continue.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {/* Patient Card */}
        <div 
          onClick={onSelectPatient}
          className="group w-80 p-8 bg-surface rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-t-4 border-transparent hover:border-primary"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-blue-100 rounded-full mb-4 transition-colors duration-300 group-hover:bg-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">For Patients</h2>
            <p className="mt-2 text-gray-500">Access your health records, appointments, and more.</p>
          </div>
        </div>

        {/* Doctor Card */}
        <div 
          onClick={onSelectDoctor}
          className="group w-80 p-8 bg-surface rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-t-4 border-transparent hover:border-secondary"
        >
          <div className="flex flex-col items-center text-center">
             <div className="p-4 bg-gray-200 rounded-full mb-4 transition-colors duration-300 group-hover:bg-secondary">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">For Providers</h2>
            <p className="mt-2 text-gray-500">Access the provider portal to manage patient data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
