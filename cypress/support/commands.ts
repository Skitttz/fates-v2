/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email = 'demo@fates.com', password = 'fates123') => {
  cy.findField('E-mail').clear().type(email);
  cy.findField('Senha').clear().type(password);
  cy.contains('button', /^Entrar$/).click();
});

export {};
