import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { apiService } from '../services/api';
import { UserProfile } from '../types';
import Modal from './Modal';
import Profile from './Profile';
import MedicalRecords from './MedicalRecords';
import Appointments from './Appointments';
import Vitals from './Vitals';
import Emergency from './Emergency';

const PatientRecordView: React.FC<{ patientId: string }> = ({ patientId }) => {
    const { userProfile, isLoading } = useData();

    if (isLoading) {
        return <div className="text-center p-8">Loading patient records...</div>;
    }
    
    if (!userProfile) {
        return <div className="text-center p-8 text-red-500">Could not load patient records.</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Viewing Records for: {userProfile.name}</h2>
            <Profile />
            <hr className="my-6" />
            <MedicalRecords />
            <hr className="my-6" />
            <Appointments />
             <hr className="my-6" />
            <Vitals />
             <hr className="my-6" />
            <Emergency />
        </div>
    );
};


const DoctorDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { loadPatientData, unloadPatientData } = useData();
    const [patients, setPatients] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const allPatients = await apiService.getPatients();
                setPatients(allPatients);
            } catch (err: any) {
                setError(err.message || 'Failed to load patients');
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();

        // Cleanup when component unmounts
        return () => {
            unloadPatientData();
        }
    }, [unloadPatientData]);
    
    const handleViewRecords = (patientId: string) => {
        loadPatientData(patientId);
        setSelectedPatientId(patientId);
    };

    const handleCloseModal = () => {
        unloadPatientData();
        setSelectedPatientId(null);
    };
    
    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                 <div className="p-5 border-b border-gray-700 flex items-center justify-center space-x-2">
                    <h1 className="text-2xl font-bold">MedLink Portal</h1>
                </div>
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center">
                         <img className="h-11 w-11 rounded-full mr-3 object-cover border-2 border-green-400" src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="Doctor avatar" />
                        <div>
                            <p className="font-semibold leading-tight">{user?.name}</p>
                            <p className="text-xs text-gray-400">{user?.role}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4">
                    <ul>
                        <li><button className="flex items-center w-full p-3 my-1 rounded-lg bg-gray-700"><span className="ml-4 font-medium">Patient List</span></button></li>
                    </ul>
                </nav>
                 <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="flex items-center justify-center w-full p-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="ml-3 font-medium">Logout</span>
                    </button>
                 </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Doctor Dashboard</h1>
                <p className="text-gray-600 mb-8">Welcome back, {user?.name}!</p>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Patient Directory</h2>
                    {loading ? (
                        <div className="text-center p-8">Loading patients...</div>
                    ) : error ? (
                        <div className="text-center p-8 text-red-500">{error}</div>
                    ) : (
                        <>
                            <input type="text" placeholder="Search for a patient by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"/>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b"><th className="p-4 font-semibold text-gray-600">Name</th><th className="p-4 font-semibold text-gray-600">Email</th><th className="p-4 font-semibold text-gray-600">Phone</th><th className="p-4 font-semibold text-gray-600">Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {filteredPatients.map(patient => (
                                            <tr key={patient.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4">{patient.name}</td>
                                                <td className="p-4">{patient.email}</td>
                                                <td className="p-4">{patient.phone || 'N/A'}</td>
                                                <td className="p-4"><button onClick={() => handleViewRecords(patient.id)} className="text-primary hover:underline">View / Edit Records</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </main>
            
            {/* Fullscreen Modal for Patient Records */}
            {selectedPatientId && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={handleCloseModal}>
                    <div className="bg-background h-full w-full max-w-4xl overflow-y-auto p-8 rounded-lg shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                        <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">&times;</button>
                        <PatientRecordView patientId={selectedPatientId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
