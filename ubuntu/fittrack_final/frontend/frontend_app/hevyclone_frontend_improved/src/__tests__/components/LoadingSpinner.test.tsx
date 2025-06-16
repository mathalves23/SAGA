import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should have correct accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Carregando');
  });

  it('should render with custom size when provided', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('should render with custom color when provided', () => {
    render(<LoadingSpinner color="white" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('border-white/20', 'border-t-white');
  });

  it('should have proper CSS classes for styling', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-4');
  });

  it('should render with default size and color', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8', 'h-8'); // size md
    expect(spinner).toHaveClass('border-purple-200', 'border-t-purple-600'); // color primary
  });

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('should have screen reader text', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
}); 