import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRemoteControlKeyboard } from './useRemoteControlKeyboard';
import { useThemeStore } from '../store/themeStore';

function Harness() {
  useRemoteControlKeyboard();
  return <div />;
}

describe('useRemoteControlKeyboard - cambio de tema', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ theme: 'dark', resolvedTheme: 'dark' });
    document.documentElement.classList.add('dark');
  });

  it('cambia a modo claro con la tecla T del simulador', () => {
    render(<Harness />);

    fireEvent.keyDown(window, { key: 't' });

    expect(useThemeStore.getState().resolvedTheme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('cambia a modo claro con el boton rojo del control de TV', () => {
    render(<Harness />);

    fireEvent.keyDown(window, { key: 'F1' });

    expect(useThemeStore.getState().resolvedTheme).toBe('light');
  });

  it('las teclas de navegacion y pausa no cambian el tema', () => {
    render(<Harness />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: '1' });
    fireEvent.keyDown(window, { key: ' ' });

    expect(useThemeStore.getState().resolvedTheme).toBe('dark');
  });
});
