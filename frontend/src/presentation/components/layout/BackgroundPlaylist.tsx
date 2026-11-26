'use client';

import React, { useEffect, useState } from 'react';

// Playlist fija de SIMON: se reproduce sola, sin pedir link al usuario.
const PLAYLIST_URL =
  'https://youtube.com/playlist?list=PLaUiCYWlUUe6jEXKvewDnrj0F9Rc9Qzir&si=_0qTsOPCE2z_akwm';
const PLAYLIST_ID = new URL(PLAYLIST_URL).searchParams.get('list') ?? '';

const buildEmbedUrl = (muted: boolean): string => {
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
    modestbranding: '1',
    rel: '0',
    mute: muted ? '1' : '0',
  }).toString();
  return url.toString();
};

export const BackgroundPlaylist: React.FC = () => {
  const [unmuted, setUnmuted] = useState(false);

  useEffect(() => {
    // El navegador bloquea el autoplay con sonido hasta la primera interacción.
    // Arranca en silencio y el control remoto activa el audio.
    const onFirstInteraction = () => setUnmuted(true);
    window.addEventListener('keydown', onFirstInteraction);
    window.addEventListener('pointerdown', onFirstInteraction);
    return () => {
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
    };
  }, []);

  return (
    <iframe
      key={unmuted ? 'sound' : 'silent'}
      title="Música de fondo"
      className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
      src={buildEmbedUrl(!unmuted)}
      allow="autoplay; encrypted-media; picture-in-picture"
    />
  );
};
