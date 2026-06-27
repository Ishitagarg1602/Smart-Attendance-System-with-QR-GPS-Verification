import authService from '../services/auth.service.js';
import { HTTP_STATUS } from '../constants/index.js';

class AuthController {
  async register(req, res, next) {
    try {
      const { user, token } = await authService.registerUser(req.body);
      
      // Set secure cookie if desired
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hour
      });

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.loginUser(email, password);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hour
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // Clear cookie client token
      res.clearCookie('jwt');
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Logged out successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      // req.user has already been populated by protect middleware
      const profile = await authService.getProfile(req.user._id);
      
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'User profile fetched successfully',
        data: { user: profile }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updated = await authService.updateProfile(req.user._id, req.body);
      
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updated }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
