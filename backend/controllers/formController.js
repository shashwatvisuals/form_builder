import fileModel from "../models/fileModel.js";
import filledFormModel from "../models/filledFormModel.js";


export const savePrototypeForm = async (req, res) => {
  const userId = req.user?.id;
  const { name, content } = req.body;
  console.log("req.body:", req.body)

  if (!userId || !name || !content) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    // Check if a prototype form with the same name already exists
    const existingPrototype = await fileModel.findOne({ userId, name, type: "file" });

    if (existingPrototype) {
      // Update the existing prototype form
      existingPrototype.content = content;
      existingPrototype.updatedAt = new Date();
      await existingPrototype.save();

      return res.status(200).json({ success: true, data: { id: existingPrototype._id.toString(), form: existingPrototype } });
    } else {
      // Create a new prototype form if not found
      const newPrototypeForm = await fileModel.create({
        userId,
        name,
        type: "file",
        content,
      });

      return res.status(201).json({ success: true, data: { id: newPrototypeForm._id.toString(), form: newPrototypeForm } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving prototype form", error });
  }
};



export const saveFilledForm = async (req, res) => {
  const { prototypeFormId, formData } = req.body;
  const userId = req.user?.id;

  if (!prototypeFormId || !userId || !formData) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    const newFilledForm = await filledFormModel.create({
      prototypeFormId,
      userId,
      formData,
    });

    res.status(201).json({ success: true, data: newFilledForm });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving filled form", error });
  }
};

export const getFilledForms = async (req, res) => {
  const { prototypeFormId } = req.params;

  try {
    const filledForms = await filledFormModel.find({ prototypeFormId });

    res.status(200).json({ success: true, data: filledForms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching filled forms", error });
  }
};

export const getPrototype = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await fileModel.findById(id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching form", error });
  }
};

// export const saveResponse = async (req, res) => {
//   const { response } = req.body;
  
//   const { formId } = req.params;
//   const elementId = formId
//   console.log('Received formId:', req.params); 
//   console.log('Received req.body:', req.body); 
//   console.log('Received elementId:', elementId); 
//   console.log('Received response:', response);

//   if (elementId === undefined || !response) {
//     console.error("Missing required fields:", { elementId, response });
//     return res.status(400).json({ success: false, message: "Missing required fields" });
//   }

//   try {
//     console.log("Attempting to save response...");
//     let userResponse = await filledFormModel.findOne({ formId});

//     if (!userResponse) {

//       userResponse = new filledFormModel({ formId, responses: [] });
//     }

//     userResponse.responses.push({ elementId, response });
//     await userResponse.save();

//     res.status(200).json({ success: true, message: "Response saved successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error saving response", error });
//   }
// };


export const saveResponse = async (req, res) => {
  const { response, sessionId } = req.body; // Added sessionId and elementId
  const { formId } = req.params;
  const elementId = formId

  console.log("Received formId:", formId);
  console.log("Received sessionId:", sessionId);
  console.log("Received elementId:", elementId);
  console.log("Received response:", response);

  // Validate required fields
  if (!sessionId || !elementId || !response) {
    console.error("Missing required fields:", { sessionId, elementId, response });
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    console.log("Attempting to save response...");

    // Check if a document exists for this form and sessionId
    let userResponse = await filledFormModel.findOne({ formId, sessionId });

    if (!userResponse) {
      // If no document exists for this formId and sessionId, create a new one
      userResponse = new filledFormModel({
        formId,
        sessionId,
        responses: [], // Initialize responses array
      });
    }

    // Append the new response to the responses array
    userResponse.responses.push({ elementId, response });

    // Save the updated document
    await userResponse.save();

    res.status(200).json({ success: true, message: "Response saved successfully" });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ success: false, message: "Error saving response", error });
  }
};


