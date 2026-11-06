describe('Footer tests', () => {
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

    it('should display all social media links', () => {
        cy.get('#contactsSection')
            .find('.contacts_socials')
            .find('a.socials_link')
            .should('have.length', 5)
            .each(($link) => {
                cy.wrap($link)
                    .should('be.visible')
                    .and('have.attr', 'href');
            });
    });

    it('should display Hillel website link', () => {
        cy.get('#contactsSection')
            .contains('a', 'ithillel.ua')
            .should('be.visible')
            .and('have.attr', 'href');
    });

    it('should display support email link', () => {
        cy.get('#contactsSection')
            .contains('a', 'support@ithillel.ua')
            .should('be.visible')
            .and('have.attr', 'href', 'mailto:support@ithillel.ua');
    });
});

// Known issue: support email link points to developer@ithillel.ua