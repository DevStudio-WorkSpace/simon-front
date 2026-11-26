import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackgroundPlaylist } from './BackgroundPlaylist';

type FakePlayer = {
  mute: ReturnType<typeof vi.fn>;
  unMute: ReturnType<typeof vi.fn>;
  setVolume: ReturnType<typeof vi.fn>;
  playVideo: ReturnType<typeof vi.fn>;
  setLoop: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
};

describe('BackgroundPlaylist', () => {
  let player: FakePlayer;
  let playerVars: Record<string, string | number>;

  beforeEach(() => {
    player = {
      mute: vi.fn(),
      unMute: vi.fn(),
      setVolume: vi.fn(),
      playVideo: vi.fn(),
      setLoop: vi.fn(),
      destroy: vi.fn(),
    };

    Object.defineProperty(window, 'YT', {
      configurable: true,
      value: {
        Player: vi.fn().mockImplementation(
          (
            _target: HTMLElement,
            options: {
              playerVars: Record<string, string | number>;
              events: { onReady: (event: { target: FakePlayer }) => void };
            },
          ) => {
            playerVars = options.playerVars;
            options.events.onReady({ target: player });
            return player;
          },
        ),
      },
    });
  });

  it('usa la playlist fija, oculta y con bucle', () => {
    const { container } = render(<BackgroundPlaylist />);
    const holder = container.firstElementChild as HTMLElement;

    expect(holder.className).toContain('opacity-0');
    expect(holder.className).toContain('w-[480px]');
    expect(holder.className).toContain('h-[270px]');
    expect(playerVars).toMatchObject({
      listType: 'playlist',
      list: 'PLA-LqkMtzdc4',
      loop: 1,
      autoplay: 1,
    });
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
    expect(player.setVolume).toHaveBeenCalledWith(40);
    expect(player.playVideo).toHaveBeenCalledTimes(2);
  });
});
