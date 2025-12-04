describe('Authentication - Logout Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearAuth();
  });

  it('TC05 - should log out user when LOG OUT button is clicked', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.getLocalStorage('token').should('exist');
    cy.contains('LOG OUT').click();
    cy.getLocalStorage('token').should('be.null');
  });

  it('TC06 - should clear localStorage on logout', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.contains('LOG OUT').click();
    cy.window().then(win => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('user')).to.be.null;
    });
  });

  it('TC07 - should show LOGIN button after logout', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.contains('LOG OUT').should('be.visible');
    cy.contains('LOG OUT').click();
    cy.contains('LOGIN').should('be.visible');
    cy.contains('LOG OUT').should('not.exist');
  });

  it('should prevent access to protected routes after logout', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.contains('LOG OUT').click();
    cy.visit('/');
    cy.contains('LOGIN').should('be.visible');
  });
});
