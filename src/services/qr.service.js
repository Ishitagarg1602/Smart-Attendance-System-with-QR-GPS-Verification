import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import qrSessionRepository from '../repositories/qrSession.repository.js';
import AppError from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/index.js';

class QRService {
  async createSession(sessionData, creatorId) {
    const { sessionName, subject, expiryMinutes = 5 } = sessionData;
    
    // Generate unique session token to prevent replay attacks
    const qrToken = uuidv4();
    
    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + Number(expiryMinutes));

    // Create session in the database
    const session = await qrSessionRepository.create({
      sessionName,
      subject,
      createdBy: creatorId,
      qrToken,
      expiresAt,
      isActive: true
    });

    // Create secure signed payload for QR content
    // Prevents students from tampering or generating their own tokens
    const qrPayload = {
      sessionId: session._id,
      qrToken: session.qrToken,
      expiresAt: session.expiresAt.getTime(),
      timestamp: Date.now()
    };

    const qrSecret = process.env.QR_SECRET || 'qr_data_encryption_secret_phrase';
    const signedQRData = jwt.sign(qrPayload, qrSecret);

    // Generate Base64 image representation of the signed token
    const qrImage = await QRCode.toDataURL(signedQRData);

    return {
      session,
      qrData: signedQRData,
      qrImage
    };
  }

  async getSessionById(id) {
    const session = await qrSessionRepository.findById(id);
    if (!session) {
      throw new AppError('QR Session not found', HTTP_STATUS.NOT_FOUND);
    }
    return session;
  }

  async getActiveSessions() {
    return await qrSessionRepository.findActive();
  }

  async terminateSession(id, userId, userRole) {
    const session = await qrSessionRepository.findById(id);
    if (!session) {
      throw new AppError('QR Session not found', HTTP_STATUS.NOT_FOUND);
    }

    // Verify ownership (Only the creator or Admin can delete/terminate the session)
    if (session.createdBy._id.toString() !== userId.toString() && userRole !== 'Admin') {
      throw new AppError('You are not authorized to terminate this session', HTTP_STATUS.FORBIDDEN);
    }

    return await qrSessionRepository.updateById(id, { isActive: false });
  }

  // Helper method to decode and validate raw QR JWT data
  validateQRTokenData(signedQRData) {
    const qrSecret = process.env.QR_SECRET || 'qr_data_encryption_secret_phrase';
    try {
      return jwt.verify(signedQRData, qrSecret);
    } catch (err) {
      throw new AppError('Invalid or corrupted QR Code data', HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export default new QRService();
