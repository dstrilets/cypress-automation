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

    it('should add a car and validate API responses', () => {
        // Intercept car creation request
        cy.intercept('POST', '**/api/cars').as('createCar');

        // Create car through UI
        garagePage.openAddCarModal();
        garagePage.addCar('Audi', 'TT', 10000);

        // Validate POST response and save car ID
        cy.wait('@createCar').then(({ response }) => {
            expect(response, 'Create car response').to.exist;
            expect(response.statusCode).to.eq(201);
            expect(response.body.status).to.eq('ok');
            expect(response.body.data.id).to.exist;

            cy.wrap(response.body.data.id).as('createdCarId');
        });

        // Verify car in Garage UI
        garagePage.verifyCarExists('Audi', 'TT');

        // Get cars via API and verify the created car
        cy.get('@createdCarId').then((carId) => {
            cy.request({
                method: 'GET',
                url: '/api/cars'
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq('ok');

                const createdCar = response.body.data.find(
                    (car) => car.id === carId
                );

                expect(
                    createdCar,
                    'Created car exists in API response'
                ).to.exist;

                expect(createdCar.brand).to.eq('Audi');
                expect(createdCar.model).to.eq('TT');
                expect(createdCar.mileage).to.eq(10000);
            });
        });
    });
});
