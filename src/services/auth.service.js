import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/index.js';

class AuthService {
  generateToken(user) {
    const payload = {
      id: user._id,
      role: user.role,
      email: user.email
    };

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_sign_key_123456_change_in_production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign(payload, secret, { expiresIn });
  }

  async registerUser(userData) {
    const { email } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('A user with this email address already exists', HTTP_STATUS.CONFLICT);
    }

    // Create user in DB
    const user = await userRepository.create(userData);
    
    // Hide password before returning
    user.password = undefined;

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async loginUser(email, password) {
    // Find user and explicitly select password field
    const user = await userRepository.findByEmailWithPassword(email);
    
    if (!user) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    // Hide password
    user.password = undefined;

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async updateProfile(userId, profileData) {
    // Make sure fields like email, role, studentId, employeeId are NOT modified directly via profile update
    const sanitisedUpdate = {};
    if (profileData.fullName) sanitisedUpdate.fullName = profileData.fullName;
    if (profileData.department) sanitisedUpdate.department = profileData.department;
    if (profileData.course) sanitisedUpdate.course = profileData.course;
    if (profileData.semester) sanitisedUpdate.semester = profileData.semester;

    const user = await userRepository.updateById(userId, sanitisedUpdate);
    if (!user) {
      throw new AppError('User profile not found', HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }
}

export default new AuthService();
