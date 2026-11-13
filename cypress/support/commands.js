// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


/// <reference types="cypress" />

Cypress.Commands.add('login', (email, password) => {
    cy.contains('button', 'Sign In').click();

    cy.get('#signinEmail').should('be.visible').type(email);

    cy.get('#signinPassword')
        .should('be.visible')
        .type(password, { sensitive: true });

    cy.contains('button', 'Login').click();

    cy.contains('Garage', { timeout: 10000 })
        .should('be.visible');
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options = {}) => {
    if (options.sensitive) {
        options.log = false;

        Cypress.log({
            $el: element,
            name: 'type',
            message: '*'.repeat(String(text).length)
        });
    }

    return originalFn(element, text, options);
});
