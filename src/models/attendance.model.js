import mongoose from 'mongoose';
import { ATTENDANCE_STATUS } from '../constants/index.js';

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Attendance must belong to a user (Student/Employee)']
    },
    qrSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRSession',
      required: [true, 'Attendance must belong to a QR session']
    },
    attendanceStatus: {
      type: String,
      enum: {
        values: Object.values(ATTENDANCE_STATUS),
        message: 'Invalid attendance status. Choose from: Present, Absent, Late, Excused'
      },
      default: ATTENDANCE_STATUS.PRESENT
    },
    attendanceTime: {
      type: Date,
      default: Date.now
    },
    date: {
      type: Date,
      required: true,
      default: () => {
        // Zero-out hours to store clean calendar date
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        return d;
      }
    }
  },
  {
    timestamps: true
  }
);

// Prevent a student from marking duplicate attendance for the same QR session
attendanceSchema.index({ userId: 1, qrSessionId: 1 }, { unique: true });
// Fast lookup indices
attendanceSchema.index({ userId: 1 });
attendanceSchema.index({ qrSessionId: 1 });
attendanceSchema.index({ date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
