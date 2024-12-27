import express from 'express';
import { saveFileOrFolder, getFilesAndFolders} from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/files/save
 * @desc    Save a new file or folder
 * @access  Private
 */
router.post('/save', protect, saveFileOrFolder);

/**
 * @route   GET /api/files/:userId/files
 * @desc    Get all files and folders for a user
 * @access  Private
 */
router.get('/:userId/files', protect, getFilesAndFolders);

export default router;




