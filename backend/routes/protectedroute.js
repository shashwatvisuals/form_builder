import express from "express";
import authenticate from "../middleware/protectedMiddleware.js";

const protectedRouter = express.Router();


protectedRouter.get("/", authenticate, (req, res) => {
  res.json({
    message: "Welcome to the protected route!",
    user: { id: req.user._id, username: req.user.username, email: req.user.email },
  });
});

export default protectedRouter;