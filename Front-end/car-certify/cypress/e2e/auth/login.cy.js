describe('Authentication - Login Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearAuth();
  });

  it('should display login modal when LOGIN button is clicked', () => {
    cy.getLoginButton();
    cy.contains('h2', 'Welcome Back!').should('be.visible');
    cy.contains('p', 'Please enter your details').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.getLocalStorage('token').should('exist');
    cy.contains(/^Welcome/).should('be.visible');
  });

  it('should show error message with invalid credentials', () => {
    cy.getLoginButton();
    cy.fillLoginForm('nonexistent@example.com', 'wrongpassword');
    cy.submitLoginForm();
    
    // Should show alert or error message
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Invalid credentials');
    });
  });

  it('should show error when email does not exist', () => {
    cy.getLoginButton();
    cy.fillLoginForm('notregistered@example.com', 'password123');
    cy.submitLoginForm();
    
    cy.on('window:alert', (str) => {
      expect(str).to.contain('No user with that email');
    });
  });

  it('should store user data in localStorage after login', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.getLocalStorage('user').then((u) => {
      const user = JSON.parse(u);
      expect(user).to.exist;
      expect(user.email).to.equal(email);
    });
  });

  it('should close login modal when clicking outside', () => {
    cy.getLoginButton();
    cy.contains('h2', 'Welcome Back!').should('be.visible');
    
    // Click outside the modal (overlay)
    cy.get('.ReactModal__Overlay').click('topLeft');
    cy.contains('h2', 'Welcome Back!').should('not.exist');
  });

  it('should clear form fields after failed login', () => {
    cy.getLoginButton();
    cy.fillLoginForm('test@example.com', 'password');
    cy.submitLoginForm();
    
    // Modal should still be visible for retry
    cy.contains('h2', 'Welcome Back!').should('be.visible');
  });

  it('should display welcome message with user email after login', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.contains(/^Welcome/).should('be.visible');
  });
});
