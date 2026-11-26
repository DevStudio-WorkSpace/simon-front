'use client';

import React from 'react';
import { RankingContributor } from '../../../domain/models';

interface RankingSlideProps {
  monthName: string;
  contributors: RankingContributor[];
}

export const RankingSlide: React.FC<RankingSlideProps> = ({ monthName, contributors }) => {
  return (
    <div className="flex w-full flex-col gap-2.5 xl:gap-4">
      {/* Title subtitle row */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 bg-[#E6007E] rounded-full" />
          <h2 className="text-lg xl:text-3xl font-black text-slate-900">
            Los que destacan este mes
          </h2>
        </div>
        <span className="text-sm xl:text-xl font-bold text-slate-500 capitalize">{monthName}</span>
      </div>

      {/* 3 Contributor Podium Cards */}
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 xl:gap-4">
        {[...contributors]
          .sort((a, b) => a.position - b.position)
          .slice(0, 3)
          .map((c) => {
            const isFirst = c.position === 1;
            const isSecond = c.position === 2;

            const topBorderColor = isFirst
              ? 'border-t-[#E6007E]'
              : isSecond
                ? 'border-t-slate-400'
                : 'border-t-amber-600';

            const badgeBg = isFirst
              ? 'bg-amber-500 text-white'
              : isSecond
                ? 'bg-slate-400 text-white'
                : 'bg-amber-700 text-white';

            // Component percentages for stacked bar
            const total = c.totalPoints || 1;
            const punctualityWidth = (c.breakdown.punctuality / total) * 100;
            const attendanceWidth = (c.breakdown.attendance / total) * 100;
            const trainingWidth = (c.breakdown.training / total) * 100;
            const servicesWidth = (c.breakdown.services / total) * 100;

            return (
              <div
                key={c.position}
                className={`rounded-b-lg bg-slate-100/75 p-3 md:p-4 flex min-w-0 flex-col justify-between border-t-[3px] xl:p-5 ${topBorderColor}`}
              >
                <div>
                  {/* Header: Position badge & name */}
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-base sm:text-lg shrink-0 ${badgeBg}`}
                    >
                      {c.position}
                    </span>
                    <span className="text-base xl:text-3xl font-black text-slate-900 truncate">
                      {c.technicianName}
                    </span>
                  </div>

                  {/* Big Score Number */}
                  <div className="my-3.5 xl:my-4">
                    <div className="text-5xl xl:text-7xl font-black text-slate-900 tracking-tight leading-none">
                      {c.totalPoints.toLocaleString('es-ES', { useGrouping: 'always' })}
                    </div>
                    <span className="text-xs xl:text-base text-slate-500 font-semibold block mt-1">
                      puntos
                    </span>
                  </div>

                  {/* 4-Segment Stacked Bar */}
                  <div className="w-full h-6 rounded-sm overflow-hidden flex mb-1.5 xl:h-8">
                    <div
                      style={{ width: `${punctualityWidth}%` }}
                      className="bg-[#008080] flex items-center justify-center text-[10px] xl:text-sm font-bold text-white"
                      title={`Puntualidad: ${c.breakdown.punctuality}`}
                    >
                      {c.breakdown.punctuality}
                    </div>
                    <div
                      style={{ width: `${attendanceWidth}%` }}
                      className="bg-[#20B2AA] flex items-center justify-center text-[10px] xl:text-sm font-bold text-white"
                      title={`Asistencia: ${c.breakdown.attendance}`}
                    >
                      {c.breakdown.attendance}
                    </div>
                    <div
                      style={{ width: `${trainingWidth}%` }}
                      className="bg-[#2563EB] flex items-center justify-center text-[10px] xl:text-sm font-bold text-white"
                      title={`Capacitación: ${c.breakdown.training}`}
                    >
                      {c.breakdown.training}
                    </div>
                    <div
                      style={{ width: `${servicesWidth}%` }}
                      className="bg-[#60A5FA] flex items-center justify-center text-[10px] xl:text-sm font-bold text-white"
                      title={`Servicios: ${c.breakdown.services}`}
                    >
                      {c.breakdown.services}
                    </div>
                  </div>

                  {/* Subtotals: Actitud vs Aptitud */}
                  <div className="flex items-center justify-between gap-1 text-sm xl:text-base py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Actitud · Aptitud</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {c.attitudeSubtotal} · {c.aptitudeSubtotal}
                    </span>
                  </div>
                </div>

                {/* Dominant and Growth Factors */}
                <div className="space-y-2.5 pt-3 text-sm xl:text-base">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500">Más pesa</span>
                    <span className="font-extrabold text-slate-900">{c.dominantFactor}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500">Creció</span>
                    <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                      {c.growthHighlight.factor} ▲{c.growthHighlight.gain}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Legend and Footnote */}
      <div className="flex flex-col items-start gap-2 text-sm text-slate-600 xl:gap-2 xl:text-lg">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 md:pr-12">
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

        <span className="text-[11px] xl:text-base">
          Ejemplo de reglas: puntual +10 por día · examen con 16 o más +50 · servicio cerrado sin
          reapertura +20
        </span>
      </div>
    </div>
  );
};
