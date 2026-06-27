import { Router } from 'express';
import attendanceController from '../controllers/attendance.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import restrictTo from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { ROLES } from '../constants/index.js';
import {
  markAttendanceValidator,
  updateAttendanceValidator
} from '../validators/attendance.validator.js';
import { mongoIdValidator } from '../validators/qr.validator.js';

const router = Router();

// Require login for all routes
router.use(protect);

// Student/Employee scans QR to mark presence
router.post(
  '/mark',
  restrictTo(ROLES.STUDENT, ROLES.EMPLOYEE),
  markAttendanceValidator,
  validate,
  attendanceController.markAttendance
);

// Student/Employee views their personal logs
router.get(
  '/history',
  restrictTo(ROLES.STUDENT, ROLES.EMPLOYEE),
  attendanceController.getMyHistory
);

// Admin/Teacher can view all logs
router.get(
  '/all',
  restrictTo(ROLES.ADMIN, ROLES.TEACHER),
  attendanceController.getAllRecords
);

// Fetch specific attendance details
router.get('/:id', mongoIdValidator, validate, attendanceController.getRecord);

// Admin/Teacher manual status overrides
router.put(
  '/:id',
  restrictTo(ROLES.ADMIN, ROLES.TEACHER),
  mongoIdValidator,
  updateAttendanceValidator,
  validate,
  attendanceController.updateRecordStatus
);

// Admin only can delete logs
router.delete(
  '/:id',
  restrictTo(ROLES.ADMIN),
  mongoIdValidator,
  validate,
  attendanceController.deleteRecord
);

export default router;
