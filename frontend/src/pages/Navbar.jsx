// import React, { useState, useEffect } from 'react';
// import styles from './pagesModuleCSS/Navbar.module.css'
// import { Link } from "react-router-dom";

// const Navbar = ({ userName, onLogout }) => {
//     console.log('Navbar received userName:', userName);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [theme, setTheme] = useState('light');

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     console.log('Dropdown is now', !isDropdownOpen ? 'open' : 'closed');
//   };

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   useEffect(() => {
//     document.body.setAttribute("data-theme", theme);
//   }, [theme]);


//   return (
//     <nav className={styles.navbar}>
//       <div className="navbar-brand">Form Builder</div>

//       <div className="navbar-actions">
//         <button className="theme-toggle" onClick={toggleTheme}>
//           {theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
//         </button>

//         <div className="dropdown">
//           <button className="dropdown-toggle" onClick={toggleDropdown}>
//             Dropdown
//           </button>
//           {isDropdownOpen && (
//             <ul className="dropdown-menu">
//               <li className="dropdown-item">{userName || 'Guest'}</li>
//               <li>
//               <Link to="/settings" className="dropdown-item" onClick={toggleDropdown}>
//                   Settings
//                 </Link>
//               </li>
//               <li className="dropdown-item" onClick={onLogout}>
//                 Logout
//               </li>
//             </ul>
//           )}
//         </div>

//         <button className="share-button">Share</button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





import React, { useState, useEffect } from 'react';
import styles from './pagesModuleCSS/Navbar.module.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Navbar = ({ userName, onLogout }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL; 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view'); // Shared drop-down
  const [sharedLink, setSharedLink] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      const response = await axios.post(
        `${backendURL}/api/files/share/invite`,
        { email, permission, type: 'email' },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        }
      );
      toast.success('Workbook shared successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'User is not registered';
      toast.error(errorMessage);
    }
  };
  
  const handleGenerateLink = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      const { data } = await axios.post(
        `${backendURL}/api/files/share/link`,
        { permission, type: 'link' },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        }
      );
      setSharedLink(data.link);
      toast.success('Link generated successfully!');
    } catch {
      toast.error('Failed to generate link');
    }
  };
  




  const handleAccessLink = () => {
    if (!sharedLink) {
      toast.error('No link available to access');
      return;
    }
    navigate(sharedLink); // Redirect to shared link
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarActions}>
        <div className={styles.dropdownDiv}>
        <div className={styles.dropdown}>
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            {userName}'s workspace
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <li>
                <Link id={styles.settings} to="/settings" className={styles.dropdownItem} onClick={toggleDropdown}>
                  Settings
                </Link>
              </li>
              <li className={styles.dropdownItem} onClick={onLogout}>
                Logout
              </li>
            </ul>
          )}
        </div>
        </div>
        {/* <button className={"theme-toggle"} onClick={toggleTheme}>
          {theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        </button> */}
<div className={styles.themeDiv}>
<p>Light</p>
<div className={styles.themeSwitch}>
  <label className={styles.themeSwitch}>
    <input
      type="checkbox"
      checked={theme === 'dark'}
      onChange={toggleTheme}
    />
    <span className={styles.slider}></span>
  </label>
</div>
<p>Dark</p>
</div>


        <button className="share-button" onClick={() => setIsShareModalOpen(true)}>Share</button>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
          <ToastContainer />
            <button
              className="modal-close"
              onClick={() => setIsShareModalOpen(false)}
            >
              &times;
            </button>
            <h2>Share Workbook</h2>

            {/* Shared Drop-Down */}
            <div>
              <label htmlFor="permission">Permission: </label>
              <select
                id="permission"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="view">View Only</option>
                <option value="edit">Can Edit</option>
              </select>
            </div>

            {/* Invite via Email */}
            <div>
              <h3>Invite via Email</h3>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleInvite}>Invite</button>
            </div>

            {/* Share Link */}
            <div>
              <h3>Share Link</h3>
              <button onClick={handleGenerateLink}>Generate Link</button>
              {sharedLink && (
                <p>
                  Copy this link: <span>{sharedLink}</span>
                  <button onClick={handleAccessLink}>Access Link</button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

