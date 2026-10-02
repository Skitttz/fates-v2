import './commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      findField(label: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('findField', (label: string) =>
  cy
    .contains('label', label)
    .invoke('attr', 'for')
    .then((id) => cy.get(`#${CSS.escape(String(id))}`)),
);

beforeEach(() => {
  cy.clearLocalStorage();
});
