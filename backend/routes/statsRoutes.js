import express from "express";
const router = express.Router();
import { incrementView, getViewCount, getStartCount, getFormSubmittedCount} from '../controllers/statsController.js';

router.use(express.json());
// Route for view count
router.get('/:formId/view-count', getViewCount);

// // Route for start count
router.get('/:formId/start-count', getStartCount);

router.get('/:formId/form-submitted-count', getFormSubmittedCount);

router.post('/:formId/view',incrementView);



export default router;

// router.post('/:formId/start',incrementStartCount);