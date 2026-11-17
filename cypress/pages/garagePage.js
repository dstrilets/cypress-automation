class GaragePage {
    openAddCarModal() {
        cy.contains('button', 'Add car').click();
    }

    addCar(brand, model, mileage) {
        cy.get('ngb-modal-window').within(() => {
            cy.get('#addCarBrand').select(brand);
            cy.get('#addCarModel').select(model);
            cy.get('#addCarMileage').type(String(mileage));
            cy.contains('button', 'Add').click();
        });
    }

    verifyCarExists(brand, model) {
        cy.contains(`${brand} ${model}`).should('be.visible');
    }
}

module.exports = new GaragePage();