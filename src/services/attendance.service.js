import attendanceRepository from '../repositories/attendance.repository.js';
import qrSessionRepository from '../repositories/qrSession.repository.js';
import qrService from './qr.service.js';
import AppError from '../utils/appError.js';
import { HTTP_STATUS, ATTENDANCE_STATUS } from '../constants/index.js';

class AttendanceService {
  async markStudentAttendance(signedQRData, userId) {
    // 1. Verify and decode signed QR payload
    const decoded = qrService.validateQRTokenData(signedQRData);
    const { sessionId, qrToken, expiresAt } = decoded;

    // 2. Check client-side/token expiration timestamp
    if (new Date().getTime() > expiresAt) {
      throw new AppError('QR Code has expired', HTTP_STATUS.BAD_REQUEST);
    }

    // 3. Find and validate session from Database
    const session = await qrSessionRepository.findById(sessionId);
    if (!session || !session.isActive) {
      throw new AppError('QR session is inactive or does not exist', HTTP_STATUS.NOT_FOUND);
    }

    // Verify token matches the active session token
    if (session.qrToken !== qrToken) {
      throw new AppError('Invalid QR Token signature match', HTTP_STATUS.BAD_REQUEST);
    }

    // Check DB expiration
    if (new Date() > session.expiresAt) {
      throw new AppError('QR Session has expired', HTTP_STATUS.BAD_REQUEST);
    }

    // 4. Check for duplicate attendance scans
    const existingRecord = await attendanceRepository.findByUserAndSession(userId, sessionId);
    if (existingRecord) {
      throw new AppError('Attendance has already been marked for this session', HTTP_STATUS.CONFLICT);
    }

    // 5. Determine attendance status (check if student marked right before closing window or late)
    // For Phase 1, we mark as 'Present'.
    let attendanceStatus = ATTENDANCE_STATUS.PRESENT;

    // 6. Create attendance record
    const attendance = await attendanceRepository.create({
      userId,
      qrSessionId: sessionId,
      attendanceStatus,
      attendanceTime: new Date()
    });

    return await attendanceRepository.findById(attendance._id);
  }

  async getStudentHistory(userId) {
    return await attendanceRepository.findByUserHistory(userId);
  }

  async getAttendanceRecord(id, userId, userRole) {
    const record = await attendanceRepository.findById(id);
    if (!record) {
      throw new AppError('Attendance record not found', HTTP_STATUS.NOT_FOUND);
    }

    // Access control: Students can only view their own records; Teachers/Admins/Employees can view any
    if (userRole === 'Student' && record.userId._id.toString() !== userId.toString()) {
      throw new AppError('You are not authorized to view this record', HTTP_STATUS.FORBIDDEN);
    }

    return record;
  }

  async getAllRecords(filter = {}) {
    return await attendanceRepository.findAll(filter);
  }

  async updateRecordStatus(id, newStatus) {
    // Allows Manual Override by Admin/Teacher
    const record = await attendanceRepository.findById(id);
    if (!record) {
      throw new AppError('Attendance record not found', HTTP_STATUS.NOT_FOUND);
    }
    
    // Update status
    record.attendanceStatus = newStatus;
    await record.save();
    
    return await attendanceRepository.findById(id);
  }

  async deleteRecord(id) {
    const deleted = await attendanceRepository.deleteById(id);
    if (!deleted) {
      throw new AppError('Attendance record not found', HTTP_STATUS.NOT_FOUND);
    }
    return deleted;
  }
}

export default new AttendanceService();
