import fileModel from "../models/fileModel.js";
import userModel from "../models/userModel.js";

export const saveFileOrFolder = async (req, res) => {
  const { name, type, content, parentId } = req.body;

  // Check if the name is provided
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }


  const userId = req.user?.id || req.body.userId; // Adjust based on your auth middleware

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  try {
    // Create a new file or folder
    const newFileOrFolder = await fileModel.create({
      userId,          // Save under the user's ID
      name,            // Name is required
      type: type || 'file', // Default to 'file' if type is not provided
      content: content || '', // Default content to an empty string
      parentId: parentId || null, // Default parentId to null if not provided
    });

    res.status(201).json(newFileOrFolder);
  } catch (error) {
    res.status(500).json({ message: 'Error saving file or folder', error });
  }
};


export const getFilesAndFolders = async (req, res) => {
  const userId = req.user._id.toString(); // Ensure userId is correctly obtained

  try {
    const filesAndFolders = await fileModel.find({ userId });

    // Convert ObjectId to string for better frontend handling
    const filesAndFoldersFormatted = filesAndFolders.map(file => ({
      ...file.toObject(),
      _id: file._id.toString(),
      userId: file.userId.toString(),
    }));

    res.status(200).json({ files: filesAndFoldersFormatted });
  } catch (error) {
    console.error('Error fetching files and folders:', error);
    res.status(500).json({ message: 'Error fetching files and folders', error });
  }
};

