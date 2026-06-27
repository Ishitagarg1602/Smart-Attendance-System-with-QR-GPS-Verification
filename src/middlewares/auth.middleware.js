import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/index.js';

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from Authorization header or Cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', HTTP_STATUS.UNAUTHORIZED));
    }

    // 2. Verify token signature
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_sign_key_123456_change_in_production';
    const decoded = jwt.verify(token, secret);

    // 3. Check if user still exists
    const currentUser = await userRepository.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', HTTP_STATUS.UNAUTHORIZED));
    }

    // 4. Mount user to request context
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
