const garagePage = require('../pages/garagePage');

describe('API Expenses tests', () => {
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

            cy.get('#signinEmail')
                .should('be.visible')
                .type(email);

            cy.get('#signinPassword')
                .should('be.visible')
                .type(password, { log: false });

            cy.contains('button', 'Login').click();

            cy.url().should('include', '/panel/garage');
        });
    });

    it('should create a car via UI, verify it via API and create an expense', () => {
        // 1. Intercept car creation request
        cy.intercept('POST', '**/api/cars').as('createCar');

        // 2. Create car through UI
        garagePage.openAddCarModal();
        garagePage.addCar('Audi', 'TT', 10000);

        // 3. Validate POST response and save car ID
        cy.wait('@createCar').then(({ response }) => {
            expect(response, 'Create car response').to.exist;
            expect(response.statusCode).to.eq(201);
            expect(response.body.status).to.eq('ok');

            const carId = response.body.data.id;
            expect(carId).to.exist;

            // 4. Get cars through API and verify created car
            cy.request({
                method: 'GET',
                url: '/api/cars'
            }).then((carsResponse) => {
                expect(carsResponse.status).to.eq(200);
                expect(carsResponse.body.status).to.eq('ok');

                const createdCar = carsResponse.body.data.find(
                    (car) => car.id === carId
                );

                expect(createdCar, 'Created car exists in API').to.exist;
                expect(createdCar.brand).to.eq('Audi');
                expect(createdCar.model).to.eq('TT');
                expect(createdCar.mileage).to.eq(10000);

                // 5. Prepare expense data
                const expenseData = {
                    carId: carId,
                    reportedAt: new Date().toISOString().split('T')[0],
                    mileage: 10100,
                    liters: 30,
                    totalCost: 60
                };

                // 6. Create expense through API
                cy.createExpense(expenseData).then((apiResponse) => {
                    expect([200, 201]).to.include(apiResponse.status);
                    expect(apiResponse.body.status).to.eq('ok');

                    const createdExpense = apiResponse.body.data;

                    expect(createdExpense.id).to.exist;
                    expect(createdExpense.carId).to.eq(carId);
                    expect(createdExpense.mileage).to.eq(10100);
                    expect(createdExpense.liters).to.eq(30);
                    expect(createdExpense.totalCost).to.eq(60);

                    // 7. Open Fuel Expenses page
                    cy.env(['username', 'password']).then((env) => {
                        cy.visit('/panel/expenses', {
                            auth: {
                                username: env.username,
                                password: env.password
                            }
                        });
                    });

                    // 8. Verify created expense through UI
                    cy.contains('tr', '10100').within(() => {
                        cy.contains('30L').should('be.visible');
                        cy.contains('60.00').should('be.visible');
                    });
                });
            });
        });
    });
});
