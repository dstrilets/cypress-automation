const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://qauto.forstudy.space',
        specPattern: 'cypress/e2e/**/*.cy.js',
    },

    reporter: 'mochawesome',

    reporterOptions: {
        reportDir: 'cypress/reports/mochawesome/qauto',
        overwrite: false,
        html: true,
        json: true,
    },
});