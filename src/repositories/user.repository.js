import User from '../models/user.model.js';

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email, isActive: true });
  }

  async findByEmailWithPassword(email) {
    return await User.findOne({ email, isActive: true }).select('+password');
  }

  async findById(id) {
    return await User.findOne({ _id: id, isActive: true });
  }

  async findByIdWithPassword(id) {
    return await User.findOne({ _id: id, isActive: true }).select('+password');
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteById(id) {
    // Soft delete support by flipping isActive
    return await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

export default new UserRepository();
