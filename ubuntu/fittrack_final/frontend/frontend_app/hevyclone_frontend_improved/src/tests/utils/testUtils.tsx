// Test Utils para SAGA
import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock User
export const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@saga.com',
  avatar: '/avatar.jpg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock Auth Context
export const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  updateProfile: vi.fn(),
};

// Wrapper para testes
interface AllTheProvidersProps {
  children: React.ReactNode;
  initialRoute?: string;
  authValue?: any;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ 
  children, 
  initialRoute = '/',
  authValue = mockAuthContext 
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  window.history.pushState({}, 'Test page', initialRoute);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider value={authValue}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// Custom render
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialRoute?: string;
    authValue?: any;
  }
) => {
  const { initialRoute, authValue, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders 
        initialRoute={initialRoute} 
        authValue={authValue}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// User Event Setup
export const setupUserEvent = () => userEvent.setup();

// Common Test Helpers
export const waitForLoadingToFinish = () => 
  waitFor(() => 
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument()
  );

export const expectToBeLoading = () => 
  expect(screen.getByText(/carregando/i)).toBeInTheDocument();

export const expectErrorMessage = (message: string) =>
  expect(screen.getByText(message)).toBeInTheDocument();

// Form Test Helpers
export const fillForm = async (fields: Record<string, string>) => {
  const user = setupUserEvent();
  
  for (const [label, value] of Object.entries(fields)) {
    const field = screen.getByLabelText(new RegExp(label, 'i'));
    await user.clear(field);
    await user.type(field, value);
  }
};

export const submitForm = async (buttonText = /enviar|salvar|criar/i) => {
  const user = setupUserEvent();
  const submitButton = screen.getByRole('button', { name: buttonText });
  await user.click(submitButton);
};

// Mock Data Generators
export const createMockWorkout = (overrides: Partial<any> = {}) => ({
  id: '1',
  name: 'Treino A - Peito e Tríceps',
  exercises: [
    {
      id: '1',
      name: 'Supino Reto',
      sets: [
        { reps: 12, weight: 80, rest: 90 },
        { reps: 10, weight: 85, rest: 90 },
        { reps: 8, weight: 90, rest: 90 },
      ],
    },
  ],
  duration: 3600,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockExercise = (overrides: Partial<any> = {}) => ({
  id: '1',
  name: 'Supino Reto',
  category: 'Peito',
  equipment: 'Barra',
  instructions: ['Deite no banco', 'Segure a barra', 'Empurre para cima'],
  muscleGroups: ['Peitoral maior', 'Tríceps'],
  image: '/exercise.jpg',
  ...overrides,
});

export const createMockRoutine = (overrides: Partial<any> = {}) => ({
  id: '1',
  name: 'Push Pull Legs',
  description: 'Rotina para ganho de massa',
  workouts: [
    createMockWorkout({ name: 'Push Day' }),
    createMockWorkout({ name: 'Pull Day' }),
    createMockWorkout({ name: 'Leg Day' }),
  ],
  ...overrides,
});

// API Mock Helpers
export const mockApiResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
});

export const mockApiError = (message = 'API Error', status = 500) =>
  Promise.reject(new Error(message));

// Component Test Helpers
export const renderWithRouter = (
  component: ReactElement,
  route = '/'
) => {
  window.history.pushState({}, 'Test page', route);
  return customRender(component);
};

export const renderWithAuth = (
  component: ReactElement,
  authValue = mockAuthContext
) => customRender(component, { authValue });

export const renderUnauthenticated = (component: ReactElement) =>
  renderWithAuth(component, {
    ...mockAuthContext,
    user: null,
    isAuthenticated: false,
  });

// Performance Test Helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  await waitFor(() => expect(screen.getByTestId('content')).toBeInTheDocument());
  const end = performance.now();
  return end - start;
};

// Accessibility Test Helpers
export const checkA11y = async () => {
  const { axe, toHaveNoViolations } = await import('jest-axe');
  expect.extend(toHaveNoViolations);
  
  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
};

// Mock Service Worker Helpers
export const mockSuccessResponse = (data: any) => ({
  status: 200,
  response: data,
});

export const mockErrorResponse = (message: string, status = 400) => ({
  status,
  response: { error: message },
});

// Local Storage Helpers
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Animation Test Helpers
export const skipAnimations = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
};

// Responsive Test Helpers
export const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  window.dispatchEvent(new Event('resize'));
};

export const mockMobile = () => setViewport(375, 667);
export const mockTablet = () => setViewport(768, 1024);
export const mockDesktop = () => setViewport(1920, 1080);

// Date Helpers
export const mockDate = (dateString: string) => {
  const mockDate = new Date(dateString);
  vi.setSystemTime(mockDate);
  return mockDate;
};

export const resetDate = () => {
  vi.useRealTimers();
};

// Network Helpers
export const mockOffline = () => {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false,
  });
  window.dispatchEvent(new Event('offline'));
};

export const mockOnline = () => {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true,
  });
  window.dispatchEvent(new Event('online'));
};

// Notification Helpers
export const mockNotificationPermission = (permission: NotificationPermission) => {
  Object.defineProperty(Notification, 'permission', {
    value: permission,
    writable: true,
  });
};

// Custom Matchers
export const customMatchers = {
  toBeVisible: (element: Element) => ({
    pass: element && getComputedStyle(element).display !== 'none',
    message: () => 'Expected element to be visible',
  }),
  
  toHaveAttribute: (element: Element, attribute: string, value?: string) => {
    const hasAttribute = element.hasAttribute(attribute);
    const attributeValue = element.getAttribute(attribute);
    
    if (value === undefined) {
      return {
        pass: hasAttribute,
        message: () => `Expected element to have attribute "${attribute}"`,
      };
    }
    
    return {
      pass: hasAttribute && attributeValue === value,
      message: () => `Expected element to have attribute "${attribute}" with value "${value}"`,
    };
  },
};

// Export tudo
export * from '@testing-library/react';
export { customRender as render };
export { 
  waitFor, 
  screen, 
  fireEvent,
  act,
  renderHook,
  cleanup
} from '@testing-library/react'; 