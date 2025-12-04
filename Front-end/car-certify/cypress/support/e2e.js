// Cypress E2E Config
import './commands';

beforeEach(() => {
  cy.clearAuth();
});

// Always capture a screenshot after each test (helps retain artifacts for passing and failing tests)
afterEach(function () {
  const test = this.currentTest || {};
  const title = (test.fullTitle && test.fullTitle()) || test.title || 'test';
  const state = test.state || 'unknown';
  // Screenshot filename includes test title and state to avoid collisions
  const filename = `${title} -- ${state}`.replace(/[\\/:*?"<>|]/g, '-');
  // capture the viewport so file sizes are reasonable
  cy.screenshot(filename, { capture: 'viewport', overwrite: false });
});
