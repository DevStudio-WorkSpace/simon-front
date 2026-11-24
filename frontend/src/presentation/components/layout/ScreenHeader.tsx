'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { useThemeStore } from '../../../application/store/themeStore';
import { useCurrentDateTime } from '../../../application/hooks/useCurrentDateTime';
import { Sun, Moon, ShieldCheck } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title }) => {
  const { currentSlide, totalSlides, isPaused, progressPercent, getCurrentView } = useScreenPlayerStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const currentDateTime = useCurrentDateTime();
  const currentView = getCurrentView();
  const displayTitle = currentView?.title || title;

  return (
    <header className="relative w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md z-20">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand section */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-goservice.png"
              alt="GO Service LATAM"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-contain drop-shadow-sm shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                GO SERVICE
              </span>
              <span className="font-extrabold text-[10px] sm:text-xs tracking-widest text-[#E6007E]">
                LATAM
              </span>
            </div>
          </div>

          <div className="h-6 sm:h-7 w-[1.5px] bg-slate-300 dark:bg-slate-700 hidden lg:block" />

          <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 hidden lg:inline">
            Soporte técnico
          </span>
        </div>

        {/* Center View Title (Visible on md and larger) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {displayTitle}
          </h1>
        </div>

        {/* Right Status & Meta */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          {/* Admin Login Shortcut Button */}
          <Link
            href="/admin"
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800"
            title="Ir al Panel de Administrador (/admin)"
            aria-label="Panel Administrador"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 h-5 text-[#E6007E]" />
            <span className="hidden sm:inline font-bold">Admin</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Cambiar a modo ${resolvedTheme === 'dark' ? 'claro' : 'oscuro'}`}
            aria-label="Alternar tema"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 h-5" /> : <Moon className="w-4 h-4 sm:w-5 h-5" />}
          </button>

          {/* Player status pill */}
          <div
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm md:text-base font-bold flex items-center gap-1 sm:gap-1.5 transition-colors ${
              isPaused
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
            }`}
          >
            <span
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                isPaused ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span>{isPaused ? 'Pausa' : 'Play'}</span>
          </div>

          {/* Slide counter n/6 */}
          <div className="flex flex-col items-end">
            <span className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none">
              {currentSlide}/{totalSlides}
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap min-h-[1rem]">
              {currentDateTime}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Title Bar (Below brand on small screens < md) */}
      <div className="md:hidden text-center pb-2 px-3 border-t border-slate-100 dark:border-slate-800/60 pt-1.5 bg-slate-50/50 dark:bg-slate-900/50">
        <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          {displayTitle}
        </h1>
      </div>

      {/* Magenta Progress bar indicator */}
      <div className="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        <div
          className="h-full bg-[#E6007E] transition-all duration-100 ease-linear shadow-[0_0_8px_#E6007E]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
