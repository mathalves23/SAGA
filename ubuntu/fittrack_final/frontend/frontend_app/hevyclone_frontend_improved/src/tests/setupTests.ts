// Setup dos Testes para SAGA
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup após cada teste
afterEach(() => {
  cleanup();
});

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock as any;

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do window.scrollTo
global.scrollTo = vi.fn();

// Mock das Notifications
global.Notification = {
  permission: 'default',
  requestPermission: vi.fn().mockResolvedValue('granted'),
} as any;

// Mock do navigator.serviceWorker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn().mockResolvedValue({
      active: { postMessage: vi.fn() },
      installing: null,
      waiting: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    ready: Promise.resolve({
      active: { postMessage: vi.fn() },
      pushManager: {
        subscribe: vi.fn(),
        getSubscription: vi.fn(),
      },
    }),
  },
  writable: true,
});

// Mock do fetch global
global.fetch = vi.fn();

// Extend expect com matchers customizados
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received !== null && received !== undefined;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    };
  },
  toHaveClass: (received, className) => {
    const pass = received?.classList?.contains(className) || false;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have class "${className}"`,
      pass,
    };
  },
});

// Configuração global de timeouts
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000,
});

export {}; 