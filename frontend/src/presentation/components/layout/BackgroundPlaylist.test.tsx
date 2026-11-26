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
    expect(container.querySelector('input')).toBeNull();
  });

  it('sigue oculto y único después de usar el control remoto', () => {
    const { container } = render(<BackgroundPlaylist />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe.className).toContain('opacity-0');
    expect(container.querySelectorAll('iframe')).toHaveLength(1);
  });
});
