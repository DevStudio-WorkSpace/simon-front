'use client';

import React, { useEffect } from 'react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
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
  const { initialize, tick, data, isLoading, error, getCurrentView } = useScreenPlayerStore();

  const isServices = getCurrentView()?.tipo === 'servicios';

  // Listen to remote control and keyboard events
  useRemoteControlKeyboard();

  useEffect(() => {
    initialize('TV-SALA-01');

    // Interval ticker for screen rotation: 100ms for smooth progress bar
    const interval = setInterval(() => {
      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [initialize, tick]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--background)] text-slate-800">
        <div className="w-12 h-12 border-4 border-[#e6007e] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Iniciando SIMON...</h2>
        <p className="text-slate-500 mt-2">Cargando vistas y sincronizando con soporte...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--background)] text-slate-800 p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-lg text-center border-red-300 bg-red-50/50">
          <h2 className="text-2xl font-black text-red-600">Error de conexión</h2>
          <p className="mt-2 text-slate-700">{error || 'No se pudieron obtener datos'}</p>
          <span className="block mt-4 text-xs text-slate-500">
            Última sincronización: {formatSimonDateTime(new Date())}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Shared Header */}
      <ScreenHeader title={title} />

      {/* Main Slide Content Area */}
      <main
        className={`mx-auto flex w-full max-w-[1920px] flex-1 flex-col px-3 sm:px-6 ${isServices ? 'justify-start py-2 lg:min-h-0 lg:overflow-y-auto xl:py-4' : 'justify-start overflow-x-hidden overflow-y-visible py-3 sm:py-4 lg:justify-center lg:overflow-hidden'}`}
      >
        {children}
      </main>

      {/* Shared Bottom Ticker */}
      {isServices ? (
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-100 pr-3 sm:pr-6">
          <ScreenTicker items={data.tickerItems} compact />
          <ScreenControls inline />
        </div>
      ) : (
        <>
          <ScreenTicker items={data.tickerItems} />
          <ScreenControls />
        </>
      )}
    </div>
  );
};
