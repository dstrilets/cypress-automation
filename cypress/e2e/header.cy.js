
describe('Header tests', () => {
  beforeEach(() => {
    cy.env(['username', 'password']).then(({ username, password }) => {
        cy.visit('https://qauto.forstudy.space/', {
            auth: {
                username: username,
                password: password
            }
        });
    });
});

  it('should display all header navigation links', () => {
    cy.get('header').within(() => {
      cy.contains('Home').should('be.visible');
      cy.contains('About').should('be.visible');
      cy.contains('Contacts').should('be.visible');
    });
  });

  it('should display login buttons', () => {
    cy.get('header').within(() => {
      cy.contains('Guest log in').should('be.visible');
      cy.contains('Sign In').should('be.visible');
    });
  });
});
