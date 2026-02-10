import React, { useEffect, useState } from 'react';




const MyProfile = () => {

  const fileInputRef = React.useRef(null);

  const handlePhotoClick = () => {
  fileInputRef.current.click();
};
const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/employee/profile/photo/${empId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photo: reader.result }),
        }
      );

      if (!res.ok) throw new Error("Photo update failed");

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      alert(err.message);
    }
  };

  reader.readAsDataURL(file); // converts image to Base64
};


  const handleSave = async () => {
  try {
    const res = await 
      fetch(`http://localhost:8080/api/employee/profile/update/${empId}`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!res.ok) throw new Error("Update failed");

    const updatedProfile = await res.json();
    setProfile(updatedProfile);
    setIsEditing(false);
  } catch (err) {
    alert(err.message);
  }
};


  // 🔹 profile state (same fields as before)
  const [profile, setProfile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: ""
})

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

  useEffect(() => {
  if (profile) {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || ""
    });
  }
}, [profile]);



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
           <div onClick={handlePhotoClick} className="w-40 h-40 sm:w-46 sm:h-46 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200 flex items-center justify-center">
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

<input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  onChange={handlePhotoChange}
  style={{ display: "none" }}
/>

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
          <div className="p-4 sm:p-6 border-b flex justify-between items-center">
  <h3 className="text-lg font-semibold text-gray-800">
    Personal Information
  </h3>

  {!isEditing ? (
    <button
      onClick={() => setIsEditing(true)}
      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
    >
      Update
    </button>
  ) : (
    <div className="space-x-2">
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Save
      </button>
      <button
        onClick={() => {
          setIsEditing(false);
          setFormData({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          });
        }}
        className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
      >
        Cancel
      </button>
    </div>
  )}
</div>


          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Info
              label="Full Name"
              value={formData.name}
              editable={isEditing}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Info
              label="Email"
              value={formData.email}
              editable={isEditing}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <Info
              label="Phone"
              value={formData.phone}
              editable={isEditing}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            {/* READ ONLY */}
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
const Info = ({ label, value, editable, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    {editable ? (
      <input
        value={value}
        onChange={onChange}
        className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
      />
    ) : (
      <div className="w-full border p-2 sm:p-3 rounded-lg bg-gray-50 text-sm sm:text-base text-gray-800">
        {value}
      </div>
    )}
  </div>
);

export default MyProfile;
