const garagePage = require('../pages/garagePage');
const fuelExpensesPage = require('../pages/fuelExpensesPage');

describe('Fuel expenses tests', () => {
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

            const email = isQauto2
                ? env.qauto2Email
                : env.qautoEmail;

            const password = isQauto2
                ? env.qauto2Password
                : env.qautoPassword;

            cy.visit('/', {
                auth: {
                    username: env.username,
                    password: env.password
                }
            });

            cy.contains('button', 'Sign In').click();

            cy.get('#signinEmail')
                .type(email);

            cy.get('#signinPassword')
                .type(password, { log: false });

            cy.contains('button', 'Login').click();

            cy.url()
                .should('include', '/panel/garage');
        });
    });

    it('should add fuel expense to a car', () => {
        // Intercept car creation request
        cy.intercept('POST', '**/api/cars').as('createCar');

        // Create car through UI
        garagePage.openAddCarModal();
        garagePage.addCar('Audi', 'TT', 10000);

        // Verify car creation response
        cy.wait('@createCar').then(({ response }) => {
            expect(response.statusCode).to.eq(201);

            expect(response.body.data).to.have.property('id');

            cy.wrap(response.body.data.id).as('createdCarId');
        });

        garagePage.verifyCarExists('Audi', 'TT');

        // Intercept expense creation
        cy.intercept('POST', '**/api/expenses').as('createExpense');

        // Create expense through UI
        fuelExpensesPage.openAddExpenseModal();
        fuelExpensesPage.addExpense(10100, 30, 60);

        // Verify expense creation response
        cy.wait('@createExpense').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            expect(response.body.data).to.have.property('id');
        });

        // Navigate to expenses
        cy.get('a[href="/panel/expenses"]:visible')
            .first()
            .click();

        cy.url()
            .should('include', '/panel/expenses');

        // Verify expense data
        cy.contains('10100').should('be.visible');
        cy.contains('30L').should('be.visible');

        // Known QAuto2 issue:
        // Total cost is displayed as "60 USD"
        // instead of "60.00 USD".
        cy.contains('60.00').should('be.visible');
    });
});
