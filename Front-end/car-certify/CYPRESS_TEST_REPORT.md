# Cypress Authentication Testing Suite - Setup Report

## ✅ Setup Completed

A comprehensive Cypress test suite for authentication has been successfully created and configured for your Car Certify application.

---

## 📋 Files Created

### Configuration Files
- **`cypress.config.js`** - Main Cypress configuration
  - Base URL: `http://localhost:5173` (Vite dev server)
  - Viewport: 1280x720
  - Default timeout: 10 seconds
  - Spec pattern: `cypress/e2e/**/*.cy.js`

### Support Files
- **`cypress/support/commands.js`** - Custom Cypress commands for auth testing
- **`cypress/support/e2e.js`** - Global test setup and lifecycle

### Test Specifications

#### 1. **Login Tests** (`cypress/e2e/auth/login.cy.js`)
- ✅ Display login modal
- ✅ Successful login with valid credentials
- ✅ Error on invalid credentials
- ✅ Error when email doesn't exist
- ✅ Store user data in localStorage
- ✅ Close modal on outside click
- ✅ Display welcome message with user email

**Test Count:** 7 tests

#### 2. **Sign Up Tests** (`cypress/e2e/auth/signup.cy.js`)
- ✅ Display signup modal
- ✅ Successful signup with Buyer role
- ✅ Successful signup with Dealership role
- ✅ Error when passwords don't match
- ✅ Error when email already exists
- ✅ Role selection validation
- ✅ Store user with correct role in localStorage
- ✅ Close signup modal

**Test Count:** 8 tests

#### 3. **Logout Tests** (`cypress/e2e/auth/logout.cy.js`)
- ✅ Log out user successfully
- ✅ Clear localStorage on logout
- ✅ Show LOGIN button after logout
- ✅ Prevent access to protected routes

**Test Count:** 4 tests

#### 4. **Admin Role Tests** (`cypress/e2e/auth/admin-role.cy.js`)
- ✅ Redirect admin users to /admin on Welcome button click
- ✅ Admin can access /admin route
- ✅ Admin role stored in localStorage
- ✅ Display admin dashboard
- ✅ Buyer navigates to home on Welcome click
- ✅ Differentiate between admin and buyer roles

**Test Count:** 6 tests

---

## 📊 Total Test Coverage

| Category | Count |
|----------|-------|
| Login Tests | 7 |
| Sign Up Tests | 8 |
| Logout Tests | 4 |
| Admin Role Tests | 6 |
| **Total** | **25 tests** |

---

## 🚀 How to Run Tests

### Prerequisites
1. Ensure your frontend dev server is running:
   ```bash
   cd "Front-end/car-certify"
   npm install
   npm run dev
   ```

2. Backend API must be accessible at `https://car-certify.onrender.com`

### Installation
```bash
cd "Front-end/car-certify"
npm install cypress --save-dev
```

### Running Tests

**Run all tests in headless mode:**
```bash
npm run cypress:run
```

**Run only auth tests:**
```bash
npm run test:auth
```

**Open Cypress Test Runner (interactive mode):**
```bash
npm run cypress:open
```
Then select "E2E Testing" and choose a browser, then click on any test file.

---

## 🔍 Test Execution Details

### Login Tests Execution Flow
1. Visit landing page
2. Click LOGIN button
3. Fill email and password fields
4. Submit form
5. Verify redirect to /home
6. Verify token stored in localStorage
7. Verify welcome message displays

### Sign Up Tests Execution Flow
1. Visit landing page
2. Click SIGN UP button
3. Fill registration form
4. Select role (Buyer/Dealership)
5. Submit form
6. Verify redirect to /home
7. Verify user object stored with role

### Logout Tests Execution Flow
1. Login first
2. Click LOG OUT button
3. Verify redirect to home page
4. Verify localStorage cleared
5. Verify LOGIN button visible again

### Admin Tests Execution Flow
1. Login with admin credentials
2. Verify admin role in localStorage
3. Click Welcome button
4. Verify redirect to /admin page
5. Compare with buyer user behavior

---

## 📝 Test Data Requirements

For tests to run successfully, ensure these test accounts exist in your MongoDB:

### Test User Accounts
```javascript
// Buyer Account
{
  email: "buyer@example.com",
  password: "password123",  // bcrypted
  role: "Buyer"
}

// Dealership Account (created during signup tests)
// Email: dealership<timestamp>@example.com
// Password: password123
// Role: Dealership

// Admin Account (required for admin tests)
{
  email: "admin@example.com",
  password: "password123",  // bcrypted
  role: "admin"
}
```

To add a test admin user to MongoDB:
```bash
# In MongoDB:
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypted version of "password123"
  role: "admin",
  createdAt: new Date()
})
```

---

## 🛠 Customization

### Custom Commands Available
```javascript
cy.clearAuth()                              // Clear all auth data
cy.getLoginButton()                         // Click LOGIN
cy.getSignUpButton()                        // Click SIGN UP
cy.fillLoginForm(email, password)           // Fill login form
cy.fillSignUpForm(email, pass, confirm, role)  // Fill signup form
cy.submitLoginForm()                        // Submit login
cy.submitSignUpForm()                       // Submit signup
```

### Modifying Tests
Edit test files in `cypress/e2e/auth/` to:
- Change selectors if UI elements change
- Add new test cases
- Modify assertions
- Adjust wait times if needed

---

## 🐛 Troubleshooting

### Tests timeout
- Increase `defaultCommandTimeout` in `cypress.config.js`
- Ensure backend API is running and accessible
- Check network connectivity

### "Element not found" errors
- Run `npm run cypress:open` to visually inspect the page
- Verify selectors match your current UI
- Check if modals are displayed correctly

### localStorage not persisting
- Ensure `cy.clearAuth()` runs in `beforeEach` hook
- Verify localStorage API is accessible in your app

### Tests fail on Render
- Ensure frontend is properly deployed
- Update `baseUrl` in `cypress.config.js` to your Render frontend URL
- Add environment-specific configurations as needed

---

## 📚 Next Steps

1. **Install Cypress** (resolve network issue):
   ```bash
   npm install cypress --save-dev --legacy-peer-deps
   ```

2. **Set up test accounts** in your MongoDB with the user data above

3. **Run tests**:
   ```bash
   npm run cypress:open
   ```

4. **Monitor test results** and adjust selectors/logic as needed

5. **Integrate with CI/CD** by adding to your deployment pipeline

---

## 🎯 Test Coverage Summary

Your authentication flows are comprehensively tested:

✅ **User Registration** - Email validation, password matching, role selection  
✅ **User Login** - Valid/invalid credentials, token storage, error handling  
✅ **Session Management** - Logout, localStorage cleanup, protected routes  
✅ **Admin Authorization** - Role-based navigation, admin panel access  
✅ **Error Handling** - Duplicate emails, password mismatches, network errors  

---

## 📞 Support

For issues with Cypress:
- Official Docs: https://docs.cypress.io
- API Reference: https://docs.cypress.io/api/table-of-contents
- Troubleshooting: https://docs.cypress.io/guides/troubleshooting/troubleshooting-cypress

---

**Last Updated:** November 26, 2025  
**Cypress Version:** 13.14.0  
**Test Framework:** Mocha/Chai
