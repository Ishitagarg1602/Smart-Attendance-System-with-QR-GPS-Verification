import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxLength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude from query results by default
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: 'Invalid role. Choose from: Admin, Teacher, Student, Employee'
      },
      default: ROLES.STUDENT
    },
    department: {
      type: String,
      trim: true,
      required: [true, 'Please specify your department']
    },
    course: {
      type: String,
      trim: true,
      required: function() {
        return this.role === ROLES.STUDENT; // Course is required for students
      }
    },
    semester: {
      type: Number,
      required: function() {
        return this.role === ROLES.STUDENT; // Semester is required for students
      }
    },
    employeeId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow multiple nulls/undefineds
      required: function() {
        return [ROLES.ADMIN, ROLES.TEACHER, ROLES.EMPLOYEE].includes(this.role);
      }
    },
    studentId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: function() {
        return this.role === ROLES.STUDENT;
      }
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
// Pre-save password hashing middleware
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to check password validity
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
