import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BackgroundPlaylist } from './BackgroundPlaylist';

describe('BackgroundPlaylist', () => {
  it('usa la playlist fija, en bucle y sin panel para ingresar link', () => {
    const { container } = render(<BackgroundPlaylist />);
    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    const src = iframe.getAttribute('src') ?? '';

    expect(src).toContain('list=PLaUiCYWlUUe6jEXKvewDnrj0F9Rc9Qzir');
    expect(src).toContain('autoplay=1');
    expect(src).toContain('loop=1');
    expect(src).toContain('playsinline=1');
    expect(src).toContain('mute=1');
    expect(container.querySelector('input')).toBeNull();
  });

  it('activa el sonido con la primera tecla y sigue oculta y única', () => {
    const { container } = render(<BackgroundPlaylist />);

    const silent = container.querySelector('iframe') as HTMLIFrameElement;
    expect(silent.getAttribute('src')).toContain('mute=1');

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    const audible = container.querySelector('iframe') as HTMLIFrameElement;
    expect(audible.getAttribute('src')).toContain('mute=0');
    expect(audible.className).toContain('opacity-0');
    expect(container.querySelectorAll('iframe')).toHaveLength(1);
  });
});
