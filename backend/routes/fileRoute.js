// import express from 'express';
// import { saveFileOrFolder, getFilesAndFolders} from '../controllers/fileController.js';
// import { getPrototype } from '../controllers/formController.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();


// router.post('/save', protect, saveFileOrFolder);

// router.get('/:userId/files', protect, getFilesAndFolders);
// router.get('/:id',getPrototype)

// export default router;


/**
 * @route   POST /api/files/save
 * @desc    Save a new file or folder
 * @access  Private
 */

import express from 'express';
import { saveFileOrFolder, getFilesAndFolders, deleteFileOrFolder } from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', protect, saveFileOrFolder);
router.get('/:userId/files', protect, getFilesAndFolders);
router.delete('/:id', protect, deleteFileOrFolder);

export default router;
