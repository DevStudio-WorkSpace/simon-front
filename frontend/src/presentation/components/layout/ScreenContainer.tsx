'use client';

import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { useThemeStore } from '../../../application/store/themeStore';
import { useRemoteControlKeyboard } from '../../../application/hooks/useRemoteControlKeyboard';
import { ScreenHeader } from './ScreenHeader';
import { ScreenTicker } from './ScreenTicker';
import { ScreenControls } from './ScreenControls';

interface ScreenContainerProps {
  children: React.ReactNode;
  title: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, title }) => {
  const { initialize, tick, data, isLoading, error, getCurrentView } = useScreenPlayerStore();
  const { setTheme } = useThemeStore();

  useRemoteControlKeyboard();

  useEffect(() => {
    setTheme('system');
    initialize('TV-SALA-01');

    const interval = setInterval(() => {
      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [initialize, tick, setTheme]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="w-16 h-16 border-[6px] border-[#e6007e] border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="tv-heading font-black">Iniciando SIMON...</h2>
        <p className="tv-body text-slate-500 dark:text-slate-400 mt-3">
          Cargando vistas y sincronizando con soporte...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6">
        <div className="glass-panel neumorph-shadow p-8 rounded-3xl max-w-3xl text-center border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30">
          <AlertTriangle className="w-14 h-14 mx-auto mb-4 text-red-600 dark:text-red-400" />
          <h2 className="tv-heading font-black text-red-700 dark:text-red-300">Sin conexión con SIMON</h2>
          <p className="tv-body mt-3 text-slate-700 dark:text-slate-300">
            {error || 'No se pudieron obtener datos de la pantalla.'}
          </p>
          <p className="tv-caption mt-4 text-slate-500 dark:text-slate-400">
            Último dato disponible: {data?.screenState.lastUpdated || 'sin registro previo'}
          </p>
        </div>
      </div>
    );
  }

  const showTicker = getCurrentView()?.tipo !== 'actividades';
  const repeatedFollowupMetric = `${data.services.metrics.pendingFollowupCount} clientes por llamar`;
  // The marquee carries operational alerts, not KPIs already visible in the slides.
  const tickerItems = data.tickerItems.filter((item) => !item.text.includes(repeatedFollowupMetric));

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden ambient-mesh bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 select-none transition-colors duration-300">
      <ScreenHeader title={title} />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 py-4 flex flex-col justify-start lg:justify-center overflow-x-hidden overflow-y-visible lg:overflow-hidden">
        {children}
      </main>

      {showTicker ? (
        <ScreenTicker items={tickerItems} />
      ) : (
        <div className="h-[76px] shrink-0" aria-hidden="true" />
      )}

      <ScreenControls />
    </div>
  );
};
