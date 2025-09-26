import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ICONS } from '../constants';
import { EmergencyContact } from '../types';
import Modal from './Modal';
import Toast from './Toast';

const Emergency: React.FC = () => {
    const { userProfile, emergencyContacts, allergies, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState<Partial<EmergencyContact> | null>(null);
    const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const severeAllergies = allergies.filter(a => a.severity === 'Severe');
    
    const openModalForNew = () => {
        setCurrentContact({});
        setIsModalOpen(true);
    };

    const openModalForEdit = (contact: EmergencyContact) => {
        setCurrentContact(contact);
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentContact) return;
        try {
            if (currentContact.id) {
                updateEmergencyContact(currentContact as EmergencyContact);
            } else {
                addEmergencyContact(currentContact as Omit<EmergencyContact, 'id'>);
            }
            setShowToast({message: 'Contact saved!', type: 'success'});
            setIsModalOpen(false);
        } catch {
             setShowToast({message: 'Failed to save contact.', type: 'error'});
        }
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                deleteEmergencyContact(id);
                setShowToast({message: 'Contact deleted.', type: 'success'});
            } catch {
                 setShowToast({message: 'Failed to delete contact.', type: 'error'});
            }
        }
    }

    const ContactCard: React.FC<{contact: EmergencyContact}> = ({ contact }) => (
        <div className="bg-light p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-900">{contact.name} <span className="text-sm font-normal text-gray-500">({contact.relation})</span></p>
                    <p className="text-gray-700">{contact.phone}</p>
                    <p className="text-gray-700">{contact.email}</p>
                </div>
                 <div className="flex space-x-2">
                    <button onClick={() => openModalForEdit(contact)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(contact.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
             {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Emergency Information</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="text-primary mr-3">{ICONS.profile}</div>
                            <h2 className="text-2xl font-semibold text-gray-800">Emergency Contacts</h2>
                        </div>
                        <button onClick={openModalForNew} className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark">Add New</button>
                    </div>
                     {emergencyContacts.length > 0 ? (
                        <div className="space-y-4">{emergencyContacts.map(c => <ContactCard key={c.id} contact={c}/>)}</div>
                    ) : <p className="text-gray-500">No emergency contacts listed.</p>}
                </div>
                
                 <div className="bg-surface p-6 rounded-xl shadow-lg">
                    <div className="flex items-center mb-4">
                        <div className="text-primary mr-3">{ICONS.records}</div>
                        <h2 className="text-2xl font-semibold text-gray-800">Critical Medical Info</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-light p-4 rounded-lg">
                            <p className="font-semibold text-gray-700">Blood Group</p>
                            <p className="text-2xl font-bold text-danger">{userProfile?.bloodGroup || 'N/A'}</p>
                        </div>
                         <div className="bg-light p-4 rounded-lg">
                            <p className="font-semibold text-gray-700">Severe Allergies</p>
                             {severeAllergies.length > 0 ? (
                                <ul className="list-disc list-inside text-danger font-medium">{severeAllergies.map(a => <li key={a.id}>{a.type}</li>)}</ul>
                            ) : <p className="text-gray-500">None</p>}
                        </div>
                    </div>
                 </div>
            </div>
             <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-r-lg">
                <div className="flex">
                    <div className="py-1">{ICONS.info}</div>
                    <div className="ml-3"><p className="text-sm font-medium">In case of an emergency, use the SOS button on the dashboard. This information will be shared with your contacts.</p></div>
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentContact?.id ? "Edit Contact" : "Add New Contact"}>
                {currentContact && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <input type="text" placeholder="Name" value={currentContact.name || ''} onChange={e => setCurrentContact({...currentContact, name: e.target.value})} className="w-full p-2 border rounded" required />
                        <input type="text" placeholder="Relation" value={currentContact.relation || ''} onChange={e => setCurrentContact({...currentContact, relation: e.target.value})} className="w-full p-2 border rounded" required />
                        <input type="tel" placeholder="Phone" value={currentContact.phone || ''} onChange={e => setCurrentContact({...currentContact, phone: e.target.value})} className="w-full p-2 border rounded" required />
                        <input type="email" placeholder="Email" value={currentContact.email || ''} onChange={e => setCurrentContact({...currentContact, email: e.target.value})} className="w-full p-2 border rounded" required />
                        <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save Contact</button>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Emergency;
