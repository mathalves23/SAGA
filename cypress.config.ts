import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URL da aplicação
    baseUrl: 'http://localhost:3001',
    
    // Configurações dos testes
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    
    // Configurações de retry
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Configurações específicas do SAGA
    env: {
      API_URL: 'http://localhost:8080/api',
      TEST_USER_EMAIL: 'test@saga.com',
      TEST_USER_PASSWORD: 'Test123!@#',
      ADMIN_EMAIL: 'admin@saga.com',
      ADMIN_PASSWORD: 'Admin123!@#',
    },
    
    // Setup dos testes
    setupNodeEvents(on, config) {
      // Plugin para relatórios
      require('@cypress/code-coverage/task')(on, config);
      
      // Plugin para limpeza do banco de dados
      on('task', {
        'db:seed': () => {
          // Seed do banco de dados para testes
          return null;
        },
        'db:clean': () => {
          // Limpeza do banco de dados
          return null;
        },
        log(message) {
          console.log(message);
          return null;
        },
      });
      
      return config;
    },
    
    // Especificações de teste
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Configurações experimentais
    experimentalStudio: true,
    experimentalWebKitSupport: true,
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
}); 