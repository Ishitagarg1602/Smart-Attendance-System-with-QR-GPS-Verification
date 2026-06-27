import attendanceService from '../services/attendance.service.js';
import { HTTP_STATUS } from '../constants/index.js';

class AttendanceController {
  async markAttendance(req, res, next) {
    try {
      const { qrToken, latitude, longitude } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'GPS coordinates are required' });
      }

      const record = await attendanceService.markStudentAttendance(qrToken, req.user._id, latitude, longitude);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Attendance marked successfully',
        data: { record }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyHistory(req, res, next) {
    try {
      const history = await attendanceService.getStudentHistory(req.user._id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Personal attendance history retrieved',
        data: { history }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecord(req, res, next) {
    try {
      const record = await attendanceService.getAttendanceRecord(
        req.params.id,
        req.user._id,
        req.user.role
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Attendance record details retrieved',
        data: { record }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRecords(req, res, next) {
    try {
      // Allow filtering by studentId, session, date, department, etc.
      const filter = {};
      if (req.query.userId) filter.userId = req.query.userId;
      if (req.query.qrSessionId) filter.qrSessionId = req.query.qrSessionId;
      if (req.query.attendanceStatus) filter.attendanceStatus = req.query.attendanceStatus;
      
      if (req.query.date) {
        const queryDate = new Date(req.query.date);
        queryDate.setUTCHours(0, 0, 0, 0);
        filter.date = queryDate;
      }

      const records = await attendanceService.getAllRecords(filter);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'All attendance records retrieved',
        results: records.length,
        data: { records }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRecordStatus(req, res, next) {
    try {
      const { attendanceStatus } = req.body;
      const updated = await attendanceService.updateRecordStatus(req.params.id, attendanceStatus);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Attendance record status updated successfully',
        data: { record: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRecord(req, res, next) {
    try {
      await attendanceService.deleteRecord(req.params.id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Attendance record deleted successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();
