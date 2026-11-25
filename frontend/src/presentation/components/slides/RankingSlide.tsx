'use client';

import React from 'react';
import { RankingContributor } from '../../../domain/models';

interface RankingSlideProps {
  monthName: string;
  contributors: RankingContributor[];
}

export const RankingSlide: React.FC<RankingSlideProps> = ({ monthName, contributors }) => {
  return (
    <div className="flex flex-col justify-between h-full gap-4 py-2">
      {/* Title subtitle row */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 bg-[#E6007E] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Los que destacan este mes
          </h2>
        </div>
        <span className="text-xl md:text-2xl font-bold text-slate-500 dark:text-slate-400 capitalize">
          {monthName}
        </span>
      </div>

      {/* 3 Contributor Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-stretch">
        {contributors.map((c) => {
          const isFirst = c.position === 1;
          const isSecond = c.position === 2;

          const topBorderColor = isFirst
            ? 'border-t-[#E6007E]'
            : isSecond
              ? 'border-t-blue-500'
              : 'border-t-amber-600';

          const badgeBg = isFirst
            ? 'bg-amber-500 text-white'
            : isSecond
              ? 'bg-slate-400 text-white'
              : 'bg-amber-700 text-white';

          // Component percentages for stacked bar
          const total = c.totalPoints;
          const punctualityWidth = (c.breakdown.punctuality / total) * 100;
          const attendanceWidth = (c.breakdown.attendance / total) * 100;
          const trainingWidth = (c.breakdown.training / total) * 100;
          const servicesWidth = (c.breakdown.services / total) * 100;

          return (
            <div
              key={c.position}
              className={`glass-panel neumorph-shadow rounded-2xl p-4 sm:p-6 flex flex-col justify-between border-t-8 ${topBorderColor} transition-transform hover:-translate-y-1`}
            >
              <div>
                {/* Header: Position badge & name */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-base sm:text-lg shrink-0 ${badgeBg}`}
                  >
                    {c.position}
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white truncate">
                    {c.technicianName}
                  </span>
                </div>

                {/* Big Score Number */}
                <div className="mt-2 sm:mt-4 mb-4 sm:mb-6">
                  <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    {c.totalPoints.toLocaleString('es-PE')}
                  </div>
                  <span className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 font-semibold block mt-1">
                    puntos
                  </span>
                </div>

                {/* 4-Segment Stacked Bar */}
                <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-inner mb-2">
                  <div
                    style={{ width: `${punctualityWidth}%` }}
                    className="bg-[#008080] flex items-center justify-center text-xs md:text-sm font-bold text-white"
                    title={`Puntualidad: ${c.breakdown.punctuality}`}
                  >
                    {c.breakdown.punctuality}
                  </div>
                  <div
                    style={{ width: `${attendanceWidth}%` }}
                    className="bg-[#20B2AA] flex items-center justify-center text-xs md:text-sm font-bold text-white"
                    title={`Asistencia: ${c.breakdown.attendance}`}
                  >
                    {c.breakdown.attendance}
                  </div>
                  <div
                    style={{ width: `${trainingWidth}%` }}
                    className="bg-[#2563EB] flex items-center justify-center text-xs md:text-sm font-bold text-white"
                    title={`Capacitación: ${c.breakdown.training}`}
                  >
                    {c.breakdown.training}
                  </div>
                  <div
                    style={{ width: `${servicesWidth}%` }}
                    className="bg-[#60A5FA] flex items-center justify-center text-xs md:text-sm font-bold text-white"
                    title={`Servicios: ${c.breakdown.services}`}
                  >
                    {c.breakdown.services}
                  </div>
                </div>

                {/* Subtotals: Actitud vs Aptitud */}
                <div className="flex items-center justify-between text-base md:text-lg py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Actitud · Aptitud
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                    {c.attitudeSubtotal} · {c.aptitudeSubtotal}
                  </span>
                </div>
              </div>

              {/* Dominant and Growth Factors */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-base md:text-lg">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Más pesa</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {c.dominantFactor}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Creció</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    {c.growthHighlight.factor} ▲{c.growthHighlight.gain}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend and Footnote */}
      <div className="py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm md:text-base text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#008080]" />
            <span>Puntualidad</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#20B2AA]" />
            <span>Asistencia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
            <span>Capacitación</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#60A5FA]" />
            <span>Servicios</span>
          </div>
        </div>

        <span className="italic text-xs md:text-sm">
          Ejemplo de reglas: puntual +10 por día · examen con 16 o más +50 · servicio cerrado sin
          reapertura +20
        </span>
      </div>
    </div>
  );
};
