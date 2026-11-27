'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Trash2, X } from 'lucide-react';
import type { ServiceItem, ServicePriority, ServiceState } from '../../../domain/models';

const fields = [
  { name: 'priority', label: 'Prioridad', maxLength: 20 },
  { name: 'time', label: 'Hora', maxLength: 5 },
  { name: 'technicianName', label: 'Técnico', maxLength: 45 },
  { name: 'clientName', label: 'Cliente', maxLength: 45 },
  { name: 'serviceDescription', label: 'Servicio', maxLength: 120 },
  { name: 'machineModel', label: 'Máquina', maxLength: 45 },
  { name: 'state', label: 'Estado', maxLength: 30 },
] as const;

type FieldName = (typeof fields)[number]['name'];
type Draft = Record<FieldName, string>;

const priorities: Record<ServicePriority, string> = {
  urgente: 'Urgente',
  programado: 'Programado',
};
const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s_]+/g, ' ');

function matchOption<T extends string>(value: string, options: Record<T, string>): T | undefined {
  const candidate = normalize(value);
  return (Object.keys(options) as T[]).find(
    (key) => normalize(options[key]) === candidate || normalize(key) === candidate,
  );
}

interface ServiceEditorProps {
  service: ServiceItem;
  creating?: boolean;
  states: Record<ServiceState, { label: string }>;
  onCancel: () => void;
  onDelete?: () => void;
  onSave: (service: ServiceItem) => void;
}

export function ServiceEditor({
  service,
  creating = false,
  states,
  onCancel,
  onDelete,
  onSave,
}: ServiceEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const keepButtonRef = useRef<HTMLButtonElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingField, setEditingField] = useState<FieldName | null>(null);
  const [error, setError] = useState<{ field: FieldName; message: string } | null>(null);
  const [draft, setDraft] = useState<Draft>({
    priority: priorities[service.priority],
    time: service.time,
    technicianName: service.technicianName,
    clientName: service.clientName,
    serviceDescription: service.serviceDescription,
    machineModel: service.machineModel,
    state: states[service.state].label,
  });

  const inputs = useRef<Partial<Record<FieldName, HTMLInputElement>>>({});

  const startEditing = (input: HTMLInputElement) => {
    if (!input.readOnly) return;
    input.blur();
    // Activate the real input while the interaction with the remote is still in progress.
    flushSync(() => setEditingField(input.name as FieldName));
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  };

  const finishEditing = (input: HTMLInputElement) => {
    input.blur();
    flushSync(() => setEditingField(null));
    input.focus();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement;
    const owner = dialog.parentElement;
    const { scrollX, scrollY } = window;
    dialog.showModal();
    inputs.current.priority?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
      const current = document.activeElement;
      if (!current || !dialog.contains(current)) return;

      if (current instanceof HTMLInputElement && !current.readOnly) {
        if (event.key === 'Enter' && !event.isComposing && event.keyCode !== 229) {
          event.preventDefault();
          finishEditing(current);
        }
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (event.repeat) return;
        if (current instanceof HTMLInputElement) startEditing(current);
        else if (current instanceof HTMLButtonElement) current.click();
        return;
      }

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const controls = [...dialog.querySelectorAll<HTMLElement>('button, input')];
      const index = controls.indexOf(current as HTMLElement);
      const fieldset = dialog.querySelector('fieldset');
      const columns = fieldset
        ? getComputedStyle(fieldset).gridTemplateColumns.split(' ').length
        : 1;
      const step =
        event.key === 'ArrowLeft'
          ? -1
          : event.key === 'ArrowRight'
            ? 1
            : event.key === 'ArrowUp'
              ? -columns
              : columns;
      const next = Math.max(0, Math.min(controls.length - 1, index + step));
      controls[next]?.focus();
    };

    window.addEventListener('keydown', handleKey, true);
    return () => {
      window.removeEventListener('keydown', handleKey, true);
      dialog.close();
      if (opener instanceof HTMLElement && opener.isConnected)
        opener.focus({ preventScroll: true });
      else {
        const next =
          owner?.querySelector<HTMLButtonElement>('[data-service-row-editor]') ??
          owner?.querySelector<HTMLButtonElement>('[data-service-action]');
        next?.focus({ preventScroll: true });
      }
      window.scrollTo(scrollX, scrollY);
    };
  }, []);

  useEffect(() => {
    if (confirmDelete) keepButtonRef.current?.focus();
  }, [confirmDelete]);

  const focusStyle = 'outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400';
  const stateLabels = Object.fromEntries(
    (Object.keys(states) as ServiceState[]).map((state) => [state, states[state].label]),
  ) as Record<ServiceState, string>;
  const help: Partial<Record<FieldName, string>> = {
    priority: 'Urgente o Programado.',
    time: 'Formato de 24 horas, por ejemplo 09:30.',
    state: Object.values(stateLabels).join(' · '),
  };

  function reject(field: FieldName, message: string) {
    setError({ field, message });
    inputs.current[field]?.focus();
  }

  function save() {
    const state = matchOption(draft.state, stateLabels);
    const missing = fields.find(
      ({ name }) => !(name === 'technicianName' && state === 'sin_tecnico') && !draft[name].trim(),
    );
    if (missing) return reject(missing.name, `Completa el campo ${missing.label}.`);

    const time = draft.time.trim().padStart(5, '0');
    const priority = matchOption(draft.priority, priorities);
    if (!priority) return reject('priority', 'Escribe Urgente o Programado.');
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))
      return reject('time', 'Escribe una hora válida, por ejemplo 09:30.');
    if (!state) return reject('state', `Estado válido: ${help.state}.`);

    onSave({
      ...service,
      priority,
      time,
      technicianName: draft.technicianName.trim() || '—',
      clientName: draft.clientName.trim(),
      serviceDescription: draft.serviceDescription.trim(),
      machineModel: draft.machineModel.trim(),
      state,
      waitReason: state === service.state ? service.waitReason : undefined,
    });
  }

  return (
    <dialog
      ref={dialogRef}
      data-service-editor
      aria-labelledby="service-editor-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 text-slate-900 shadow-xl backdrop:bg-slate-950/50 xl:max-w-3xl xl:p-6"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const input = editingField && inputs.current[editingField];
          if (input) finishEditing(input);
          else if (!confirmDelete) save();
        }}
      >
        <header className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2 id="service-editor-title" className="text-xl font-extrabold xl:text-2xl">
              {confirmDelete
                ? 'Eliminar servicio'
                : creating
                  ? 'Nuevo servicio'
                  : 'Editar servicio'}{' '}
              {service.orderNumber}
            </h2>
            <p className="text-xs text-slate-600 xl:text-sm">
              {confirmDelete
                ? `Se quitará la fila de ${service.clientName} de esta demo.`
                : 'Usa las flechas para moverte y OK para editar el campo.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar edición"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 ${focusStyle}`}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        {confirmDelete ? (
          <div className="mt-5 flex gap-3">
            <button
              ref={keepButtonRef}
              type="button"
              onClick={() => {
                flushSync(() => setConfirmDelete(false));
                deleteButtonRef.current?.focus();
              }}
              className={`flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold ${focusStyle}`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDelete}
              className={`flex-1 rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white ${focusStyle}`}
            >
              Confirmar eliminación
            </button>
          </div>
        ) : (
          <>
            <fieldset
              aria-label="Datos del servicio"
              className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2"
            >
              {fields.map(({ name, label, maxLength }) => (
                <label key={name} className="block min-w-0 text-xs font-semibold xl:text-sm">
                  {label}
                  <input
                    ref={(input) => {
                      if (input) inputs.current[name] = input;
                      else delete inputs.current[name];
                    }}
                    type="text"
                    name={name}
                    value={draft[name]}
                    readOnly={editingField !== name}
                    maxLength={maxLength}
                    enterKeyHint="done"
                    onClick={(event) => startEditing(event.currentTarget)}
                    onBlur={() => setEditingField((active) => (active === name ? null : active))}
                    onChange={(event) => {
                      setDraft((current) => ({ ...current, [name]: event.target.value }));
                      if (error?.field === name) setError(null);
                    }}
                    aria-invalid={error?.field === name}
                    aria-describedby={
                      error?.field === name
                        ? 'service-edit-error'
                        : editingField === name && help[name]
                          ? 'service-edit-help'
                          : undefined
                    }
                    className={`mt-0.5 block w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm font-medium xl:py-2.5 xl:text-base ${focusStyle} ${editingField === name ? 'bg-white' : 'cursor-pointer bg-slate-50'}`}
                  />
                </label>
              ))}
              <dl className="min-w-0 text-xs font-semibold xl:text-sm">
                <dt>N.º de orden</dt>
                <dd className="mt-0.5 flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-sm xl:py-2.5 xl:text-base">
                  <span className="font-mono">{service.orderNumber}</span>
                  <span className="text-xs font-medium text-slate-600">
                    {creating ? 'Asignación automática' : 'Solo lectura'}
                  </span>
                </dd>
              </dl>
            </fieldset>

            {editingField && help[editingField] && (
              <p id="service-edit-help" className="mt-2 text-xs text-slate-600">
                {help[editingField]}
              </p>
            )}
            {error && (
              <p
                id="service-edit-error"
                role="alert"
                className="mt-2 text-xs font-semibold text-red-700"
              >
                {error.message}
              </p>
            )}
            <div className="mt-3 flex gap-3">
              {!creating && onDelete && (
                <button
                  ref={deleteButtonRef}
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-800 xl:text-base ${focusStyle}`}
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  Eliminar
                </button>
              )}
              <button
                type="submit"
                className={`flex-1 rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white xl:text-base ${focusStyle}`}
              >
                Guardar
              </button>
            </div>
          </>
        )}
      </form>
    </dialog>
  );
}
