'use client';

import React from 'react';
import { Medal } from 'lucide-react';
import { RankingContributor } from '../../../domain/models';

interface RankingSlideProps {
  monthName: string;
  contributors: RankingContributor[];
}

const breakdownLegend = [
  { label: 'Puntualidad', color: 'bg-[#e6007e]' },
  { label: 'Asistencia', color: 'bg-[#ff7ab8]' },
  { label: 'Capacitación', color: 'bg-slate-500' },
  { label: 'Servicios', color: 'bg-slate-300 dark:bg-slate-600' },
];

const medalStyles: Record<1 | 2 | 3, { border: string; badge: string; label: string }> = {
  1: { border: 'border-t-amber-500', badge: 'bg-amber-500 text-white', label: 'Oro' },
  2: { border: 'border-t-slate-400', badge: 'bg-slate-400 text-white', label: 'Plata' },
  3: { border: 'border-t-amber-700', badge: 'bg-amber-700 text-white', label: 'Bronce' },
};

export const RankingSlide: React.FC<RankingSlideProps> = ({ monthName, contributors }) => {
  return (
    <div className="flex flex-col justify-between h-full gap-4 lg:gap-5 py-1">
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-2 bg-[#e6007e] dark:bg-[#ff2d95] rounded-full" aria-hidden="true" />
          <h2 className="tv-heading font-black text-slate-900 dark:text-white">
            Los que destacan este mes
          </h2>
        </div>
        <span className="tv-caption font-bold text-slate-500 dark:text-slate-400 capitalize whitespace-nowrap">
          {monthName}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 flex-1 items-stretch">
        {contributors.map((c) => {
          const medal = medalStyles[c.position];
          const total = c.totalPoints;
          const widths = [
            (c.breakdown.punctuality / total) * 100,
            (c.breakdown.attendance / total) * 100,
            (c.breakdown.training / total) * 100,
            (c.breakdown.services / total) * 100,
          ];

          return (
            <div
              key={c.position}
              className={`glass-panel neumorph-shadow rounded-2xl p-4 lg:p-6 flex flex-col justify-between border-t-8 ${medal.border}`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`w-9 h-9 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center gap-0.5 text-lg lg:text-2xl xl:text-[28px] font-black shrink-0 tv-tabular ${medal.badge}`}
                    title={medal.label}
                  >
                    <Medal className="w-4 h-4 lg:w-5 lg:h-5" />
                    {c.position}°
                  </span>
                  <span className="tv-body font-black text-slate-900 dark:text-white truncate" title={c.technicianName}>
                    {c.technicianName}
                  </span>
                </div>

                <div className="mt-2 lg:mt-4 mb-4 lg:mb-5">
                  <div className="tv-kpi text-slate-900 dark:text-white">
                    {c.totalPoints.toLocaleString('es-PE')}
                  </div>
                  <span className="tv-caption text-slate-500 dark:text-slate-400 font-bold block mt-1">
                    puntos
                  </span>
                </div>

                <div className="w-full h-10 lg:h-12 rounded-xl overflow-hidden flex shadow-inner">
                  {widths.map((width, index) => (
                    <div
                      key={breakdownLegend[index].label}
                      style={{ width: `${width}%` }}
                      className={`${breakdownLegend[index].color} h-full`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between tv-caption py-2 border-b border-slate-100 dark:border-slate-800 gap-2 mt-3">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Actitud · Aptitud</span>
                  <span className="font-extrabold text-slate-900 dark:text-white tv-tabular whitespace-nowrap">
                    {c.attitudeSubtotal} · {c.aptitudeSubtotal}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 tv-caption">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Más pesa</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-right">{c.dominantFactor}</span>
                </div>
                <div className="flex items-center justify-between gap-2 semantic-text--success">
                  <span className="font-bold whitespace-nowrap">Creció</span>
                  <span className="font-extrabold text-right whitespace-nowrap">
                    <span aria-hidden="true">▲</span> {c.growthHighlight.factor} +{c.growthHighlight.gain}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-3 tv-caption text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {breakdownLegend.map((segment) => (
            <span key={segment.label} className="flex items-center gap-2 font-bold">
              <span className={`w-3 h-3 rounded-full shrink-0 ${segment.color}`} aria-hidden="true" />
              {segment.label}
            </span>
          ))}
        </div>
        <span className="font-semibold whitespace-nowrap">Top 3 · sin últimos lugares</span>
      </div>
    </div>
  );
};
