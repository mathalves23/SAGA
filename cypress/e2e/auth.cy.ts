/// <reference types="cypress" />

describe('SAGA - Autenticação E2E', () => {
  beforeEach(() => {
    // Limpar dados e navegar para a página inicial
    cy.task('db:clean');
    cy.visit('/');
  });

  describe('Login', () => {
    it('deve fazer login com credenciais válidas', () => {
      // Navegar para página de login
      cy.get('[data-cy="login-button"]').click();
      
      // Preencher formulário
      cy.get('[data-cy="email-input"]').type(Cypress.env('TEST_USER_EMAIL'));
      cy.get('[data-cy="password-input"]').type(Cypress.env('TEST_USER_PASSWORD'));
      
      // Submeter formulário
      cy.get('[data-cy="submit-login"]').click();
      
      // Verificar redirecionamento para dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-cy="user-menu"]').should('be.visible');
      
      // Verificar se token foi salvo
      cy.window().its('localStorage').invoke('getItem', 'token').should('exist');
    });

    it('deve mostrar erro com credenciais inválidas', () => {
      cy.get('[data-cy="login-button"]').click();
      
      cy.get('[data-cy="email-input"]').type('invalid@email.com');
      cy.get('[data-cy="password-input"]').type('wrongpassword');
      cy.get('[data-cy="submit-login"]').click();
      
      // Verificar mensagem de erro
      cy.get('[data-cy="error-message"]')
        .should('be.visible')
        .and('contain', 'Credenciais inválidas');
      
      // Verificar que permanece na página de login
      cy.url().should('include', '/login');
    });

    it('deve validar campos obrigatórios', () => {
      cy.get('[data-cy="login-button"]').click();
      cy.get('[data-cy="submit-login"]').click();
      
      // Verificar validação de email
      cy.get('[data-cy="email-error"]')
        .should('be.visible')
        .and('contain', 'Email é obrigatório');
      
      // Verificar validação de senha
      cy.get('[data-cy="password-error"]')
        .should('be.visible')
        .and('contain', 'Senha é obrigatória');
    });

    it('deve implementar rate limiting', () => {
      cy.get('[data-cy="login-button"]').click();
      
      // Tentar fazer login múltiplas vezes rapidamente
      for (let i = 0; i < 6; i++) {
        cy.get('[data-cy="email-input"]').clear().type('test@test.com');
        cy.get('[data-cy="password-input"]').clear().type('wrongpassword');
        cy.get('[data-cy="submit-login"]').click();
      }
      
      // Verificar bloqueio por rate limiting
      cy.get('[data-cy="rate-limit-error"]')
        .should('be.visible')
        .and('contain', 'Muitas tentativas');
    });
  });

  describe('Registro', () => {
    it('deve registrar novo usuário com sucesso', () => {
      cy.get('[data-cy="register-button"]').click();
      
      // Preencher formulário de registro
      cy.get('[data-cy="name-input"]').type('João da Silva');
      cy.get('[data-cy="email-input"]').type('joao@teste.com');
      cy.get('[data-cy="password-input"]').type('MinhaSenh@123');
      cy.get('[data-cy="confirm-password-input"]').type('MinhaSenh@123');
      
      // Aceitar termos
      cy.get('[data-cy="terms-checkbox"]').check();
      
      // Submeter formulário
      cy.get('[data-cy="submit-register"]').click();
      
      // Verificar redirecionamento
      cy.url().should('include', '/welcome');
      cy.get('[data-cy="welcome-message"]').should('contain', 'Bem-vindo');
    });

    it('deve validar força da senha', () => {
      cy.get('[data-cy="register-button"]').click();
      
      // Testar senha fraca
      cy.get('[data-cy="password-input"]').type('123');
      cy.get('[data-cy="password-strength"]')
        .should('be.visible')
        .and('contain', 'Fraca');
      
      // Testar senha forte
      cy.get('[data-cy="password-input"]').clear().type('MinhaSenh@123');
      cy.get('[data-cy="password-strength"]')
        .should('be.visible')
        .and('contain', 'Forte');
    });

    it('deve validar confirmação de senha', () => {
      cy.get('[data-cy="register-button"]').click();
      
      cy.get('[data-cy="password-input"]').type('MinhaSenh@123');
      cy.get('[data-cy="confirm-password-input"]').type('SenhasDiferentes');
      
      cy.get('[data-cy="submit-register"]').click();
      
      cy.get('[data-cy="password-mismatch-error"]')
        .should('be.visible')
        .and('contain', 'Senhas não coincidem');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Fazer login antes de cada teste de logout
      cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
    });

    it('deve fazer logout com sucesso', () => {
      cy.get('[data-cy="user-menu"]').click();
      cy.get('[data-cy="logout-button"]').click();
      
      // Verificar redirecionamento para página inicial
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Verificar que token foi removido
      cy.window().its('localStorage').invoke('getItem', 'token').should('be.null');
      
      // Verificar que botões de login aparecem
      cy.get('[data-cy="login-button"]').should('be.visible');
    });
  });

  describe('Proteção de Rotas', () => {
    it('deve redirecionar para login ao acessar rota protegida', () => {
      cy.visit('/dashboard');
      
      // Deve ser redirecionado para login
      cy.url().should('include', '/login');
      cy.get('[data-cy="login-form"]').should('be.visible');
    });

    it('deve permitir acesso após autenticação', () => {
      cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
      
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
      cy.get('[data-cy="dashboard-content"]').should('be.visible');
    });
  });

  describe('Recuperação de Senha', () => {
    it('deve solicitar recuperação de senha', () => {
      cy.get('[data-cy="login-button"]').click();
      cy.get('[data-cy="forgot-password-link"]').click();
      
      cy.get('[data-cy="email-input"]').type(Cypress.env('TEST_USER_EMAIL'));
      cy.get('[data-cy="submit-forgot-password"]').click();
      
      cy.get('[data-cy="success-message"]')
        .should('be.visible')
        .and('contain', 'Email de recuperação enviado');
    });
  });
}); 