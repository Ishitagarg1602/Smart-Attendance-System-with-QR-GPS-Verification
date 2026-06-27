import { Router } from 'express';
import qrController from '../controllers/qr.controller.js';
import protect from '../middlewares/auth.middleware.js';
import restrictTo from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { ROLES } from '../constants/index.js';
import {
  createSessionValidator,
  mongoIdValidator
} from '../validators/qr.validator.js';

const router = Router();

// All QR endpoints require authenticating
router.use(protect);

// Admin & Teacher allowed to build sessions
router.post(
  '/create-session',
  restrictTo(ROLES.ADMIN, ROLES.TEACHER),
  createSessionValidator,
  validate,
  qrController.createSession
);

// All logged-in roles can check active sessions
router.get('/active', qrController.getActiveSessions);

// Details by ID
router.get('/:id', mongoIdValidator, validate, qrController.getSession);

// Admin & Teacher (creator verified in service) can terminate sessions
router.delete('/:id', mongoIdValidator, validate, qrController.terminateSession);

export default router;
