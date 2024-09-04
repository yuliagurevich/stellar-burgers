describe('Burger constructor functionality', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('should add a bun to the burger constructor', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-top]').contains('Булка 1').should('exist');
    cy.get('[data-cy=constructor-bun-bottom]')
      .contains('Булка 1')
      .should('exist');
  });

  it('should replace the existing bun in the burger constructor', function () {
    cy.get('[data-cy=bun-ingredients]')
      .find('li')
      .eq(1)
      .contains('Добавить')
      .click();
    cy.get('[data-cy=constructor-bun-top]').contains('Булка 2').should('exist');
    cy.get('[data-cy=constructor-bun-bottom]')
      .contains('Булка 2')
      .should('exist');
  });

  it('should add an ingredient to the burger constructor', function () {
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Начинка 1')
      .should('exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Соус 1')
      .should('exist');
  });
});

describe('Ingredients details modal', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('should open on ingredient click with correct ingredient', function () {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Начинка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Начинка 1').should('exist');
  });

  it('should close on button click', function () {
    cy.contains('Начинка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy="close-button"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('should slose on overlay click', function () {
    cy.contains('Начинка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy="modal-overlay"]').click('left', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Order', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'placeOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('fake-refresh-token')
    );
    cy.setCookie('accessToken', 'fake-access-token');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should be processed correctly', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=order-area]').find('button').click();

    cy.wait('@placeOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '2', '3', '1']
      });

    cy.get('[data-cy="order-number"]').contains('11111').should('exist');

    cy.get('[data-cy="close-button"]').click();
    cy.contains('11111').should('not.exist');

    cy.get('[data-cy=constructor-bun-top]')
      .contains('Булка 1')
      .should('not.exist');
    cy.get('[data-cy=constructor-bun-bottom]')
      .contains('Булка 1')
      .should('not.exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Начинка 1')
      .should('not.exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Соус 1')
      .should('not.exist');
  });
});
