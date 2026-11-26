'use client';

import React, { useEffect, useState } from 'react';

// Playlist fija de SIMON: se reproduce sola, sin pedir link al usuario.
const PLAYLIST_URL =
  'https://youtube.com/playlist?list=PLaUiCYWlUUe6jEXKvewDnrj0F9Rc9Qzir&si=_0qTsOPCE2z_akwm';
const PLAYLIST_ID = new URL(PLAYLIST_URL).searchParams.get('list') ?? '';

const EMBED_URL = new URL('https://www.youtube.com/embed');
EMBED_URL.search = new URLSearchParams({
  listType: 'playlist',
  list: PLAYLIST_ID,
  autoplay: '1',
  controls: '0',
  loop: '1',
  playlist: PLAYLIST_ID,
  playsinline: '1',
  disablekb: '1',
  modestbranding: '1',
  rel: '0',
}).toString();

export const BackgroundPlaylist: React.FC = () => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Los navegadores bloquean el autoplay con sonido; la primera tecla del
    // control (o primer toque) permite arrancar la música.
    const onFirstInteraction = () => setStarted(true);
    window.addEventListener('keydown', onFirstInteraction);
    window.addEventListener('pointerdown', onFirstInteraction);
    return () => {
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
    };
  }, []);

  return (
    <iframe
      key={started ? 'started' : 'waiting'}
      title="Música de fondo"
      className="pointer-events-none fixed -left-[9999px] top-0 h-1 w-1 opacity-0"
      src={EMBED_URL.toString()}
      allow="autoplay; encrypted-media; picture-in-picture"
    />
  );
};
