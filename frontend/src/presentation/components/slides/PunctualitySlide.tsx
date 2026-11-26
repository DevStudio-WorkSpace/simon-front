'use client';

import React, { useState } from 'react';
import { PunctualityData } from '../../../domain/models';
import { Eye, EyeOff, X, ChevronRight, Info } from 'lucide-react';

interface PunctualitySlideProps {
  data: PunctualityData;
}

export const PunctualitySlide: React.FC<PunctualitySlideProps> = ({ data }) => {
  const [showTardinessModal, setShowTardinessModal] = useState(false);
  const [revealNames, setRevealNames] = useState(false);

  // Y-axis scale benchmarks
  const yAxisTicks = [20, 15, 10, 5, 0];
  const maxScaleValue = 20;

  return (
    <div className="flex flex-col justify-between h-full gap-4 py-2 relative">
      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 items-stretch">
        {/* Left Column: On-Time list */}
        <div className="lg:col-span-5 glass-panel neumorph-shadow rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-3 sm:mb-4">
              Llegaron a tiempo
            </h2>

            <div className="space-y-1.5 sm:space-y-2">
              {data.onTimeList.map((item) => {
                const isGold = item.position === 1;
                const isSilver = item.position === 2;
                const isBronze = item.position === 3;

                return (
                  <div
                    key={item.position}
                    className={`flex items-center justify-between p-2 sm:p-2.5 px-3 sm:px-4 rounded-xl transition-all ${
                      isGold
                        ? 'bg-amber-100/80 text-amber-900 font-bold border border-amber-200 shadow-sm'
                        : isSilver
                          ? 'bg-slate-200/60 text-slate-800 font-semibold'
                          : isBronze
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shrink-0 ${
                          isGold
                            ? 'bg-amber-500 text-white shadow-sm'
                            : isSilver
                              ? 'bg-slate-400 text-white shadow-sm'
                              : isBronze
                                ? 'bg-amber-700 text-white shadow-sm'
                                : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.position}
                      </span>
                      <span className="text-base sm:text-lg md:text-xl font-bold">
                        {item.technicianName}
                      </span>
                    </div>

                    <span className="text-sm sm:text-base md:text-lg font-mono font-semibold text-slate-600">
                      {item.arrivalTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: KPIs & Professional Weekly Bar Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          {/* Top 2 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="glass-panel neumorph-shadow rounded-2xl p-4 sm:p-5 bg-emerald-50/70 border border-emerald-200/70">
              <span className="text-sm sm:text-base md:text-lg font-bold text-emerald-800 block mb-1">
                A tiempo hoy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-emerald-700">
                  {data.onTimeCount} de {data.totalTeamCount}
                </span>
              </div>
            </div>

            <div className="glass-panel neumorph-shadow rounded-2xl p-4 sm:p-5 bg-amber-50/70 border border-amber-200/70">
              <span className="text-sm sm:text-base md:text-lg font-bold text-amber-800 block mb-1">
                Tardanzas hoy
              </span>
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-amber-700">
                  {data.tardinessCountToday}
                </span>
                <span className="text-xs sm:text-base md:text-lg text-amber-800 font-semibold">
                  ({data.totalTardinessMinutes} min en total)
                </span>
              </div>
            </div>
          </div>

          {/* Professional Weekly Tardiness Chart Card */}
          <div className="glass-panel neumorph-shadow rounded-2xl p-4 sm:p-6 flex-1 flex flex-col justify-between border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">
                  Tardanzas del equipo por semana
                </h3>
                <span className="text-xs text-slate-500">Histórico semanal de incidencias</span>
              </div>

              {/* Interactive +2 Anonymous Trigger Button */}
              <button
                onClick={() => setShowTardinessModal(true)}
                className="group flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all border border-slate-300/80 active:scale-95 shadow-sm"
                title="Ver detalle anónimo de tardanzas"
              >
                <span className="text-lg sm:text-xl font-black text-amber-600">
                  +{data.anonymousTardinessBadge}
                </span>
                <span className="text-xs font-bold text-slate-600 hidden sm:inline">anónimos</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Structured Chart Container with Y-Axis, Grid Lines and Horizontal Scroll */}
            <div className="relative flex-1 flex items-stretch mt-2 pt-2">
              {/* Y-Axis Label Column */}
              <div className="flex flex-col justify-between items-end pr-3 pb-8 text-xs font-mono font-bold text-slate-400 select-none border-r border-slate-300">
                {yAxisTicks.map((tick) => (
                  <span key={tick} className="leading-none -mr-1">
                    {tick}
                  </span>
                ))}
              </div>

              {/* Scrollable Graph Area */}
              <div className="flex-1 overflow-x-auto relative pl-2 pb-2">
                {/* Horizontal Guide Grid Lines */}
                <div className="absolute inset-0 right-0 pointer-events-none flex flex-col justify-between pb-8">
                  {yAxisTicks.map((tick) => (
                    <div key={tick} className="w-full border-b border-dashed border-slate-200" />
                  ))}
                </div>

                {/* Bars Plotting Area */}
                <div className="relative min-w-[360px] h-full flex items-end justify-around gap-4 sm:gap-6 pt-4 pb-8">
                  {data.weeklyTardinessHistory.map((week) => {
                    const heightPercent = Math.min(
                      100,
                      Math.max(8, (week.count / maxScaleValue) * 100),
                    );

                    return (
                      <div
                        key={week.weekLabel}
                        className="flex flex-col items-center flex-1 max-w-[85px] sm:max-w-[100px] h-full justify-end group z-10"
                      >
                        {/* Number on top of bar */}
                        <span
                          className={`text-lg sm:text-xl font-black mb-1 transition-transform group-hover:-translate-y-0.5 ${
                            week.isCurrentWeek ? 'text-emerald-600 drop-shadow' : 'text-slate-700'
                          }`}
                        >
                          {week.count}
                        </span>

                        {/* Bar element with gradient & shadow */}
                        <div
                          className={`w-full rounded-t-xl transition-all duration-700 shadow-md ${
                            week.isCurrentWeek
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                              : 'bg-gradient-to-t from-slate-400 to-slate-300 hover:from-slate-500 hover:to-slate-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />

                        {/* X-Axis Week Label */}
                        <div className="flex flex-col items-center text-center mt-2 absolute -bottom-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap">
                            {week.weekLabel}
                          </span>
                          {week.isCurrentWeek ? (
                            <span className="text-[10px] text-emerald-600 font-extrabold whitespace-nowrap">
                              esta semana
                            </span>
                          ) : week.weekLabel === '26 oct' ? (
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                              marcha blanca
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Longest Streak Pill */}
            <div className="mt-3 p-2.5 sm:p-3 px-4 sm:px-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm sm:text-base md:text-lg flex items-center justify-between">
              <span>
                Racha más larga: {data.longestStreak.technicianName} ·{' '}
                {data.longestStreak.consecutiveDays} días puntual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Improvement Notice Banner */}
      <div className="p-3 sm:p-3.5 px-4 sm:px-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm sm:text-base md:text-lg font-bold flex items-center gap-2">
        <span className="text-amber-600 shrink-0">Por mejorar:</span>
        <span className="truncate sm:whitespace-normal">
          {data.tardinessCountToday} tardanzas hoy. Meta de mañana:{' '}
          {data.improvementNotice.targetTardiness} · Entrada {data.improvementNotice.entryTime}{' '}
          (tolerancia {data.improvementNotice.toleranceTime})
        </span>
      </div>

      {/* Interactive Modal for +2 Anonymous Late Arrivals */}
      {showTardinessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel neumorph-shadow rounded-3xl p-6 sm:p-8 max-w-lg w-full bg-white border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Detalle de Tardanzas de Hoy</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    +{data.anonymousTardinessBadge}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Métricas de puntualidad registradas para auditoría
                </p>
              </div>

              <button
                onClick={() => {
                  setShowTardinessModal(false);
                  setRevealNames(false);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy Policy Callout Box (SIMON Sprint 1 Rule 63) */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs sm:text-sm text-blue-800">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Regla de Privacidad (SIMON-S1-T05):</strong> En la TV pública de la sala,
                los nombres de quienes llegaron tarde se mantienen en anonimato para fomentar la
                mejora continua sin exposición.
              </span>
            </div>

            {/* List of late arrivals */}
            <div className="space-y-2.5">
              {(
                data.lateArrivalsList || [
                  {
                    id: '1',
                    technicianName: 'Pedro Quispe',
                    arrivalTime: '09:18',
                    minutesLate: 13,
                  },
                  {
                    id: '2',
                    technicianName: 'Lucas Morales',
                    arrivalTime: '09:39',
                    minutesLate: 34,
                  },
                ]
              ).map((late, idx) => (
                <div
                  key={late.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-sm sm:text-base text-slate-900">
                        {revealNames ? (
                          <span className="text-red-600">{late.technicianName}</span>
                        ) : (
                          <span className="font-mono text-slate-400">
                            Técnico Anónimo #{idx + 1}
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-slate-500">
                        Entrada marcada: {late.arrivalTime}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-extrabold text-amber-600 text-sm sm:text-base">
                    +{late.minutesLate} min
                  </span>
                </div>
              ))}
            </div>

            {/* Supervisor / Admin reveal button */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setRevealNames(!revealNames)}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {revealNames ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>
                  {revealNames
                    ? 'Ocultar nombres (Modo Público)'
                    : 'Revelar nombres (Solo Coordinador)'}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowTardinessModal(false);
                  setRevealNames(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
