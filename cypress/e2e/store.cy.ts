describe('Vitrine', () => {
  it('mostra os produtos do drop na home', () => {
    cy.visit('/');
    cy.contains('h1', 'Essência').should('exist');
    cy.get('[data-testid="product-card"]').should('have.length', 4);
  });

  it('busca e filtra produtos no catálogo', () => {
    cy.visit('/products');
    cy.get('input[name="q"]').type('touca{enter}');
    cy.url().should('include', 'q=touca');
    cy.get('[data-testid="product-card"]').should('have.length', 1).and('contain', 'Touca');

    cy.visit('/products?category=calcas');
    cy.get('[data-testid="product-card"]').should('have.length', 1).and('contain', 'Calça');

    cy.visit('/products?q=nada-com-isso');
    cy.contains('Nada por aqui').should('exist');
  });

  it('abre o detalhe do produto a partir do card', () => {
    cy.visit('/');
    cy.contains('[data-testid="product-card"]', 'Camiseta Basic Fates').click();
    cy.url().should('include', '/products/camiseta-basic-fates');
    cy.contains('h1', 'Camiseta Basic Fates').should('exist');
  });

  it('mostra a página 404 para produto inexistente', () => {
    cy.visit('/products/nao-existe', { failOnStatusCode: false });
    cy.contains('Perdeu o rolê').should('exist');
  });
});
