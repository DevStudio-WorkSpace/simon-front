'use client';

import React, { useState } from 'react';
import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, MapPin, Monitor, Wrench } from 'lucide-react';
import { ServiceItem, ServicesMetrics, ServiceModality, ServiceState } from '../../../domain/models';
import { KpiCard } from '../ui/KpiCard';
import { Badge, BadgeVariant } from '../ui/Badge';

interface ServicesSlideProps {
  metrics: ServicesMetrics;
  services: ServiceItem[];
}

const stateVariantMap: Record<ServiceState, { label: string; variant: BadgeVariant }> = {
  atendiendo: { label: 'Atendiendo', variant: 'scheduled' },
  programado: { label: 'Programado', variant: 'scheduled' },
  espera_repuesto: { label: 'Espera repuesto', variant: 'waiting' },
  sin_tecnico: { label: 'Sin técnico', variant: 'unassigned' },
  terminado: { label: 'Terminado', variant: 'success' },
};

const modalityIcons: Record<ServiceModality, React.ReactNode> = {
  visita: <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-slate-500 inline mr-2 shrink-0" />,
  remoto: <Monitor className="w-5 h-5 lg:w-6 lg:h-6 text-slate-500 inline mr-2 shrink-0" />,
  taller: <Wrench className="w-5 h-5 lg:w-6 lg:h-6 text-slate-500 inline mr-2 shrink-0" />,
};

export const ServicesSlide: React.FC<ServicesSlideProps> = ({ metrics, services }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const pageCount = Math.max(1, Math.ceil(services.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleServices = services.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <div className="flex flex-col justify-between h-full gap-4 lg:gap-5 py-1">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        <KpiCard number={metrics.totalToday} label="servicios hoy" variant="neutral" />
        <KpiCard number={metrics.urgentCount} label="urgentes" variant="urgent" />
        <KpiCard number={metrics.inProgressCount} label="atendiendo ahora" variant="scheduled" />
        <KpiCard number={metrics.unassignedCount} label="sin técnico" variant="unassigned" />
        <KpiCard
          number={metrics.pendingFollowupCount}
          label="por llamar"
          subLabel="seguimiento"
          variant="waiting"
        />
      </div>

      <div className="glass-panel neumorph-shadow rounded-2xl overflow-hidden flex-1 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 min-h-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1280px] xl:min-w-full table-fixed text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 tv-caption font-extrabold uppercase tracking-wider">
                <th className="w-[7%] py-3 px-3 pl-5">N°</th>
                <th className="w-[12%] py-3 px-3">Prioridad</th>
                <th className="w-[9%] py-3 px-3">Hora</th>
                <th className="w-[11%] py-3 px-3">Técnico</th>
                <th className="w-[11%] py-3 px-3">Cliente</th>
                <th className="w-[19%] py-3 px-3">Servicio</th>
                <th className="w-[13%] py-3 px-3">Máquina</th>
                <th className="w-[18%] py-3 px-3 pr-5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200 tv-body">
              {visibleServices.map((item) => {
                const isUrgent = item.priority === 'urgente';
                const stateConfig = stateVariantMap[item.state] || {
                  label: item.state,
                  variant: 'neutral' as BadgeVariant,
                };

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30 ${
                      isUrgent
                        ? 'border-l-4 border-l-red-600 bg-red-50/30 dark:bg-red-950/20'
                        : item.state === 'sin_tecnico'
                        ? 'border-l-4 border-l-purple-600'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3 pl-5 font-mono font-bold text-slate-900 dark:text-white tv-tabular">
                      {item.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      {isUrgent ? (
                        <span className="semantic-text--urgent font-extrabold flex items-center gap-1.5">
                          <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 shrink-0" />
                          Urgente
                        </span>
                      ) : (
                        <span className="semantic-text--scheduled font-bold flex items-center gap-1.5">
                          <CalendarDays className="w-5 h-5 lg:w-6 lg:h-6 shrink-0" />
                          Programado
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 tv-tabular">
                      {item.time}
                    </td>
                    <td className="py-3 px-3">
                      <span className="block truncate font-bold text-slate-900 dark:text-white" title={item.technicianName}>
                        {item.technicianName}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center font-medium" title={`${item.clientName} · ${item.modality}`}>
                        {modalityIcons[item.modality]}
                        <span className="truncate">{item.clientName}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="block truncate text-slate-700 dark:text-slate-300" title={item.serviceDescription}>
                        {item.serviceDescription}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="block truncate font-medium text-slate-700 dark:text-slate-300" title={item.machineModel}>
                        {item.machineModel}
                      </span>
                    </td>
                    <td className="py-3 px-3 pr-5 text-right">
                      <Badge variant={stateConfig.variant} size="md">
                        {stateConfig.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="py-3 px-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 tv-caption text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <span className="semantic-text--urgent font-extrabold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" aria-hidden="true" />
              Urgente = máquina parada
            </span>
            <span className="semantic-text--scheduled font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" aria-hidden="true" />
              Programado
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><MapPin className="w-5 h-5" /> Visita</span>
              <span className="flex items-center gap-1.5"><Monitor className="w-5 h-5" /> Remoto</span>
              <span className="flex items-center gap-1.5"><Wrench className="w-5 h-5" /> Taller</span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-bold whitespace-nowrap self-end sm:self-auto tv-tabular">
            <button
              type="button"
              onClick={() => setPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="tv-focus p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              aria-label="Página anterior de servicios"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span>
              Página {currentPage + 1}/{pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
              disabled={currentPage >= pageCount - 1}
              className="tv-focus p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              aria-label="Página siguiente de servicios"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
