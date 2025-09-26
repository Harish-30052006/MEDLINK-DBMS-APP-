import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Appointment } from '../types';
import Modal from './Modal';
import Toast from './Toast';

const Appointments: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment> | null>(null);
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastAppointments = appointments.filter(a => new Date(a.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openModalForNew = () => {
    setCurrentAppointment({ doctorName: '', specialization: '', date: '', time: '', status: 'Scheduled' });
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (app: Appointment) => {
    setCurrentAppointment(app);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAppointment) return;
    
    try {
        if (currentAppointment.id) {
            updateAppointment(currentAppointment as Appointment);
        } else {
            addAppointment(currentAppointment as Omit<Appointment, 'id'>);
        }
        setShowToast({message: 'Appointment saved!', type: 'success'});
        setIsModalOpen(false);
    } catch {
        setShowToast({message: 'Failed to save appointment.', type: 'error'});
    }
  };
  
  const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to cancel this appointment?')) {
          try {
              deleteAppointment(id);
              setShowToast({message: 'Appointment canceled.', type: 'success'});
          } catch {
              setShowToast({message: 'Failed to cancel appointment.', type: 'error'});
          }
      }
  }
  
  const AppointmentItem: React.FC<{ app: Appointment }> = ({ app }) => {
    const statusClasses = {
        Scheduled: 'bg-blue-100 text-blue-800',
        Completed: 'bg-green-100 text-green-800',
        Canceled: 'bg-red-100 text-red-800',
    };
    return (
        <li className="bg-surface p-5 rounded-lg shadow-md flex items-center justify-between transition-transform hover:scale-105">
            <div>
                <p className="font-bold text-lg text-gray-800">{app.doctorName}</p>
                <p className="text-gray-600">{app.specialization}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(app.date).toDateString()} at {app.time}</p>
            </div>
            <div className="flex items-center space-x-4">
                 <span className={`px-4 py-1 text-sm font-semibold rounded-full ${statusClasses[app.status]}`}>{app.status}</span>
                 {app.status === 'Scheduled' && (
                     <div className="flex space-x-2">
                        <button onClick={() => openModalForEdit(app)} className="text-sm text-blue-600 hover:underline">Reschedule</button>
                        <button onClick={() => handleDelete(app.id)} className="text-sm text-red-600 hover:underline">Cancel</button>
                    </div>
                 )}
            </div>
        </li>
    )
};

  return (
    <div className="animate-fade-in">
        {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Appointments</h1>
            <button onClick={openModalForNew} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center shadow-lg">
                Schedule New
            </button>
        </div>

        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming</h2>
                {upcomingAppointments.length > 0 ? (
                    <ul className="space-y-4">{upcomingAppointments.map(app => <AppointmentItem key={app.id} app={app} />)}</ul>
                ) : <p className="text-gray-500 bg-surface p-4 rounded-lg">No upcoming appointments.</p>}
            </div>
             <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Past</h2>
                {pastAppointments.length > 0 ? (
                    <ul className="space-y-4">{pastAppointments.map(app => <AppointmentItem key={app.id} app={app} />)}</ul>
                ) : <p className="text-gray-500 bg-surface p-4 rounded-lg">No past appointments.</p>}
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAppointment?.id ? "Edit Appointment" : "Schedule New Appointment"}>
            {currentAppointment && (
                <form onSubmit={handleSave} className="space-y-4">
                    <input type="text" name="doctorName" placeholder="Doctor's Name" value={currentAppointment.doctorName || ''} onChange={(e) => setCurrentAppointment({...currentAppointment, doctorName: e.target.value})} required className="w-full p-2 border rounded" />
                    <input type="text" name="specialization" placeholder="Specialization" value={currentAppointment.specialization || ''} onChange={(e) => setCurrentAppointment({...currentAppointment, specialization: e.target.value})} required className="w-full p-2 border rounded" />
                    <input type="date" name="date" value={currentAppointment.date || ''} onChange={(e) => setCurrentAppointment({...currentAppointment, date: e.target.value})} required className="w-full p-2 border rounded" />
                    <input type="time" name="time" value={currentAppointment.time || ''} onChange={(e) => setCurrentAppointment({...currentAppointment, time: e.target.value})} required className="w-full p-2 border rounded" />
                     <select name="status" value={currentAppointment.status || 'Scheduled'} onChange={(e) => setCurrentAppointment({...currentAppointment, status: e.target.value as Appointment['status']})} className="w-full p-2 border rounded">
                        <option>Scheduled</option>
                        <option>Completed</option>
                        <option>Canceled</option>
                    </select>
                    <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save Changes</button>
                </form>
            )}
        </Modal>
    </div>
  );
};

export default Appointments;
