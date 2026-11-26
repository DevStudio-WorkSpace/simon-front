'use client';

import React, { useEffect, useRef, useState } from 'react';

// Playlist fija de SIMON: se reproduce sola, sin pedir link al usuario.
const PLAYLIST_URL = 'https://youtube.com/playlist?list=PLA-LqkMtzdc4&si=ic4ErnniAkBptMqE';
const PLAYLIST_ID = new URL(PLAYLIST_URL).searchParams.get('list') ?? '';
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

const buildEmbedUrl = (): string => {
  const url = new URL('https://www.youtube.com/embed');
  url.search = new URLSearchParams({
    listType: 'playlist',
    list: PLAYLIST_ID,
    autoplay: '1',
    controls: '0',
    loop: '1',
    playlist: PLAYLIST_ID,
    playsinline: '1',
    disablekb: '1',
    rel: '0',
    enablejsapi: '1',
    origin: window.location.origin,
  }).toString();
  return url.toString();
};

const INTERACTION_EVENTS = ['keydown', 'pointerdown', 'touchstart', 'click'] as const;

export const BackgroundPlaylist: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const interactedRef = useRef(false);
  const mountedRef = useRef(true);
  const [src, setSrc] = useState('');

  useEffect(() => {
    setSrc(buildEmbedUrl());
  }, []);

  useEffect(() => {
    if (!src) return;
    mountedRef.current = true;
    const iframe = iframeRef.current;
    if (!iframe) return;

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
      INTERACTION_EVENTS.forEach((event) => window.removeEventListener(event, onFirstInteraction));
    };

    const createPlayer = () => {
      if (!mountedRef.current || playerRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(iframe, {
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
            // Sin música la TV sigue funcionando.
          },
          onAutoplayBlocked: () => {
            // Se espera la primera interacción del control.
          },
        },
      });
    };

    INTERACTION_EVENTS.forEach((event) => window.addEventListener(event, onFirstInteraction));

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
      INTERACTION_EVENTS.forEach((event) => window.removeEventListener(event, onFirstInteraction));
      playerRef.current?.destroy();
      playerRef.current = null;
      readyRef.current = false;
    };
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      src={src || undefined}
      title="Música de fondo"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[270px] w-[480px] opacity-0"
      allow="autoplay; encrypted-media; picture-in-picture"
    />
  );
};
