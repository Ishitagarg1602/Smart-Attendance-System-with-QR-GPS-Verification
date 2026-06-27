import Attendance from '../models/attendance.model.js';
import User from '../models/user.model.js';
import QRSession from '../models/qrSession.model.js';
import { HTTP_STATUS, ATTENDANCE_STATUS, ROLES } from '../constants/index.js';

class DashboardController {
  async getDashboardStats(req, res, next) {
    try {
      // 1. Total Students
      const totalStudents = await User.countDocuments({ role: ROLES.STUDENT });

      // 2. Today's Statistics
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Aggregation for today's attendance status counts
      const todayAttendance = await Attendance.aggregate([
        { $match: { date: today } },
        {
          $group: {
            _id: '$attendanceStatus',
            count: { $sum: 1 }
          }
        }
      ]);

      const stats = {
        [ATTENDANCE_STATUS.PRESENT]: 0,
        [ATTENDANCE_STATUS.ABSENT]: 0,
        [ATTENDANCE_STATUS.LATE]: 0,
        [ATTENDANCE_STATUS.EXCUSED]: 0,
        [ATTENDANCE_STATUS.SPOOFED_REJECTED]: 0
      };

      todayAttendance.forEach(item => {
        if (stats[item._id] !== undefined) {
          stats[item._id] = item.count;
        }
      });

      // 3. Active Sessions
      const activeSessionsCount = await QRSession.countDocuments({
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      // 4. Overall Attendance Percentage (Last 30 Days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const overallStats = await Attendance.aggregate([
        { $match: { date: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: '$attendanceStatus',
            count: { $sum: 1 }
          }
        }
      ]);

      let totalRecords = 0;
      let presentRecords = 0;

      overallStats.forEach(item => {
        totalRecords += item.count;
        if (item._id === ATTENDANCE_STATUS.PRESENT || item._id === ATTENDANCE_STATUS.LATE) {
          presentRecords += item.count;
        }
      });

      const attendancePercentage = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(2) : 0;

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          totalStudents,
          activeSessionsCount,
          todayStats: stats,
          thirtyDayAttendancePercentage: Number(attendancePercentage)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceTrends(req, res, next) {
    try {
      // Aggregation for Daily Attendance over the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setUTCHours(0, 0, 0, 0);

      const trends = await Attendance.aggregate([
        { $match: { date: { $gte: sevenDaysAgo }, attendanceStatus: ATTENDANCE_STATUS.PRESENT } },
        {
          $group: {
            _id: '$date',
            presentCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: trends
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
