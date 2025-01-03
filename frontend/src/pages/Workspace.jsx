// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import styles from '../pages/pagesModuleCSS/Workspace.module.css';

// function Workspace() {
//   const location = useLocation();
//   const { user, file, fileId } = location.state || {}; // Assuming userId and prototypeFormId are passed as state
//   const [formName, setFormName] = useState(file.name || 'Untitled');
//   const [formElements, setFormElements] = useState([]); // Initialize as empty array
//   const [formId, setFormId] = useState(null); // Store the form ID if it already exists
//   // const navigate = useNavigate();

//   console.log("fileId", fileId)
//   useEffect(() => {
//     console.log('User:', user);
//     console.log('file:', file);
//     console.log(file._id)
//   }, [user, file]);
//   // Fetch the existing form when the workspace loads
//   useEffect(() => {
//     if (user && file.length > 0) {
//       const existingForm = file; // Assuming file contain the form prototype

//       // Fetch the form data if it exists
//       const fetchFormData = async () => {
//         const token = localStorage.getItem('token');
//         try {
//           const response = await axios.get(
//             `http://localhost:4000/api/forms/${file._id}`, // Get form by ID
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           const formData = response.data;
//           console.log(formData);
//           setFormName(formData.data.name);
//           setFormElements(formData.content || []); // Set existing form elements, ensure it's an array
//           setFormId(formData._id); // Set the form ID
//         } catch (error) {
//           console.error('Error fetching existing form data:', error);
//         }
//       };

//       fetchFormData();
//     }
//   }, [user, file]);

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
//       name: formName, // Ensure `formName` matches the file name created
//       content: formElements,
//     };
  
//     const token = localStorage.getItem('token');
  
//     try {
//       const response = await axios.post(
//         'http://localhost:4000/api/forms/prototype',
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
//         'http://localhost:4000/api/forms/prototype',
//         formPrototype,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const id = response.data.id;
//       const shareableLink = `http://localhost:5173/formbot/${id}`;
//       await navigator.clipboard.writeText(shareableLink);
//       alert('Form link copied to clipboard!');
//     } catch (error) {
//       console.error('Error sharing form:', error);
//       alert('Failed to generate shareable link.');
//     }
//   };

//   return (
//     <div>
//       <div className={styles.navbar}>
//         <div>
//           Form Name:{' '}
//           <input
//             type="text"
//             value={formName}
//             onChange={(e) => setFormName(e.target.value)}
//             placeholder="Enter form name"
//           />
//         </div>
//         <div>
//           <button>Flow</button>
//           <button>Response</button>
//         </div>
//         <button onClick={saveForm}>Save</button>
//         <button>X</button>
//         <button onClick={shareForm}>Share</button>
//       </div>

//       <div className={styles.bubblesNInputs}>
//         <div>
//           <h3>Bubbles</h3>
//           <div className={styles.bubbles}>
//             <button onClick={() => addBubble('text')}>Text</button>
//             <button onClick={() => addBubble('image')}>Image</button>
//             <button onClick={() => addBubble('video')}>Video</button>
//             <button onClick={() => addBubble('gif')}>GIF</button>
//           </div>
//           <h3>Inputs</h3>
//           <div className={styles.inputs}>
//             <button onClick={() => addBubble('input', { inputType: 'text' })}>Text</button>
//             <button onClick={() => addBubble('input', { inputType: 'number' })}>Number</button>
//             <button onClick={() => addBubble('input', { inputType: 'email' })}>Email</button>
//             <button onClick={() => addBubble('input', { inputType: 'phone' })}>Phone</button>
//             <button onClick={() => addBubble('input', { inputType: 'date' })}>Date</button>
//             <button onClick={() => addBubble('input', { inputType: 'rating', range: [1, 5] })}>
//               Rating
//             </button>
//             <button onClick={() => addBubble('button', { label: 'Submit' })}>Buttons</button>
//           </div>
//         </div>

//         <div className={styles.selectedBubblesNInputs}>
//           <h2>Form Preview</h2>
//           <div>
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










import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import axios from 'axios';
import styles from '../pages/pagesModuleCSS/Workspace.module.css';

function Workspace() {
  const location = useLocation();
  const { user, file, fileId, parentId } = location.state || {}; 
  const [formName, setFormName] = useState(file.name || 'Untitled');
  const [theme, setTheme] = useState('light');
  const [formElements, setFormElements] = useState([]); 
  const [formId, setFormId] = useState(null); 
const toggleTheme = () => {
  setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
};


console.log("new fileId", fileId)
  useEffect(() => {
    setFormElements(file)
    console.log('User:', user);
    console.log('file:', file);
    console.log('fileId:', fileId);
    // console.log("file._id:",file[1]._id)
  }, [user, file, fileId, parentId]);
  // Fetch the existing form when the workspace loads
  useEffect(() => {
    if (user) {
      setFormElements(file);
      console.log("formElements:", formElements)
      // const existingForm = file;

      // Fetch the form data if it exists
      const fetchFormData = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(
            `http://localhost:4000/api/forms/${fileId}`, // Get form by ID
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Full response data:", response.data);

          const formData = response.data;
          const formDataContent = response.data.data.content;
          console.log(Array.isArray(formDataContent))
          console.log("Type of formDataContent:", typeof formDataContent);
          console.log("formdata",formData);
          console.log("formdatacontent",formData.data.content);
          setFormName(formData.data.name);
          setFormElements(formDataContent); 
          setFormId(formData._id); // Set the form ID
        } catch (error) {
          console.error('Error fetching existing form data:', error);
        }
      };

      fetchFormData();
    }
  }, [user, file, fileId]);

  const addBubble = (type, options = {}) => {
    setFormElements([
      ...formElements,
      { id: Date.now(), type, content: '', ...options },
    ]);
  };

  const updateBubbleContent = (id, content) => {
    setFormElements(
      formElements.map((element) =>
        element.id === id ? { ...element, content } : element
      )
    );
  };

  const deleteBubble = (id) => {
    setFormElements(formElements.filter((element) => element.id !== id));
  };

  const saveForm = async () => {
    if (!user._id) {
      console.error('User ID is missing.');
      alert('User ID is missing.');
      return;
    }
  
    const formPrototype = {
      userId: user._id,
      name: formName, 
      content: formElements,
      parentId: parentId
    };
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        `http://localhost:4000/api/forms/prototype/${fileId}`,
        formPrototype,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert('Prototype form saved successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error saving form prototype:', error.response || error);
      alert('Failed to save the prototype form.');
    }
  };
  
  

  // Function to share the form
  const shareForm = async () => {
    if (!formElements || formElements.length === 0) {
      alert('Please save the form before sharing.');
      return;
    }

    const formPrototype = {
      userId: user._id,
      name: formName,
      content: formElements,
    };

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `http://localhost:4000/api/forms/prototype/${fileId}`,
        formPrototype,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const id = response.data.id;
      const shareableLink = `http://localhost:5173/formbot/${fileId}`;
      await navigator.clipboard.writeText(shareableLink);
      alert('Form link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing form:', error);
      alert('Failed to generate shareable link.');
    }
  };

    useEffect(() => {
      document.body.setAttribute("data-theme", theme);
    }, [theme]);

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.formName} >
          {' '}
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
          />
        </div>
        <div className={styles.flowNResponseDiv}>
          <button className={styles.flow}>Flow</button>
          <button className={styles.response}>Response</button>
        </div>
        <div className={styles.themeNShareDiv}>
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
          <button className={styles.shareButton} onClick={shareForm}>Share</button>
        <button className={styles.saveButton} onClick={saveForm}>Save</button>
        <button className={styles.Xbutton}>X</button>
        </div>
      </div>
      <div className={styles.bubblesNInputs}>
        <div className={styles.selection}>
          <div className={styles.bubblesMain}>
          <h3>Bubbles</h3>
          <div className={styles.bubbles}>
            <button onClick={() => addBubble('text')}><FiMessageSquare /> Text</button>
            <button onClick={() => addBubble('image')}><IoImageOutline /> Image</button>
            <button onClick={() => addBubble('video')}><LiaPhotoVideoSolid /> Video</button>
            <button onClick={() => addBubble('gif')}><MdGif /> GIF</button>
          </div>
          </div>
          <div className={styles.inputsMain}>
          <h3>Inputs</h3>
          <div className={styles.inputs}>
            <button onClick={() => addBubble('input', { inputType: 'text' })}><RxText /> Text</button>
            <button onClick={() => addBubble('input', { inputType: 'number' })}><FaHashtag /> Number</button>
            <button onClick={() => addBubble('input', { inputType: 'email' })}><MdAlternateEmail />Email</button>
            <button onClick={() => addBubble('input', { inputType: 'phone' })}><FiPhone /> Phone</button>
            <button onClick={() => addBubble('input', { inputType: 'date' })}><MdOutlineDateRange />Date</button>
            <button onClick={() => addBubble('input', { inputType: 'rating', range: [1, 5] })}><FaRegStar /> 
              Rating
            </button>
            <button onClick={() => addBubble('button', { label: 'Submit' })}><IoMdCheckboxOutline /> Buttons</button>
          </div>
          </div>
        </div>

        <div className={styles.selectedDivMain}>
          <h2>Start</h2>
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
                  <button>{element.label}</button>
                )}
                <button onClick={() => deleteBubble(element.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;





