const garagePage = require('../pages/garagePage');

describe('Garage tests', () => {
    beforeEach(() => {
        cy.env([
            'username',
            'password',
            'qautoEmail',
            'qautoPassword',
            'qauto2Email',
            'qauto2Password'
        ]).then((env) => {
            const isQauto2 = Cypress.config('baseUrl').includes('qauto2.');

            const email = isQauto2 ? env.qauto2Email : env.qautoEmail;
            const password = isQauto2 ? env.qauto2Password : env.qautoPassword;

            cy.visit('/', {
                auth: {
                    username: env.username,
                    password: env.password
                }
            });

            cy.contains('button', 'Sign In').click();

            cy.get('#signinEmail').type(email);
            cy.get('#signinPassword').type(password, { log: false });

            cy.contains('button', 'Login').click();

            cy.url().should('include', '/panel/garage');
        });
    });

    it('should add a car to garage', () => {
        garagePage.openAddCarModal();
        garagePage.addCar('Audi', 'TT', 10000);
        garagePage.verifyCarExists('Audi', 'TT');
    });
});