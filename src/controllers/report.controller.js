import Attendance from '../models/attendance.model.js';
import { HTTP_STATUS } from '../constants/index.js';

class ReportController {
  async generateDailyReport(req, res, next) {
    try {
      const dateParam = req.query.date ? new Date(req.query.date) : new Date();
      dateParam.setUTCHours(0, 0, 0, 0);

      const records = await Attendance.find({ date: dateParam })
        .populate('userId', 'fullName email department role')
        .populate('qrSessionId', 'sessionName subject locationZone')
        .sort({ attendanceTime: -1 });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        count: records.length,
        date: dateParam,
        data: records
      });
    } catch (error) {
      next(error);
    }
  }

  async generateStudentReport(req, res, next) {
    try {
      const studentId = req.params.studentId;
      
      const records = await Attendance.find({ userId: studentId })
        .populate('qrSessionId', 'sessionName subject date')
        .sort({ date: -1 });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
