'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { ServiceEditor } from './ServiceEditor';
import {
  ServiceItem,
  ServicesMetrics,
  ServiceModality,
  ServiceState,
} from '../../../domain/models';
import { KpiCard } from '../ui/KpiCard';
import { Badge, BadgeVariant } from '../ui/Badge';
import { MapPin, Monitor, Pencil, Plus, Wrench } from 'lucide-react';

interface ServicesSlideProps {
  metrics: ServicesMetrics;
  services: ServiceItem[];
  serviceEdits?: Partial<Record<string, ServiceItem>>;
  deletedServiceIds?: ReadonlySet<string>;
  onEditService?: (service: ServiceItem) => void;
  onDeleteService?: (id: string) => void;
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

const pageSize = 9;
const actionStyle =
  'inline-grid h-5 w-6 place-items-center rounded-md bg-blue-700 text-white outline-none transition-shadow hover:ring-2 hover:ring-inset hover:ring-yellow-300 focus:ring-2 focus:ring-inset focus:ring-yellow-300 xl:h-9 xl:w-9';

function newService(items: (ServiceItem | undefined)[]): ServiceItem {
  const highest = items.reduce((max, item) => {
    const number = Number(item?.orderNumber.match(/^#?(\d+)$/)?.[1]);
    return Number.isSafeInteger(number) ? Math.max(max, number) : max;
  }, 0);
  const number = highest + 1;
  return {
    id: `demo-service-${number}`,
    orderNumber: `#${String(number).padStart(4, '0')}`,
    priority: 'programado',
    time: '',
    technicianName: '',
    clientName: '',
    serviceDescription: '',
    machineModel: '',
    state: 'programado',
    modality: 'visita',
    closed: false,
    cancelled: false,
  };
}

export const ServicesSlide: React.FC<ServicesSlideProps> = ({
  metrics,
  services,
  serviceEdits,
  deletedServiceIds,
  onEditService,
  onDeleteService,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<{ service: ServiceItem; creating: boolean } | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const savedServiceId = useRef<string | null>(null);
  const editorHasFocus = useScreenPlayerStore((state) => state.isEditingServices);
  const editorEnabled = Boolean(onEditService);
  const { items, totalToday, urgentCount, inProgressCount, unassignedCount } = useMemo(() => {
    let totalToday = metrics.totalToday;
    let urgentCount = metrics.urgentCount;
    let inProgressCount = metrics.inProgressCount;
    let unassignedCount = metrics.unassignedCount;
    const items: ServiceItem[] = [];
    const baseIds = new Set(services.map((item) => item.id));
    for (const item of services) {
      const updated = deletedServiceIds?.has(item.id)
        ? undefined
        : (serviceEdits?.[item.id] ?? item);
      urgentCount += Number(updated?.priority === 'urgente') - Number(item.priority === 'urgente');
      inProgressCount +=
        Number(updated?.state === 'atendiendo') - Number(item.state === 'atendiendo');
      unassignedCount +=
        Number(updated?.state === 'sin_tecnico') - Number(item.state === 'sin_tecnico');
      if (updated) items.push(updated);
      else totalToday -= 1;
    }
    for (const item of Object.values(serviceEdits ?? {})) {
      if (!item || baseIds.has(item.id) || deletedServiceIds?.has(item.id)) continue;
      items.push(item);
      totalToday += 1;
      urgentCount += Number(item.priority === 'urgente');
      inProgressCount += Number(item.state === 'atendiendo');
      unassignedCount += Number(item.state === 'sin_tecnico');
    }
    return { items, totalToday, urgentCount, inProgressCount, unassignedCount };
  }, [metrics, services, serviceEdits, deletedServiceIds]);

  const ordered = useMemo(
    () =>
      [...items].sort((a, b) => {
        const group = (item: ServiceItem) =>
          item.state === 'terminado' ? 2 : item.priority === 'urgente' ? 0 : 1;
        return (
          group(a) - group(b) || a.time.padStart(5, '0').localeCompare(b.time.padStart(5, '0'))
        );
      }),
    [items],
  );
  const pages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const activePage = useScreenPlayerStore((state) =>
    Math.min(pages - 1, Math.floor((Math.max(0, state.progressPercent) / 100) * pages)),
  );
  const selectedIndex =
    editorHasFocus || savedServiceId.current
      ? ordered.findIndex((item) => item.id === selectedServiceId)
      : -1;
  const page = selectedIndex >= 0 ? Math.floor(selectedIndex / pageSize) : activePage;
  const rows = ordered.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    const id = savedServiceId.current;
    if (!id || editing) return;
    savedServiceId.current = null;
    const buttons = sectionRef.current?.querySelectorAll<HTMLButtonElement>(
      '[data-service-row-editor]',
    );
    const button = [...(buttons ?? [])].find((row) => row.dataset.serviceRowEditor === id);
    button?.focus();
  }, [editing, page]);
  useEffect(() => {
    if (!editorEnabled) return;

    const handleKey = (event: KeyboardEvent) => {
      const section = sectionRef.current;
      if (!section || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
        return;
      const target = document.activeElement;

      if (section.querySelector('dialog[open]')) return;
      const rows = [...section.querySelectorAll<HTMLButtonElement>('[data-service-action]')];
      const activeRow = rows.findIndex((button) => button === target);
      const isActivate = event.key === 'Enter' || event.key === ' ';
      if (activeRow >= 0) {
        if (event.key === 'Tab') return;
        event.preventDefault();
        if (isActivate && !event.repeat) rows[activeRow].click();
        if (event.key === 'ArrowDown') rows[activeRow + 1]?.focus();
        if (event.key === 'ArrowUp') {
          if (activeRow === 0) setSelectedServiceId(null);
          (rows[activeRow - 1] ?? section).focus();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
      } else if (event.key === 'ArrowDown' && rows.length) {
        event.preventDefault();
        rows[0].focus();
      }
    };

    window.addEventListener('keydown', handleKey, true);
    return () => {
      window.removeEventListener('keydown', handleKey, true);
      useScreenPlayerStore.getState().setEditingServices(false);
    };
  }, [editorEnabled]);

  const setEditorFocus = (target: EventTarget | null) => {
    const focused =
      target instanceof Element &&
      sectionRef.current?.contains(target) &&
      Boolean(target.closest('[data-service-editor]'));
    useScreenPlayerStore.getState().setEditingServices(Boolean(focused));
  };

  return (
    <div
      ref={sectionRef}
      tabIndex={-1}
      onFocusCapture={(event) => setEditorFocus(event.target)}
      onBlurCapture={(event) => setEditorFocus(event.relatedTarget)}
      className="flex w-full flex-col gap-2.5 outline-none xl:gap-4"
    >
      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 xl:gap-4">
        <KpiCard compact number={totalToday} label="servicios hoy" variant="neutral" />
        <KpiCard compact number={urgentCount} label="urgentes" variant="urgent" />
        <KpiCard compact number={inProgressCount} label="atendiendo ahora" variant="scheduled" />
        <KpiCard compact number={unassignedCount} label="sin técnico" variant="unassigned" />
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
              <col className="w-[14%]" />
              <col />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              {editorEnabled && <col className="w-11 xl:w-16" />}
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
                {editorEnabled && (
                  <th className="text-center">
                    <button
                      type="button"
                      data-service-editor
                      data-service-action
                      aria-label="Añadir servicio"
                      onClick={() =>
                        setEditing({
                          service: newService([...services, ...Object.values(serviceEdits ?? {})]),
                          creating: true,
                        })
                      }
                      className={actionStyle}
                    >
                      <Plus aria-hidden="true" className="h-4 w-4 xl:h-6 xl:w-6" />
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs leading-tight text-slate-800 xl:text-lg">
              {rows.map((item) => {
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
                    <td className="break-words font-mono font-bold text-slate-900">
                      {item.orderNumber}
                    </td>
                    <td className="font-bold">
                      {isUrgent ? (
                        <span className="text-red-600 font-extrabold">Urgente</span>
                      ) : (
                        <span className="text-slate-600">Programado</span>
                      )}
                    </td>
                    <td className="font-semibold text-slate-700">{item.time}</td>
                    <td className="break-words font-bold text-slate-900">{item.technicianName}</td>
                    <td className="font-medium">
                      <span className="flex items-center">
                        {modalityIcons[item.modality]}
                        <span className="min-w-0 break-words">{item.clientName}</span>
                      </span>
                    </td>
                    <td className="break-words text-slate-700">{item.serviceDescription}</td>
                    <td className="break-words font-medium text-slate-700">{item.machineModel}</td>
                    <td className="text-center">
                      <Badge
                        variant={stateConfig.variant}
                        size="sm"
                        className="w-full justify-center !border-0 !px-1 !py-0.5 !text-[11px] !leading-tight xl:!text-base"
                      >
                        {item.state === 'espera_repuesto'
                          ? item.waitReason || stateConfig.label
                          : stateConfig.label}
                      </Badge>
                    </td>
                    {editorEnabled && (
                      <td className="text-center">
                        <button
                          type="button"
                          data-service-editor
                          data-service-action
                          data-service-row-editor={item.id}
                          aria-label={`Editar servicio ${item.orderNumber}`}
                          onClick={() => setEditing({ service: item, creating: false })}
                          className={actionStyle}
                        >
                          <Pencil aria-hidden="true" className="h-3.5 w-3.5 xl:h-5 xl:w-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={editorEnabled ? 9 : 8} className="text-center text-slate-600">
                    No hay servicios para mostrar.
                  </td>
                </tr>
              )}
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
          <span className="font-semibold text-slate-600 self-end sm:self-auto">
            Página {page + 1}/{pages}
          </span>
        </div>
      </div>
      {editing && (
        <ServiceEditor
          service={editing.service}
          creating={editing.creating}
          states={stateVariantMap}
          onCancel={() => setEditing(null)}
          onDelete={
            !editing.creating && onDeleteService
              ? () => {
                  onDeleteService(editing.service.id);
                  setSelectedServiceId(null);
                  setEditing(null);
                }
              : undefined
          }
          onSave={(service) => {
            savedServiceId.current = service.id;
            setSelectedServiceId(service.id);
            onEditService?.(service);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
};
