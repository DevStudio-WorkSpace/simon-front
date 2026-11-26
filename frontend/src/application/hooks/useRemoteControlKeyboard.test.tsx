import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRemoteControlKeyboard } from './useRemoteControlKeyboard';
import { useScreenPlayerStore } from '../store/screenPlayerStore';

function Harness() {
  useRemoteControlKeyboard();
  return <button>Control</button>;
}

describe('useRemoteControlKeyboard', () => {
  const initialState = useScreenPlayerStore.getState();

  afterEach(() => {
    useScreenPlayerStore.setState(initialState);
  });

  it('navega y pausa con los botones del mando', () => {
    const nextSlide = vi.fn();
    const prevSlide = vi.fn();
    const togglePause = vi.fn();
    useScreenPlayerStore.setState({ nextSlide, prevSlide, togglePause });
    render(<Harness />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'Enter' });

    expect(nextSlide).toHaveBeenCalledOnce();
    expect(prevSlide).toHaveBeenCalledOnce();
    expect(togglePause).toHaveBeenCalledOnce();
  });

  it('deja que OK active el botón enfocado sin pausar el reproductor', () => {
    const togglePause = vi.fn();
    useScreenPlayerStore.setState({ togglePause });
    const { getByRole } = render(<Harness />);

    fireEvent.keyDown(getByRole('button'), { key: 'Enter' });

    expect(togglePause).not.toHaveBeenCalled();
  });
});
