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

  const walkToGlow = (): void => {
    cy.get('body').trigger('keydown', { key: 'ArrowRight', code: 'ArrowRight', force: true });
    cy.contains('Opa, um cone!', { timeout: 8000 }).should('exist');
    cy.get('body').trigger('keydown', { key: ' ', code: 'Space', force: true });
    cy.get('body').trigger('keyup', { key: ' ', code: 'Space', force: true });
    cy.contains('Fates. Destinos, no plural.', { timeout: 8000 }).should('exist');
    cy.get('body').trigger('keyup', { key: 'ArrowRight', code: 'ArrowRight', force: true });
  };

  it('joga a história até o final', () => {
    cy.visit('/about');
    cy.contains('Aracaju. Fim de tarde.').should('exist');

    advanceUntil('Ollie!');
    cy.contains('button', 'Ollie!').click();

    advanceUntil('Leve o Paulo até o brilho.');
    walkToGlow();

    advanceUntil('Onde colar o primeiro?');
    cy.contains('button', 'No poste').click();
    cy.contains('Alguém parou para olhar').should('exist');
    cy.contains('button', 'Ver meu destino').click();

    cy.contains('E o ursinho nunca mais ficou invisível.').should('exist');
    cy.contains('Quem espera o ônibus agora tem pra onde olhar.').should('exist');
    cy.get('img[alt*="poste"]').should('exist');
  });

  it('o ursinho comenta o ollie errado', () => {
    cy.visit('/about');
    advanceUntil('Ollie!');
    cy.contains('button', 'Ollie!').click();

    advanceUntil('Eu vi você cair lá na pista.');
    cy.contains('Eu vi seu ollie.').should('not.exist');
  });

  it('o ursinho comenta o ollie acertado', () => {
    cy.visit('/about');
    advanceUntil('Ollie!');
    cy.get('[role="meter"]', { timeout: 8000 }).should(($meter) => {
      expect(Number($meter.attr('aria-valuenow'))).to.be.within(70, 78);
    });
    cy.contains('button', 'Ollie!').click();

    advanceUntil('Eu vi seu ollie. Você acertou… e mesmo assim caiu.');
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
    walkToGlow();

    pressUntil('Onde colar o primeiro?');
    cy.focused().should('contain', 'No caixote').trigger('keydown', { key: 'ArrowRight' });
    cy.focused().should('contain', 'No poste').click();
    cy.contains('button', 'Ver meu destino').focus().type('{enter}');

    cy.get('section[aria-label="Final da história"]', { timeout: 8000 }).should('have.focus');
    cy.get('img[alt*="poste"]').should('exist');
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

  it('segura o espaço no jogo durante a caminhada e devolve ao clicar fora', () => {
    cy.visit('/about');
    advanceUntil('Ollie!');
    cy.contains('button', 'Ollie!').click();
    advanceUntil('Leve o Paulo até o brilho.');
    cy.window().then((win) => {
      const event = new win.KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });
      win.document.body.dispatchEvent(event);
      expect(event.defaultPrevented).to.equal(true);
    });
    cy.get('footer').click({ force: true });
    cy.window().then((win) => {
      const event = new win.KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });
      win.document.body.dispatchEvent(event);
      expect(event.defaultPrevented).to.equal(false);
    });
  });
});
