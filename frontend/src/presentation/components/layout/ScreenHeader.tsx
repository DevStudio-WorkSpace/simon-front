'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  getRotationElapsed,
  selectCurrentView,
  useScreenPlayerStore,
} from '../../../application/store/screenPlayerStore';
import { useCurrentDateTime } from '../../../application/hooks/useCurrentDateTime';

function PlaybackProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let animation: Animation | undefined;

    const syncProgress = (state: ReturnType<typeof useScreenPlayerStore.getState>) => {
      animation?.cancel();
      const { rotationClock, secondsPerSlide } = state;
      const duration = secondsPerSlide * 1000;
      const elapsed = Math.min(duration, getRotationElapsed(rotationClock, performance.now()));
      const transform = `scaleX(${elapsed / duration})`;
      bar.style.transform = transform;
      if (rotationClock.startedAt === null || elapsed >= duration || !bar.animate) return;

      animation = bar.animate([{ transform }, { transform: 'scaleX(1)' }], {
        duration: duration - elapsed,
        fill: 'forwards',
        easing: 'linear',
      });
    };

    const unsubscribe = useScreenPlayerStore.subscribe((state, previous) => {
      if (state.rotationClock !== previous.rotationClock || !bar.animate) syncProgress(state);
    });
    syncProgress(useScreenPlayerStore.getState());

    return () => {
      unsubscribe();
      animation?.cancel();
    };
  }, []);

  return (
    <div className="relative h-1 w-full overflow-hidden bg-slate-100 sm:h-1.5">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-[#E6007E] shadow-[0_0_8px_#E6007E]"
      />
    </div>
  );
}

interface ScreenHeaderProps {
  title: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title }) => {
  const { currentSlide, totalSlides, viewTitle, paused } = useScreenPlayerStore(
    useShallow((state) => ({
      currentSlide: state.currentSlide,
      totalSlides: state.totalSlides,
      viewTitle: selectCurrentView(state).title,
      paused: state.isPaused || state.isEditingServices,
    })),
  );
  const currentDateTime = useCurrentDateTime();
  const displayTitle = viewTitle || title;
  const playbackStatus = paused ? 'En pausa' : 'Reproduciendo';

  return (
    <header className="relative w-full border-b border-slate-200 bg-white backdrop-blur-md z-20">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4 md:grid md:grid-cols-3">
        {/* Brand section */}
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/go-service-latam.png"
            alt="GO Service LATAM"
            width={1103}
            height={285}
            className="h-auto w-24 shrink-0 sm:w-32 xl:w-40"
          />
          <span className="hidden whitespace-nowrap border-l border-slate-200 pl-3 text-sm font-bold text-slate-800 min-[900px]:inline xl:text-lg">
            Soporte técnico
          </span>
        </div>

        {/* Center View Title (Visible on md and larger) */}
        <div className="hidden min-w-0 text-center md:block">
          <h1 className="text-xl xl:text-3xl font-extrabold text-slate-900 tracking-tight">
            {displayTitle}
          </h1>
        </div>

        {/* Right Status & Meta */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 md:justify-end">
          <span className="inline-flex items-center" title={playbackStatus}>
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${paused ? 'bg-amber-500' : 'bg-emerald-500'}`}
            />
            <span className="ml-1.5 text-[11px] font-semibold text-slate-700 xl:text-base">
              {playbackStatus}
            </span>
          </span>

          {/* Slide counter n/6 */}
          <div className="flex flex-col items-end">
            <span className="text-[16.2px] sm:text-[18px] xl:text-[27px] font-black text-slate-900 leading-none">
              {currentSlide}/{totalSlides}
            </span>
            <span className="text-[10px] sm:text-xs xl:text-sm text-slate-500 mt-0.5 whitespace-nowrap min-h-[1rem]">
              {currentDateTime}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Title Bar (Below brand on small screens < md) */}
      <div className="md:hidden text-center pb-2 px-3 border-t border-slate-100 pt-1.5 bg-slate-50/50">
        <h1 className="text-lg font-black text-slate-900 tracking-tight">{displayTitle}</h1>
      </div>

      <PlaybackProgress />
    </header>
  );
};
