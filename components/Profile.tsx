import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { UserProfile } from '../types';
import Toast from './Toast';

const Profile: React.FC = () => {
  const { userProfile, updateProfile } = useData();
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (profile) {
      updateProfile(profile as UserProfile);
      setIsEditing(false);
      setShowToast(true);
    }
  };

  if (!userProfile) return <div className="text-center p-8">Loading profile...</div>;

  const ProfileField = ({ label, value, name, type = 'text' }: { label: string, value: string, name: string, type?: string }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        ) : (
          value
        )}
      </dd>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {showToast && <Toast message="Profile updated successfully!" type="success" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
        {isEditing ? (
          <div className="space-x-2">
            <button onClick={() => { setIsEditing(false); setProfile(userProfile); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save Changes</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Edit Profile</button>
        )}
      </div>
      
      <div className="bg-surface shadow-lg rounded-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about yourself.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <ProfileField label="Full Name" name="name" value={profile.name || ''} />
            <ProfileField label="Email address" name="email" value={profile.email || ''} />
            <ProfileField label="Phone Number" name="phone" value={profile.phone || ''} />
            <ProfileField label="Date of Birth" name="dob" value={profile.dob || ''} type="date" />
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {isEditing ? (
                        <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    ) : (
                        profile.gender
                    )}
                </dd>
            </div>
            <ProfileField label="Address" name="address" value={profile.address || ''} />
            <ProfileField label="Blood Group" name="bloodGroup" value={profile.bloodGroup || ''} />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
