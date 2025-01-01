// import fileModel from "../models/fileModel.js";

// export const saveFileOrFolder = async (req, res) => {

//   const { name, type, content, parentId } = req.body;
//   const userId = req.user?.id;
//   console.log("savefilereq.body:", req.body)
//   if (!name) {
//     return res.status(400).json({ success: false, message: "Name is required" });
//   }

//   if (!userId) {
//     return res.status(400).json({ success: false, message: "User ID is missing" });
//   }

//   if (parentId) {
//     const parentFolder = await fileModel.findById(parentId);
//     if (!parentFolder || parentFolder.type !== "folder") {
//       return res.status(400).json({ success: false, message: "Invalid parent folder ID" });
//     }
//   }

//   try {
//     // Check if a prototype form with the same name already exists
//     if (type === "file") {
//       const existingPrototype = await fileModel.findOne({ userId, name, type: "file" });

//       if (existingPrototype) {
//         // Update the existing prototype form
//         existingPrototype.content = content;
//         existingPrototype.updatedAt = new Date();
//         await existingPrototype.save();

//         return res.status(200).json({ success: true, data: { id: existingPrototype._id.toString(), form: existingPrototype } });
//       } else {
//         // Create a new prototype form if not found
//         const newPrototypeForm = await fileModel.create({
//           userId,
//           name,
//           type: "file",
//           content,
//           parentId: parentId || null,
//         });

//         return res.status(201).json({ success: true, data: { id: newPrototypeForm._id.toString(), form: newPrototypeForm } });
//       }
//     } else {
//       // For other file/folder types, proceed as usual
//       const newFileOrFolder = await fileModel.create({
//         userId,
//         name,
//         type: type || "file",
//         content: content || "",
//         parentId: parentId || null,
//       });
//       if (type == "folder") {      
//       const filter = { _id:newFileOrFolder._id.toString() };
//       const update = { parentId:newFileOrFolder._id.toString()};
//       await fileModel.findOneAndUpdate(filter, update);
//     }

//       return res.status(201).json({ success: true, data: newFileOrFolder });

//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error saving file or folder", error });
//   }
// };

// export const getFilesAndFolders = async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const filesAndFolders = await fileModel.find({ userId });

//     const filesAndFoldersFormatted = filesAndFolders.map((file) => ({
//       ...file.toObject(),
//       _id: file._id.toString(),
//       userId: file.userId.toString(),
//       parentId: file.parentId ? file.parentId.toString() : null,
//     }));

//     console.log("Formatted files and folders to be sent:", filesAndFoldersFormatted);

//     res.status(200).json({ success: true, data: filesAndFoldersFormatted });
//   } catch (error) {
//     console.error("Error fetching files and folders:", error);
//     res.status(500).json({ success: false, message: "Error fetching files and folders", error });
//   }

 
// };





import fileModel from '../models/fileModel.js';

export const saveFileOrFolder = async (req, res) => {
  const { userId, name, type, parentId } = req.body;

  // Check if name and userId are provided
  if (!userId || !name) {
    return res.status(400).json({ message: 'userId and name are required.' });
  }

  try {
    const newItem = new fileModel({
      userId,
      name,
      type,
      parentId: parentId || null, // If no parentId, set it to null (for root level)
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error saving file or folder:', error);
    res.status(500).json({ message: 'Failed to save file or folder.' });
  }
};

export const getFilesAndFolders = async (req, res) => {
  const { userId } = req.params;
  const { parentId } = req.query;

  try {
    const filesAndFolders = await fileModel.find({
      userId,
      parentId: parentId || null, // Only fetch items belonging to the current folder
    });
    res.status(200).json(filesAndFolders);
  } catch (error) {
    console.error('Error fetching files and folders:', error);
    res.status(500).json({ message: 'Failed to fetch files and folders.' });
  }
};

export const deleteFileOrFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const itemToDelete = await fileModel.findByIdAndDelete(id);
    if (!itemToDelete) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item.' });
  }
};
