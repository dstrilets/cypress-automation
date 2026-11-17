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

    it('should add fuel expense to a car', () => {
        garagePage.openAddCarModal();
        garagePage.addCar('Audi', 'TT', 10000);
        garagePage.verifyCarExists('Audi', 'TT');

        fuelExpensesPage.openAddExpenseModal();
        fuelExpensesPage.addExpense(10100, 30, 60);

        cy.get('ngb-modal-window').should('not.exist');

        cy.get('a[href="/panel/expenses"]:visible')
            .first()
            .click();

        cy.url().should('include', '/panel/expenses');

        cy.contains('10100').should('be.visible');
        cy.contains('30L').should('be.visible');
// Potential QAuto2 bug: total cost is displayed as "60 USD"
// instead of "60.00 USD" as on QAuto.
// Expense is created successfully, but formatting differs.
cy.contains('60.00').should('be.visible');
    });
});