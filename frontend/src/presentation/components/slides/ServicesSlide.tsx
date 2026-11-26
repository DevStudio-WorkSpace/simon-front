'use client';

import React from 'react';
import {
  ServiceItem,
  ServicesMetrics,
  ServiceModality,
  ServiceState,
} from '../../../domain/models';
import { KpiCard } from '../ui/KpiCard';
import { Badge, BadgeVariant } from '../ui/Badge';
import { MapPin, Monitor, Wrench } from 'lucide-react';

interface ServicesSlideProps {
  metrics: ServicesMetrics;
  services: ServiceItem[];
}

const stateVariantMap: Record<ServiceState, { label: string; variant: BadgeVariant }> = {
  atendiendo: { label: 'Atendiendo', variant: 'scheduled' },
  programado: { label: 'Programado', variant: 'neutral' },
  espera_repuesto: { label: 'Espera repuesto', variant: 'waiting' },
  sin_tecnico: { label: 'Sin técnico', variant: 'unassigned' },
  terminado: { label: 'Terminado', variant: 'success' },
};

const modalityIcons: Record<ServiceModality, React.ReactNode> = {
  visita: <MapPin className="mr-1 h-3.5 w-3.5 shrink-0 text-slate-500 xl:h-5 xl:w-5" />,
  remoto: <Monitor className="mr-1 h-3.5 w-3.5 shrink-0 text-slate-500 xl:h-5 xl:w-5" />,
  taller: <Wrench className="mr-1 h-3.5 w-3.5 shrink-0 text-slate-500 xl:h-5 xl:w-5" />,
};

export const ServicesSlide: React.FC<ServicesSlideProps> = ({ metrics, services }) => {
  return (
    <div className="flex w-full flex-col gap-2.5 xl:gap-4">
      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 xl:gap-4">
        <KpiCard compact number={metrics.totalToday} label="servicios hoy" variant="neutral" />
        <KpiCard compact number={metrics.urgentCount} label="urgentes" variant="urgent" />
        <KpiCard
          compact
          number={metrics.inProgressCount}
          label="atendiendo ahora"
          variant="scheduled"
        />
        <KpiCard
          compact
          number={metrics.unassignedCount}
          label="sin técnico"
          variant="unassigned"
        />
        <KpiCard
          compact
          number={metrics.pendingFollowupCount}
          label="por llamar"
          subLabel="(seguimiento)"
          variant="waiting"
        />
      </div>

      {/* Main Services Table */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[680px] table-fixed border-collapse text-left [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1.5 xl:[&_td]:px-3 xl:[&_td]:py-2 xl:[&_th]:px-3 xl:[&_th]:py-2">
            <colgroup>
              <col className="w-[7%]" />
              <col className="w-[12%]" />
              <col className="w-[7%]" />
              <col className="w-[12%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[13%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold xl:text-lg">
                <th>N°</th>
                <th>Prioridad</th>
                <th>Hora</th>
                <th>Técnico</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Máquina</th>
                <th className="text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs leading-tight text-slate-800 xl:text-lg">
              {services.map((item) => {
                const isUrgent = item.priority === 'urgente';
                const stateConfig = stateVariantMap[item.state] || {
                  label: item.state,
                  variant: 'neutral' as BadgeVariant,
                };

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-100 ${
                      isUrgent
                        ? 'border-l-4 border-l-red-600 bg-red-50/30'
                        : item.state === 'sin_tecnico'
                          ? 'border-l-4 border-l-purple-500'
                          : 'even:bg-slate-50'
                    }`}
                  >
                    <td className="font-mono font-bold text-slate-900">{item.orderNumber}</td>
                    <td className="font-bold">
                      {isUrgent ? (
                        <span className="text-red-600 font-extrabold">Urgente</span>
                      ) : (
                        <span className="text-slate-600">Programado</span>
                      )}
                    </td>
                    <td className="font-semibold text-slate-700">{item.time}</td>
                    <td className="font-bold text-slate-900">{item.technicianName}</td>
                    <td className="font-medium">
                      <span className="flex items-center">
                        {modalityIcons[item.modality]}
                        {item.clientName}
                      </span>
                    </td>
                    <td className="break-words text-slate-700">{item.serviceDescription}</td>
                    <td className="font-medium text-slate-700">{item.machineModel}</td>
                    <td className="text-center">
                      <Badge
                        variant={stateConfig.variant}
                        size="sm"
                        className="w-full justify-center !px-1 !py-0.5 !text-[11px] !leading-tight xl:!text-base"
                      >
                        {stateConfig.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Legend */}
        <div className="flex flex-col items-start justify-between gap-1 border-t border-slate-200 px-2 py-1.5 text-[11px] text-slate-500 sm:flex-row sm:items-center xl:px-3 xl:text-base">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="text-red-600 font-bold">Urgente = máquina parada</span>
            <span className="text-blue-600 font-semibold">Programado</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" /> Visita
              </span>
              <span className="flex items-center">
                <Monitor className="w-3.5 h-3.5 mr-1 text-slate-500" /> Remoto
              </span>
              <span className="flex items-center">
                <Wrench className="w-3.5 h-3.5 mr-1 text-slate-500" /> Taller
              </span>
            </div>
          </div>
          <span className="font-semibold text-slate-600 self-end sm:self-auto">Página 1/1</span>
        </div>
      </div>
    </div>
  );
};
