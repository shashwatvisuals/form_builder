import React, { useState } from "react";

function Settings() {
    const token = localStorage.getItem("token");
    console.log("Token retrieved:", token);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }


    try {
        
      // Implement API request to update user details
      const response = await fetch(`${backendURL}/api/user/updateuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("Details updated successfully!");
      } else {
        alert(data.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };

  return (
    <div className="settings">
      <h2>Update Your Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
          />
        </div>

        {/* Email Field */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Fields */}
        <div>
          <label>Old Password:</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="oldPassword"
              value={userDetails.oldPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div>
          <label>New Password:</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={userDetails.newPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit">Update Details</button>
      </form>
    </div>
  );
}

export default Settings;
