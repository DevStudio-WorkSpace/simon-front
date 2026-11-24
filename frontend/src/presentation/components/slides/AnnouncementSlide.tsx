'use client';

import React from 'react';
import { Megaphone } from 'lucide-react';
import { AnnouncementData } from '../../../domain/models';
import { Badge } from '../ui/Badge';

interface AnnouncementSlideProps {
  data: AnnouncementData;
}

export const AnnouncementSlide: React.FC<AnnouncementSlideProps> = ({ data }) => {
  return (
    <div className="flex flex-col justify-center h-full max-w-6xl mx-auto py-3 sm:py-6 w-full">
      <div className="glass-panel neumorph-shadow rounded-3xl p-6 sm:p-10 lg:p-12 border-l-8 border-l-[#2563EB] relative overflow-hidden flex flex-col justify-between min-h-[420px] xl:min-h-[560px]">
        <div className="flex items-center justify-between mb-6 xl:mb-8 gap-6">
          <Badge variant="scheduled" size="lg" className="gap-2">
            <Megaphone className="w-6 h-6 xl:w-7 xl:h-7" />
            {data.timeTag}
          </Badge>

          <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full semantic-surface--scheduled border flex flex-col items-center justify-center shrink-0" aria-label={`Duración: ${data.remainingSeconds || 10} segundos`}>
            <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-black text-blue-700 dark:text-blue-300 tv-tabular leading-none">
              {data.remainingSeconds || 10}
            </span>
            <span className="tv-caption semantic-text--scheduled font-bold leading-none">seg</span>
          </div>
        </div>

        <div className="my-auto space-y-4 xl:space-y-6">
          <h2 className="tv-hero font-black text-slate-900 dark:text-white tracking-tight">
            {data.title}
          </h2>

          <p className="text-2xl md:text-3xl lg:text-4xl xl:text-[36px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
            {data.description}
          </p>
        </div>

        <div className="pt-6 xl:pt-8 border-t-2 border-slate-200 dark:border-slate-800">
          <p className="tv-body semantic-text--scheduled font-extrabold">
            Guías: {data.responsibleGuides.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};
