import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ICONS } from '../constants';
import SOSModal from './SOSModal';

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
    <div className={`bg-surface p-6 rounded-xl shadow-lg flex items-center border-l-4 ${color} transition-all duration-300 hover:shadow-xl hover:scale-105`}>
        <div className="mr-5 text-3xl">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { appointments, vitals, medicalHistory } = useData();
    const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

    const upcomingAppointment = appointments.find(a => a.status === 'Scheduled');
    const latestVital = vitals.length > 0 ? vitals[vitals.length - 1] : null;
    const activeConditions = medicalHistory.filter(r => r.status === 'Ongoing').length;

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
                 <button 
                    onClick={() => setIsSOSModalOpen(true)}
                    className="flex items-center bg-danger text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 animate-pulse"
                 >
                    {ICONS.emergency}
                    <span className="ml-2 text-lg">SOS</span>
                 </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                <StatCard 
                    icon={ICONS.appointments} 
                    label="Next Appointment" 
                    value={upcomingAppointment ? `${new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'None'}
                    color="border-primary"
                />
                 <StatCard 
                    icon={ICONS.vitals} 
                    label="Heart Rate" 
                    value={latestVital ? `${latestVital.heartRate} BPM` : 'N/A'}
                    color="border-danger"
                />
                 <StatCard 
                    icon={ICONS.records} 
                    label="Active Conditions" 
                    value={activeConditions}
                    color="border-warning"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-surface p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h2>
                    {appointments.filter(a => a.status === 'Scheduled').length > 0 ? (
                        <ul className="space-y-4">
                            {appointments.filter(a => a.status === 'Scheduled').slice(0, 4).map(app => (
                                <li key={app.id} className="flex items-center justify-between p-4 bg-light rounded-lg transition-shadow hover:shadow-md">
                                    <div>
                                        <p className="font-semibold text-gray-800">{app.doctorName} <span className="text-sm text-gray-500">({app.specialization})</span></p>
                                        <p className="text-sm text-gray-600">{new Date(app.date).toDateString()} at {app.time}</p>
                                    </div>
                                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{app.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No upcoming appointments.</p>
                    )}
                </div>

                <div className="lg:col-span-2 bg-surface p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Vitals</h2>
                    {latestVital ? (
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-light rounded-lg">
                                <p className="text-sm text-gray-500">Blood Pressure</p>
                                <p className="font-semibold text-lg text-gray-800">{`${latestVital.bloodPressure.systolic}/${latestVital.bloodPressure.diastolic}`}</p>
                            </div>
                            <div className="p-4 bg-light rounded-lg">
                                <p className="text-sm text-gray-500">Heart Rate</p>
                                <p className="font-semibold text-lg text-gray-800">{latestVital.heartRate} <span className="text-sm">BPM</span></p>
                            </div>
                            <div className="p-4 bg-light rounded-lg">
                                <p className="text-sm text-gray-500">Sugar Level</p>
                                <p className="font-semibold text-lg text-gray-800">{latestVital.sugarLevel} <span className="text-sm">mg/dL</span></p>
                            </div>
                             <div className="p-4 bg-light rounded-lg">
                                <p className="text-sm text-gray-500">Temperature</p>
                                <p className="font-semibold text-lg text-gray-800">{latestVital.temperature} °F</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No recent vitals recorded.</p>
                    )}
                </div>
            </div>
            <SOSModal isOpen={isSOSModalOpen} onClose={() => setIsSOSModalOpen(false)} />
        </div>
    );
};

export default Dashboard;