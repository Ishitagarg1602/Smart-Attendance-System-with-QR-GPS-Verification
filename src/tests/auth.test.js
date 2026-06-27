import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/user.model.js';

// Mock mongoose connect function directly to prevent TCP database connections during test startup
mongoose.connect = jest.fn().mockResolvedValue({
  connection: {
    host: 'mocked-mongodb-host',
    on: jest.fn(),
  }
});

// Mock mongoose connection events to prevent connection hangs or failures
mongoose.connection = {
  host: 'mocked-mongodb-host',
  on: jest.fn(),
};

describe('Auth Endpoints Mocked Unit Tests', () => {
  let findOneSpy;
  let createSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Explicitly mock Mongoose User model statics
    findOneSpy = jest.fn();
    createSpy = jest.fn();
    
    User.findOne = findOneSpy;
    User.create = createSpy;
  });

  describe('POST /api/auth/register', () => {
    it('should validate invalid input formats', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: '',
          email: 'invalid-email',
          password: '123',
          role: 'InvalidRole'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation Error');
    });

    it('should successfully register a new Student user and return token', async () => {
      // Mock User.findOne to return null (no duplicate email)
      findOneSpy.mockResolvedValue(null);
      
      // Mock User.create to return a mocked user instance
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        fullName: 'John Doe',
        email: 'john.doe@university.edu',
        role: 'Student',
        department: 'Computer Science',
        course: 'B.Tech CSE',
        semester: 4,
        studentId: 'STUD123456',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      createSpy.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john.doe@university.edu',
          password: 'Password123',
          role: 'Student',
          department: 'Computer Science',
          course: 'B.Tech CSE',
          semester: 4,
          studentId: 'STUD123456'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('john.doe@university.edu');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login student with correct credentials', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        fullName: 'John Doe',
        email: 'john.doe@university.edu',
        role: 'Student',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      // Mock user.select('+password') query chain
      findOneSpy.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@university.edu',
          password: 'Password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('john.doe@university.edu');
    });

    it('should reject login with wrong credentials', async () => {
      // Mock findOne chain returning null
      findOneSpy.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@university.edu',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
