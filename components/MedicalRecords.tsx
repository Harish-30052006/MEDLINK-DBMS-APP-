import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MedicalRecord, Medication, Allergy } from '../types';
import Modal from './Modal';
import Toast from './Toast';

type RecordType = 'Medical History' | 'Medication' | 'Allergy';
type EditableRecord = Partial<MedicalRecord> & Partial<Medication> & Partial<Allergy>;

const MedicalRecords: React.FC = () => {
  const { medicalHistory, medications, allergies, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord, addMedication, updateMedication, deleteMedication, addAllergy, updateAllergy, deleteAllergy } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<RecordType>('Medical History');
  const [currentRecord, setCurrentRecord] = useState<EditableRecord | null>(null);
  const [showToast, setShowToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const openModalForNew = (type: RecordType) => {
    setCurrentRecord({});
    setModalType(type);
    setIsModalOpen(true);
  };

  const openModalForEdit = (type: RecordType, record: EditableRecord) => {
    setCurrentRecord(record);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!currentRecord) return;

    try {
        if (modalType === 'Medical History') {
            currentRecord.id ? updateMedicalRecord(currentRecord as MedicalRecord) : addMedicalRecord(currentRecord as Omit<MedicalRecord, 'id'>);
        } else if (modalType === 'Medication') {
            currentRecord.id ? updateMedication(currentRecord as Medication) : addMedication(currentRecord as Omit<Medication, 'id'>);
        } else if (modalType === 'Allergy') {
            currentRecord.id ? updateAllergy(currentRecord as Allergy) : addAllergy(currentRecord as Omit<Allergy, 'id'>);
        }
        setShowToast({ message: 'Record saved successfully!', type: 'success' });
    } catch (e) {
         setShowToast({ message: 'Failed to save record.', type: 'error' });
    }
    
    setIsModalOpen(false);
    setCurrentRecord(null);
  };
  
  const handleDelete = (type: RecordType, id: string) => {
      if (window.confirm('Are you sure you want to delete this record?')) {
          try {
              if (type === 'Medical History') deleteMedicalRecord(id);
              if (type === 'Medication') deleteMedication(id);
              if (type === 'Allergy') deleteAllergy(id);
              setShowToast({ message: 'Record deleted successfully!', type: 'success' });
          } catch(e) {
              setShowToast({ message: 'Failed to delete record.', type: 'error' });
          }
      }
  }

  const renderModalContent = () => {
    if (!currentRecord) return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setCurrentRecord({ ...currentRecord, [e.target.name]: e.target.value });
    };

    if (modalType === 'Medical History') {
      return (
        <div className="space-y-4">
          <input name="condition" placeholder="Condition" value={currentRecord.condition || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="diagnosisDate" type="date" value={currentRecord.diagnosisDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          <select name="status" value={currentRecord.status || 'Ongoing'} onChange={handleChange} className="w-full p-2 border rounded"><option>Ongoing</option><option>Resolved</option></select>
          <input name="doctor" placeholder="Doctor" value={currentRecord.doctor || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="notes" placeholder="Notes" value={currentRecord.notes || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      );
    }
    if (modalType === 'Medication') {
      return (
        <div className="space-y-4">
            <input name="name" placeholder="Medication Name" value={currentRecord.name || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="dosage" placeholder="Dosage" value={currentRecord.dosage || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="startDate" type="date" value={currentRecord.startDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="endDate" placeholder="End Date (or Ongoing)" value={currentRecord.endDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="prescribingDoctor" placeholder="Prescribing Doctor" value={currentRecord.prescribingDoctor || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      );
    }
    if (modalType === 'Allergy') {
      return (
        <div className="space-y-4">
             <input name="type" placeholder="Allergy Type (e.g., Peanuts)" value={currentRecord.type || ''} onChange={handleChange} className="w-full p-2 border rounded" />
             <select name="severity" value={currentRecord.severity || 'Mild'} onChange={handleChange} className="w-full p-2 border rounded"><option>Mild</option><option>Moderate</option><option>Severe</option></select>
             <input name="reaction" placeholder="Reaction" value={currentRecord.reaction || ''} onChange={handleChange} className="w-full p-2 border rounded" />
             <textarea name="notes" placeholder="Notes" value={currentRecord.notes || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      );
    }
    return null;
  };

    const Card: React.FC<{title: RecordType; children: React.ReactNode}> = ({ title, children }) => (
        <div className="bg-surface shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                <button onClick={() => openModalForNew(title)} className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark">Add New</button>
            </div>
            {children}
        </div>
    );
    
    const ActionButtons = ({onEdit, onDelete}: {onEdit: () => void, onDelete: () => void}) => (
        <div className="flex items-center space-x-2">
             <button onClick={onEdit} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
             <button onClick={onDelete} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
        </div>
    );

  return (
    <div className="animate-fade-in space-y-8">
      {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
      <h1 className="text-4xl font-bold text-gray-800">Medical Records</h1>
      
      <Card title="Medical History">
        {medicalHistory.length > 0 ? (
            <ul>{medicalHistory.map(r => (
                 <li key={r.id} className="p-4 bg-light rounded-lg mb-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-lg text-gray-800">{r.condition}</p>
                            <p className="text-sm text-gray-600">Diagnosed: {new Date(r.diagnosisDate).toLocaleDateString()}</p>
                        </div>
                         <ActionButtons onEdit={() => openModalForEdit('Medical History', r)} onDelete={() => handleDelete('Medical History', r.id)} />
                    </div>
                </li>
            ))}</ul>
        ) : <p className="text-gray-500">No medical history records found.</p>}
      </Card>

      <Card title="Medication">
         {medications.length > 0 ? (
            <ul>{medications.map(m => (
                 <li key={m.id} className="p-4 bg-light rounded-lg mb-3">
                    <div className="flex justify-between items-start">
                         <p className="font-bold text-lg text-gray-800">{m.name} - <span className="font-medium">{m.dosage}</span></p>
                         <ActionButtons onEdit={() => openModalForEdit('Medication', m)} onDelete={() => handleDelete('Medication', m.id)} />
                    </div>
                </li>
            ))}</ul>
        ) : <p className="text-gray-500">No current medications listed.</p>}
      </Card>
      
      <Card title="Allergy">
          {allergies.length > 0 ? (
            <ul>{allergies.map(a => (
                <li key={a.id} className="p-4 bg-light rounded-lg mb-3">
                    <div className="flex justify-between items-start">
                        <p className="font-bold text-lg text-gray-800">{a.type}</p>
                        <ActionButtons onEdit={() => openModalForEdit('Allergy', a)} onDelete={() => handleDelete('Allergy', a.id)} />
                    </div>
                </li>
            ))}</ul>
        ) : <p className="text-gray-500">No known allergies.</p>}
      </Card>

       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${currentRecord?.id ? 'Edit' : 'Add'} ${modalType}`}>
            <div className="space-y-4">
                {renderModalContent()}
                <div className="flex justify-end space-x-2 pt-4">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save</button>
                </div>
            </div>
        </Modal>

    </div>
  );
};

export default MedicalRecords;
