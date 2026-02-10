import React, { useEffect, useState } from 'react';

const MyProfile = () => {

  // 🔹 profile state (same fields as before)
  const [profile, setProfile] = useState(null);

  // 🔹 logged-in employee id (saved during login)
  const empId = localStorage.getItem("empId");

  // 🔹 fetch profile from backend
  useEffect(() => {
    if (!empId) return;

    fetch(`http://localhost:8080/api/employee/profile/${empId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Profile not found");
        }
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, [empId]);

  // 🔹 loading state
  if (!profile) {
    return <p className="p-6">Loading profile...</p>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            View your personal information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT CARD */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-8">
          <div className="text-center">
           <div className="w-40 h-40 sm:w-46 sm:h-46 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200 flex items-center justify-center">
            {profile.photo ? (
             <img
              src={profile.photo}
              alt="Profile"
              className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-white text-2xl sm:text-3xl font-bold bg-green-500 w-full h-full flex items-center justify-center">
      {profile.name?.charAt(0)}
    </span>
  )}
</div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              {profile.name}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {profile.department}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Employee ID: {profile.empId}
            </p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h3>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Full Name" value={profile.name} />
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone} />
              <Info label="Department" value={profile.department} />
              <Info label="Employee ID" value={profile.empId} />
              <Info label="Join Date" value={profile.joinDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 helper component (no UI change)
const Info = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
      {value}
    </div>
  </div>
);

export default MyProfile;
