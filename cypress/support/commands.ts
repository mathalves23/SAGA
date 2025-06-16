// Comandos customizados para testes E2E do SAGA

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando para fazer login
       * @param email - Email do usuário
       * @param password - Senha do usuário
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Comando para fazer logout
       */
      logout(): Chainable<void>
      
      /**
       * Comando para criar um treino de teste
       * @param workoutData - Dados do treino
       */
      createWorkout(workoutData: any): Chainable<void>
      
      /**
       * Comando para limpar dados de teste
       */
      cleanTestData(): Chainable<void>
      
      /**
       * Comando para seed de dados de teste
       */
      seedTestData(): Chainable<void>
    }
  }
}

// Implementação dos comandos

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="submit-login"]').click();
    
    // Aguardar redirecionamento e verificar token
    cy.url().should('not.include', '/login');
    cy.window().its('localStorage').invoke('getItem', 'token').should('exist');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"]').click();
  cy.get('[data-cy="logout-button"]').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

Cypress.Commands.add('createWorkout', (workoutData) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/workouts`,
    headers: {
      'Authorization': `Bearer ${window.localStorage.getItem('token')}`
    },
    body: workoutData
  }).then((response) => {
    expect(response.status).to.eq(201);
  });
});

Cypress.Commands.add('cleanTestData', () => {
  cy.task('db:clean');
});

Cypress.Commands.add('seedTestData', () => {
  cy.task('db:seed');
});

// Comandos para interceptar APIs
Cypress.Commands.add('interceptAPI', () => {
  // Interceptar chamadas da API
  cy.intercept('POST', '/api/auth/signin', { fixture: 'auth/signin-success.json' }).as('login');
  cy.intercept('POST', '/api/auth/signup', { fixture: 'auth/signup-success.json' }).as('register');
  cy.intercept('GET', '/api/users/profile', { fixture: 'user/profile.json' }).as('userProfile');
  cy.intercept('GET', '/api/workouts', { fixture: 'workouts/list.json' }).as('workoutsList');
  cy.intercept('POST', '/api/workouts', { fixture: 'workouts/create-success.json' }).as('createWorkout');
});

export {}; 