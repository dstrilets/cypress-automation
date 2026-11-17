const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    overwrite: false,
    html: false,
    json: true
  },

  e2e: {
    setupNodeEvents(on, config) {
      // Node event listeners
    }
  }
});
