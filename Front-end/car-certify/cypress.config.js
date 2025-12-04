import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://car-certify-1.onrender.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.js",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 60000,
    requestTimeout: 20000,
  },
});
