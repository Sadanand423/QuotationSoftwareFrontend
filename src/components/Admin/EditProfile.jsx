import React, { useEffect, useState } from "react";

const EditProfile = () => {

  // ✅ THIS MUST BE USERNAME (not password)
  const loggedInUsername = "admin"; // later store from JWT/localStorage

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ LOAD ADMIN USERNAME
  useEffect(() => {
    fetch(`http://localhost:8080/api/admin/profile/${loggedInUsername}`)
      .then(res => {
        if (!res.ok) throw new Error("Admin not found");
        return res.json();
      })
      .then(data => {
        setUsername(data.username || "");
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async () => {

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch(
      `http://localhost:8080/api/admin/update-credentials/${loggedInUsername}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword
        })
      }
    );

    const msg = await response.text();
    alert(msg);

    if (response.ok) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold">Edit Admin Profile</h2>

      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
