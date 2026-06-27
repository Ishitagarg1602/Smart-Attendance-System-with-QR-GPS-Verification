import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
// Dashboard access limited to Admin and Teacher
router.use(authorize('Admin', 'Teacher'));

router.get('/stats', dashboardController.getDashboardStats);
router.get('/trends', dashboardController.getAttendanceTrends);

export default router;
