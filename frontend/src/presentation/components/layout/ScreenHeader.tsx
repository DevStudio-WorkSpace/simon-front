'use client';

import React from 'react';
import Link from 'next/link';
import { Pause, Play, ShieldCheck } from 'lucide-react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { useCurrentDateTime } from '../../../application/hooks/useCurrentDateTime';

interface ScreenHeaderProps {
  title: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title }) => {
  const { currentSlide, totalSlides, isPaused, progressPercent, getCurrentView } = useScreenPlayerStore();
  const currentDateTime = useCurrentDateTime();
  const currentView = getCurrentView();
  const displayTitle = currentView?.title || title;

  return (
    <header className="relative w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md z-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-goservice.png"
              alt="GO Service LATAM"
              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 xl:h-[68px] xl:w-[68px] rounded-full object-contain shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-lg sm:text-2xl lg:text-3xl xl:text-[32px] tracking-tight text-slate-900 dark:text-white">
                GO SERVICE
              </span>
              <span className="font-extrabold text-xs sm:text-base lg:text-lg xl:text-[28px] tracking-[0.15em] text-[#e6007e] dark:text-[#ff2d95]">
                LATAM
              </span>
            </div>
          </div>

          <div className="h-9 w-[2px] bg-slate-200 dark:bg-slate-700 hidden lg:block" />

          <span className="tv-body font-bold text-slate-700 dark:text-slate-300 hidden lg:inline">
            Soporte técnico
          </span>
        </div>

        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-center pointer-events-none px-56">
          <h1 className="tv-heading font-black text-slate-900 dark:text-white tracking-tight">
            {displayTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
          <Link
            href="/admin"
            className="tv-focus p-2 lg:p-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 font-bold border border-slate-200 dark:border-slate-800"
            title="Ir al Panel de Administrador (/admin)"
            aria-label="Panel Administrador"
          >
            <ShieldCheck className="w-6 h-6 xl:w-7 xl:h-7 text-[#e6007e] dark:text-[#ff2d95]" />
            <span className="hidden sm:inline text-sm md:text-base lg:text-lg xl:text-[28px]">Admin</span>
          </Link>

          <div
            className={`tv-body flex items-center gap-2 px-3 py-1.5 rounded-full font-extrabold border transition-colors ${
              isPaused
                ? 'semantic-surface--waiting semantic-text--waiting'
                : 'semantic-surface--success semantic-text--success'
            }`}
          >
            {isPaused ? (
              <Pause className="w-5 h-5 xl:w-6 xl:h-6 fill-current" />
            ) : (
              <Play className="w-5 h-5 xl:w-6 xl:h-6 fill-current" />
            )}
            <span>{isPaused ? 'Pausado' : 'Reproduciendo'}</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-black text-slate-900 dark:text-white leading-none tv-tabular">
              {currentSlide}/{totalSlides}
            </span>
            <span className="tv-caption text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
              {currentDateTime}
            </span>
          </div>
        </div>
      </div>

      <div className="md:hidden text-center pb-3 px-4 border-t border-slate-100 dark:border-slate-800/60 pt-2 bg-white/80 dark:bg-slate-900/60">
        <h1 className="tv-heading font-black text-slate-900 dark:text-white tracking-tight">
          {displayTitle}
        </h1>
      </div>

      <div className="w-full h-1.5 sm:h-2 lg:h-2.5 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        <div
          className="h-full bg-[#e6007e] dark:bg-[#ff2d95] transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(230,0,126,0.45)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
