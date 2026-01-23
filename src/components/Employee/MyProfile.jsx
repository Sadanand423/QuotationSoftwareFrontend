import React, { useState } from 'react';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Employee',
    email: 'john.employee@company.com',
    phone: '+1-555-0123',
    department: 'Sales',
    employeeId: 'EMP001',
    joinDate: '2023-06-15'
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your personal information and settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl sm:text-3xl font-bold">JE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{profile.name}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{profile.department}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Employee ID: {profile.employeeId}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base self-start sm:self-auto"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  disabled={!isEditing}
                  className={`w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={profile.email}
                  disabled={!isEditing}
                  className={`w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  value={profile.phone}
                  disabled={!isEditing}
                  className={`w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base ${!isEditing ? 'bg-gray-50' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input 
                  type="text" 
                  value={profile.department}
                  disabled
                  className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <input 
                  type="text" 
                  value={profile.employeeId}
                  disabled
                  className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                <input 
                  type="text" 
                  value={profile.joinDate}
                  disabled
                  className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base">
                  Save Changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input type="password" className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input type="password" className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input type="password" className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base" />
            </div>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4 text-sm sm:text-base">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;