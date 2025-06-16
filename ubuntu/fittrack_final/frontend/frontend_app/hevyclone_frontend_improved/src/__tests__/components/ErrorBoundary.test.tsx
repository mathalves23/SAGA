import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from '../../components/ErrorBoundary';

// Componente que gera erro para testar o ErrorBoundary
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock do window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suprimir console.error durante os testes
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when there is no error', () => {
    // Given & When
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Then
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should render error UI when child component throws error', () => {
    // Given & When
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Then
    expect(screen.getByText('😵')).toBeInTheDocument();
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Ocorreu um erro inesperado. Tente recarregar a página.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recarregar Página' })).toBeInTheDocument();
  });

  it('should call window.location.reload when reload button is clicked', async () => {
    // Given
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: 'Recarregar Página' });

    // When - Simular click direto no elemento
    reloadButton.click();

    // Then
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should log error to console when error occurs', () => {
    // Given
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // When
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Then
    expect(consoleSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('should have correct CSS classes for error UI', () => {
    // Given & When
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Then
    const button = screen.getByRole('button', { name: 'Recarregar Página' });
    expect(button).toHaveClass('px-6', 'py-3', 'bg-purple-600', 'text-white', 'rounded-lg');
  });

  it('should handle multiple errors gracefully', () => {
    // Given
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();

    // When - trigger error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Then
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });

  it('should maintain error state after re-render', () => {
    // Given
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();

    // When - re-render with different props but same error state
    rerender(
      <ErrorBoundary>
        <div>Different content</div>
      </ErrorBoundary>
    );

    // Then - should still show error UI
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(screen.queryByText('Different content')).not.toBeInTheDocument();
  });
}); 