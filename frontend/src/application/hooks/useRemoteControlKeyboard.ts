'use client';

import { useEffect } from 'react';
import { useScreenPlayerStore } from '../store/screenPlayerStore';

export function useRemoteControlKeyboard() {
  const { nextSlide, prevSlide, togglePause, goToSlide } = useScreenPlayerStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || useScreenPlayerStore.getState().isEditingServices) return;
      const target = event.target;

      // Don't steal keys while the user is typing
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      // OK/Enter or Space on a focused button must activate that button only.
      // Otherwise the global action and the button's onClick both run.
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        target instanceof Element &&
        target.closest('button, a, [role="button"]')
      ) {
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
        case 'MediaPlayPause': // dedicated play/pause key on TV remotes
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
