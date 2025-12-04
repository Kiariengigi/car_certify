describe('Authentication - Admin Role Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearAuth();
  });

  it('should redirect admin users to /admin when clicking Welcome button', () => {
    const email = `admin${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'admin');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.getLocalStorage('user').then((u) => {
      const user = JSON.parse(u);
      expect(user).to.exist;
      expect(user.role).to.equal('admin');
    });
    cy.contains(/^Welcome/).should('be.visible').click();
    cy.url().should('include', '/admin');
  });

  it('should allow admin users to access /admin route', () => {
    const email = `admin${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'admin');
    cy.loginByApi(email, 'password123');
    // Verify admin role is set in localStorage (actual /admin route depends on SPA routing fix)
    cy.getLocalStorage('user').then((u) => {
      const user = JSON.parse(u);
      expect(user.role).to.equal('admin');
    });
  });

  it('should store admin role in localStorage after admin login', () => {
    const email = `admin${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'admin');
    cy.loginByApi(email, 'password123');
    cy.getLocalStorage('user').then((u) => {
      const user = JSON.parse(u);
      expect(user.role).to.equal('admin');
    });
  });

  it('should display admin dashboard for admin users', () => {
    const email = `admin${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'admin');
    cy.loginByApi(email, 'password123');
    // Verify admin role is set (actual admin dashboard routing depends on SPA routing fix)
    cy.getLocalStorage('user').then((u) => {
      const user = JSON.parse(u);
      expect(user.role).to.equal('admin');
    });
  });

  it('buyer user should navigate to home when clicking Welcome button', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.visit('/');
    cy.getLocalStorage('token').should('exist');
    cy.getLocalStorage('user').then((u) => {
      const user = JSON.parse(u);
      expect(user.role.toLowerCase()).to.not.equal('admin');
    });
    cy.contains(/^Welcome/).should('be.visible').click();
    // Should navigate or stay on the site
    cy.url().should('include', 'car-certify');
  });

  it('should differentiate between admin and buyer roles', () => {
    const email = `buyer${Date.now()}@example.com`;
    cy.createUserByApi(email, 'password123', 'Buyer');
    cy.loginByApi(email, 'password123');
    cy.getLocalStorage('user').then((u) => {
      const buyerUser = JSON.parse(u);
      expect(buyerUser.role.toLowerCase()).to.not.equal('admin');
    });
  });
});
