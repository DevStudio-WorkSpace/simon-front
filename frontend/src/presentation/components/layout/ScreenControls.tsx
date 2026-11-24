'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, SlidersHorizontal } from 'lucide-react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';

export const ScreenControls: React.FC = () => {
  const { currentSlide, isPaused, nextSlide, prevSlide, togglePause, goToSlide, getActiveViews } = useScreenPlayerStore();
  const [isOpen, setIsOpen] = useState(false);
  const activeViews = getActiveViews();

  return (
    <div className="fixed bottom-24 right-3 sm:right-6 z-50 flex flex-col items-end gap-3 max-w-[calc(100vw-24px)]">
      {isOpen && (
        <div className="glass-panel neumorph-shadow rounded-2xl p-4 lg:p-5 flex flex-col gap-3 lg:gap-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl transition-all max-w-full">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-4">
            <span className="tv-body font-extrabold text-slate-800 dark:text-slate-200">
              Control Remoto / Botonera
            </span>
            <span className="tv-caption font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Atajos: ◄, ►, Espacio, 1-6
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 py-1">
            <button
              onClick={prevSlide}
              className="tv-focus p-3 lg:p-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold shadow transition-all active:scale-95"
              title="Anterior (◄ / RePág)"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-7 h-7 lg:w-8 lg:h-8" />
            </button>

            <button
              onClick={togglePause}
              className={`tv-focus p-4 lg:p-5 rounded-full text-white font-bold shadow-lg transition-all active:scale-95 ${
                isPaused ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#e6007e] hover:bg-[#c9006e]'
              }`}
              title={isPaused ? 'Reanudar (Play)' : 'Pausar (Pausa)'}
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
            >
              {isPaused ? <Play className="w-7 h-7 lg:w-8 lg:h-8 fill-current" /> : <Pause className="w-7 h-7 lg:w-8 lg:h-8 fill-current" />}
            </button>

            <button
              onClick={nextSlide}
              className="tv-focus p-3 lg:p-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold shadow transition-all active:scale-95"
              title="Siguiente (► / AvPág)"
              aria-label="Diapositiva siguiente"
            >
              <ChevronRight className="w-7 h-7 lg:w-8 lg:h-8" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            {activeViews.map((view, idx) => (
              <button
                key={view.id}
                onClick={() => goToSlide(idx + 1)}
                className={`tv-focus flex-1 min-w-[48px] py-2 px-2 rounded-lg tv-body font-bold transition-colors ${
                  currentSlide === idx + 1
                    ? 'bg-[#e6007e] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={view.title}
                aria-label={`Ir a la vista ${idx + 1}: ${view.title}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tv-focus p-3 lg:p-4 rounded-full bg-white text-[#e6007e] border border-[#e6007e]/30 shadow-lg hover:bg-pink-50 transition-all flex items-center gap-2 tv-body font-bold"
        title="Mostrar simulador de control"
        aria-label="Simulador de control"
        aria-expanded={isOpen}
      >
        <SlidersHorizontal className="w-6 h-6 lg:w-7 lg:h-7" />
        <span className="hidden sm:inline">Control</span>
      </button>
    </div>
  );
};
