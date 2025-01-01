// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FiMessageSquare } from "react-icons/fi";
// import { IoImageOutline } from "react-icons/io5";
// import { RxText } from "react-icons/rx";
// import { MdGif } from "react-icons/md";
// import { LiaPhotoVideoSolid } from "react-icons/lia";
// import { FaHashtag } from "react-icons/fa";
// import { MdAlternateEmail } from "react-icons/md";
// import { FiPhone } from "react-icons/fi";
// import { MdOutlineDateRange } from "react-icons/md";
// import { FaRegStar } from "react-icons/fa";
// import { IoMdCheckboxOutline } from "react-icons/io";
// import axios from 'axios';
// import styles from '../pages/pagesModuleCSS/Workspace.module.css';

// function Workspace() {
//   const backendURL = import.meta.env.VITE_BACKEND_URL; 
//   const frontendURL = import.meta.env.VITE_FRONTEND_URL;
//   const location = useLocation();
//   const { user, file, fileId, parentId } = location.state || {}; 
//   const [formName, setFormName] = useState(file.name || 'Untitled');
//   const [theme, setTheme] = useState('light');
//   const [formElements, setFormElements] = useState([]); 
//   const [formId, setFormId] = useState(null); 
//   const navigate = useNavigate()
// const toggleTheme = () => {
//   setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
// };


// console.log("new fileId", fileId)
//   useEffect(() => {
//     setFormElements(file)
//     console.log('User:', user);
//     console.log('file:', file);
//     console.log('fileId:', fileId);
//     // console.log("file._id:",file[1]._id)
//   }, [user, file, fileId, parentId]);
//   // Fetch the existing form when the workspace loads
//   useEffect(() => {
//     if (user) {
//       setFormElements(file);
//       console.log("formElements:", formElements)
//       // const existingForm = file;

//       // Fetch the form data if it exists
//       const fetchFormData = async () => {
//         const token = localStorage.getItem('token');
//         try {
//           const response = await axios.get(
//             `${backendURL}/api/forms/${fileId}`, // Get form by ID
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           console.log("Full response data:", response.data);

//           const formData = response.data;
//           const formDataContent = response.data.data.content;
//           console.log(Array.isArray(formDataContent))
//           console.log("Type of formDataContent:", typeof formDataContent);
//           console.log("formdata",formData);
//           console.log("formdatacontent",formData.data.content);
//           setFormName(formData.data.name);
//           setFormElements(formDataContent); 
//           setFormId(formData._id); // Set the form ID
//         } catch (error) {
//           console.error('Error fetching existing form data:', error);
//         }
//       };

//       fetchFormData();
//     }
//   }, [user, file, fileId]);

//   const addBubble = (type, options = {}) => {
//     setFormElements([
//       ...formElements,
//       { id: Date.now(), type, content: '', ...options },
//     ]);
//   };

//   const updateBubbleContent = (id, content) => {
//     setFormElements(
//       formElements.map((element) =>
//         element.id === id ? { ...element, content } : element
//       )
//     );
//   };

//   const deleteBubble = (id) => {
//     setFormElements(formElements.filter((element) => element.id !== id));
//   };

//   const saveForm = async () => {
//     if (!user._id) {
//       console.error('User ID is missing.');
//       alert('User ID is missing.');
//       return;
//     }
  
//     const formPrototype = {
//       userId: user._id,
//       name: formName, 
//       content: formElements,
//       parentId: parentId
//     };
  
//     const token = localStorage.getItem('token');
  
//     try {
//       const response = await axios.post(
//         `${backendURL}/api/forms/prototype/${fileId}`,
//         formPrototype,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       alert('Prototype form saved successfully!');
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error saving form prototype:', error.response || error);
//       alert('Failed to save the prototype form.');
//     }
//   };
  
  

//   // Function to share the form
//   const shareForm = async () => {
//     if (!formElements || formElements.length === 0) {
//       alert('Please save the form before sharing.');
//       return;
//     }

//     const formPrototype = {
//       userId: user._id,
//       name: formName,
//       content: formElements,
//     };

//     const token = localStorage.getItem('token');

//     try {
//       const response = await axios.post(
//         `${backendURL}/api/forms/prototype/${fileId}`,
//         formPrototype,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const id = response.data.id;
//       const shareableLink = `${frontendURL}/formbot/${fileId}`;
//       await navigator.clipboard.writeText(shareableLink);
//       alert('Form link copied to clipboard!');
//     } catch (error) {
//       console.error('Error sharing form:', error);
//       alert('Failed to generate shareable link.');
//     }
//   };

//     useEffect(() => {
//       document.body.setAttribute("data-theme", theme);
//     }, [theme]);

//     const jumpToResponse = () => {
//       navigate(`/response/${fileId}`, { state: { 
//         user,
//         fileId,
//         parentId: parentId
//       }});
//     }

//   return (
//     <div>
//       <div className={styles.navbar}>
//         <div className={styles.formName} >
//           {' '}
//           <input
//             type="text"
//             value={formName}
//             onChange={(e) => setFormName(e.target.value)}
//             placeholder="Enter form name"
//           />
//         </div>
//         <div className={styles.flowNResponseDiv}>
//           <button className={styles.flow}>Flow</button>
//           <button onClick={jumpToResponse} className={styles.response}>Response</button>
//         </div>
//         <div className={styles.themeNShareDiv}>
//           <div className={styles.themeDiv}>
//           <p>Light</p>
//           <div className={styles.themeSwitch}>
//             <label className={styles.themeSwitch}>
//               <input
//                 type="checkbox"
//                 checked={theme === 'dark'}
//                 onChange={toggleTheme}
//               />
//               <span className={styles.slider}></span>
//             </label>
//           </div>
//           <p>Dark</p>
//           </div>
//           <button className={styles.shareButton} onClick={shareForm}>Share</button>
//         <button className={styles.saveButton} onClick={saveForm}>Save</button>
//         <button className={styles.Xbutton}>X</button>
//         </div>
//       </div>
//       <div className={styles.bubblesNInputs}>
//         <div className={styles.selection}>
//           <div className={styles.bubblesMain}>
//           <h3>Bubbles</h3>
//           <div className={styles.bubbles}>
//             <button onClick={() => addBubble('text')}><FiMessageSquare /> Text</button>
//             <button onClick={() => addBubble('image')}><IoImageOutline /> Image</button>
//             <button onClick={() => addBubble('video')}><LiaPhotoVideoSolid /> Video</button>
//             <button onClick={() => addBubble('gif')}><MdGif /> GIF</button>
//           </div>
//           </div>
//           <div className={styles.inputsMain}>
//           <h3>Inputs</h3>
//           <div className={styles.inputs}>
//             <button onClick={() => addBubble('input', { inputType: 'text' })}><RxText /> Text</button>
//             <button onClick={() => addBubble('input', { inputType: 'number' })}><FaHashtag /> Number</button>
//             <button onClick={() => addBubble('input', { inputType: 'email' })}><MdAlternateEmail />Email</button>
//             <button onClick={() => addBubble('input', { inputType: 'phone' })}><FiPhone /> Phone</button>
//             <button onClick={() => addBubble('input', { inputType: 'date' })}><MdOutlineDateRange />Date</button>
//             <button onClick={() => addBubble('input', { inputType: 'rating', range: [1, 5] })}><FaRegStar /> 
//               Rating
//             </button>
//             <button onClick={() => addBubble('button', { label: 'Submit' })}><IoMdCheckboxOutline /> Buttons</button>
//           </div>
//           </div>
//         </div>

//         <div className={styles.selectedDivMain}>
//           <h2>Start</h2>
//           <div className={styles.selectedBubblesNInputs}>
//             {Array.isArray(formElements) && formElements.map((element) => (
//               <div key={element.id} className={styles.formElement}>
//                 {['text', 'image', 'video', 'gif'].includes(element.type) && (
//                   <div>
//                     <p>
//                       {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Bubble
//                     </p>
//                     <input
//                       type="text"
//                       value={element.content}
//                       onChange={(e) =>
//                         updateBubbleContent(element.id, e.target.value)
//                       }
//                       placeholder={
//                         element.type === 'image'
//                           ? 'Enter image URL (will display in FormBot)'
//                           : `Enter ${element.type} dialogue`
//                       }
//                     />
//                   </div>
//                 )}

//                 {element.type === 'input' && (
//                   <div>
//                     <p>Input Type: {element.inputType}</p>
//                   </div>
//                 )}
//                 {element.type === 'button' && (
//                   <button>{element.label}</button>
//                 )}
//                 <button onClick={() => deleteBubble(element.id)}>Delete</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Workspace;






// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FiMessageSquare } from "react-icons/fi";
// import { IoImageOutline } from "react-icons/io5";
// import { RxText } from "react-icons/rx";
// import { MdGif } from "react-icons/md";
// import { LiaPhotoVideoSolid } from "react-icons/lia";
// import { FaHashtag } from "react-icons/fa";
// import { MdAlternateEmail } from "react-icons/md";
// import { FiPhone } from "react-icons/fi";
// import { MdOutlineDateRange } from "react-icons/md";
// import { FaRegStar } from "react-icons/fa";
// import { IoMdCheckboxOutline } from "react-icons/io";
// import axios from 'axios';
// import styles from '../pages/pagesModuleCSS/Workspace.module.css';

// // Navbar Component
// const Navbar = ({ fileId, user, parentId, theme, setTheme, formName, setFormName, saveForm, shareForm, jumpToResponse }) => {
//   useEffect(() => {
//     document.body.setAttribute("data-theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   return (
//     <div className={styles.navbar}>
//       <div className={styles.formName}>
//         <input
//           type="text"
//           value={formName}
//           onChange={(e) => setFormName(e.target.value)}
//           placeholder="Enter form name"
//         />
//       </div>
//       <div className={styles.flowNResponseDiv}>
//         <button className={styles.flow}>Flow</button>
//         <button onClick={jumpToResponse} className={styles.response}>Response</button>
//       </div>
//       <div className={styles.themeNShareDiv}>
//         <div className={styles.themeDiv}>
//           <p>Light</p>
//           <div className={styles.themeSwitch}>
//             <label className={styles.themeSwitch}>
//               <input
//                 type="checkbox"
//                 checked={theme === "dark"}
//                 onChange={toggleTheme}
//               />
//               <span className={styles.slider}></span>
//             </label>
//           </div>
//           <p>Dark</p>
//         </div>
//         <button className={styles.shareButton} onClick={shareForm}>Share</button>
//         <button className={styles.saveButton} onClick={saveForm}>Save</button>
//         <button className={styles.Xbutton}>X</button>
//       </div>
//     </div>
//   );
// };

// // Workspace Component
// function Workspace() {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const frontendURL = import.meta.env.VITE_FRONTEND_URL;
//   const location = useLocation();
//   const { user, file, fileId, parentId } = location.state || {};
//   const [formName, setFormName] = useState(file.name || "Untitled");
//   const [theme, setTheme] = useState("light");
//   const [formElements, setFormElements] = useState([]);
//   const [formId, setFormId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       const fetchFormData = async () => {
//         const token = localStorage.getItem("token");
//         try {
//           const response = await axios.get(
//             `${backendURL}/api/forms/${fileId}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           const formData = response.data;
//           setFormName(formData.data.name);
//           setFormElements(formData.data.content);
//           setFormId(formData._id);
//         } catch (error) {
//           console.error("Error fetching existing form data:", error);
//         }
//       };
//       fetchFormData();
//     }
//   }, [user, fileId, backendURL]);

//   const addBubble = (type, options = {}) => {
//     setFormElements([
//       ...formElements,
//       { id: Date.now(), type, content: "", ...options },
//     ]);
//   };

//   const updateBubbleContent = (id, content) => {
//     setFormElements(
//       formElements.map((element) =>
//         element.id === id ? { ...element, content } : element
//       )
//     );
//   };

//   const deleteBubble = (id) => {
//     setFormElements(formElements.filter((element) => element.id !== id));
//   };

//   const saveForm = async () => {
//     if (!user._id) {
//       alert("User ID is missing.");
//       return;
//     }
//     const formPrototype = {
//       userId: user._id,
//       name: formName,
//       content: formElements,
//       parentId: parentId,
//     };
//     const token = localStorage.getItem("token");
//     try {
//       await axios.post(
//         `${backendURL}/api/forms/prototype/${fileId}`,
//         formPrototype,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert("Prototype form saved successfully!");
//     } catch (error) {
//       console.error("Error saving form prototype:", error);
//       alert("Failed to save the prototype form.");
//     }
//   };

//   const shareForm = async () => {
//     if (!formElements || formElements.length === 0) {
//       alert("Please save the form before sharing.");
//       return;
//     }
//     const shareableLink = `${frontendURL}/formbot/${fileId}`;
//     await navigator.clipboard.writeText(shareableLink);
//     alert("Form link copied to clipboard!");
//   };

//   const jumpToResponse = () => {
//     navigate(`/response/${fileId}`, {
//       state: { user, fileId, parentId },
//     });
//   };

//   return (
//     <div>
//       <Navbar
//         fileId={fileId}
//         user={user}
//         parentId={parentId}
//         theme={theme}
//         setTheme={setTheme}
//         formName={formName}
//         setFormName={setFormName}
//         saveForm={saveForm}
//         shareForm={shareForm}
//         jumpToResponse={jumpToResponse}
//       />
//       <div className={styles.bubblesNInputs}>
//         <div className={styles.selection}>
//           <div className={styles.bubblesMain}>
//           <h3>Bubbles</h3>
//           <div className={styles.bubbles}>
//             <button onClick={() => addBubble('text')}><FiMessageSquare /> Text</button>
//             <button onClick={() => addBubble('image')}><IoImageOutline /> Image</button>
//             <button onClick={() => addBubble('video')}><LiaPhotoVideoSolid /> Video</button>
//             <button onClick={() => addBubble('gif')}><MdGif /> GIF</button>
//           </div>
//           </div>
//           <div className={styles.inputsMain}>
//           <h3>Inputs</h3>
//           <div className={styles.inputs}>
//             <button onClick={() => addBubble('input', { inputType: 'text' })}><RxText /> Text</button>
//             <button onClick={() => addBubble('input', { inputType: 'number' })}><FaHashtag /> Number</button>
//             <button onClick={() => addBubble('input', { inputType: 'email' })}><MdAlternateEmail />Email</button>
//             <button onClick={() => addBubble('input', { inputType: 'phone' })}><FiPhone /> Phone</button>
//             <button onClick={() => addBubble('input', { inputType: 'date' })}><MdOutlineDateRange />Date</button>
//             <button onClick={() => addBubble('input', { inputType: 'rating', range: [1, 5] })}><FaRegStar /> 
//               Rating
//             </button>
//             <button onClick={() => addBubble('button', { label: 'Submit' })}><IoMdCheckboxOutline /> Buttons</button>
//           </div>
//           </div>
//         </div>

//         <div className={styles.selectedDivMain}>
//           <h2>Start</h2>
//           <div className={styles.selectedBubblesNInputs}>
//             {Array.isArray(formElements) && formElements.map((element) => (
//               <div key={element.id} className={styles.formElement}>
//                 {['text', 'image', 'video', 'gif'].includes(element.type) && (
//                   <div>
//                     <p>
//                       {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Bubble
//                     </p>
//                     <input
//                       type="text"
//                       value={element.content}
//                       onChange={(e) =>
//                         updateBubbleContent(element.id, e.target.value)
//                       }
//                       placeholder={
//                         element.type === 'image'
//                           ? 'Enter image URL (will display in FormBot)'
//                           : `Enter ${element.type} dialogue`
//                       }
//                     />
//                   </div>
//                 )}

//                 {element.type === 'input' && (
//                   <div>
//                     <p>Input Type: {element.inputType}</p>
//                   </div>
//                 )}
//                 {element.type === 'button' && (
//                   <button>{element.label}</button>
//                 )}
//                 <button onClick={() => deleteBubble(element.id)}>Delete</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Workspace;






// Workspace.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { FiMessageSquare } from "react-icons/fi";
import { IoImageOutline } from "react-icons/io5";
import { RxText } from "react-icons/rx";
import { MdGif } from "react-icons/md";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { FaHashtag } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import { GiFlyingFlag } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import styles from '../pages/pagesModuleCSS/Workspace.module.css';

function Workspace() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const frontendURL = import.meta.env.VITE_FRONTEND_URL;
  const location = useLocation();
  const { user, file, fileId, parentId } = location.state || {};
  const [formName, setFormName] = useState(file.name || "Untitled");
  const [theme, setTheme] = useState("light");
  const [formElements, setFormElements] = useState([]);
  const [formId, setFormId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchFormData = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${backendURL}/api/forms/${fileId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const formData = response.data;
          setFormName(formData.data.name);
          setFormElements(formData.data.content);
          setFormId(formData._id);
        } catch (error) {
          console.error("Error fetching existing form data:", error);
        }
      };
      fetchFormData();
    }
  }, [user, fileId, backendURL]);

  const addBubble = (type, options = {}) => {
    setFormElements([ ...formElements, { id: Date.now(), type, content: "", ...options } ]);
  };

  const updateBubbleContent = (id, content) => {
    setFormElements(formElements.map((element) =>
      element.id === id ? { ...element, content } : element
    ));
  };

  const deleteBubble = (id) => {
    setFormElements(formElements.filter((element) => element.id !== id));
  };

  return (
    <div>
      <Header
        fileId={fileId}
        user={user}
        parentId={parentId}
        theme={theme}
        setTheme={setTheme}
        formName={formName}
        setFormName={setFormName}
        formElements={formElements}
        setFormElements={setFormElements}
        navigate={navigate}
        frontendURL={frontendURL}
        backendURL={backendURL}
      />

<div className={styles.bubblesNInputs}>
        <div className={styles.selection}>
          <div className={styles.bubblesMain}>
          <h3>Bubbles</h3>
          <div className={styles.bubbles}>
            <button className={styles.icon} onClick={() => addBubble('text')}><FiMessageSquare color ='#1b3ff3' size={20}/> Text</button>
            <button className={styles.icon} onClick={() => addBubble('image')}><IoImageOutline color ='#1b3ff3' size={20}/> Image</button>
            <button className={styles.icon}><LiaPhotoVideoSolid color ='#1b3ff3' size={20}/> Video</button>
            <button className={styles.icon}><MdGif color ='#1b3ff3' size={50}/> GIF</button>
          </div>
          </div>
          <div className={styles.inputsMain}>
          <h3>Inputs</h3>
          <div className={styles.inputs}>
            <button className={styles.icon} onClick={() => addBubble('input', { inputType: 'text' })}><RxText color='#ca9b02' size={20}/> Text</button>
            <button className={styles.icon} onClick={() => addBubble('input', { inputType: 'number' })}><FaHashtag color='#ca9b02' size={20}/> Number</button>
            <button className={styles.icon} onClick={() => addBubble('input', { inputType: 'email' })}><MdAlternateEmail color='#ca9b02' size={20}/>Email</button>
            <button className={styles.icon} onClick={() => addBubble('input', { inputType: 'phone' })}><FiPhone color='#ca9b02' size={20}/> Phone</button>
            <button className={styles.icon} onClick={() => addBubble('input', { inputType: 'date' })}><MdOutlineDateRange color='#ca9b02' size={20}/>Date</button>
            <button className={styles.icon} onClick={() => addBubble('input', { inputType: 'rating', range: [1, 5] })}><FaRegStar color='#ca9b02' size={20}/> 
              Rating
            </button>
            <button className={styles.icon} onClick={() => addBubble('button', { label: 'Submit' })}><IoMdCheckboxOutline color='#ca9b02' size={20}/> Buttons</button>
          </div>
          </div>
        </div>

        <div className={styles.selectedDivMain}>
          <h2 className={styles.start}> <span><GiFlyingFlag id={styles.flag}/></span> Start</h2>
          <div className={styles.selectedBubblesNInputs}>
            {Array.isArray(formElements) && formElements.map((element) => (
              <div key={element.id} className={styles.formElement}>
                {['text', 'image', 'video', 'gif'].includes(element.type) && (
                  <div>
                    <p>
                      {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Bubble
                    </p>
                    <input
                      type="text"
                      value={element.content}
                      onChange={(e) =>
                        updateBubbleContent(element.id, e.target.value)
                      }
                      placeholder={
                        element.type === 'image'
                          ? 'Enter image URL (will display in FormBot)'
                          : `Enter ${element.type} dialogue`
                      }
                    />
                  </div>
                )}

                {element.type === 'input' && (
                  <div>
                    <p>Input Type: {element.inputType}</p>
                  </div>
                )}
                {element.type === 'button' && (
                  <button className={styles.submitButton}>{element.label}</button>
                )}
                <button className={styles.deleteButton} onClick={() => deleteBubble(element.id)}><RiDeleteBin6Line /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;


