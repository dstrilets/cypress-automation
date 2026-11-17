const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://qauto2.forstudy.space',
        specPattern: 'cypress/e2e/**/*.cy.js',
    },

    reporter: 'mochawesome',

    reporterOptions: {
        reportDir: 'cypress/reports/mochawesome/qauto2',
        overwrite: false,
        html: true,
        json: true,
    },
});