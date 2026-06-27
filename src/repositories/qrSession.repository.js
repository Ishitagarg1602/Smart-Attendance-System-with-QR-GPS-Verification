import QRSession from '../models/qrSession.model.js';

class QRSessionRepository {
  async create(sessionData) {
    return await QRSession.create(sessionData);
  }

  async findById(id) {
    return await QRSession.findById(id).populate('createdBy', 'fullName email role department');
  }

  async findActiveByToken(qrToken) {
    return await QRSession.findOne({
      qrToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
  }

  async findActive() {
    return await QRSession.find({
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('createdBy', 'fullName email department');
  }

  async updateById(id, updateData) {
    return await QRSession.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteById(id) {
    // Hard delete or soft deactivate
    return await QRSession.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

export default new QRSessionRepository();
