'use client';

import React, { useEffect, useRef } from 'react';

// Playlist fija de SIMON: se reproduce sola, sin pedir link al usuario.
const PLAYLIST_URL =
  'https://youtube.com/playlist?list=PLaUiCYWlUUe6jEXKvewDnrj0F9Rc9Qzir&si=_0qTsOPCE2z_akwm';
const PLAYLIST_ID = new URL(PLAYLIST_URL).searchParams.get('list') ?? '';

// YouTube exige un viewport mínimo de 200x200 px. Se oculta fuera de pantalla.
const PLAYER_WIDTH = 480;
const PLAYER_HEIGHT = 270;
const VOLUME = 40;

type YTPlayer = {
  mute(): void;
  unMute(): void;
  setVolume(volume: number): void;
  playVideo(): void;
  setLoop(loop: boolean): void;
  destroy(): void;
};

type YTPlayerEvent = { target: YTPlayer };

type YTNamespace = {
  Player: new (
    target: HTMLElement,
    options: {
      width: number;
      height: number;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YTPlayerEvent) => void;
        onError?: (event: { data: number }) => void;
        onAutoplayBlocked?: () => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const BackgroundPlaylist: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const interactedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    const unmute = () => {
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      player.unMute();
      player.setVolume(VOLUME);
      player.playVideo();
    };

    const onFirstInteraction = () => {
      interactedRef.current = true;
      unmute();
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
    };

    const createPlayer = () => {
      if (!mountedRef.current || playerRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(container, {
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        playerVars: {
          listType: 'playlist',
          list: PLAYLIST_ID,
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: PLAYLIST_ID,
          playsinline: 1,
          disablekb: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            readyRef.current = true;
            event.target.setLoop(true);
            event.target.mute();
            event.target.setVolume(VOLUME);
            event.target.playVideo();
            if (interactedRef.current) unmute();
          },
          onError: () => {
            // Sin música la TV sigue funcionando: no se muestra ningún error.
          },
          onAutoplayBlocked: () => {
            // Se espera a la primera tecla del control para activar el sonido.
          },
        },
      });
    };

    window.addEventListener('keydown', onFirstInteraction);
    window.addEventListener('pointerdown', onFirstInteraction);

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        createPlayer();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      mountedRef.current = false;
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
      playerRef.current?.destroy();
      playerRef.current = null;
      readyRef.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed -left-[9999px] top-0 h-[270px] w-[480px] opacity-0"
    />
  );
};
