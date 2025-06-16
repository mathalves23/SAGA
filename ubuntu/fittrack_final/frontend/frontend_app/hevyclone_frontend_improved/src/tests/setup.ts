// Test setup and configuration
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator APIs
Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    register: vi.fn().mockResolvedValue({
      scope: '/',
      unregister: vi.fn(),
      update: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    ready: Promise.resolve({
      scope: '/',
      unregister: vi.fn(),
      update: vi.fn(),
    }),
    controller: null,
    getRegistration: vi.fn(),
    getRegistrations: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
});

Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock Web APIs
Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      get length() {
        return Object.keys(store).length;
      },
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
    };
  })(),
});

Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      get length() {
        return Object.keys(store).length;
      },
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
    };
  })(),
});

// Mock fetch
global.fetch = vi.fn();

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    navigation: {
      loadEventEnd: 1000,
      domContentLoadedEventEnd: 800,
      responseEnd: 600,
      requestStart: 100,
    },
  },
});

// Mock Image constructor for lazy loading tests
class MockImage {
  src = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 100);
  }
}

Object.defineProperty(global, 'Image', {
  writable: true,
  value: MockImage,
});

// Mock canvas for chart tests
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  canvas: {
    width: 800,
    height: 600,
  },
}));

// Mock framer-motion for animation tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (target, prop) => {
          return React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement(prop as string, { ...props, ref }, children)
          );
        },
      }
    ),
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const icons = [
    'Home', 'User', 'Settings', 'Search', 'Plus', 'Minus', 'Check', 'X',
    'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown',
    'Heart', 'Star', 'Share', 'Download', 'Upload',
    'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack',
    'Volume2', 'VolumeX', 'Wifi', 'WifiOff',
    'Eye', 'EyeOff', 'Lock', 'Unlock',
    'Dumbbell', 'TrendingUp', 'Calendar', 'Clock',
    'Mail', 'Phone', 'Camera', 'Image', 'File',
    'Edit', 'Trash2', 'Save', 'Copy', 'External Link',
    'Info', 'AlertCircle', 'CheckCircle', 'XCircle',
    'Loader2', 'Zap', 'Target', 'Award',
  ];

  const mockIcons: Record<string, any> = {};
  
  icons.forEach(iconName => {
    mockIcons[iconName] = React.forwardRef(
      ({ size = 24, className = '', ...props }: any, ref: any) =>
        React.createElement('svg', {
          'data-testid': `${iconName.toLowerCase()}-icon`,
          width: size,
          height: size,
          className,
          ref,
          ...props,
        })
    );
  });

  return mockIcons;
});

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Global test utilities
global.testUtils = {
  // Helper to create mock API response
  mockApiResponse: <T>(data: T, status: number = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    headers: new Headers(),
  }),

  // Helper to mock async function with delay
  mockAsyncFunction: <T>(result: T, delay: number = 100) =>
    vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(result), delay))
    ),

  // Helper to mock error
  mockError: (message: string) =>
    vi.fn().mockRejectedValue(new Error(message)),

  // Helper to wait for async operations
  waitFor: (callback: () => void, timeout: number = 1000) =>
    new Promise<void>((resolve, reject) => {
      const startTime = Date.now();
      const checkCondition = () => {
        try {
          callback();
          resolve();
        } catch (error) {
          if (Date.now() - startTime >= timeout) {
            reject(error);
          } else {
            setTimeout(checkCondition, 10);
          }
        }
      };
      checkCondition();
    }),

  // Helper to trigger events
  fireEvent: {
    swipe: (element: Element, direction: 'left' | 'right' | 'up' | 'down') => {
      const startCoords = { x: 100, y: 100 };
      const endCoords = {
        left: { x: 0, y: 100 },
        right: { x: 200, y: 100 },
        up: { x: 100, y: 0 },
        down: { x: 100, y: 200 },
      }[direction];

      // Simulate touch events
      element.dispatchEvent(new TouchEvent('touchstart', {
        touches: [{ clientX: startCoords.x, clientY: startCoords.y } as Touch]
      }));

      element.dispatchEvent(new TouchEvent('touchmove', {
        touches: [{ clientX: endCoords.x, clientY: endCoords.y } as Touch]
      }));

      element.dispatchEvent(new TouchEvent('touchend', {
        changedTouches: [{ clientX: endCoords.x, clientY: endCoords.y } as Touch]
      }));
    },

    longPress: (element: Element, duration: number = 500) => {
      element.dispatchEvent(new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      }));

      setTimeout(() => {
        element.dispatchEvent(new TouchEvent('touchend', {
          changedTouches: [{ clientX: 100, clientY: 100 } as Touch]
        }));
      }, duration);
    },
  },
};

// Add React import for JSX
import React from 'react';

// Console warnings that we want to suppress in tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: validateDOMNesting') ||
     args[0].includes('Warning: Function components cannot be given refs'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Setup cleanup
afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  
  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear any pending async operations
  return new Promise(resolve => setTimeout(resolve, 0));
});

// Global test timeout
vi.setConfig({
  testTimeout: 10000,
}); 