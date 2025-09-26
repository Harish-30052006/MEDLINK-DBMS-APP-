import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Modal from './Modal';
import Toast from './Toast';
import { Vital } from '../types';

const Vitals: React.FC = () => {
    const { vitals, addVital } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVital, setNewVital] = useState<Omit<Vital, 'date'>>({
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 70,
        sugarLevel: 100,
        temperature: 98.6
    });
    const [showToast, setShowToast] = useState(false);

    const chartData = vitals.map(v => ({
        ...v,
        name: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    const handleAddVital = (e: React.FormEvent) => {
        e.preventDefault();
        addVital(newVital);
        setIsModalOpen(false);
        setShowToast(true);
    };

    const VitalCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-surface p-6 rounded-xl shadow-lg h-80 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="flex-grow">
                {children}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
             {showToast && <Toast message="New vitals entry added!" type="success" onClose={() => setShowToast(false)} />}
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-4xl font-bold text-gray-800">Vitals History</h1>
                 <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center shadow-lg">Add New Entry</button>
            </div>
            
            {vitals.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <VitalCard title="Heart Rate (BPM)">
                        <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="heartRate" stroke="#ef4444" activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer>
                    </VitalCard>
                    <VitalCard title="Sugar Level (mg/dL)">
                        <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="sugarLevel" stroke="#3b82f6" activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer>
                    </VitalCard>
                    <VitalCard title="Temperature (°F)">
                        <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={['dataMin - 1', 'dataMax + 1']} /><Tooltip /><Legend /><Line type="monotone" dataKey="temperature" stroke="#f97316" activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer>
                    </VitalCard>
                    <VitalCard title="Blood Pressure (Systolic/Diastolic)">
                         <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="bloodPressure.systolic" name="Systolic" stroke="#8884d8" activeDot={{ r: 8 }} /><Line yAxisId="right" type="monotone" dataKey="bloodPressure.diastolic" name="Diastolic" stroke="#82ca9d" /></LineChart></ResponsiveContainer>
                    </VitalCard>
                </div>
            ) : (
                <div className="bg-surface p-8 rounded-xl shadow-lg text-center"><p className="text-gray-500">No vitals data available. Add a new entry to get started.</p></div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vitals Entry">
                <form onSubmit={handleAddVital} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Systolic BP</label>
                            <input type="number" value={newVital.bloodPressure.systolic} onChange={e => setNewVital({...newVital, bloodPressure: {...newVital.bloodPressure, systolic: +e.target.value}})} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Diastolic BP</label>
                            <input type="number" value={newVital.bloodPressure.diastolic} onChange={e => setNewVital({...newVital, bloodPressure: {...newVital.bloodPressure, diastolic: +e.target.value}})} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Heart Rate (BPM)</label>
                        <input type="number" value={newVital.heartRate} onChange={e => setNewVital({...newVital, heartRate: +e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Sugar Level (mg/dL)</label>
                        <input type="number" value={newVital.sugarLevel} onChange={e => setNewVital({...newVital, sugarLevel: +e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
                        <input type="number" step="0.1" value={newVital.temperature} onChange={e => setNewVital({...newVital, temperature: +e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save Entry</button>
                </form>
            </Modal>
        </div>
    );
};

export default Vitals;
