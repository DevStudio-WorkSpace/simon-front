'use client';

import React from 'react';
import { ServiceItem, ServicesMetrics, ServiceModality, ServiceState } from '../../../domain/models';
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
  visita: <MapPin className="w-4 h-4 text-slate-500 inline mr-1.5" />,
  remoto: <Monitor className="w-4 h-4 text-slate-500 inline mr-1.5" />,
  taller: <Wrench className="w-4 h-4 text-slate-500 inline mr-1.5" />,
};

export const ServicesSlide: React.FC<ServicesSlideProps> = ({ metrics, services }) => {
  return (
    <div className="flex flex-col justify-between h-full gap-4 py-2">
      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
        <KpiCard
          number={metrics.totalToday}
          label="servicios hoy"
          variant="neutral"
        />
        <KpiCard
          number={metrics.urgentCount}
          label="urgentes"
          variant="urgent"
        />
        <KpiCard
          number={metrics.inProgressCount}
          label="atendiendo ahora"
          variant="scheduled"
        />
        <KpiCard
          number={metrics.unassignedCount}
          label="sin técnico"
          variant="unassigned"
        />
        <KpiCard
          number={metrics.pendingFollowupCount}
          label="por llamar"
          subLabel="(seguimiento)"
          variant="waiting"
        />
      </div>

      {/* Main Services Table */}
      <div className="glass-panel neumorph-shadow rounded-2xl overflow-hidden flex-1 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[720px] lg:min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm md:text-base uppercase tracking-wider font-bold">
                <th className="py-3 px-4 pl-6">N°</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4">Hora</th>
                <th className="py-3 px-4">Técnico</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Servicio</th>
                <th className="py-3 px-4">Máquina</th>
                <th className="py-3 px-4 pr-6 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200 text-base md:text-lg">
              {services.map((item) => {
                const isUrgent = item.priority === 'urgente';
                const stateConfig = stateVariantMap[item.state] || {
                  label: item.state,
                  variant: 'neutral' as BadgeVariant,
                };

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                      isUrgent
                        ? 'border-l-4 border-l-red-600 bg-red-50/30 dark:bg-red-950/20'
                        : item.state === 'sin_tecnico'
                        ? 'border-l-4 border-l-purple-500'
                        : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 pl-6 font-mono font-bold text-slate-900 dark:text-white">
                      {item.orderNumber}
                    </td>
                    <td className="py-2.5 px-4 font-bold">
                      {isUrgent ? (
                        <span className="text-red-600 dark:text-red-400 font-extrabold flex items-center gap-1">
                          Urgente
                        </span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400">
                          Programado
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.time}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                      {item.technicianName}
                    </td>
                    <td className="py-2.5 px-4 font-medium flex items-center">
                      {modalityIcons[item.modality]}
                      {item.clientName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {item.serviceDescription}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {item.machineModel}
                    </td>
                    <td className="py-2.5 px-4 pr-6 text-right">
                      <Badge variant={stateConfig.variant} size="sm">
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
        <div className="py-2.5 px-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="text-red-600 dark:text-red-400 font-bold">
              Urgente = máquina parada
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Programado
            </span>
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
          <span className="font-semibold text-slate-600 dark:text-slate-300 self-end sm:self-auto">
            Página 1/1
          </span>
        </div>
      </div>
    </div>
  );
};

