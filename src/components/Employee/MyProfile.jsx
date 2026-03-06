import React from 'react';

const MyProfile = () => {
  // Static profile data - will be fetched from login session
  const profile = {
    name: 'John Employee',
    email: 'john.employee@company.com',
    phone: '+1-555-0123',
    department: 'Sales',
    employeeId: 'EMP001',
    joinDate: '2023-06-15'
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">View your personal information</p>
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
          <div className="p-4 sm:p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
                  {profile.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
                  {profile.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
                  {profile.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
                  {profile.department}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
                  {profile.employeeId}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
                  {profile.joinDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;