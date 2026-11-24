'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { MonthlyGoalData } from '../../../domain/models';

interface GoalSlideProps {
  data: MonthlyGoalData;
}

export const GoalSlide: React.FC<GoalSlideProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto py-5 text-center">
      <h2 className="tv-heading font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
        Meta comercial de {data.monthName}
      </h2>

      <p className="tv-caption font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Avance del equipo
      </p>
      <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[160px] font-black text-slate-900 dark:text-white tracking-tighter leading-none my-2 tv-tabular">
        {data.progressPercentage}%
      </div>

      <div className="mt-3 mb-3 sm:mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full semantic-surface--success border semantic-text--success font-extrabold text-base sm:text-xl lg:text-2xl xl:text-[32px]">
        <Check className="w-6 h-6 lg:w-7 lg:h-7 stroke-[3] shrink-0" />
        <span>{data.currentMilestone}</span>
      </div>

      <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-[32px] font-semibold text-slate-600 dark:text-slate-300 mb-8 sm:mb-12">
        {data.nextMilestone}
      </p>

      <div className="w-full px-6 pb-14 mt-2 sm:mt-4">
        <div className="relative w-full">
          <div className="w-full h-4 lg:h-5 xl:h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
            <div
              className="h-full bg-[#e6007e] dark:bg-[#ff2d95] transition-all duration-700 ease-out rounded-full shadow-[0_0_14px_rgba(230,0,126,0.45)]"
              style={{ width: `${data.progressPercentage}%` }}
            />
          </div>

          {data.milestones.map((m) => {
            const isCompleted = m.reached;

            return (
              <div
                key={m.level}
                className={`absolute top-0 flex flex-col items-center z-10 ${
                  m.percentage === 100 ? '-translate-x-full' : '-translate-x-1/2'
                }`}
                style={{ left: `${m.percentage}%` }}
              >
                <div
                  className={`w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 -translate-y-1/2 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                    isCompleted
                      ? 'bg-white text-[#e6007e] border-[#e6007e] dark:bg-slate-900 dark:text-[#ff2d95]'
                      : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}
                  title={`${m.label}: ${isCompleted ? 'alcanzado' : 'pendiente'}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 xl:w-6 xl:h-6 stroke-[3]" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" aria-hidden="true" />
                  )}
                </div>

                <span
                  className={`tv-caption font-extrabold mt-2 whitespace-nowrap ${
                    isCompleted
                      ? 'text-[#e6007e] dark:text-[#ff2d95]'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
