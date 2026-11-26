'use client';

import React, { useState } from 'react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { useThemeStore } from '../../../application/store/themeStore';
import { ChevronLeft, ChevronRight, Play, Pause, SlidersHorizontal, Sun, Moon } from 'lucide-react';

export const ScreenControls: React.FC = () => {
  const { currentSlide, isPaused, nextSlide, prevSlide, togglePause, goToSlide, getActiveViews } =
    useScreenPlayerStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const activeViews = getActiveViews();

  return (
    <div className="fixed bottom-12 sm:bottom-14 right-2 sm:right-6 z-50 flex flex-col items-end gap-2 max-w-[calc(100vw-16px)]">
      {isOpen && (
        <div className="glass-panel neumorph-shadow rounded-2xl p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl transition-all max-w-full">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Control Remoto / Botonera
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Atajos: ◄, ►, Espacio, 1-6, T (tema)
            </span>
          </div>

          {/* Physical 3-button simulation */}
          <div className="flex items-center justify-center gap-3 py-1">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold shadow transition-all active:scale-95"
              title="Anterior (◄ / RePág)"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={togglePause}
              className={`p-4 rounded-full text-white font-bold shadow-lg transition-all active:scale-95 ${
                isPaused ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#e6007e] hover:bg-[#c9006e]'
              }`}
              title={isPaused ? 'Reanudar (Play)' : 'Pausar (Pausa)'}
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
            >
              {isPaused ? (
                <Play className="w-6 h-6 fill-current" />
              ) : (
                <Pause className="w-6 h-6 fill-current" />
              )}
            </button>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold shadow transition-all active:scale-95"
              title="Siguiente (► / AvPág)"
              aria-label="Diapositiva siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Theme toggle (remote: T or red button) */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Modo {resolvedTheme === 'dark' ? 'oscuro' : 'claro'}
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 text-xs font-bold transition-colors"
              title="Cambiar tema (T o botón rojo del control)"
              aria-label="Cambiar tema desde el control"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              Cambiar tema
            </button>
          </div>

          {/* Quick Jump buttons */}
          <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200 dark:border-slate-800">
            {activeViews.map((view, idx) => (
              <button
                key={view.id}
                onClick={() => goToSlide(idx + 1)}
                className={`flex-1 min-w-[34px] py-1.5 px-1 rounded-lg text-xs font-bold transition-colors ${
                  currentSlide === idx + 1
                    ? 'bg-[#e6007e] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={view.title}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:opacity-90 transition-all flex items-center gap-2 text-sm font-semibold"
        title="Mostrar simulador de control"
        aria-label="Simulador de control"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="hidden sm:inline">Control</span>
      </button>
    </div>
  );
};
