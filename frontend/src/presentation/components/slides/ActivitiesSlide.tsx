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
    <div className="flex flex-col justify-between h-full gap-4 lg:gap-5 py-1">
      <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="tv-heading font-black text-slate-900 dark:text-white">
          Qué avanzar cuando estás disponible
        </h2>
        <p className="tv-caption text-slate-500 dark:text-slate-400 mt-1">
          Ejemplo ilustrativo · coordinación organiza, cada técnico registra su avance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <KpiCard number={data.inProgressCount} label="en curso" variant="scheduled" />
        <KpiCard number={data.pausedByServiceCount} label="pausada por servicio" variant="waiting" />
        <KpiCard number={data.readyForReviewCount} label="lista para revisión" variant="success" />
      </div>

      <div className="glass-panel neumorph-shadow rounded-2xl overflow-hidden flex-1 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 min-h-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[960px] xl:min-w-full table-fixed text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 tv-caption font-extrabold uppercase tracking-wider">
                <th className="w-[18%] py-3 px-5">Técnico</th>
                <th className="w-[27%] py-3 px-4">Actividad interna</th>
                <th className="w-[25%] py-3 px-4">Estado</th>
                <th className="w-[30%] py-3 px-4 pr-5">Siguiente paso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200 tv-body">
              {data.activities.map((item) => {
                const stateConfig = activityStateMap[item.state] || {
                  label: item.state,
                  variant: 'neutral' as BadgeVariant,
                };

                return (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-5 font-black text-slate-900 dark:text-white">
                      <span className="block truncate" title={item.technicianName}>{item.technicianName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="block truncate font-semibold" title={item.activityTitle}>{item.activityTitle}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={stateConfig.variant} size="md">
                        {stateConfig.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 pr-5">
                      <span className="block truncate text-slate-600 dark:text-slate-300 font-medium" title={item.nextStep}>
                        {item.nextStep}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 px-5 semantic-surface--brand border-t flex flex-wrap items-center gap-x-3 gap-y-1 tv-body">
          <span className="semantic-text--brand font-extrabold">Disponible para tomar:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{data.availableToTake.title}</span>
          <span className="text-slate-500 dark:text-slate-400">· {data.availableToTake.requirement}</span>
        </div>
      </div>

      <p className="tv-caption text-slate-500 dark:text-slate-400 px-2">
        Datos de ejemplo · La bitácora detallada se consulta en el sistema.
      </p>
    </div>
  );
};
