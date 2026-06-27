import express from 'express';
import reportController from '../controllers/report.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
// Reports access limited to Admin and Teacher
router.use(authorize('Admin', 'Teacher'));

router.get('/daily', reportController.generateDailyReport);
router.get('/student/:studentId', reportController.generateStudentReport);

export default router;
