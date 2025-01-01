// Navbar.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './componentModuleCSS/Header.module.css';

const Header = ({ fileId, user, parentId, theme, setTheme, formName, setFormName, formElements, setFormElements, navigate, frontendURL, backendURL }) => {
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const saveForm = async () => {
    if (!user.userId) {
      alert("User ID is missing.");
      return;
    }
    const formPrototype = {
      userId: user.userId,
      name: formName,
      content: formElements,
      parentId: parentId,
    };
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${backendURL}/api/forms/prototype/${fileId}`,
        formPrototype,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Prototype form saved successfully!");
    } catch (error) {
      console.error("Error saving form prototype:", error);
      alert("Failed to save the prototype form.");
    }
  };

  const shareForm = async () => {
    if (!formElements || formElements.length === 0) {
      alert("Please save the form before sharing.");
      return;
    }
    const shareableLink = `${frontendURL}/formbot/${fileId}`;
    await navigator.clipboard.writeText(shareableLink);
    alert("Form link copied to clipboard!");
  };


  const jumpToResponse = () => {
    navigate(`/response/${fileId}`, {
      state: { user, fileId, parentId },
    });
  };


  return (
    <div className={styles.navbar}>
      <div className={styles.formName}>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter form name"
        />
      </div>
      <div className={styles.flowNResponseDiv}>
        <button className={styles.flow} >Flow</button>
        <button onClick={jumpToResponse} className={styles.response}>Response</button>
      </div>
      <div className={styles.themeNShareDiv}>
        <div className={styles.themeDiv}>
          <p>Light</p>
          <div className={styles.themeSwitch}>
            <label className={styles.themeSwitch}>
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <p>Dark</p>
        </div>
        <button className={styles.shareButton} onClick={shareForm}>Share</button>
        <button className={styles.saveButton} onClick={saveForm}>Save</button>
        <button className={styles.Xbutton}>X</button>
      </div>
    </div>
  );
};

export default Header;
