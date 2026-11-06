describe('Registration tests', () => {
    const url = 'https://qauto.forstudy.space/';

    const fields = {
        name: '#signupName',
        lastName: '#signupLastName',
        email: '#signupEmail',
        password: '#signupPassword',
        repeatPassword: '#signupRepeatPassword',
    };

    const validUser = {
        name: 'Daria',
        lastName: 'Smith',
        password: 'Password123',
    };

    const uniqueEmail = () =>
        `daria.test.${Date.now()}.${Math.floor(Math.random() * 100000)}@gmail.com`;

    const openRegistration = () => {
        cy.contains('button', 'Sign up').click();

        cy.get('h4.modal-title')
            .should('be.visible')
            .and('contain.text', 'Registration');
    };

    const checkValidation = (selector, message) => {
        cy.get(selector)
            .parent()
            .should('contain.text', message);

        cy.get(selector)
            .should('have.class', 'is-invalid');
    };

    const fillValidForm = (email = uniqueEmail()) => {
        cy.get(fields.name).type(validUser.name);
        cy.get(fields.lastName).type(validUser.lastName);
        cy.get(fields.email).type(email);
        cy.get(fields.password).type(validUser.password, {
            sensitive: true,
        });
        cy.get(fields.repeatPassword).type(validUser.password, {
            sensitive: true,
        });

        return email;
    };

    beforeEach(() => {
        cy.env(['username', 'password']).then(({ username, password }) => {
            cy.visit(url, {
                auth: {
                    username,
                    password,
                },
            });
        });

        openRegistration();
    });

    it('should display registration form', () => {
        Object.values(fields).forEach((selector) => {
            cy.get(selector).should('be.visible');
        });

        cy.contains('button', 'Register')
            .should('be.visible');
    });

    it('should validate required name', () => {
        cy.get(fields.name).focus().blur();

        checkValidation(fields.name, 'Name required');
    });

    it('should validate name minimum length', () => {
        cy.get(fields.name).type('A').blur();

        checkValidation(
            fields.name,
            'Name has to be from 2 to 20 characters long'
        );
    });

    it('should validate name maximum length', () => {
        cy.get(fields.name).type('A'.repeat(21)).blur();

        checkValidation(
            fields.name,
            'Name has to be from 2 to 20 characters long'
        );
    });

    it('should reject invalid name', () => {
        cy.get(fields.name).type('12345').blur();

        checkValidation(fields.name, 'Name is invalid');
    });

    it('should validate spaces-only name', () => {
        cy.get(fields.name).type('   ').blur();

        cy.get(fields.name)
            .should('have.class', 'is-invalid');
    });

    it('should validate required last name', () => {
        cy.get(fields.lastName).focus().blur();

        checkValidation(fields.lastName, 'Last name required');
    });

    it('should validate last name minimum length', () => {
        cy.get(fields.lastName).type('A').blur();

        checkValidation(
            fields.lastName,
            'Last name has to be from 2 to 20 characters long'
        );
    });

    it('should validate last name maximum length', () => {
        cy.get(fields.lastName).type('A'.repeat(21)).blur();

        checkValidation(
            fields.lastName,
            'Last name has to be from 2 to 20 characters long'
        );
    });

    it('should reject invalid last name', () => {
        cy.get(fields.lastName).type('12345').blur();

        checkValidation(fields.lastName, 'Last name is invalid');
    });

    it('should validate spaces-only last name', () => {
        cy.get(fields.lastName).type('   ').blur();

        cy.get(fields.lastName)
            .should('have.class', 'is-invalid');
    });

    it('should validate required email', () => {
        cy.get(fields.email).focus().blur();

        checkValidation(fields.email, 'Email required');
    });

    it('should reject email without @', () => {
        cy.get(fields.email).type('dariagmail.com').blur();

        checkValidation(fields.email, 'Email is incorrect');
    });

    it('should reject email without domain', () => {
        cy.get(fields.email).type('daria@').blur();

        checkValidation(fields.email, 'Email is incorrect');
    });

    it('should accept valid email', () => {
        cy.get(fields.email).type(uniqueEmail()).blur();

        cy.get(fields.email)
            .should('not.have.class', 'is-invalid');
    });

    it('should validate required password', () => {
        cy.get(fields.password).focus().blur();

        checkValidation(fields.password, 'Password required');
    });

    it('should validate password minimum length', () => {
        cy.get(fields.password)
            .type('Pass1', { sensitive: true })
            .blur();

        cy.get(fields.password)
            .should('have.class', 'is-invalid');
    });

    it('should validate password maximum length', () => {
        cy.get(fields.password)
            .type('Password1234567890123', { sensitive: true })
            .blur();

        cy.get(fields.password)
            .should('have.class', 'is-invalid');
    });

    it('should reject password without uppercase letter', () => {
        cy.get(fields.password)
            .type('password123', { sensitive: true })
            .blur();

        cy.get(fields.password)
            .should('have.class', 'is-invalid');
    });

    it('should reject password without lowercase letter', () => {
        cy.get(fields.password)
            .type('PASSWORD123', { sensitive: true })
            .blur();

        cy.get(fields.password)
            .should('have.class', 'is-invalid');
    });

    it('should reject password without number', () => {
        cy.get(fields.password)
            .type('PasswordABC', { sensitive: true })
            .blur();

        cy.get(fields.password)
            .should('have.class', 'is-invalid');
    });

    it('should validate required repeat password', () => {
        cy.get(fields.repeatPassword).focus().blur();

        checkValidation(
            fields.repeatPassword,
            'Re-enter password required'
        );
    });

    it('should reject mismatched passwords', () => {
        cy.get(fields.password)
            .type('Password123', { sensitive: true });

        cy.get(fields.repeatPassword)
            .type('Password456', { sensitive: true })
            .blur();

        cy.get(fields.repeatPassword)
            .should('have.class', 'is-invalid');
    });

    it('should accept matching passwords', () => {
        cy.get(fields.password)
            .type('Password123', { sensitive: true });

        cy.get(fields.repeatPassword)
            .type('Password123', { sensitive: true })
            .blur();

        cy.get(fields.repeatPassword)
            .should('not.have.class', 'is-invalid');
    });

    it('should disable Register button for empty form', () => {
        cy.contains('button', 'Register')
            .should('be.disabled');
    });

    it('should register a new user successfully', () => {
        fillValidForm();

        cy.contains('button', 'Register')
            .should('be.enabled')
            .click();

        cy.contains('Garage')
            .should('be.visible');
    });

    it('should login with newly registered user', () => {
        const email = uniqueEmail();
        const password = validUser.password;

        fillValidForm(email);

        cy.contains('button', 'Register')
            .should('be.enabled')
            .click();

        cy.contains('Garage')
            .should('be.visible');

        cy.contains('Log out').click();

        cy.contains('button', 'Sign In')
            .should('be.visible')
            .click();

        cy.get('#signinEmail')
            .should('be.visible')
            .type(email);

        cy.get('#signinPassword')
            .type(password, { sensitive: true });

        cy.get('.modal-content')
            .contains('button', 'Login')
            .click();

        cy.contains('Garage')
            .should('be.visible');
    });
});