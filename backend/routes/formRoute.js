import express from "express";
import { savePrototypeForm, saveFilledForm, getFilledForms, getPrototype, saveResponse } from "../controllers/formController.js";
import { protect } from "../middleware/authMiddleware.js";


const formRouter = express.Router();

/**
 * @route   POST /api/forms/prototype
 * @desc    Save a prototype form
 * @access  Private
 */
// formRouter.put("/prototype/:formid", protect, savePrototypeForm);
formRouter.post("/prototype/:formid", protect, savePrototypeForm);

/**
 * @route   POST /api/forms/filled
 * @desc    Save a filled form
 * @access  Private
 */
formRouter.post("/filled", protect, saveFilledForm);

/**
 * @route   GET /api/forms/:prototypeFormId/filled
 * @desc    Get all filled forms for a prototype form
 * @access  Private
 */
formRouter.get("/:prototypeFormId/filled", protect, getFilledForms);

formRouter.get('/:id',getPrototype)

formRouter.post('/:formId/responses',saveResponse)


export default formRouter;
