describe('Sobre', () => {
  const DIALOGUE_BUTTON = 'button[aria-label="Avançar diálogo"]';

  const advanceUntil = (text: string, attempts = 40): void => {
    cy.get('main').then(($main) => {
      if ($main.text().includes(text)) return;
      if (attempts === 0) {
        throw new Error(`Texto não apareceu: ${text} | tela: ${$main.text().slice(-200)}`);
      }
      if ($main.find(DIALOGUE_BUTTON).length === 0) {
        cy.wait(300);
      } else {
        cy.get(DIALOGUE_BUTTON).click();
      }
      advanceUntil(text, attempts - 1);
    });
  };

  it('joga a história até o final', () => {
    cy.visit('/about');
    cy.contains('Aracaju. Fim de tarde.').should('exist');

    advanceUntil('Ollie!');
    cy.contains('button', 'Ollie!').click();

    advanceUntil('Leve o Paulo até o brilho.');
    cy.get('body').trigger('keydown', { key: 'ArrowRight', code: 'ArrowRight', force: true });
    cy.contains('Fates. Quer dizer destinos.', { timeout: 15000 }).should('exist');
    cy.get('body').trigger('keyup', { key: 'ArrowRight', code: 'ArrowRight', force: true });

    advanceUntil('Onde colar o primeiro?');
    cy.contains('button', 'No poste').click();

    cy.contains('E o ursinho nunca mais ficou invisível.').should('exist');
    cy.get('img[alt*="poste"]').should('exist');
  });

  const pressUntil = (text: string, attempts = 40): void => {
    cy.get('main').then(($main) => {
      if ($main.text().includes(text)) return;
      if (attempts === 0) {
        throw new Error(`Texto não apareceu: ${text} | tela: ${$main.text().slice(-200)}`);
      }
      if ($main.find(DIALOGUE_BUTTON).length === 0) {
        cy.wait(300);
      } else {
        cy.get('body').type('{enter}');
      }
      pressUntil(text, attempts - 1);
    });
  };

  it('joga a história só com o teclado', () => {
    cy.visit('/about');
    cy.get(DIALOGUE_BUTTON).should('contain', 'Aracaju');

    pressUntil('Ollie!');
    cy.get('body').type(' ');

    pressUntil('Leve o Paulo até o brilho.');
    cy.get('body').trigger('keydown', { key: 'ArrowRight', code: 'ArrowRight', force: true });
    cy.contains('Fates. Quer dizer destinos.', { timeout: 15000 }).should('exist');
    cy.get('body').trigger('keyup', { key: 'ArrowRight', code: 'ArrowRight', force: true });

    pressUntil('Onde colar o primeiro?');
    cy.focused().should('contain', 'No caixote').click();

    cy.get('section[aria-label="Final da história"]').should('have.focus');
    cy.get('img[alt*="caixote"]').should('exist');
  });

  it('pula a história e mostra o final', () => {
    cy.visit('/about');
    cy.contains('button', 'Pular história').click();
    cy.contains('E o ursinho nunca mais ficou invisível.').should('exist');
  });

  it('mostra a história como texto', () => {
    cy.visit('/about');
    cy.contains('button', 'Ler como texto').click();
    cy.contains('Eu guardei uma coisa pra quem me encontrasse.').should('exist');
  });
});
