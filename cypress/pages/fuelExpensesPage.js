class FuelExpensesPage {
    openAddExpenseModal() {
        cy.get('ngb-modal-window')
            .should('not.exist');

        cy.contains('button', 'Add fuel expense')
            .first()
            .should('be.visible')
            .click();

        cy.get('ngb-modal-window')
            .should('be.visible');
    }

    addExpense(mileage, liters, totalCost) {
        cy.get('ngb-modal-window').within(() => {
            cy.get('select')
                .first()
                .find('option')
                .filter((index, option) =>
                    option.textContent.trim() === 'Audi TT'
                )
                .first()
                .then(($option) => {
                    cy.get('select')
                        .first()
                        .select($option.val());
                });

            cy.get('#addExpenseMileage')
                .clear()
                .type(String(mileage));

            cy.get('#addExpenseLiters')
                .clear()
                .type(String(liters));

            cy.get('#addExpenseTotalCost')
                .clear()
                .type(String(totalCost));

            cy.contains('button', 'Add')
                .should('be.enabled')
                .click();
        });

        cy.get('ngb-modal-window', { timeout: 10000 })
            .should('not.exist');
    }
}

module.exports = new FuelExpensesPage();
