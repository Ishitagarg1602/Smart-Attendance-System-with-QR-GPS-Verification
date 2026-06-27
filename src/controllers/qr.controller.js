import qrService from '../services/qr.service.js';
import { HTTP_STATUS } from '../constants/index.js';

class QRController {
  async createSession(req, res, next) {
    try {
      const { session, qrData, qrImage } = await qrService.createSession(req.body, req.user._id);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'QR Attendance Session created successfully',
        data: {
          session,
          qrData,
          qrImage
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getSession(req, res, next) {
    try {
      const session = await qrService.getSessionById(req.params.id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'QR Session details retrieved successfully',
        data: { session }
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveSessions(req, res, next) {
    try {
      const sessions = await qrService.getActiveSessions();

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Active QR Sessions retrieved successfully',
        data: { sessions }
      });
    } catch (error) {
      next(error);
    }
  }

  async terminateSession(req, res, next) {
    try {
      const terminated = await qrService.terminateSession(
        req.params.id,
        req.user._id,
        req.user.role
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'QR Session terminated successfully',
        data: { session: terminated }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new QRController();
