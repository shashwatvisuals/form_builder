import express from 'express';
import { loginUser,registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getUserDetails } from '../controllers/userController.js';
import { updateUser } from '../controllers/updateUser.js';

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get('/profile', protect, getUserDetails);
userRouter.post("/updateuser", protect, updateUser);


export default userRouter;