import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator"

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  };


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.json({ success: false, message: "User does not exist" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid Credentials" });
      }
  
      // Create the token
      const token = createToken(user._id);
  
      // Return the token and user name
      res.json({
        success: true,
        token,
        user: {
          userId: user._id,
          username: user.username, // Add user name to the response
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  };
  




  // const getUserDetails = async (req, res) => {
  //   try {
  //     const user = await userModel.findById(req.user.id).select('-password'); // Exclude password from response
  //     if (!user) {
  //       return res.status(404).json({ success: false, message: 'User not found' });
  //     }
  //     res.json({ success: true, user });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ success: false, message: 'Server error' });
  //   }
  // };

  const getUserDetails = async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id).select('-password'); // Exclude password from response
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      // Include the user id explicitly in the response, even though it's part of the user object by default
      const userDetails = {
        _id: user._id,  // Explicitly include the user id
        username: user.username,
        email: user.email,
        // Add any other fields you want to include in the response
      };
      console.log('User Details:', userDetails);
      res.json({ success: true, user: userDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  














 


//register user
const registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    console.log(req.body); 
    try {
        //checking is user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User Already exists"})
        }
        //validating email format & string password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "please enter valid email"})
        }

        if (password.length<8) {
            return res.json({success:false, message:"please enter a strong password"})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const newUser = new userModel({
            username:username,
            email:email,
            password: hashedPassword,
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({
          success:true, 
          token,
          user: {
            username: user.username,
            email: user.email,
        },
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

export {loginUser,registerUser, getUserDetails }
