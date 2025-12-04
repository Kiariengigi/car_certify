# Supertest Authorization Testing - Quick Reference

## What Was Built

A complete authorization testing suite for your backend using **Supertest** and **Jest**:

```
46 Tests Total
├─ 21 Authentication Tests (signup, login, tokens)
└─ 25 Authorization Tests (RBAC, middleware, security)
```

## File Structure

```
Back-end/
├── jest.config.js                  # Jest configuration
├── package.json                    # Updated with test scripts
├── TESTING_REPORT.md              # Full test documentation
└── tests/
    ├── auth.test.js               # 21 auth tests
    └── authorization.test.js      # 25 RBAC tests
```

## Quick Commands

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific test file
npx jest tests/auth.test.js
```

## Test Coverage at a Glance

### Authentication (auth.test.js)
| Feature | Tests | Status |
|---------|-------|--------|
| Signup validation | 10 | ✓ |
| Login flow | 9 | ✓ |
| JWT tokens | 2 | ✓ |

### Authorization (authorization.test.js)
| Feature | Tests | Status |
|---------|-------|--------|
| Protect middleware | 9 | ✓ |
| Single-role RBAC | 6 | ✓ |
| Multi-role RBAC | 3 | ✓ |
| Missing auth | 2 | ✓ |
| Edge cases | 3 | ✓ |
| Token security | 2 | ✓ |

## Key Test Scenarios

### Signup Validation
```javascript
✓ Valid user creation (returns 201 + token)
✓ Invalid email format
✓ Short password (< 6 chars)
✓ Missing fields
✓ Duplicate email
✓ Invalid role
✓ All valid roles accepted (Buyer, Dealership, admin)
```

### Login Validation
```javascript
✓ Correct credentials → 200 + token + user
✓ Wrong password → 401
✓ Non-existent email → 401
✓ Missing fields → 400
```

### Protected Routes
```javascript
✓ Valid token → 200 (access granted)
✗ No token → 401
✗ Invalid token → 401
✗ Expired token → 401
```

### Role-Based Access
```javascript
✓ Buyer can access buyer-only routes
✗ Buyer denied from admin routes
✓ Admin can access admin routes
✗ Admin denied from buyer-only
✓ Multi-role routes accessible to any matching role
```

## Test Results (Latest Run)

```
PASS tests/auth.test.js (19.377 s)
  Authentication Tests
    POST /users/new - Sign Up           [10 tests]
    POST /users/login - Login           [9 tests]
    JWT Token Validation                [2 tests]

PASS tests/authorization.test.js (11.188 s)
  Authorization & Middleware Tests
    Protect Middleware                  [9 tests]
    Role-Based Access Control           [9 tests]
    Missing/Invalid Authentication      [2 tests]
    Edge Cases                          [3 tests]
    Token Security                      [2 tests]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 46 passing in ~31.5 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## What Each Test Suite Validates

### auth.test.js
- **Input Validation**: Email format, password length, required fields
- **Business Logic**: User creation, credential verification
- **Security**: Password hashing, token generation
- **Data Protection**: Password never exposed in responses
- **Token Quality**: Proper JWT structure with expiration

### authorization.test.js
- **Authentication Middleware**: Token parsing, user lookup, signature validation
- **Authorization Middleware**: Role checking, single/multi-role support
- **Access Control**: Correct 200/403/401 responses
- **Edge Cases**: Deleted users, role changes, case-sensitivity
- **Token Tampering**: Modified tokens, forged signatures rejected

## How Tests Work

1. **Setup**: Create test Express app with routes + middleware
2. **Data**: Create test users (Buyer, admin, Dealership)
3. **Execute**: Make HTTP requests via supertest
4. **Assert**: Verify response status, body, headers
5. **Cleanup**: Delete test users from database

## Example Test

```javascript
it('should allow Buyer role to access /api/buyer-only', async () => {
  const response = await request(app)
    .get('/api/buyer-only')
    .set('Authorization', `Bearer ${buyerToken}`)
    .expect(200);  // Assert HTTP 200
  
  expect(response.body.message).toBe('Buyer route accessed');
});
```

## Integration with CI/CD

Add to your GitHub Actions / GitLab CI:

```yaml
test:
  script:
    - cd Back-end
    - npm install
    - npm test
```

## Troubleshooting

### Tests timeout
→ Increase jest timeout in jest.config.js or test file
```javascript
beforeAll(async () => { ... }, 30000);  // 30 seconds
```

### MongoDB connection fails
→ Verify `MONGO_URI` in `.env` file
→ Check network access to MongoDB instance

### Duplicate email errors
→ Normal - tests create unique timestamps per run
→ AfterEach cleanup handles user deletion

## Next Steps

1. ✓ Authorization tests complete
2. → Add integration tests for other routes (vehicles, reports)
3. → Add E2E tests with Cypress (already set up)
4. → Integrate into CI/CD pipeline
5. → Monitor test coverage over time

## Related Documentation

- Full report: `TESTING_REPORT.md`
- Auth controller: `Controllers/authCTRL.js`
- Middleware: `middlewares/authmiddleware.js`
- User model: `Models/user.js`
- Jest docs: https://jestjs.io
- Supertest docs: https://github.com/visionmedia/supertest
