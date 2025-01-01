import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import styles from './pagesModuleCSS/FormBot.module.css';

const FormBot = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL; 
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
    // Send POST request to record view count
    axios.post(`${backendURL}/api/stats/${formId}/view`, { sessionId: sessionId })
      .then(response => console.log('View recorded:', response.data))
      .catch(error => console.error('Error recording view:', error));
  }, [formId]);
  

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/forms/${formId}`);
        console.log('Form data:', response.data.data);
        setElementId(response.data.data._id);
        setFormData(response.data.data);
        setLoading(false);  

        if (response.data.data.responses && response.data.data.responses.length > 0) {
          console.log('Form has started');
          // You can perform any action here if needed
        } else {
          console.log('Form has not started');
        }
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
      await axios.post(`${backendURL}/api/forms/${formId}/responses`, payload);
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

        case 'image':
          if (!loading) {
            // Trigger state updates in a controlled manner
            setTimeout(() => {
              // Avoid adding the image URL to the history as a response
              setHistory((prevHistory) => [
                ...prevHistory,
                { type: 'image', content: element.content }, // Differentiating image history
              ]);
        
              setCurrentIndex((prevIndex) => {
                if (prevIndex + 1 < formData.content.length) {
                  return prevIndex + 1;
                } else {
                  setFormSubmitted(true);
                  return prevIndex;
                }
              });
            }, 3000); // Adjust the delay as needed
          }
        
          return (
            <div key={index} className={styles.imageWrapper}>
              <img
                src={element.content}
                alt={element.alt || 'Form Image'}
                className={styles.image}
                onError={(e) => {
                  e.target.src = '../assets/placeholder.png'; // Fallback to a placeholder image
                }}
              />
            </div>
          );
        


      case 'input':
        if (element.inputType === 'rating') {
          return renderRating(element, index); // Custom render function for ratings
        }
        return (
          <div key={index} className={styles.inputWrapper}>
            {/* <label>{element.content || 'Input'}</label> */}
            <div className={styles.inputsNSend}>
            <input
              type={element.inputType || 'text'}
              placeholder={element.placeholder || 'Enter your response'}
              value={responses[index] || ''}
              // onFocus={handleFormStart}
              onChange={(e) =>
                setResponses((prevResponses) => ({
                  ...prevResponses,
                  [index]: e.target.value,
                }))
              }
              className={styles.input}
            />
            <button onClick={handleInputSubmit} className={styles.sendButton}>
            <IoSend className={styles.sendIcon}/>
            </button>
            </div>
          </div>
        );
      case 'rating':
        return renderRating(element, index);
        case 'button':
          const handleButtonClick = () => {
            const currentElement = formData.content[index];
            const timestamp = new Date().toLocaleString('en-US', {
              timeZoneName: 'short',  
              hour12: true,          
            });
            setResponses((prevResponses) => ({
              ...prevResponses,
              [index]: timestamp,  // Store Date.now() as the response for the button
            }));
            saveResponse(currentElement._id, timestamp); // Save the timestamp response to backend
            setFormSubmitted(true);  // Mark form as submitted
          };
        
          return (
            <div key={index} className={styles.buttonWrapper}>
              {formSubmitted ? (
                <p id={styles.greet}>Thank you for completing the form!</p>
              ) : (
                <button 
                  onClick={handleButtonClick} 
                  disabled={formSubmitted}
                  style={{backgroundColor: formSubmitted ? '#c3c3c3' : '#1d50f7'}}
                >
                  {element.label || 'Submit'}
                </button>
              )}
            </div>
          );
        
      default:
        return null;
    }
  
  };
  const handleRatingSelection = (elementId, rating) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [elementId]: rating,
    }));
  };
  
  const handleSendRating = (elementId) => {
    if (!responses[elementId]) {
      alert('Please select a rating before sending!');
      return;
    }
  
    // Save the rating response to the backend
    saveResponse(elementId, responses[elementId]);
  
    // Add the current rating to history
    setHistory((prevHistory) => [
      ...prevHistory,
      { type: 'input', response: `Rating: ${responses[elementId]}` },
    ]);
  
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
  
  const renderRating = (element, index) => (
    <div key={index} className={styles.ratingDiv}>
      {/* Rating Buttons */}
      <div className={styles.ratingScale}>
        {Array.from(
          { length: element.range[1] - element.range[0] + 1 },
          (_, i) => element.range[0] + i
        ).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleRatingSelection(index, num)}
            className={styles.ratingScaleButtons}
            style={{
              backgroundColor: responses[index] === num ? '#fd9c1e' : '#1A5FFF',
            }}
          >
            {num}
          </button>
        ))}
      </div>
      {/* Send Button */}
      <button
        type="button"
        onClick={() => handleSendRating(index)}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#1d50f7',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        <IoSend className={styles.sendIcon}/>
      </button>
    </div>
  );


  
  
  return (
    <div className={styles.formbotContainer}>
      {formData && Array.isArray(formData.content) && formData.content.length > 0 ? (
        <div className={styles.formWrapper}>
          {/* <h2>{formData.name || 'Untitled Form'}</h2> */}

          {/* Render the history elements */}
          {history.map((historyItem, index) => {
            if (historyItem.type === 'input') {
              return (
                <div key={index} className={styles.inputWrapper}>
                  <span className={styles.inputResponce}>{historyItem.response}</span>
                </div>
              );
            }
            if (historyItem.type === 'bubble') {
              return (
                <div key={index} className={styles.bubble}>
                  <img id={styles.botProfile} src="../assets/formBot.png" alt="" />
                  <span className={styles.bubbleDialogue}>{historyItem.response}</span>
                </div>
              );
            }else if (historyItem.type === 'image') {
              return (
                <div key={index} className={styles.imageHistory}>
                  <img src={historyItem.content} alt="History Image" className={styles.image} />
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








