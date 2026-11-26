'use client';

import React from 'react';
import { AnnouncementData } from '../../../domain/models';

interface AnnouncementSlideProps {
  data: AnnouncementData;
}

export const AnnouncementSlide: React.FC<AnnouncementSlideProps> = ({ data }) => {
  return (
    <div className="flex flex-col justify-center h-full max-w-5xl mx-auto py-3 sm:py-6 w-full">
      {/* Hero Announcement Card with Blue Left Border Accent */}
      <div className="glass-panel neumorph-shadow rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 lg:p-14 border-l-4 sm:border-l-8 border-l-[#2563EB] relative overflow-hidden flex flex-col justify-between min-h-[320px] sm:min-h-[460px]">
        {/* Top Tag & Remaining seconds counter */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="px-3 sm:px-5 py-1 sm:py-2 rounded-xl bg-blue-100 text-[#2563EB] font-extrabold text-sm sm:text-lg md:text-xl border border-blue-200">
            {data.timeTag}
          </div>

          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-lg sm:text-2xl text-[#2563EB] shadow-inner">
            {data.remainingSeconds || 10}
          </div>
        </div>

        {/* Big Bold Headline */}
        <div className="my-auto space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {data.title}
          </h2>

          <p className="text-base sm:text-2xl md:text-3xl text-slate-600 font-medium">
            {data.description}
          </p>
        </div>

        {/* Separator and Guides */}
        <div className="pt-4 sm:pt-8 border-t border-slate-200">
          <p className="text-base sm:text-2xl md:text-3xl font-extrabold text-[#2563EB]">
            Guías: {data.responsibleGuides.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};
