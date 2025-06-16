import { useEffect, useRef, useState, useCallback } from 'react';

// Types
interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface SwipeData {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

interface PinchData {
  scale: number;
  center: { x: number; y: number };
}

interface GestureOptions {
  swipeThreshold?: number;
  velocityThreshold?: number;
  pinchThreshold?: number;
  enableHaptics?: boolean;
  preventScroll?: boolean;
}

interface GestureHandlers {
  onSwipe?: (data: SwipeData) => void;
  onPinch?: (data: PinchData) => void;
  onTap?: (position: { x: number; y: number }) => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
  onPanStart?: (position: { x: number; y: number }) => void;
  onPanMove?: (position: { x: number; y: number }, delta: { x: number; y: number }) => void;
  onPanEnd?: (position: { x: number; y: number }) => void;
}

const defaultOptions: GestureOptions = {
  swipeThreshold: 50,
  velocityThreshold: 0.5,
  pinchThreshold: 0.1,
  enableHaptics: true,
  preventScroll: false
};

export const useGestures = (
  handlers: GestureHandlers = {},
  options: GestureOptions = {}
) => {
  const elementRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPanningRef = useRef(false);
  const initialDistanceRef = useRef<number>(0);
  const currentScaleRef = useRef<number>(1);
  
  const [isPressed, setIsPressed] = useState(false);
  const [touchCount, setTouchCount] = useState(0);

  const config = { ...defaultOptions, ...options };

  // Haptic feedback utility
  const triggerHaptic = useCallback((type: 'selection' | 'impact' | 'notification' = 'selection') => {
    if (!config.enableHaptics) return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        selection: [10],
        impact: [25],
        notification: [50, 50, 50]
      };
      navigator.vibrate(patterns[type]);
    }
  }, [config.enableHaptics]);

  // Calculate distance between two points
  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate velocity
  const getVelocity = useCallback((start: TouchPoint, end: TouchPoint): number => {
    const distance = getDistance(start, end);
    const timeDiff = end.timestamp - start.timestamp;
    return timeDiff > 0 ? distance / timeDiff : 0;
  }, [getDistance]);

  // Get touch position
  const getTouchPosition = useCallback((event: TouchEvent): TouchPoint => {
    const touch = event.touches[0] || event.changedTouches[0];
    return {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (config.preventScroll) {
      event.preventDefault();
    }

    const touchCount = event.touches.length;
    setTouchCount(touchCount);
    setIsPressed(true);

    if (touchCount === 1) {
      const position = getTouchPosition(event);
      touchStartRef.current = position;
      isPanningRef.current = false;

      // Start long press timer
      longPressTimerRef.current = setTimeout(() => {
        if (touchStartRef.current && !isPanningRef.current) {
          triggerHaptic('impact');
          handlers.onLongPress?.(position);
        }
      }, 500);

      // Pan start
      handlers.onPanStart?.(position);

    } else if (touchCount === 2) {
      // Initialize pinch gesture
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      initialDistanceRef.current = distance;
      currentScaleRef.current = 1;

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  }, [config.preventScroll, getTouchPosition, triggerHaptic, handlers]);

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (config.preventScroll) {
      event.preventDefault();
    }

    const touchCount = event.touches.length;

    if (touchCount === 1 && touchStartRef.current) {
      const currentPosition = getTouchPosition(event);
      const distance = getDistance(touchStartRef.current, currentPosition);

      if (distance > 10) {
        isPanningRef.current = true;
        
        // Clear long press timer on movement
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        // Pan move
        const delta = {
          x: currentPosition.x - touchStartRef.current.x,
          y: currentPosition.y - touchStartRef.current.y
        };
        handlers.onPanMove?.(currentPosition, delta);
      }

    } else if (touchCount === 2 && initialDistanceRef.current > 0) {
      // Handle pinch gesture
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      const scale = currentDistance / initialDistanceRef.current;
      const scaleChange = Math.abs(scale - currentScaleRef.current);

      if (scaleChange > config.pinchThreshold!) {
        const center = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        };

        handlers.onPinch?.({ scale, center });
        currentScaleRef.current = scale;
      }
    }
  }, [config.preventScroll, config.pinchThreshold, getTouchPosition, getDistance, handlers]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    setIsPressed(false);
    setTouchCount(event.touches.length);

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (touchStartRef.current && event.changedTouches.length === 1) {
      const touchEnd = getTouchPosition(event);
      touchEndRef.current = touchEnd;

      // Pan end
      handlers.onPanEnd?.(touchEnd);

      // If not panning, handle tap gestures
      if (!isPanningRef.current) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        if (timeSinceLastTap < 300) {
          // Double tap
          triggerHaptic('selection');
          handlers.onDoubleTap?.(touchEnd);
          lastTapRef.current = 0; // Reset to prevent triple tap
        } else {
          // Single tap (delayed to detect double tap)
          setTimeout(() => {
            if (Date.now() - lastTapRef.current > 250) {
              triggerHaptic('selection');
              handlers.onTap?.(touchEnd);
            }
          }, 250);
          lastTapRef.current = now;
        }
      } else {
        // Handle swipe gesture
        const distance = getDistance(touchStartRef.current, touchEnd);
        const velocity = getVelocity(touchStartRef.current, touchEnd);

        if (distance > config.swipeThreshold! && velocity > config.velocityThreshold!) {
          const deltaX = touchEnd.x - touchStartRef.current.x;
          const deltaY = touchEnd.y - touchStartRef.current.y;

          let direction: SwipeData['direction'];
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
          } else {
            direction = deltaY > 0 ? 'down' : 'up';
          }

          const swipeData: SwipeData = {
            direction,
            distance,
            velocity,
            duration: touchEnd.timestamp - touchStartRef.current.timestamp
          };

          triggerHaptic('impact');
          handlers.onSwipe?.(swipeData);
        }
      }

      // Reset refs
      touchStartRef.current = null;
      touchEndRef.current = null;
      isPanningRef.current = false;
    }

    // Reset pinch state
    if (event.touches.length < 2) {
      initialDistanceRef.current = 0;
      currentScaleRef.current = 1;
    }
  }, [config.swipeThreshold, config.velocityThreshold, getTouchPosition, getDistance, getVelocity, triggerHaptic, handlers]);

  // Event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add passive flag for better performance
    const options = { passive: !config.preventScroll };

    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, options);
    element.addEventListener('touchcancel', handleTouchEnd, options);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, config.preventScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    elementRef,
    isPressed,
    touchCount,
    // Utility functions
    triggerHaptic
  };
};

// Hook for swipe navigation
export const useSwipeNavigation = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  options?: GestureOptions
) => {
  return useGestures({
    onSwipe: (data) => {
      if (data.direction === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (data.direction === 'right' && onSwipeRight) {
        onSwipeRight();
      }
    }
  }, options);
};

// Hook for pinch to zoom
export const usePinchZoom = (
  onZoom: (scale: number, center: { x: number; y: number }) => void,
  options?: GestureOptions
) => {
  return useGestures({
    onPinch: (data) => {
      onZoom(data.scale, data.center);
    }
  }, options);
};

// Hook for pull to refresh
export const usePullToRefresh = (
  onRefresh: () => void,
  threshold: number = 100
) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const gestureProps = useGestures({
    onPanMove: (position, delta) => {
      if (window.scrollY === 0 && delta.y > 0) {
        setPullDistance(Math.min(delta.y, threshold * 1.5));
      }
    },
    onPanEnd: () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh();
      }
      setPullDistance(0);
    }
  }, { preventScroll: false });

  const resetRefresh = useCallback(() => {
    setIsRefreshing(false);
    setPullDistance(0);
  }, []);

  return {
    ...gestureProps,
    pullDistance,
    isRefreshing,
    resetRefresh,
    pullProgress: Math.min(pullDistance / threshold, 1)
  };
}; 