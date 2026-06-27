import { body, param } from 'express-validator';
import { ATTENDANCE_STATUS } from '../constants/index.js';

export const markAttendanceValidator = [
  body('qrToken')
    .trim()
    .notEmpty()
    .withMessage('QR Token is required to verify and mark attendance'),
    
  body('attendanceStatus')
    .optional()
    .isIn(Object.values(ATTENDANCE_STATUS))
    .withMessage(`Attendance status must be one of: ${Object.values(ATTENDANCE_STATUS).join(', ')}`)
];

export const updateAttendanceValidator = [
  body('attendanceStatus')
    .notEmpty()
    .withMessage('Attendance status is required')
    .isIn(Object.values(ATTENDANCE_STATUS))
    .withMessage(`Attendance status must be one of: ${Object.values(ATTENDANCE_STATUS).join(', ')}`)
];
