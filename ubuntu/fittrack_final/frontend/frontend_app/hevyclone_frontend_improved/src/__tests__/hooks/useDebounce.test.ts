import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    // Given
    const initialValue = 'initial';
    const delay = 500;

    // When
    const { result } = renderHook(() => useDebounce(initialValue, delay));

    // Then
    expect(result.current).toBe(initialValue);
  });

  it('should debounce value changes', () => {
    // Given
    const delay = 500;
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay }
      }
    );

    expect(result.current).toBe('initial');

    // When - change value
    rerender({ value: 'updated', delay });

    // Then - value should not change immediately
    expect(result.current).toBe('initial');

    // When - advance time by less than delay
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Then - value should still be initial
    expect(result.current).toBe('initial');

    // When - advance time to complete delay
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Then - value should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer when value changes before delay completes', () => {
    // Given
    const delay = 500;
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay }
      }
    );

    // When - change value first time
    rerender({ value: 'first-change', delay });
    
    // Advance time partially
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Change value again before first delay completes
    rerender({ value: 'second-change', delay });

    // Advance time by original delay amount
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Then - should have the second change, not the first
    expect(result.current).toBe('second-change');
  });

  it('should handle multiple rapid changes', () => {
    // Given
    const delay = 300;
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay }
      }
    );

    // When - make multiple rapid changes
    rerender({ value: 'change1', delay });
    act(() => { vi.advanceTimersByTime(100); });
    
    rerender({ value: 'change2', delay });
    act(() => { vi.advanceTimersByTime(100); });
    
    rerender({ value: 'change3', delay });
    act(() => { vi.advanceTimersByTime(100); });
    
    rerender({ value: 'final-change', delay });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // When - complete the delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Then - should have only the final change
    expect(result.current).toBe('final-change');
  });

  it('should work with different data types', () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 200 }
      }
    );

    numberRerender({ value: 42, delay: 200 });
    act(() => { vi.advanceTimersByTime(200); });
    expect(numberResult.current).toBe(42);

    // Test with object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: { id: 1 }, delay: 200 }
      }
    );

    const newObject = { id: 2, name: 'test' };
    objectRerender({ value: newObject, delay: 200 });
    act(() => { vi.advanceTimersByTime(200); });
    expect(objectResult.current).toEqual(newObject);

    // Test with array
    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: [1, 2], delay: 200 }
      }
    );

    const newArray = [3, 4, 5];
    arrayRerender({ value: newArray, delay: 200 });
    act(() => { vi.advanceTimersByTime(200); });
    expect(arrayResult.current).toEqual(newArray);
  });

  it('should handle delay changes', () => {
    // Given
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    // When - change value and delay
    rerender({ value: 'updated', delay: 200 });

    // Advance by new delay amount
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Then - should use new delay
    expect(result.current).toBe('updated');
  });

  it('should handle zero delay', () => {
    // Given
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 }
      }
    );

    // When - change value with zero delay
    rerender({ value: 'immediate', delay: 0 });

    // Advance timers minimally
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Then - should update immediately
    expect(result.current).toBe('immediate');
  });

  it('should cleanup timer on unmount', () => {
    // Given
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 500));

    // When
    unmount();

    // Then
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
}); 