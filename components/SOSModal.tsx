import React, { FC, useEffect, useState } from 'react';
import Modal from './Modal';
import { useData } from '../context/DataContext';
import { ICONS } from '../constants';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOSModal: FC<SOSModalProps> = ({ isOpen, onClose }) => {
    const { userProfile, allergies, emergencyContacts } = useData();
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        if (isOpen && isConfirmed) {
            setLocationError(null);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    setLocationError('Could not retrieve location. Please enable location services.');
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else if (!isOpen) {
            // Reset state when modal closes
            setIsConfirmed(false);
            setLocation(null);
            setLocationError(null);
        }
    }, [isOpen, isConfirmed]);
    
    const handleConfirm = () => {
        // Here you would typically trigger an API call to a backend service
        // to notify emergency contacts. We will simulate this.
        setIsConfirmed(true);
    };

    const severeAllergies = allergies.filter(a => a.severity === 'Severe');
    
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Emergency SOS Alert">
            {!isConfirmed ? (
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        {ICONS.emergency}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Confirm SOS Alert</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">
                            This will simulate sending an alert to your emergency contacts with your location and critical medical information. Are you sure you want to proceed?
                        </p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-danger text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Yes, Send Alert
                        </button>
                         <button
                            onClick={onClose}
                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                     <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center mb-4">
                        <p className="font-semibold">Alert Sent!</p>
                        <p className="text-sm">Your emergency contacts have been notified.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-700">Your Location:</h4>
                            {location ? (
                                <p className="text-sm text-gray-600">Lat: {location.lat.toFixed(5)}, Lon: {location.lon.toFixed(5)}</p>
                            ) : locationError ? (
                                <p className="text-sm text-red-600">{locationError}</p>
                            ) : (
                                <p className="text-sm text-gray-500">Fetching location...</p>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Critical Info:</h4>
                             <p className="text-sm text-gray-600"><strong>Blood Group:</strong> {userProfile.bloodGroup}</p>
                             {severeAllergies.length > 0 && (
                                <p className="text-sm text-gray-600"><strong>Severe Allergies:</strong> {severeAllergies.map(a => a.type).join(', ')}</p>
                             )}
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-700">Notified Contacts:</h4>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                {emergencyContacts.map(c => <li key={c.id}>{c.name} ({c.relation})</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default SOSModal;
