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
    <div className="flex w-full flex-col gap-2.5 xl:gap-4">
      {/* Subtitle / Header row */}
      <div className="pb-1">
        <h2 className="text-lg xl:text-3xl font-black text-slate-900">
          Qué avanzar cuando estás disponible
        </h2>
        <span className="text-xs xl:text-base text-slate-600">
          Ejemplo ilustrativo · coordinación organiza, cada técnico registra su avance
        </span>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:gap-4">
        <KpiCard compact number={data.inProgressCount} label="en curso" variant="scheduled" />
        <KpiCard
          compact
          number={data.pausedByServiceCount}
          label="pausada por servicio"
          variant="waiting"
        />
        <KpiCard
          compact
          number={data.readyForReviewCount}
          label="lista para revisión"
          variant="success"
        />
      </div>

      {/* Activities Table */}
      <div className="flex flex-col gap-2 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[580px] table-fixed border-separate border-spacing-y-1 text-left [&_td]:px-2 [&_td]:py-2.5 [&_th]:px-2 xl:[&_td]:px-4 xl:[&_td]:py-3 xl:[&_th]:px-4">
            <colgroup>
              <col className="w-[13%]" />
              <col className="w-[32%]" />
              <col className="w-[23%]" />
              <col className="w-[32%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs xl:text-lg font-bold">
                <th>Técnico</th>
                <th>Actividad interna</th>
                <th>Estado</th>
                <th>Siguiente paso</th>
              </tr>
            </thead>
            <tbody className="text-sm leading-tight text-slate-800 xl:text-lg">
              {data.activities
                .filter((item) => item.state !== 'validada')
                .map((item) => {
                  const stateConfig = activityStateMap[item.state] || {
                    label: item.state,
                    variant: 'neutral' as BadgeVariant,
                  };

                  return (
                    <tr key={item.id} className="bg-slate-100/80">
                      <td className="font-black text-slate-900">{item.technicianName}</td>
                      <td className="font-semibold text-slate-800">{item.activityTitle}</td>
                      <td>
                        <Badge
                          variant={stateConfig.variant}
                          size="sm"
                          className="!border-0 !bg-transparent !px-0 !leading-tight"
                        >
                          {stateConfig.label}
                        </Badge>
                      </td>
                      <td className="text-slate-600 font-medium">{item.nextStep}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Bottom Banner for Available Activity */}
        <div className="rounded-md bg-pink-50 px-3 py-2 text-sm xl:px-4 xl:py-3 xl:text-xl">
          <span className="font-extrabold text-[#E6007E]">Disponible para tomar:</span>{' '}
          <span className="font-semibold text-slate-800">{data.availableToTake.title}</span>{' '}
          <span className="text-slate-500">· {data.availableToTake.requirement}</span>
        </div>
      </div>

      {/* Footnote */}
      <div className="px-1 text-xs text-slate-600 xl:text-base">
        Datos de ejemplo · La bitácora detallada se consulta en el sistema.
      </div>
    </div>
  );
};
