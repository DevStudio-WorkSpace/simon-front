'use client';

import { useEffect } from 'react';
import { useScreenPlayerStore } from '../store/screenPlayerStore';

export function useRemoteControlKeyboard() {
  const { nextSlide, prevSlide, togglePause, goToSlide } = useScreenPlayerStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          prevSlide();
          break;

        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault();
          nextSlide();
          break;

        case ' ': // Space
        case 'Enter':
        case 'b':
        case 'B':
        case '.':
          event.preventDefault();
          togglePause();
          break;

        // Number keys 1-6 for quick testing
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          event.preventDefault();
          goToSlide(parseInt(event.key, 10));
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide, togglePause, goToSlide]);
}

