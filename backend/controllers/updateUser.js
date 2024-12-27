import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'

const updateUser = async (req, res) => {
  try {
    const { username, email, oldPassword, newPassword } = req.body;
    
      const user = await userModel.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update username and email
      if (username) user.username = username;
      if (email) user.email = email;
  
      // Update password if provided
      if (oldPassword && newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, message: "Old password is incorrect" });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }
  
      await user.save();
      res.json({ success: true, message: "Details updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export {updateUser}