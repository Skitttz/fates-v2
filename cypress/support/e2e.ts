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
  // O modo headless não depende dos snapshots gráficos das View Transitions.
  if (Cypress.isBrowser({ family: 'chromium' })) {
    cy.then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Emulation.setEmulatedMedia',
        params: { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
      }),
    );
  }
  cy.clearLocalStorage();
});
