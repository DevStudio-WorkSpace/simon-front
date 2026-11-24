'use client';

import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Clock3, Info, Medal, X } from 'lucide-react';
import { PunctualityData } from '../../../domain/models';

interface PunctualitySlideProps {
  data: PunctualityData;
}

export const PunctualitySlide: React.FC<PunctualitySlideProps> = ({ data }) => {
  const [showTardinessModal, setShowTardinessModal] = useState(false);

  const yAxisTicks = [20, 15, 10, 5, 0];
  const maxScaleValue = 20;

  const closeModal = () => {
    setShowTardinessModal(false);
  };

  return (
    <div className="flex flex-col justify-between h-full gap-4 lg:gap-5 py-1 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 items-stretch min-h-0">
        <div className="lg:col-span-5 glass-panel neumorph-shadow rounded-2xl p-4 lg:p-6 flex flex-col justify-between">
          <div>
            <h2 className="tv-heading font-black text-slate-900 dark:text-white mb-4">
              Llegaron a tiempo
            </h2>

            <div className="space-y-1.5 lg:space-y-2">
              {data.onTimeList.map((item) => {
                const isGold = item.position === 1;
                const isSilver = item.position === 2;
                const isBronze = item.position === 3;

                return (
                  <div
                    key={item.position}
                    className={`flex items-center justify-between p-2 lg:p-2.5 px-3 lg:px-4 rounded-xl transition-all gap-3 ${
                      isGold
                        ? 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-900/50'
                        : isSilver
                        ? 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-semibold'
                        : isBronze
                        ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200/70 dark:border-amber-900/40'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/40 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 lg:gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 lg:w-9 lg:h-9 xl:w-11 xl:h-11 rounded-full flex items-center justify-center gap-0.5 text-base lg:text-lg xl:text-[28px] font-black shrink-0 tv-tabular ${
                          isGold
                            ? 'bg-amber-500 text-white shadow-sm'
                            : isSilver
                            ? 'bg-slate-400 text-white shadow-sm'
                            : isBronze
                            ? 'bg-amber-700 text-white shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.position <= 3 && <Medal className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />}
                        {item.position}
                      </span>
                      <span className="tv-body font-bold truncate" title={item.technicianName}>
                        {item.technicianName}
                      </span>
                    </div>

                    <span className="tv-body font-semibold text-slate-600 dark:text-slate-400 tv-tabular whitespace-nowrap">
                      {item.arrivalTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-4 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <div className="glass-panel neumorph-shadow rounded-2xl p-4 lg:p-5 border semantic-surface--success">
              <span className="tv-body semantic-text--success font-extrabold block mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 lg:w-7 lg:h-7 shrink-0" />
                A tiempo hoy
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="tv-kpi semantic-number--success">{data.onTimeCount}</span>
                <span className="tv-body text-slate-600 dark:text-slate-300 font-bold">
                  de {data.totalTeamCount}
                </span>
              </div>
            </div>

            <div className="glass-panel neumorph-shadow rounded-2xl p-4 lg:p-5 border semantic-surface--waiting">
              <span className="tv-body semantic-text--waiting font-extrabold block mb-2 flex items-center gap-2">
                <Clock3 className="w-6 h-6 lg:w-7 lg:h-7 shrink-0" />
                Tardanzas hoy
              </span>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="tv-kpi semantic-number--waiting">{data.tardinessCountToday}</span>
                <span className="tv-caption semantic-text--waiting font-bold">
                  ({data.totalTardinessMinutes} min en total)
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel neumorph-shadow rounded-2xl p-4 lg:p-6 flex-1 flex flex-col justify-between border border-slate-200 dark:border-slate-800 min-h-0">
            <div className="flex items-center justify-between mb-4 gap-4">
              <div>
                <h3 className="text-lg md:text-2xl lg:text-3xl xl:text-[34px] font-black text-slate-900 dark:text-white">
                  Tardanzas del equipo por semana
                </h3>
                <span className="tv-caption text-slate-500 dark:text-slate-400">
                  Histórico semanal de incidencias
                </span>
              </div>

              <button
                onClick={() => setShowTardinessModal(true)}
                className="tv-focus tv-body flex items-center gap-2 p-2 lg:px-4 lg:py-2.5 rounded-xl semantic-surface--neutral transition-all active:scale-95 shadow-sm shrink-0"
                title="Ver detalle anónimo de tardanzas"
                aria-haspopup="dialog"
              >
                <span className="font-black semantic-text--neutral tv-tabular">
                  +{data.anonymousTardinessBadge}
                </span>
                <span className="font-bold semantic-text--neutral hidden sm:inline">
                  anónimos
                </span>
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="relative flex-1 flex items-stretch mt-2 pt-2 min-h-[220px]">
              <div className="flex flex-col justify-between items-end pr-4 pb-10 xl:pb-20 tv-caption font-bold text-slate-500 dark:text-slate-400 border-r border-slate-300 dark:border-slate-700 tv-tabular">
                {yAxisTicks.map((tick) => (
                  <span key={tick} className="leading-none -mr-1">
                    {tick}
                  </span>
                ))}
              </div>

              <div className="flex-1 overflow-x-auto relative pl-3 pb-2">
                <div className="absolute inset-0 right-0 pointer-events-none flex flex-col justify-between pb-10 xl:pb-20">
                  {yAxisTicks.map((tick) => (
                    <div
                      key={tick}
                      className="w-full border-b border-dashed border-slate-200 dark:border-slate-800"
                    />
                  ))}
                </div>

                <div className="relative min-w-[560px] xl:min-w-full h-full flex items-end justify-around gap-4 sm:gap-6 pt-4 pb-10 xl:pb-20">
                  {data.weeklyTardinessHistory.slice(-3).map((week) => {
                    const heightPercent = Math.min(100, Math.max(8, (week.count / maxScaleValue) * 100));

                    return (
                      <div
                        key={week.weekLabel}
                        className="flex flex-col items-center flex-1 max-w-[110px] h-full justify-end group z-10"
                      >
                        <span
                          className={`tv-body font-black mb-1 transition-transform group-hover:-translate-y-0.5 tv-tabular ${
                            week.isCurrentWeek
                              ? 'semantic-text--success drop-shadow'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {week.count}
                        </span>

                        <div
                          className={`w-full rounded-t-xl transition-all duration-700 shadow-md ${
                            week.isCurrentWeek
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-700 dark:to-emerald-400 ring-2 ring-emerald-400/40'
                              : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />

                        <div className="flex flex-col items-center text-center mt-2 absolute bottom-0 xl:-bottom-[76px]">
                          <span className="tv-caption font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap tv-tabular">
                            {week.weekLabel}
                          </span>
                          {week.isCurrentWeek ? (
                            <span className="tv-caption semantic-text--success font-extrabold whitespace-nowrap">
                              esta semana
                            </span>
                          ) : week.weekLabel === '26 oct' ? (
                            <span className="tv-caption text-slate-400 font-medium whitespace-nowrap">
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

            <div className="mt-4 p-3 lg:p-4 px-4 lg:px-5 rounded-xl semantic-surface--success border semantic-text--success font-bold tv-body flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 lg:w-7 lg:h-7 semantic-text--success shrink-0" />
              <span>
                Racha más larga: {data.longestStreak.technicianName} · {data.longestStreak.consecutiveDays} días puntual
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 lg:p-4 px-4 lg:px-6 rounded-2xl semantic-surface--waiting border tv-body font-bold flex items-center gap-3">
        <span className="semantic-text--waiting font-extrabold shrink-0">Por mejorar:</span>
        <span className="min-w-0">
          Meta de mañana: {data.improvementNotice.targetTardiness} · Entrada {data.improvementNotice.entryTime} (tolerancia {data.improvementNotice.toleranceTime})
        </span>
      </div>

      {showTardinessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tardiness-modal-title"
            className="glass-panel neumorph-shadow rounded-3xl p-6 lg:p-8 max-w-3xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="tardiness-modal-title" className="tv-heading font-black text-slate-900 dark:text-white flex items-center gap-3 flex-wrap">
                  <span>Detalle de Tardanzas de Hoy</span>
                  <span className="tv-caption semantic-surface--waiting semantic-text--waiting border px-3 py-1 rounded-full font-black">
                    +{data.anonymousTardinessBadge}
                  </span>
                </h3>
                <p className="tv-caption text-slate-500 dark:text-slate-400 mt-1">
                  Métricas de puntualidad registradas para auditoría
                </p>
              </div>

              <button
                onClick={closeModal}
                className="tv-focus p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors shrink-0"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 rounded-xl semantic-surface--scheduled border flex items-start gap-3 tv-caption">
              <Info className="w-6 h-6 semantic-text--scheduled shrink-0" />
              <span>
                <strong>Regla de Privacidad (SIMON-S1-T05):</strong> En la TV pública de la sala, los nombres de quienes llegaron tarde se mantienen en anonimato para fomentar la mejora continua sin exposición.
              </span>
            </div>

            <div className="space-y-3">
              {(data.lateArrivalsList || []).map((late, idx) => (
                <div
                  key={late.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 xl:w-11 xl:h-11 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center tv-body font-black text-slate-700 dark:text-slate-300 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="tv-body font-bold text-slate-900 dark:text-white truncate">
                        Técnico Anónimo #{idx + 1}
                      </p>
                      <span className="tv-caption text-slate-500 dark:text-slate-400">
                        Entrada marcada: {late.arrivalTime}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-extrabold semantic-text--waiting tv-body whitespace-nowrap tv-tabular">
                    +{late.minutesLate} min
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={closeModal}
                className="tv-focus px-5 py-2.5 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white font-bold tv-caption shadow-md transition-all active:scale-95"
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
