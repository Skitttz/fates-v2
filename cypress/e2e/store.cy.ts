describe('Vitrine', () => {
  it('mostra os produtos do drop na home', () => {
    cy.visit('/');
    cy.contains('h1', 'Essência').should('exist');
    cy.get('[data-testid="product-card"]').should('have.length', 3);
  });

  it('busca e filtra produtos no catálogo', () => {
    cy.visit('/products');
    cy.get('input[name="q"]').type('gorro{enter}');
    cy.url().should('include', 'q=gorro');
    cy.get('[data-testid="product-card"]').should('have.length', 1).and('contain', 'Gorro');

    cy.visit('/products?category=calcas');
    cy.get('[data-testid="product-card"]').should('have.length', 1).and('contain', 'Calça');

    cy.visit('/products?q=nada-com-isso');
    cy.contains('Nada por aqui').should('exist');
  });

  it('abre o detalhe do produto a partir do card', () => {
    cy.visit('/');
    cy.contains('[data-testid="product-card"]', 'Camiseta Masculina Fates').click();
    cy.url().should('include', '/products/camiseta-masculina-fates');
    cy.contains('h1', 'Camiseta Masculina Fates').should('exist');
  });

  it('rola suavemente até a seção pela cidade pela âncora do hero', () => {
    cy.visit('/');
    cy.contains('a', 'Pela cidade').click();
    cy.location('hash').should('eq', '#pela-cidade');
    cy.window().its('scrollY').should('be.greaterThan', 0);
  });

  it('mostra a página 404 para produto inexistente', () => {
    cy.visit('/products/nao-existe', { failOnStatusCode: false });
    cy.contains('Fora do mapa').should('exist');
  });
});
