'use client';

import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  getRotationElapsed,
  selectCurrentView,
  useScreenPlayerStore,
} from '../../../application/store/screenPlayerStore';
import { useRemoteControlKeyboard } from '../../../application/hooks/useRemoteControlKeyboard';
import { formatSimonDateTime } from '../../../application/hooks/useCurrentDateTime';
import { ScreenHeader } from './ScreenHeader';
import { ScreenTicker } from './ScreenTicker';
import { BackgroundPlaylist } from './BackgroundPlaylist';

interface ScreenContainerProps {
  children: React.ReactNode;
  title: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, title }) => {
  const { initialize, tick, data, isLoading, error, showTicker, refreshDemoServices } =
    useScreenPlayerStore(
      useShallow((state) => ({
        initialize: state.initialize,
        tick: state.tick,
        data: state.data,
        isLoading: state.isLoading,
        error: state.error,
        showTicker: selectCurrentView(state).tipo !== 'actividades',
        refreshDemoServices: state.refreshDemoServices,
      })),
    );

  // Listen to remote control and keyboard events
  useRemoteControlKeyboard();

  useEffect(() => {
    initialize('TV-SALA-01');

    let rotationTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleRotation = () => {
      clearTimeout(rotationTimer);
      const { rotationClock, secondsPerSlide } = useScreenPlayerStore.getState();
      if (rotationClock.startedAt === null) return;

      const remaining =
        secondsPerSlide * 1000 - getRotationElapsed(rotationClock, performance.now());
      rotationTimer = setTimeout(
        () => {
          tick();
          if (useScreenPlayerStore.getState().rotationClock === rotationClock) scheduleRotation();
        },
        Math.min(100, Math.max(1, Math.ceil(remaining))),
      );
    };
    const unsubscribeRotation = useScreenPlayerStore.subscribe((state, previous) => {
      if (state.rotationClock !== previous.rotationClock) scheduleRotation();
    });
    scheduleRotation();
    let stopped = false;
    let pollTimer: ReturnType<typeof setTimeout>;

    if (process.env.NEXT_PUBLIC_DATA_SOURCE !== 'api') {
      const poll = async () => {
        await refreshDemoServices();
        if (!stopped) pollTimer = setTimeout(poll, 1000);
      };
      pollTimer = setTimeout(poll, 1000);
    }

    return () => {
      stopped = true;
      unsubscribeRotation();
      clearTimeout(rotationTimer);
      clearTimeout(pollTimer);
    };
  }, [initialize, tick, refreshDemoServices]);

  return (
    <>
      {/* Fixed background playlist: no panel, no user link, always mounted */}
      <BackgroundPlaylist />

      {isLoading ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--background)] text-slate-800">
          <div className="w-12 h-12 border-4 border-[#e6007e] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-2xl font-bold">Iniciando SIMON...</h2>
          <p className="text-slate-500 mt-2">Cargando vistas y sincronizando con soporte...</p>
        </div>
      ) : error || !data ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--background)] text-slate-800 p-6">
          <div className="glass-panel p-8 rounded-2xl max-w-lg text-center border-red-300 bg-red-50/50">
            <h2 className="text-2xl font-black text-red-600">Error de conexión</h2>
            <p className="mt-2 text-slate-700">{error || 'No se pudieron obtener datos'}</p>
            <span className="block mt-4 text-xs text-slate-500">
              Última sincronización:{' '}
              {data?.lastDataAt ? formatSimonDateTime(new Date(data.lastDataAt)) : 'sin datos'}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden md:min-h-dvh bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
          {/* Shared Header */}
          <ScreenHeader title={title} />

          {/* Main Slide Content Area */}
          <main className="mx-auto flex w-full max-w-[1920px] flex-1 flex-col px-3 py-2 sm:px-6 xl:py-4">
            {children}
          </main>

          {showTicker && <ScreenTicker items={data.tickerItems} />}
        </div>
      )}
    </>
  );
};
