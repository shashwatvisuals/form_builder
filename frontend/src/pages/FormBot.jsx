// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import styles from './pagesModuleCSS/FormBot.module.css';

// const FormBot = () => {
//   const { formId } = useParams(); // Fetch formId from URL
//   const [formData, setFormData] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0); // Track the current index of form elements
//   const [responses, setResponses] = useState({}); // Track the responses as an object for each element
//   const [history, setHistory] = useState([]); // Store the stack history (bubbles and inputs)
//   const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form has been submitted

//   // Fetch form prototype from localStorage based on formId
//   useEffect(() => {
//     const savedPrototype = JSON.parse(localStorage.getItem('formPrototype'));
//     if (savedPrototype && savedPrototype.id === formId) {
//       setFormData(savedPrototype);
//     } else {
//       alert('Form not found!');
//     }
//   }, [formId]);

//   // Handle input submission and move to the next element
//   const handleInputSubmit = () => {
//     if (!responses[currentIndex]?.trim()) return; // Prevent submitting empty input

//     // Add the current input to history
//     setHistory((prevHistory) => [
//       ...prevHistory,
//       { type: 'input', response: responses[currentIndex] },
//     ]);

//     // Move to the next element after input submission
//     setResponses((prevResponses) => ({
//       ...prevResponses,
//       [currentIndex]: '',
//     }));
//     setCurrentIndex((prevIndex) => prevIndex + 1);
//   };

//   // Handle rating selection
//   const handleRatingSelection = (elementId, rating) => {
//     setResponses((prevResponses) => ({
//       ...prevResponses,
//       [elementId]: rating,
//     }));

//     // Add the rating to history
//     setHistory((prevHistory) => [
//       ...prevHistory,
//       { type: 'input', response: `Rating: ${rating}` },
//     ]);

//     // Move to the next element
//     setCurrentIndex((prevIndex) => prevIndex + 1);
//   };

//   // Render the current form element based on its type
//   const renderElement = (element, index) => {
//     switch (element.type) {
//       case 'text':
//         return (
//           <div key={index} className={styles.bubble}>
//             <span>{element.content}</span>
//           </div>
//         );
//       case 'input':
//         return (
//           <div key={index} className={styles.inputWrapper}>
//             <label>{element.content || 'Input'}</label>
//             <input
//               type={element.inputType || 'text'}
//               placeholder={element.placeholder || 'Enter your response'}
//               value={responses[index] || ''}
//               onChange={(e) =>
//                 setResponses((prevResponses) => ({
//                   ...prevResponses,
//                   [index]: e.target.value,
//                 }))
//               }
//               className={styles.input}
//             />
//             <button
//               onClick={handleInputSubmit}
//               className={styles.sendButton}
//             >
//               Send
//             </button>
//           </div>
//         );
//       case 'image':
//         return (
//           <div key={index} className={styles.imageWrapper}>
//             <img
//               src={element.content}
//               alt="Form Image"
//               style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', margin: '10px 0' }}
//             />
//           </div>
//         );
//       case 'rating':
//         return renderRating(element, index); // Separate render for rating
//       case 'button':
//         return (
//           <div key={index} className={styles.buttonWrapper}>
//             <button onClick={() => setFormSubmitted(true)} disabled={formSubmitted}>
//               {element.label || 'Submit'}
//             </button>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   // Separate render for rating
//   const renderRating = (element, index) => {
//     return (
//       <div key={index} className={styles.ratingWrapper}>
//         <label>{element.content || 'Select a rating:'}</label>
//         <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//           {Array.from(
//             { length: element.range[1] - element.range[0] + 1 },
//             (_, i) => element.range[0] + i
//           ).map((num) => (
//             <button
//               key={num}
//               type="button"
//               onClick={() => handleRatingSelection(index, num)}
//               style={{
//                 padding: '5px 10px',
//                 backgroundColor:
//                   responses[index] === num ? '#4caf50' : '#e0e0e0',
//                 color: responses[index] === num ? '#fff' : '#000',
//                 border: '1px solid #ccc',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 transition: 'background-color 0.3s ease',
//               }}
//             >
//               {num}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Automatic movement for bubbles
//   useEffect(() => {
//     if (formData && currentIndex < formData.formElements.length) {
//       const currentElement = formData.formElements[currentIndex];

//       if (currentElement.type === 'text') {
//         // For text bubbles, automatically add to history and move to the next element after 0.5 seconds
//         setHistory((prevHistory) => [
//           ...prevHistory,
//           { type: 'bubble', response: currentElement.content },
//         ]);
//         setTimeout(() => {
//           setCurrentIndex((prevIndex) => prevIndex + 1);
//         }, 500);
//       } else if (currentElement.type === 'image') {
//         // For images, add to history and move to the next element after 0.5 seconds
//         setHistory((prevHistory) => [
//           ...prevHistory,
//           { type: 'image', response: currentElement.content },
//         ]);
//         setTimeout(() => {
//           setCurrentIndex((prevIndex) => prevIndex + 1);
//         }, 500);
//       }
//     }
//   }, [currentIndex, formData]);

//   return (
//     <div className={styles.formbotContainer}>
//       {formData ? (
//         <div className={styles.formWrapper}>
//           <h2>{formData.formName || 'Untitled Form'}</h2>

//           {/* Show the history of all bubbles and inputs */}
//           {history.map((historyItem, index) => {
//             if (historyItem.type === 'input') {
//               return (
//                 <div key={index} className={styles.inputWrapper}>
//                   <span>{historyItem.response}</span>
//                 </div>
//               );
//             } else if (historyItem.type === 'bubble') {
//               return (
//                 <div key={index} className={styles.bubble}>
//                   <span>{historyItem.response}</span>
//                 </div>
//               );
//             } else if (historyItem.type === 'image') {
//               return (
//                 <div key={index} className={styles.imageWrapper}>
//                   <img
//                     src={historyItem.response}
//                     alt="History Image"
//                     style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', margin: '10px 0' }}
//                   />
//                 </div>
//               );
//             }
//             return null;
//           })}

//           {/* Render the current element */}
//           {formData.formElements && formData.formElements.length > 0 && currentIndex < formData.formElements.length ? (
//             formData.formElements[currentIndex].type === 'input' &&
//             formData.formElements[currentIndex].inputType === 'rating' ? (
//               <div>
//                 <label>Select a rating:</label>
//                 <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//                   {Array.from(
//                     { length: formData.formElements[currentIndex].range[1] - formData.formElements[currentIndex].range[0] + 1 },
//                     (_, i) => formData.formElements[currentIndex].range[0] + i
//                   ).map((num) => (
//                     <button
//                       key={num}
//                       type="button"
//                       onClick={() => handleRatingSelection(formData.formElements[currentIndex].id, num)}
//                       style={{
//                         padding: '5px 10px',
//                         backgroundColor:
//                           responses[formData.formElements[currentIndex].id] === num ? '#4caf50' : '#e0e0e0',
//                         color: responses[formData.formElements[currentIndex].id] === num ? '#fff' : '#000',
//                         border: '1px solid #ccc',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         transition: 'background-color 0.3s ease',
//                       }}
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               renderElement(formData.formElements[currentIndex], currentIndex)
//             )
//           ) : (
//             <p>Thank you for completing the form!</p> // Display once all elements are completed
//           )}
//         </div>
//       ) : (
//         <p>Loading form...</p>
//       )}
//     </div>
//   );
// };

// export default FormBot;









import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import styles from './pagesModuleCSS/FormBot.module.css';

const FormBot = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [sessionId] = useState(uuidv4());
  const [elementId, setElementId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [history, setHistory] = useState([]); // To store history of bubbles and inputs
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/forms/${formId}`);
        console.log('Form data:', response.data.data);
        setElementId(response.data.data._id);
        setFormData(response.data.data);
        setLoading(false);  // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching form:', error);
        alert('Failed to load the form. Please check the link.');
      }
    };

    fetchForm();
  }, [formId]);

  const saveResponse = async (elementId, response) => {
    try {
      const payload = { elementId, response, sessionId };
      await axios.post(`http://localhost:4000/api/forms/${formId}/responses`, payload);
      console.log('Response saved:', response);
    } catch (error) {
      console.error('Error saving response:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputSubmit = () => {
    if (!responses[currentIndex]?.trim()) return; // Prevent submitting empty input

    const currentElement = formData.content[currentIndex];

    // Save the response to the backend
    saveResponse(currentElement._id, responses[currentIndex]);

    // Add the current input to history
    setHistory((prevHistory) => [
      ...prevHistory,
      { type: 'input', response: responses[currentIndex] },
    ]);

    // Move to the next element by updating responses and currentIndex
    setResponses((prevResponses) => ({
      ...prevResponses,
      [currentIndex]: '', // Clear the response for current index
    }));

    setCurrentIndex((prevIndex) => {
      if (prevIndex + 1 < formData.content.length) {
        return prevIndex + 1;
      } else {
        setFormSubmitted(true); // If it's the last element, mark the form as submitted
        return prevIndex;
      }
    });
  };

  const handleRatingSelection = (elementId, rating) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [elementId]: rating,
    }));

    setHistory((prevHistory) => [
      ...prevHistory,
      { type: 'input', response: `Rating: ${rating}` },
    ]);

    // Save the rating response to the backend
    saveResponse(elementId, rating);

    // Move to the next element
    setCurrentIndex((prevIndex) => {
      if (prevIndex + 1 < formData.content.length) {
        return prevIndex + 1;
      } else {
        setFormSubmitted(true); // If it's the last element, mark the form as submitted
        return prevIndex;
      }
    });
  };

  const renderElement = (element, index) => {
    switch (element.type) {
      case 'text':
        return (
          <div key={index} className={styles.bubble}>
            <span>{loading ? '(....)' : element.content}</span>
            {!loading && setHistory((prevHistory) => [
              ...prevHistory,
              { type: 'bubble', response: element.content },
            ])}
            {!loading && setCurrentIndex((prevIndex) => {
              if (prevIndex + 1 < formData.content.length) {
                return prevIndex + 1;
              } else {
                setFormSubmitted(true);
                return prevIndex;
              }
            })}
          </div>
        );
      case 'input':
        if (element.inputType === 'rating') {
          return renderRating(element, index); // Custom render function for ratings
        }
        return (
          <div key={index} className={styles.inputWrapper}>
            <label>{element.content || 'Input'}</label>
            <input
              type={element.inputType || 'text'}
              placeholder={element.placeholder || 'Enter your response'}
              value={responses[index] || ''}
              onChange={(e) =>
                setResponses((prevResponses) => ({
                  ...prevResponses,
                  [index]: e.target.value,
                }))
              }
              className={styles.input}
            />
            <button onClick={handleInputSubmit} className={styles.sendButton}>
              Send
            </button>
          </div>
        );
      case 'rating':
        return renderRating(element, index);
      case 'button':
        return (
          <div key={index} className={styles.buttonWrapper}>
            <button onClick={() => setFormSubmitted(true)} disabled={formSubmitted}>
              {element.label || 'Submit'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderRating = (element, index) => (
    <div key={index} className={styles.ratingWrapper}>
      <label>{element.content || 'Select a rating:'}</label>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {Array.from(
          { length: element.range[1] - element.range[0] + 1 },
          (_, i) => element.range[0] + i
        ).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleRatingSelection(index, num)}
            style={{
              padding: '5px 10px',
              backgroundColor: responses[index] === num ? '#4caf50' : '#e0e0e0',
              color: responses[index] === num ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.formbotContainer}>
      {formData && Array.isArray(formData.content) && formData.content.length > 0 ? (
        <div className={styles.formWrapper}>
          <h2>{formData.name || 'Untitled Form'}</h2>

          {/* Render the history elements */}
          {history.map((historyItem, index) => {
            if (historyItem.type === 'input') {
              return (
                <div key={index} className={styles.inputWrapper}>
                  <span>{historyItem.response}</span>
                </div>
              );
            }
            if (historyItem.type === 'bubble') {
              return (
                <div key={index} className={styles.bubble}>
                  <span>{historyItem.response}</span>
                </div>
              );
            }
            return null;
          })}

          {/* Render the current element */}
          {formData.content.map((element, index) =>
            index === currentIndex ? renderElement(element, index) : null
          )}

          {currentIndex >= formData.content.length && (
            <p>Thank you for completing the form!</p>
          )}
        </div>
      ) : (
        <p>Loading form...</p>
      )}
    </div>
  );
};

export default FormBot;








