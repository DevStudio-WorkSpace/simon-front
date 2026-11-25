'use client';

import React, { useEffect } from 'react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { useThemeStore } from '../../../application/store/themeStore';
import { useRemoteControlKeyboard } from '../../../application/hooks/useRemoteControlKeyboard';
import { formatSimonDateTime } from '../../../application/hooks/useCurrentDateTime';
import { ScreenHeader } from './ScreenHeader';
import { ScreenTicker } from './ScreenTicker';
import { ScreenControls } from './ScreenControls';

interface ScreenContainerProps {
  children: React.ReactNode;
  title: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, title }) => {
  const { initialize, tick, data, isLoading, error } = useScreenPlayerStore();
  const { initTheme } = useThemeStore();

  // Listen to remote control and keyboard events
  useRemoteControlKeyboard();

  useEffect(() => {
    initTheme();
    initialize('TV-SALA-01');

    // Interval ticker for screen rotation: 100ms for smooth progress bar
    const interval = setInterval(() => {
      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [initialize, tick, initTheme]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="w-12 h-12 border-4 border-[#e6007e] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Iniciando SIMON...</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Cargando vistas y sincronizando con soporte...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-lg text-center border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30">
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400">Error de conexión</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            {error || 'No se pudieron obtener datos'}
          </p>
          <span className="block mt-4 text-xs text-slate-500">
            Última sincronización: {formatSimonDateTime(new Date())}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden ambient-mesh bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Shared Header */}
      <ScreenHeader title={title} />

      {/* Main Slide Content Area */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col justify-start lg:justify-center overflow-x-hidden overflow-y-visible lg:overflow-hidden">
        {children}
      </main>

      {/* Shared Bottom Ticker */}
      <ScreenTicker items={data.tickerItems} />

      {/* Remote Control / Button Box Emulator */}
      <ScreenControls />
    </div>
  );
};
