import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  registerValidator,
  loginValidator,
  profileUpdateValidator
} from '../validators/auth.validator.js';

const router = Router();

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/logout', authController.logout);

// Protected routes (Requires login token)
router.use(protect);
router.get('/profile', authController.getProfile);
router.put('/profile', profileUpdateValidator, validate, authController.updateProfile);

export default router;
