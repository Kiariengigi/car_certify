describe('Authentication - Sign Up Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearAuth();
  });

  it('TC01 - should display signup modal when SIGN UP button is clicked', () => {
    cy.getSignUpButton();
    cy.contains('h2', 'Welcome!').should('be.visible');
    cy.contains('p', 'Please enter your details').should('be.visible');
  });

  it('TC02 - should successfully sign up with valid credentials and Buyer role', () => {
    const uniqueEmail = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(uniqueEmail, 'password123', 'Buyer');
    cy.loginByApi(uniqueEmail, 'password123');
    cy.visit('/');
    cy.getLocalStorage('token').should('exist');
  });

  it('TC03 - should successfully sign up with valid credentials and Dealership role', () => {
    const uniqueEmail = `dealership${Date.now()}@example.com`;
    cy.createUserByApi(uniqueEmail, 'password123', 'Dealership');
    cy.loginByApi(uniqueEmail, 'password123');
    cy.visit('/');
    cy.getLocalStorage('token').should('exist');
  });

  it('TC04 - should show error when passwords do not match', () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    cy.getSignUpButton();
    cy.fillSignUpForm(uniqueEmail, 'password123', 'password456', 'Buyer');
    cy.submitSignUpForm();
    
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Passwords do not match');
    });
  });

  it('should show error when email already exists', () => {
    cy.getSignUpButton();
    cy.fillSignUpForm('buyer@example.com', 'password123', 'password123', 'Buyer');
    cy.submitSignUpForm();
    
    cy.on('window:alert', (str) => {
      expect(str).to.contain('User already exists');
    });
  });

  it('should require role selection for signup', () => {
    const uniqueEmail = `newuser${Date.now()}@example.com`;
    
    cy.getSignUpButton();
    cy.get('input[placeholder="Email"]').type(uniqueEmail);
    cy.get('input[placeholder="Password"]').eq(0).type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    // Don't select role
    
    cy.get('select').invoke('val').should('equal', '');
  });

  it('should store user data with correct role in localStorage after signup', () => {
    const uniqueEmail = `newbuyer${Date.now()}@example.com`;
    cy.createUserByApi(uniqueEmail, 'password123', 'Buyer');
    cy.loginByApi(uniqueEmail, 'password123');
    cy.visit('/');
    cy.getLocalStorage('user').then((u) => {
      const user = JSON.parse(u);
      expect(user).to.exist;
      expect(user.email).to.equal(uniqueEmail);
      expect(user.role).to.equal('Buyer');
    });
  });

  it('should close signup modal when clicking outside', () => {
    cy.getSignUpButton();
    cy.contains('h2', 'Welcome!').should('be.visible');
    
    cy.get('.ReactModal__Overlay').click('topLeft');
    cy.contains('h2', 'Welcome!').should('not.exist');
  });
});
