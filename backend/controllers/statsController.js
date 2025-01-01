import filledFormModel from "../models/filledFormModel.js";

export const getViewCount = async (req, res) => {
    const { formId } = req.params;
  
    try {
      if (!formId) {
        return res.status(400).json({ success: false, message: "Form ID is required" });
      }
  
      // Count documents matching the formId
      const viewCount = await filledFormModel.countDocuments({ formId });
  
      res.status(200).json({ success: true, data: viewCount });
    } catch (error) {
      console.error('Error getting view count:', error);
      res.status(500).json({ success: false, message: 'Error getting view count', error: error.message });
    }
  };
  
  
  
  
  export const getStartCount = async (req, res) => {
    const { formId } = req.params;

    try {
        // Perform aggregation to get the count of sessions that have at least one response
        const startCount = await filledFormModel.aggregate([
            { 
                $match: { 
                    formId: formId, // Match documents for the specific formId
                    "responses.0": { $exists: true } // Ensure there's a response at index 0
                }
            },
            {
                $group: {
                    _id: "$sessionId", // Group by sessionId to get distinct sessions
                    count: { $sum: 1 } // Count the number of sessions
                }
            }
        ]);

        // If startCount is found, extract the count value, else set to 0
        const startCountValue = startCount.length > 0 ? startCount.length : 0; // Count the number of sessions

        res.status(200).json({ success: true, data: startCountValue });
    } catch (error) {
        console.error('Error getting start count:', error);
        res.status(500).json({ success: false, message: 'Error getting start count', error });
    }
};





  export const incrementView = async (req, res) => {
    const { formId } = req.params;
    const { sessionId } = req.body; // Expecting sessionId from the frontend
  
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }
  
    try {
      // Check if this session has already been recorded for a view
      const existingEntry = await filledFormModel.findOne({ formId, sessionId });
      if (!existingEntry) {
        // Create a new entry with an empty responses array for tracking the session
        await filledFormModel.create({
          formId,
          sessionId,
          responses: [],
        });
      }
  
      res.status(200).json({ message: 'View count incremented successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  export const getFormSubmittedCount = async (req, res) => {
    const { formId } = req.params;
  
    try {
      // Perform aggregation to count sessions with a valid date-time in the last response
      const formSubmittedCount = await filledFormModel.aggregate([
        {
          $match: {
            formId: formId, // Match documents for the specific formId
            "responses.0": { $exists: true } // Ensure there's at least one response
          }
        },
        {
          $project: {
            sessionId: 1,
            responses: 1,
            lastResponse: { $arrayElemAt: ["$responses", -1] } // Get the last response
          }
        },
        {
          $addFields: {
            isDateTimeValid: {
              $regexMatch: {
                input: { $ifNull: ["$lastResponse.response", ""] },
                regex: /^(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM) GMT[+-]\d{1,2}:\d{2})$/ // Regex for date and time format
              }
            }
          }
        },
        {
          $match: {
            isDateTimeValid: true // Only include entries with valid date-time
          }
        },
        {
          $group: {
            _id: "$sessionId", // Group by sessionId
            count: { $sum: 1 } // Count the sessions
          }
        }
      ]);
  
      // Log the result of aggregation for debugging
      console.log("Debugging Aggregation Result:", formSubmittedCount);
  
      // Count the distinct sessions that are considered "submitted"
      const formSubmittedCountValue = formSubmittedCount.length;
  
      res.status(200).json({ success: true, data: formSubmittedCountValue });
    } catch (error) {
      console.error("Error getting form submitted count:", error);
      res.status(500).json({ success: false, message: "Error getting form submitted count", error });
    }
  };
  