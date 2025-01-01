// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import styles from "./pagesModuleCSS/Response.module.css";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";

// function Response() {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const [viewCount, setViewCount] = useState(0);
//   const [startCount, setStartCount] = useState(0);
//   const [submittedCount, setSubmittedCount] = useState(0);
//   const [responses, setResponses] = useState([]);
//   const [formElements, setFormElements] = useState([]);
//   const [formName, setFormName] = useState("");
//   const [error, setError] = useState("");
//   const location = useLocation();
//   const { fileId } = location.state || {};
//   let serialNumber = 1;

//   // Fetch Form Metadata (Structure)
//   useEffect(() => {
//     const fetchFormData = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await axios.get(`${backendURL}/api/forms/${fileId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const formData = response.data;
//         setFormName(formData.data.name);
//         setFormElements(formData.data.content.filter((el) => el.type === "input"));
//       } catch (error) {
//         console.error("Error fetching form data:", error);
//         setError("An error occurred while fetching form data.");
//       }
//     };
//     if (fileId) {
//       fetchFormData();
//     }
//   }, [fileId, backendURL]);

//   // Fetch Stats and Filled Responses
//   useEffect(() => {
//     const fetchStatsAndResponses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No token found in localStorage.");
//           return;
//         }

//         const [viewRes, startRes, submittedRes, filledRes] = await Promise.all([
//           axios.get(`${backendURL}/api/stats/${fileId}/view-count`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${backendURL}/api/stats/${fileId}/start-count`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${backendURL}/api/stats/${fileId}/form-submitted-count`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${backendURL}/api/forms/${fileId}/filled`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setViewCount(viewRes.data.data);
//         setStartCount(startRes.data.data);
//         setSubmittedCount(submittedRes.data.data);
//         setResponses(filledRes.data.data);
//       } catch (err) {
//         console.error("Error fetching data:", err.response || err.message);
//         setError("An error occurred while fetching data.");
//       }
//     };
//     if (fileId) {
//       fetchStatsAndResponses();
//     }
//   }, [fileId, backendURL]);

//   const calculateCompletionRate = () => {
//     if (!startCount || !submittedCount) return 0;
//     return ((submittedCount / startCount) * 100).toFixed(2);
//   };

//   return (
// <div className={styles.mainDiv}>
//   <div className={styles.navbar}>

//   </div>
  
//   <div className={styles.stats}>
//     <div className={styles.stat}>
//       <p>Views</p>
//       <span>{viewCount || "Loading..."}</span>
//     </div>
//     <div className={styles.stat}>
//       <p>Starts</p>
//       <span>{startCount || "Loading..."}</span>
//     </div>
//   </div>

//   <div className={styles.responsDivMain}>
//     <div className={styles.tableWrapper}> 
//       <table className={styles.responsesTable}>
//         <thead>
//           <tr className={styles.headingRow}>
//             <th>S/N</th>
//             <th>Submitted at</th>
//             {formElements.map((el) => (
//               <th key={el.id}>
//                 <span>{el.inputType}</span>
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {responses.length > 0 ? (
//             responses.map((response, index) => {
//               console.log(`Processing response ${index}:`, response);
//               const validResponses = response.responses.filter((resp) => resp.response);

             
//               const missingColumns = formElements.length - validResponses.length;

//               return (
//                 <tr key={index} className={styles.responsesRow}>
//                   <td className={styles.serialNumber}>{serialNumber++}</td>
//                   <td className={styles.boxDiv}>
//                     {validResponses.some((resp) => resp.response && resp.response.includes("GMT+5:30")) ? (
//                       (() => {
//                         const dateResponse = validResponses.find((resp) => resp.response && resp.response.includes("GMT+5:30"));
//                         console.log("Found Date Response:", dateResponse);
//                         if (dateResponse) {
//                           const dateTime = dateResponse.response.split(" GMT")[0];
//                           return dateTime;
//                         }
//                         return "N/A";
//                       })()
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>

//                   {validResponses.map((resp, idx) => (
//                     !resp.response.includes("GMT+5:30") && (
//                       <td key={idx} className={styles.boxDiv}>
//                         {resp.response}
//                       </td>
//                     )
//                   ))}

                  
//                   {Array.from({ length: missingColumns }).map((_, idx) => (
//                     <td key={`empty-${idx}`} className={styles.boxDiv}>&nbsp;</td>
//                   ))}
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan={formElements.length + 2}>No responses available.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>

//   <div className={styles.CompletionStatsMain}>
//     <div className={styles.circularProgressBar} style={{ width: 300, height: 300 }}>
//       <CircularProgressbar
//         value={calculateCompletionRate()}
//         text={`Completed: ${submittedCount}`}
        
//         styles={buildStyles({
//           textSize: "8px",
//           pathColor: "#1377ea",
//           textColor: "#000",
//         })}
//       />
//     </div>
//     <div className={styles.completionRateDiv}>
//       <p>Completion Rate</p>
//       <span>{calculateCompletionRate()}%</span>
//     </div>
//   </div>
// </div>



//   );
// }

// export default Response;











// Response.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./pagesModuleCSS/Response.module.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Header from "../components/Header";

function Response() {
   const frontendURL = import.meta.env.VITE_FRONTEND_URL;
   const [theme, setTheme] = useState("light");
   const [formId, setFormId] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [viewCount, setViewCount] = useState(0);
  const [startCount, setStartCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [responses, setResponses] = useState([]);
  const [formElements, setFormElements] = useState([]);
  const [formName, setFormName] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const { fileId } = location.state || {};
  let serialNumber = 1;
  const navigate = useNavigate();

  // Fetch Form Metadata (Structure)
  useEffect(() => {
    const fetchFormData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${backendURL}/api/forms/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formData = response.data;
        setFormName(formData.data.name);
        setFormElements(formData.data.content.filter((el) => el.type === "input"));
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError("An error occurred while fetching form data.");
      }
    };
    if (fileId) {
      fetchFormData();
    }
  }, [fileId, backendURL]);

  // Fetch Stats and Filled Responses
  useEffect(() => {
    const fetchStatsAndResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const [viewRes, startRes, submittedRes, filledRes] = await Promise.all([
          axios.get(`${backendURL}/api/stats/${fileId}/view-count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/stats/${fileId}/start-count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/stats/${fileId}/form-submitted-count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/forms/${fileId}/filled`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setViewCount(viewRes.data.data);
        setStartCount(startRes.data.data);
        setSubmittedCount(submittedRes.data.data);
        setResponses(filledRes.data.data);
      } catch (err) {
        console.error("Error fetching data:", err.response || err.message);
        setError("An error occurred while fetching data.");
      }
    };
    if (fileId) {
      fetchStatsAndResponses();
    }
  }, [fileId, backendURL]);

  const calculateCompletionRate = () => {
    if (!startCount || !submittedCount) return 0;
    return ((submittedCount / startCount) * 100).toFixed(2);
  };

  return (
    <div className={styles.mainDiv}>
      <Header
        fileId={fileId}
        theme={theme}
        setTheme={setTheme}
        formName={formName}
        navigate={navigate}
        setFormName={setFormName}
        formElements={formElements}
        setFormElements={setFormElements}
        frontendURL={frontendURL}
        backendURL={backendURL}
      />
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <p>Views</p>
          <span>{viewCount || "Loading..."}</span>
        </div>
        <div className={styles.stat}>
          <p>Starts</p>
          <span>{startCount || "Loading..."}</span>
        </div>
      </div>

      <div className={styles.responsDivMain}>
        <div className={styles.tableWrapper}>
          <table className={styles.responsesTable}>
            <thead>
              <tr className={styles.headingRow}>
                <th>S/N</th>
                <th>Submitted at</th>
                {formElements.map((el) => (
                  <th key={el.id}>
                    <span>{el.inputType}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.length > 0 ? (
                responses.map((response, index) => {
                  const validResponses = response.responses.filter((resp) => resp.response);
                  const missingColumns = formElements.length - validResponses.length;

                  return (
                    <tr key={index} className={styles.responsesRow}>
                      <td className={styles.serialNumber}>{serialNumber++}</td>
                      <td className={styles.boxDiv}>
                        {validResponses.some((resp) => resp.response && resp.response.includes("GMT+5:30")) ? (
                          (() => {
                            const dateResponse = validResponses.find((resp) => resp.response && resp.response.includes("GMT+5:30"));
                            if (dateResponse) {
                              const dateTime = dateResponse.response.split(" GMT")[0];
                              return dateTime;
                            }
                            return "N/A";
                          })()
                        ) : (
                          "N/A"
                        )}
                      </td>

                      {validResponses.map((resp, idx) => (
                        !resp.response.includes("GMT+5:30") && (
                          <td key={idx} className={styles.boxDiv}>
                            {resp.response}
                          </td>
                        )
                      ))}
                      
                      {Array.from({ length: missingColumns }).map((_, idx) => (
                        <td key={`empty-${idx}`} className={styles.boxDiv}>&nbsp;</td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={formElements.length + 2}>No responses available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.CompletionStatsMain}>
        <div className={styles.circularProgressBar} style={{ width: 300, height: 300 }}>
          <CircularProgressbar
            value={calculateCompletionRate()}
            text={`Completed: ${submittedCount}`}
            styles={buildStyles({
              textSize: "8px",
              pathColor: "#1377ea",
              textColor: "#000",
            })}
          />
        </div>
        <div className={styles.completionRateDiv}>
          <p>Completion Rate</p>
          <span>{calculateCompletionRate()}%</span>
        </div>
      </div>
    </div>
  );
}

export default Response;





