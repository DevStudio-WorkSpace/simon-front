import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackgroundPlaylist } from './BackgroundPlaylist';

type FakePlayer = {
  mute: ReturnType<typeof vi.fn>;
  unMute: ReturnType<typeof vi.fn>;
  setVolume: ReturnType<typeof vi.fn>;
  playVideo: ReturnType<typeof vi.fn>;
  setLoop: ReturnType<typeof vi.fn>;
  getPlayerState: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
};

describe('BackgroundPlaylist', () => {
  let player: FakePlayer;

  beforeEach(() => {
    player = {
      mute: vi.fn(),
      unMute: vi.fn(),
      setVolume: vi.fn(),
      playVideo: vi.fn(),
      setLoop: vi.fn(),
      getPlayerState: vi.fn(() => 1),
      destroy: vi.fn(),
    };

    Object.defineProperty(window, 'YT', {
      configurable: true,
      value: {
        Player: vi
          .fn()
          .mockImplementation(
            (
              _iframe: HTMLElement,
              options: { events: { onReady: (event: { target: FakePlayer }) => void } },
            ) => {
              options.events.onReady({ target: player });
              return player;
            },
          ),
      },
    });
  });

  it('usa la playlist fija, oculta y con bucle', () => {
    const { container } = render(<BackgroundPlaylist />);
    const iframe = container.querySelector('iframe') as HTMLIFrameElement;
    const src = iframe.getAttribute('src') ?? '';

    expect(src).toContain('list=PLA-LqkMtzdc4');
    expect(src).toContain('autoplay=1');
    expect(src).toContain('loop=1');
    expect(src).toContain('enablejsapi=1');
    expect(iframe.className).toContain('opacity-0');
    expect(iframe.className).toContain('w-[480px]');
    expect(iframe.className).toContain('h-[270px]');
    expect(iframe.getAttribute('referrerpolicy')).toBe('origin');
    expect(iframe.getAttribute('allow')).toContain('autoplay');
    expect(player.setLoop).toHaveBeenCalledWith(true);
    expect(player.mute).toHaveBeenCalled();
    expect(player.playVideo).toHaveBeenCalled();
    expect(container.querySelector('input')).toBeNull();
  });

  it('arranca silenciada y activa el sonido con la primera tecla', () => {
    render(<BackgroundPlaylist />);

    expect(player.mute).toHaveBeenCalledTimes(1);
    expect(player.unMute).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(player.unMute).toHaveBeenCalledTimes(1);
    expect(player.setVolume).toHaveBeenCalledWith(60);
    expect(player.playVideo).toHaveBeenCalledTimes(2);
  });
});
