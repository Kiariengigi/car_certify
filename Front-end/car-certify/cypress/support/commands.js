// Support file for auth tests - custom commands and utilities
Cypress.Commands.add('clearAuth', () => {
  // ensure storage is cleared reliably
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  cy.clearCookies();
});

Cypress.Commands.add('getLoginButton', () => {
  cy.contains('LOGIN').click();
});

Cypress.Commands.add('getSignUpButton', () => {
  cy.contains('SIGN UP').click();
});

Cypress.Commands.add('fillLoginForm', (email, password) => {
  cy.get('input[placeholder="Email"]').first().clear().type(email);
  cy.get('input[placeholder="Password"]').first().clear().type(password);
});

Cypress.Commands.add('fillSignUpForm', (email, password, confirmPass, role) => {
  cy.get('input[placeholder="Email"]').type(email);
  cy.get('input[placeholder="Password"]').eq(0).type(password);
  cy.get('input[placeholder="Confirm Password"]').type(confirmPass);
  cy.get('select').select(role);
});

Cypress.Commands.add('submitLoginForm', () => {
  cy.contains('button', 'Login').click();
});

Cypress.Commands.add('submitSignUpForm', () => {
  cy.contains('button', 'Sign Up').click();
});

// Get localStorage item by key
Cypress.Commands.add('getLocalStorage', (key) => {
  return cy.window().then((win) => win.localStorage.getItem(key));
});

// Login directly via backend API and set localStorage
Cypress.Commands.add('loginByApi', (email, password) => {
  // Use backend URL (not the frontend baseUrl)
  const backendUrl = 'https://car-certify.onrender.com';
  const loginUrl = `${backendUrl}/users/login`;
  cy.log(`Attempting login to ${loginUrl} with email: ${email}`);
  
  return cy.request({
    method: 'POST',
    url: loginUrl,
    body: { email, password },
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((resp) => {
    cy.log(`Login response status: ${resp.status}`);
    cy.log(`Login response body: ${JSON.stringify(resp.body)}`);
    
    if (resp.status !== 200 && resp.status !== 201) {
      throw new Error(`Login failed with status ${resp.status}: ${JSON.stringify(resp.body)}`);
    }
    if (!resp.body || !resp.body.token) {
      throw new Error(`Login response missing token. Body: ${JSON.stringify(resp.body)}`);
    }
    const { token, user } = resp.body;
    return cy.window().then((win) => {
      win.localStorage.setItem('token', token);
      if (user) {
        win.localStorage.setItem('user', JSON.stringify(user));
      }
      return { token, user };
    });
  });
});

// Create user via backend API (useful for signup tests)
Cypress.Commands.add('createUserByApi', (email, password, role = 'Buyer') => {
  // Use backend URL (not the frontend baseUrl)
  const backendUrl = 'https://car-certify.onrender.com';
  return cy.request({
    method: 'POST',
    url: `${backendUrl}/users/new`,
    body: { email, password, role },
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
