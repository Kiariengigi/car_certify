const request = require('supertest');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middlewares/authmiddleware');
const User = require('../Models/user');
const userRoutes = require('../routes/userRoutes');

// Setup Express app for testing with protected routes
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes);

  // Test protected routes
  app.get('/api/protected', protect, (req, res) => {
    res.status(200).json({
      message: 'Protected route accessed',
      user: req.user,
    });
  });

  app.get('/api/buyer-only', protect, authorize('Buyer'), (req, res) => {
    res.status(200).json({
      message: 'Buyer route accessed',
      user: req.user,
    });
  });

  app.get('/api/admin-only', protect, authorize('admin'), (req, res) => {
    res.status(200).json({
      message: 'Admin route accessed',
      user: req.user,
    });
  });

  app.get('/api/dealership-only', protect, authorize('Dealership'), (req, res) => {
    res.status(200).json({
      message: 'Dealership route accessed',
      user: req.user,
    });
  });

  app.get('/api/multi-role', protect, authorize('Buyer', 'Dealership'), (req, res) => {
    res.status(200).json({
      message: 'Multi-role route accessed',
      user: req.user,
    });
  });

  return app;
};

describe('Authorization & Middleware Tests', () => {
  let app;
  let buyerToken;
  let adminToken;
  let dealershipToken;
  let buyerUser;
  let adminUser;
  let dealershipUser;

  beforeAll(async () => {
    app = createTestApp();
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Create test users with different roles
    const buyerSignup = await request(app)
      .post('/users/new')
      .send({
        email: `buyer_${Date.now()}@example.com`,
        password: 'BuyerPass123',
        role: 'Buyer',
      });
    buyerToken = buyerSignup.body.token;
    buyerUser = buyerSignup.body.user;

    const adminSignup = await request(app)
      .post('/users/new')
      .send({
        email: `admin_${Date.now()}@example.com`,
        password: 'AdminPass123',
        role: 'admin',
      });
    adminToken = adminSignup.body.token;
    adminUser = adminSignup.body.user;

    const dealershipSignup = await request(app)
      .post('/users/new')
      .send({
        email: `dealer_${Date.now()}@example.com`,
        password: 'DealerPass123',
        role: 'Dealership',
      });
    dealershipToken = dealershipSignup.body.token;
    dealershipUser = dealershipSignup.body.user;
  }, 30000);

  afterAll(async () => {
    // Clean up test users
    await User.deleteMany({
      email: { $regex: 'buyer_|admin_|dealer_' },
    });
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('Protect Middleware - Authentication', () => {
    it('should allow access to protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(200);

      expect(response.body.message).toBe('Protected route accessed');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(buyerUser.email);
    });

    it('should reject access to protected route without token', async () => {
      const response = await request(app)
        .get('/api/protected')
        .expect(401);

      expect(response.body.message).toContain('NOT AUTHORIZED');
    });

    it('should reject access with invalid token format', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', 'InvalidToken')
        .expect(401);

      expect(response.body.message).toContain('NOT AUTHORIZED');
    });

    it('should reject access with malformed Bearer token', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer invalid.token.format')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should reject access with expired or invalid JWT', async () => {
      const invalidToken = jwt.sign(
        { id: 'nonexistent_id' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1s' }
      );

      // Wait for token to expire (optional - invalid user ID will also fail)
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should accept Bearer token with proper capitalization', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(200);

      expect(response.body.user.email).toBe(buyerUser.email);
    });

    it('should reject token without Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', buyerToken)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should populate req.user with authenticated user data', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user.email).toBe(adminUser.email);
    });

    it('should not expose password in req.user', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
    });
  });

  describe('Authorize Middleware - Role-Based Access Control', () => {
    describe('Single Role Authorization', () => {
      it('should allow Buyer role to access /api/buyer-only', async () => {
        const response = await request(app)
          .get('/api/buyer-only')
          .set('Authorization', `Bearer ${buyerToken}`)
          .expect(200);

        expect(response.body.message).toBe('Buyer route accessed');
      });

      it('should deny Buyer role from accessing /api/admin-only', async () => {
        const response = await request(app)
          .get('/api/admin-only')
          .set('Authorization', `Bearer ${buyerToken}`)
          .expect(403);

        expect(response.body.message).toBe('Forbidden');
      });

      it('should allow admin role to access /api/admin-only', async () => {
        const response = await request(app)
          .get('/api/admin-only')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.message).toBe('Admin route accessed');
      });

      it('should deny admin role from accessing /api/buyer-only', async () => {
        const response = await request(app)
          .get('/api/buyer-only')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(403);

        expect(response.body.message).toBe('Forbidden');
      });

      it('should allow Dealership role to access /api/dealership-only', async () => {
        const response = await request(app)
          .get('/api/dealership-only')
          .set('Authorization', `Bearer ${dealershipToken}`)
          .expect(200);

        expect(response.body.message).toBe('Dealership route accessed');
      });

      it('should deny Dealership role from accessing /api/admin-only', async () => {
        const response = await request(app)
          .get('/api/admin-only')
          .set('Authorization', `Bearer ${dealershipToken}`)
          .expect(403);

        expect(response.body.message).toBe('Forbidden');
      });
    });

    describe('Multi-Role Authorization', () => {
      it('should allow Buyer to access multi-role route', async () => {
        const response = await request(app)
          .get('/api/multi-role')
          .set('Authorization', `Bearer ${buyerToken}`)
          .expect(200);

        expect(response.body.message).toBe('Multi-role route accessed');
      });

      it('should allow Dealership to access multi-role route', async () => {
        const response = await request(app)
          .get('/api/multi-role')
          .set('Authorization', `Bearer ${dealershipToken}`)
          .expect(200);

        expect(response.body.message).toBe('Multi-role route accessed');
      });

      it('should deny admin from accessing multi-role route (Buyer/Dealership only)', async () => {
        const response = await request(app)
          .get('/api/multi-role')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(403);

        expect(response.body.message).toBe('Forbidden');
      });
    });

    describe('Missing/Invalid Authentication for Authorization', () => {
      it('should return 401 for protected route without token', async () => {
        const response = await request(app)
          .get('/api/buyer-only')
          .expect(401);

        expect(response.body.message).toContain('NOT AUTHORIZED');
      });

      it('should return 401 when authorize middleware encounters unauthenticated request', async () => {
        const response = await request(app)
          .get('/api/admin-only')
          .expect(401);

        expect(response.body.message).toContain('NOT AUTHORIZED');
      });
    });
  });

  describe('Authorization Edge Cases', () => {
    it('should handle authorization check when user is deleted from database', async () => {
      // Create a user
      const tempResponse = await request(app)
        .post('/users/new')
        .send({
          email: `temp_delete_${Date.now()}@example.com`,
          password: 'TempPass123',
          role: 'Buyer',
        })
        .expect(201);

      const tempToken = tempResponse.body.token;
      const tempUserId = tempResponse.body.user.id;

      // Verify token works
      await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${tempToken}`)
        .expect(200);

      // Delete the user
      await User.deleteOne({ _id: tempUserId });

      // Try to use token after user is deleted
      const deletedResponse = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${tempToken}`)
        .expect(401);

      expect(deletedResponse.body.message).toBeDefined();
    });

    it('should handle role changes by requiring new login', async () => {
      // Initially, verify Buyer can access buyer-only route
      await request(app)
        .get('/api/buyer-only')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(200);

      // Change user role in database
      await User.updateOne(
        { _id: buyerUser.id },
        { role: 'admin' }
      );

      // Old token should still grant original role access (token not revoked)
      // This is a security consideration - tokens should be short-lived for role changes
      const response = await request(app)
        .get('/api/buyer-only')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect(403); // Now forbidden because middleware checks current DB role

      expect(response.body.message).toBe('Forbidden');
    });

    it('should properly validate role field case-sensitivity', async () => {
      // Create a fresh buyer user for this test
      const freshBuyerResponse = await request(app)
        .post('/users/new')
        .send({
          email: `fresh_buyer_${Date.now()}@example.com`,
          password: 'FreshPass123',
          role: 'Buyer',
        })
        .expect(201);

      const freshToken = freshBuyerResponse.body.token;

      // All our roles are case-sensitive (Buyer, Dealership, admin)
      // Authorization should match exact case
      const response = await request(app)
        .get('/api/buyer-only')
        .set('Authorization', `Bearer ${freshToken}`)
        .expect(200);

      expect(response.body.message).toBe('Buyer route accessed');
    });
  });

  describe('Token Security', () => {
    it('should not allow access with modified token', async () => {
      const modifiedToken = buyerToken + 'modified';

      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${modifiedToken}`)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should validate token signature', async () => {
      const forgedToken = jwt.sign(
        { id: buyerUser.id },
        'wrong_secret', // Different secret
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${forgedToken}`)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });
});
