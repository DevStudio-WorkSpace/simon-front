'use client';

import React from 'react';
import { MonthlyGoalData } from '../../../domain/models';
import { Check } from 'lucide-react';

interface GoalSlideProps {
  data: MonthlyGoalData;
}

export const GoalSlide: React.FC<GoalSlideProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto py-6 text-center">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
        Meta comercial de {data.monthName}
      </h2>

      {/* Hero Percentage (>80px required by TV specs, here 120-140px on TV, responsive on mobile) */}
      <div className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-black text-slate-900 dark:text-white tracking-tighter leading-none my-1 sm:my-2 drop-shadow-sm">
        {data.progressPercentage}%
      </div>

      {/* Milestone Reached Badge */}
      <div className="mt-3 mb-2 sm:mt-4 sm:mb-3 inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-base sm:text-xl md:text-2xl shadow-sm">
        <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
        <span>{data.currentMilestone}</span>
      </div>

      {/* Next Milestone Target */}
      <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-slate-600 dark:text-slate-300 mb-8 sm:mb-12">
        {data.nextMilestone}
      </p>

      {/* Milestone Progress Bar Track */}
      <div className="w-full relative px-2 sm:px-6 mt-2 sm:mt-4">
        {/* Background track line */}
        <div className="w-full h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
          {/* Filled magenta progress */}
          <div
            className="h-full bg-[#E6007E] transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_#E6007E]"
            style={{ width: `${data.progressPercentage}%` }}
          />
        </div>

        {/* Milestone checkpoints overlaid */}
        <div className="flex justify-between items-center -mt-5 sm:-mt-6 relative z-10">
          {data.milestones.map((m) => {
            const isCompleted = m.reached;

            return (
              <div key={m.level} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs border-2 transition-all shadow-md ${
                    isCompleted
                      ? 'bg-white text-[#E6007E] border-[#E6007E]'
                      : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400" />}
                </div>

                <span
                  className={`text-xs sm:text-base md:text-xl font-bold mt-2 sm:mt-3 ${
                    isCompleted
                      ? 'text-[#E6007E] dark:text-[#FF2D95]'
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

