class ExpensesPage {
    openAddExpenseModal() {
        cy.contains('button', 'Add fuel expense').click();
    }

    addExpense(mileage, liters, totalCost) {
        cy.get('#addExpenseMileage').clear().type(String(mileage));
        cy.get('#addExpenseLiters').type(String(liters));
        cy.get('#addExpenseTotalCost').type(String(totalCost));

        cy.get('ngb-modal-window')
            .contains('button', 'Add')
            .click();
    }
}

module.exports = new ExpensesPage();
