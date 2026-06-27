import mongoose from 'mongoose';

const qrSessionSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      required: [true, 'Please provide a session name'],
      trim: true,
      maxLength: [100, 'Session name cannot exceed 100 characters']
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Session must have an associated creator (Teacher/Admin)']
    },
    qrToken: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: [true, 'Session must have an expiry time']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
qrSessionSchema.index({ createdBy: 1 });
qrSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-expire from DB index after expiresAt

const QRSession = mongoose.model('QRSession', qrSessionSchema);

export default QRSession;
