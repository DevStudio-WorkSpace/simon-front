'use client';

import React from 'react';
import { InternalActivitiesData, ActivityState } from '../../../domain/models';
import { KpiCard } from '../ui/KpiCard';
import { Badge, BadgeVariant } from '../ui/Badge';

interface ActivitiesSlideProps {
  data: InternalActivitiesData;
}

const activityStateMap: Record<ActivityState, { label: string; variant: BadgeVariant }> = {
  asignada: { label: 'Asignada', variant: 'neutral' },
  en_curso: { label: 'En curso', variant: 'scheduled' },
  pausada_por_servicio: { label: 'Pausada por servicio', variant: 'waiting' },
  bloqueada: { label: 'Bloqueada', variant: 'alert' },
  lista_para_revision: { label: 'Lista para revisión', variant: 'success' },
  validada: { label: 'Validada', variant: 'success' },
};

export const ActivitiesSlide: React.FC<ActivitiesSlideProps> = ({ data }) => {
  return (
    <div className="flex flex-col justify-between h-full gap-4 py-2">
      {/* Subtitle / Header row */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Qué avanzar cuando estás disponible
        </h2>
        <span className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          Ejemplo ilustrativo · coordinación organiza, cada técnico registra su avance
        </span>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <KpiCard number={data.inProgressCount} label="en curso" variant="scheduled" />
        <KpiCard
          number={data.pausedByServiceCount}
          label="pausada por servicio"
          variant="waiting"
        />
        <KpiCard number={data.readyForReviewCount} label="lista para revisión" variant="success" />
      </div>

      {/* Activities Table */}
      <div className="glass-panel neumorph-shadow rounded-2xl overflow-hidden flex-1 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[580px] lg:min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base uppercase tracking-wider font-bold">
                <th className="py-2.5 sm:py-3 px-3 sm:px-6">Técnico</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-6">Actividad interna</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-6">Estado</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-6">Siguiente paso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200 text-sm sm:text-base md:text-lg">
              {data.activities.map((item) => {
                const stateConfig = activityStateMap[item.state] || {
                  label: item.state,
                  variant: 'neutral' as BadgeVariant,
                };

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-2.5 sm:py-3 px-3 sm:px-6 font-black text-slate-900 dark:text-white">
                      {item.technicianName}
                    </td>
                    <td className="py-2.5 sm:py-3 px-3 sm:px-6 font-semibold text-slate-800 dark:text-slate-200">
                      {item.activityTitle}
                    </td>
                    <td className="py-2.5 sm:py-3 px-3 sm:px-6">
                      <Badge variant={stateConfig.variant} size="sm">
                        {stateConfig.label}
                      </Badge>
                    </td>
                    <td className="py-2.5 sm:py-3 px-3 sm:px-6 text-slate-600 dark:text-slate-300 font-medium">
                      {item.nextStep}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Banner for Available Activity */}
        <div className="p-3 sm:p-4 px-4 sm:px-6 bg-pink-50/70 dark:bg-pink-950/30 border-t border-pink-200/60 dark:border-pink-900/40 text-sm sm:text-base md:text-lg">
          <span className="font-extrabold text-[#E6007E] dark:text-[#FF2D95]">
            Disponible para tomar:
          </span>{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {data.availableToTake.title}
          </span>{' '}
          <span className="text-slate-500 dark:text-slate-400">
            · {data.availableToTake.requirement}
          </span>
        </div>
      </div>

      {/* Footnote */}
      <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 px-2">
        Datos de ejemplo · La bitácora detallada se consulta en el sistema.
      </div>
    </div>
  );
};
