describe('Carrinho, login e checkout', () => {
  it('adiciona ao carrinho, faz login e finaliza o pedido', () => {
    cy.visit('/products/camiseta-masculina-fates');

    cy.contains('button', 'Adicionar ao carrinho').click();
    cy.contains('Escolha um tamanho').should('exist');

    cy.contains('label', /^M$/).click();
    cy.contains('button', 'Adicionar ao carrinho').click();
    cy.get('[data-testid="cart-count"]').should('have.text', '1');

    cy.visit('/cart');
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.contains('button', 'Entrar para finalizar').click();

    cy.url().should('include', '/login?redirect=%2Fcart');
    cy.login('demo@fates.com', 'senha-errada');
    cy.contains('E-mail ou senha inválidos.').should('exist');

    cy.login();
    cy.location('pathname').should('eq', '/cart');
    cy.contains('Olá,').should('exist');

    cy.contains('button', 'Finalizar compra').click();
    cy.contains('Pedido confirmado').should('exist');
    cy.get('[data-testid="order-code"]').invoke('text').should('match', /^FTS-/);
    cy.get('[data-testid="cart-count"]').should('have.text', '0');

    cy.get('button[aria-label="Sair da conta"]').click();
    cy.get('dialog[open]').within(() => {
      cy.contains('Sair da conta?').should('be.visible');
      cy.contains('button', 'Continuar conectado').click();
    });
    cy.contains('Olá,').should('exist');

    cy.get('button[aria-label="Sair da conta"]').click();
    cy.get('dialog[open]')
      .contains('button', /^Sair$/)
      .click();
    cy.contains('a', 'Entrar').should('exist');
  });

  it('valida o formulário de login', () => {
    cy.visit('/login');
    cy.contains('button', /^Entrar$/).click();
    cy.contains('Campo obrigatório').should('exist');

    cy.findField('E-mail').type('email-invalido').blur();
    cy.contains('Valor inválido').should('exist');
  });
});
