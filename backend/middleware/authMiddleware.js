import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token ;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error("Token verification failed:",error);
      res.status(401).json({ success: false, message: 'Not authorized' });
    }
  }else {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

};

export { protect };
