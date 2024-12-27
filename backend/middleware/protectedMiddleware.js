import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authenticate = async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }
  
      req.user = user; // Attach the user data to the request
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };

  export default authenticate;