import Attendance from '../models/attendance.model.js';

class AttendanceRepository {
  async create(attendanceData) {
    return await Attendance.create(attendanceData);
  }

  async findById(id) {
    return await Attendance.findById(id)
      .populate('userId', 'fullName email role department course semester studentId employeeId')
      .populate('qrSessionId', 'sessionName subject createdBy');
  }

  async findByUserAndSession(userId, qrSessionId) {
    return await Attendance.findOne({ userId, qrSessionId });
  }

  async findByUserHistory(userId) {
    return await Attendance.find({ userId })
      .populate('qrSessionId', 'sessionName subject createdBy expiresAt')
      .sort({ attendanceTime: -1 });
  }

  async findAll(filter = {}) {
    return await Attendance.find(filter)
      .populate('userId', 'fullName email role department course semester studentId employeeId')
      .populate('qrSessionId', 'sessionName subject createdBy')
      .sort({ attendanceTime: -1 });
  }

  async deleteById(id) {
    return await Attendance.findByIdAndDelete(id);
  }
}

export default new AttendanceRepository();
