class GaragePage {
    openAddCarModal() {
        cy.contains('button', 'Add car')
            .should('be.visible')
            .click();

        cy.get('ngb-modal-window')
            .should('be.visible');
    }

    addCar(brand, model, mileage) {
        cy.get('ngb-modal-window').within(() => {
            cy.get('#addCarBrand')
                .select(brand);

            cy.get('#addCarModel')
                .select(model);

            cy.get('#addCarMileage')
                .clear()
                .type(String(mileage));

            cy.contains('button', 'Add')
                .should('be.enabled')
                .click();
        });

        // Car creation must finish before continuing
        cy.get('ngb-modal-window', { timeout: 10000 })
            .should('not.exist');
    }

    verifyCarExists(brand, model) {
        cy.contains(`${brand} ${model}`)
            .should('be.visible');
    }
}

module.exports = new GaragePage();
