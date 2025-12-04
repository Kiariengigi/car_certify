const request = require('supertest');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const User = require('../Models/user');

// Setup Express app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes);
  return app;
};

describe('Authentication Tests', () => {
  let app;
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123';
  const testRole = 'Buyer';

  beforeAll(async () => {
    app = createTestApp();
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    // Clean up test user
    await User.deleteOne({ email: testEmail });
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  afterEach(async () => {
    // Clean up any additional test users
    await User.deleteMany({ email: { $regex: 'test_' } });
  });

  describe('POST /users/new - Sign Up', () => {
    it('should successfully create a new user with valid credentials', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          email: testEmail,
          password: testPassword,
          role: testRole,
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.role).toBe(testRole);
      expect(response.body.message).toBe('User created successfully');
    });

    it('should reject signup with invalid email', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          email: 'invalid-email',
          password: testPassword,
          role: testRole,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject signup with password too short', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          email: `short_${Date.now()}@example.com`,
          password: 'short',
          role: testRole,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject signup with missing email', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          password: testPassword,
          role: testRole,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject signup with missing password', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          email: `missing_pass_${Date.now()}@example.com`,
          role: testRole,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject signup with invalid role', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          email: `invalid_role_${Date.now()}@example.com`,
          password: testPassword,
          role: 'InvalidRole',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject signup with duplicate email', async () => {
      const duplicateEmail = `duplicate_${Date.now()}@example.com`;

      // First signup
      await request(app)
        .post('/users/new')
        .send({
          email: duplicateEmail,
          password: testPassword,
          role: testRole,
        })
        .expect(201);

      // Attempt duplicate signup
      const response = await request(app)
        .post('/users/new')
        .send({
          email: duplicateEmail,
          password: testPassword,
          role: testRole,
        })
        .expect(400);

      expect(response.body.message).toContain('already exists');
    });

    it('should accept all valid roles: Buyer, Dealership, admin', async () => {
      const roles = ['Buyer', 'Dealership', 'admin'];

      for (const role of roles) {
        const response = await request(app)
          .post('/users/new')
          .send({
            email: `user_${role}_${Date.now()}@example.com`,
            password: testPassword,
            role,
          })
          .expect(201);

        expect(response.body.user.role).toBe(role);
      }
    });

    it('should return token in response', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          email: `token_test_${Date.now()}@example.com`,
          password: testPassword,
          role: testRole,
        })
        .expect(201);

      const token = response.body.token;
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should not expose password in response', async () => {
      const response = await request(app)
        .post('/users/new')
        .send({
          email: `no_pwd_expose_${Date.now()}@example.com`,
          password: testPassword,
          role: testRole,
        })
        .expect(201);

      expect(response.body.user).not.toHaveProperty('password');
    });
  });

  describe('POST /users/login - Login', () => {
    let loginTestEmail;
    let loginTestPassword = 'LoginTest123';

    beforeEach(async () => {
      loginTestEmail = `login_${Date.now()}@example.com`;
      // Create a user for login tests
      await request(app)
        .post('/users/new')
        .send({
          email: loginTestEmail,
          password: loginTestPassword,
          role: 'Buyer',
        });
    });

    it('should successfully login with valid credentials', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: loginTestEmail,
          password: loginTestPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginTestEmail);
      expect(response.body.message).toBe('Login successful');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: loginTestPassword,
        })
        .expect(401);

      expect(response.body.message).toContain('No user with that email');
    });

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: loginTestEmail,
          password: 'WrongPassword123',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login with missing email', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          password: loginTestPassword,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: loginTestEmail,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return valid JWT token on successful login', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: loginTestEmail,
          password: loginTestPassword,
        })
        .expect(200);

      const token = response.body.token;
      expect(token).toBeTruthy();
      expect(token.split('.').length).toBe(3); // JWT structure
    });

    it('should not expose password in login response', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: loginTestEmail,
          password: loginTestPassword,
        })
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return user data with role on successful login', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: loginTestEmail,
          password: loginTestPassword,
        })
        .expect(200);

      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user.email).toBe(loginTestEmail);
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'invalid-email',
          password: loginTestPassword,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('JWT Token Validation', () => {
    it('should generate tokens with proper expiration claim', async () => {
      const tokenTestEmail = `token_validation_${Date.now()}@example.com`;

      const signupResponse = await request(app)
        .post('/users/new')
        .send({
          email: tokenTestEmail,
          password: testPassword,
          role: 'Buyer',
        })
        .expect(201);

      const token = signupResponse.body.token;
      const decoded = require('jsonwebtoken').decode(token);

      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('exp');
      expect(decoded.id).toBeTruthy();
    });

    it('should generate consistent tokens for the same user', async () => {
      const consistentEmail = `consistent_${Date.now()}@example.com`;

      await request(app)
        .post('/users/new')
        .send({
          email: consistentEmail,
          password: testPassword,
          role: 'Buyer',
        });

      const loginResponse1 = await request(app)
        .post('/users/login')
        .send({
          email: consistentEmail,
          password: testPassword,
        })
        .expect(200);

      const loginResponse2 = await request(app)
        .post('/users/login')
        .send({
          email: consistentEmail,
          password: testPassword,
        })
        .expect(200);

      const decoded1 = require('jsonwebtoken').decode(loginResponse1.body.token);
      const decoded2 = require('jsonwebtoken').decode(loginResponse2.body.token);

      expect(decoded1.id).toBe(decoded2.id); // Same user ID
    });
  });
});
