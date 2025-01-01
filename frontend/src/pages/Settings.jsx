import React, { useState } from "react";
import { IoLogInOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import styles from './pagesModuleCSS/Settings.module.css'

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
    <div className={styles.settingsMain}>
      <div className={styles.settings}>
      <h2 id={styles.heading}>Settings</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className={styles.userName}>
          <label><FaRegUser/></label>
          <input className={styles.inputField}
            placeholder="Name"
            type="text"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
          />
        </div>

        {/* Email Field */}
        <div className={styles.userName}>
          <label><MdOutlineLock/></label>
          <input className={styles.inputField}
            placeholder="Update Email"
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Fields */}
        <div className={styles.passwordDiv}>
          <label><MdOutlineLock/></label>
            <input className={styles.inputField}
              placeholder="Old Password"
              type={showPassword ? "text" : "password"}
              name="oldPassword"
              value={userDetails.oldPassword}
              onChange={handleChange}
            />
            <button
            className={styles.eyeButton}
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <MdOutlineRemoveRedEye /> :  <IoEyeOffOutline />}
            </button>
        </div>
        <div className={styles.passwordDiv}>
          <label><MdOutlineLock/></label>
            <input className={styles.inputField}
              placeholder="New Password"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={userDetails.newPassword}
              onChange={handleChange}
            />
            <button className={styles.eyeButton}
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <MdOutlineRemoveRedEye /> :  <IoEyeOffOutline />}
            </button>
        </div>
      </form>
      <button className={styles.updateButton} type="submit">Update</button>
      </div>
      <button id={styles.logout}> <span><IoLogInOutline id={styles.logoutIcon}/></span> log out</button>
    </div>
  );
}

export default Settings;
