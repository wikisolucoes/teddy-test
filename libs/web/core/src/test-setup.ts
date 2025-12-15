/// <reference types="jest" />

// Mock do módulo env.config para testes
jest.mock('./lib/shared/config/env.config', () => ({
  env: {
    apiUrl: 'http://localhost:3000/api',
  },
}));
