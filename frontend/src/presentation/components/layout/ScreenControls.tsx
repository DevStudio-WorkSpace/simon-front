'use client';

import React, { useState } from 'react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { ChevronLeft, ChevronRight, Play, Pause, SlidersHorizontal } from 'lucide-react';

export const ScreenControls: React.FC<{ inline?: boolean }> = ({ inline = false }) => {
  const { currentSlide, isPaused, nextSlide, prevSlide, togglePause, goToSlide, getActiveViews } =
    useScreenPlayerStore();
  const [isOpen, setIsOpen] = useState(false);
  const activeViews = getActiveViews();

  return (
    <div
      className={
        inline
          ? 'relative z-50 shrink-0'
          : 'fixed bottom-12 right-2 z-50 flex max-w-[calc(100vw-16px)] flex-col items-end gap-2 sm:bottom-14 sm:right-6'
      }
    >
      {isOpen && (
        <div
          className={`glass-panel neumorph-shadow flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl transition-all sm:gap-3 sm:p-4 ${inline ? 'absolute bottom-full right-0 mb-2 w-max max-w-[calc(100vw-16px)]' : 'max-w-full'}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-sm font-bold text-slate-800">Control Remoto / Botonera</span>
            <span className="text-xs text-slate-500">Atajos: ◄, ►, Espacio, 1-6</span>
          </div>

          {/* Physical 3-button simulation */}
          <div className="flex items-center justify-center gap-3 py-1">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold shadow transition-all active:scale-95"
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
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold shadow transition-all active:scale-95"
              title="Siguiente (► / AvPág)"
              aria-label="Diapositiva siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Jump buttons */}
          <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200">
            {activeViews.map((view, idx) => (
              <button
                key={view.id}
                onClick={() => goToSlide(idx + 1)}
                className={`flex-1 min-w-[34px] py-1.5 px-1 rounded-lg text-xs font-bold transition-colors ${
                  currentSlide === idx + 1
                    ? 'bg-[#e6007e] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
        className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white font-semibold text-slate-900 transition-all hover:opacity-90 ${inline ? 'px-2.5 py-1 text-xs' : 'p-3 text-sm shadow-lg'}`}
        title="Mostrar simulador de control"
        aria-label="Simulador de control"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="hidden sm:inline">Control</span>
      </button>
    </div>
  );
};
