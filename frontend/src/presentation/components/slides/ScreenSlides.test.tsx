import { useState } from 'react';
import type { ServiceItem } from '../../../domain/models';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRemoteControlKeyboard } from '../../../application/hooks/useRemoteControlKeyboard';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { mockAnnouncement } from '../../../infrastructure/mocks/announcements.mock';
import { mockServices, mockServicesMetrics } from '../../../infrastructure/mocks/services.mock';
import { AnnouncementSlide } from './AnnouncementSlide';
import { ServicesSlide } from './ServicesSlide';
import { ServiceEditor } from './ServiceEditor';

function stubDialog() {
  const prototype = HTMLDialogElement.prototype;
  const showModal = Object.getOwnPropertyDescriptor(prototype, 'showModal');
  const close = Object.getOwnPropertyDescriptor(prototype, 'close');
  Object.defineProperty(prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
    },
  });
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  return () => {
    if (showModal) Object.defineProperty(prototype, 'showModal', showModal);
    else Reflect.deleteProperty(prototype, 'showModal');
    if (close) Object.defineProperty(prototype, 'close', close);
    else Reflect.deleteProperty(prototype, 'close');
    scroll.mockRestore();
  };
}

describe('Vistas de TV', () => {
  const initialState = useScreenPlayerStore.getInitialState();

  afterEach(() => {
    useScreenPlayerStore.setState(initialState);
  });

  it('pagina los servicios de nueve en nueve y deja el terminado al final', () => {
    const extra = {
      ...mockServices[2],
      id: 'test-service',
      orderNumber: '#9999',
      time: '08:00',
    };
    const services = [extra, ...mockServices];
    render(<ServicesSlide metrics={mockServicesMetrics} services={services} />);

    const table = within(screen.getByRole('table'));
    expect(table.getAllByRole('row')).toHaveLength(10);
    expect(table.getAllByRole('row')[1]).toHaveTextContent('#0151');
    expect(screen.getByText('Página 1/2')).toBeInTheDocument();
    expect(table.queryByText('Terminado')).not.toBeInTheDocument();

    act(() => useScreenPlayerStore.setState({ progressPercent: 50 }));

    expect(screen.getByText('Página 2/2')).toBeInTheDocument();
    expect(table.getAllByRole('row')).toHaveLength(2);
    expect(table.getByText('Terminado')).toBeInTheDocument();
  });

  it('recorre las filas con abajo y arriba sin cambiar de vista al editar', () => {
    const initial = useScreenPlayerStore.getState();
    const nextSlide = vi.fn();
    const now = vi.spyOn(performance, 'now').mockReturnValue(3000);
    useScreenPlayerStore.setState({
      nextSlide,
      isLoading: false,
      isPaused: false,
      secondsPerSlide: 10,
      progressPercent: 30,
      rotationClock: { elapsedMs: 0, startedAt: 0 },
    });

    function Demo() {
      useRemoteControlKeyboard();
      return (
        <ServicesSlide
          metrics={mockServicesMetrics}
          services={mockServices}
          onEditService={vi.fn()}
        />
      );
    }

    const { unmount } = render(<Demo />);
    try {
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      expect(screen.getByRole('button', { name: 'Añadir servicio' })).toHaveFocus();
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      expect(screen.getByRole('button', { name: 'Editar servicio #0151' })).toHaveFocus();
      expect(useScreenPlayerStore.getState().isEditingServices).toBe(true);
      useScreenPlayerStore.getState().tick();
      expect(useScreenPlayerStore.getState().progressPercent).toBe(30);
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      expect(screen.getByRole('button', { name: 'Editar servicio #0152' })).toHaveFocus();
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(nextSlide).not.toHaveBeenCalled();

      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      expect(useScreenPlayerStore.getState().isEditingServices).toBe(false);
      const playbackFocus = document.activeElement;
      expect(fireEvent.keyDown(window, { key: 'ArrowUp' })).toBe(false);
      expect(fireEvent.keyDown(window, { key: 'ArrowUp', repeat: true })).toBe(false);
      expect(document.activeElement).toBe(playbackFocus);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(nextSlide).toHaveBeenCalledOnce();
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      expect(screen.getByRole('button', { name: 'Añadir servicio' })).toHaveFocus();
    } finally {
      unmount();
      useScreenPlayerStore.setState(initial);
      now.mockRestore();
    }
  });

  it('termina la edición del campo con Listo y guarda solo al confirmar el formulario', () => {
    const restoreDialog = stubDialog();
    const onSave = vi.fn();
    const { unmount } = render(
      <ServiceEditor
        service={mockServices[0]}
        onSave={onSave}
        onCancel={vi.fn()}
        states={{
          atendiendo: { label: 'Atendiendo' },
          programado: { label: 'Programado' },
          espera_repuesto: { label: 'Espera repuesto' },
          sin_tecnico: { label: 'Sin técnico' },
          terminado: { label: 'Terminado' },
        }}
      />,
    );
    try {
      expect(screen.getAllByRole('textbox')).toHaveLength(6);
      const editor = within(screen.getByRole('dialog'));
      const heading = editor.getByRole('heading', { name: 'Editar servicio #0151' });
      expect(within(heading).getByText('#0151')).toBeVisible();
      expect(editor.getAllByText('#0151')).toHaveLength(1);
      const priority = editor.getByRole('combobox', { name: 'Prioridad' });
      expect(priority).toHaveFocus();
      expect(priority).toHaveValue('urgente');
      expect(
        within(priority)
          .getAllByRole('option')
          .map((option) => option.textContent),
      ).toEqual(['Urgente', 'Programado']);
      fireEvent.change(priority, { target: { value: 'programado' } });
      const modality = editor.getByRole('combobox', { name: 'Tipo de cliente' });
      expect(modality).toHaveValue('visita');
      expect(
        within(modality)
          .getAllByRole('option')
          .map((option) => option.textContent),
      ).toEqual(['Visita', 'Remoto', 'Taller']);
      const client = editor.getByRole('textbox', { name: 'Cliente' }) as HTMLInputElement;
      expect(modality.closest('label')?.nextElementSibling).toBe(client.closest('label'));
      expect(editor.queryByText('N.º de orden')).not.toBeInTheDocument();
      client.focus();
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(modality).toHaveFocus();
      const showPicker = vi.fn();
      Object.defineProperty(modality, 'showPicker', { value: showPicker });
      fireEvent.keyDown(window, { key: 'Enter' });
      expect(showPicker).toHaveBeenCalledOnce();
      fireEvent.change(modality, { target: { value: 'remoto' } });
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(client).toHaveFocus();
      expect(client).toHaveAttribute('readonly');
      fireEvent.click(client);
      fireEvent.change(client, { target: { value: 'Cliente demo' } });
      fireEvent.submit(client.form!);
      expect(client).toHaveAttribute('readonly');
      expect(client).toHaveValue('Cliente demo');
      expect(onSave).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
      expect(onSave).toHaveBeenCalledWith({
        ...mockServices[0],
        clientName: 'Cliente demo',
        priority: 'programado',
        modality: 'remoto',
        waitReason: undefined,
      });
    } finally {
      unmount();
      restoreDialog();
    }
  });

  it('crea números consecutivos y lleva el foco a la fila nueva aunque cambie de página', () => {
    const restoreDialog = stubDialog();
    const existing = useScreenPlayerStore.getState();

    function CreateDemo() {
      const [edits, setEdits] = useState<Record<string, ServiceItem>>({});
      const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(new Set());
      return (
        <ServicesSlide
          metrics={mockServicesMetrics}
          services={mockServices}
          serviceEdits={edits}
          deletedServiceIds={deletedIds}
          onDeleteService={(id) => setDeletedIds((ids) => new Set(ids).add(id))}
          onEditService={(service) =>
            setEdits((current) => ({ ...current, [service.id]: service }))
          }
        />
      );
    }

    const { unmount } = render(<CreateDemo />);
    const add = screen.getByRole('button', { name: 'Añadir servicio' });
    try {
      add.focus();
      fireEvent.keyDown(window, { key: 'Enter' });
      expect(screen.getByRole('heading', { name: 'Nuevo servicio #0158' })).toBeInTheDocument();
      const createEditor = within(screen.getByRole('dialog'));
      expect(createEditor.getByText('#0158', { exact: true })).toBeVisible();
      expect(createEditor.getByText('Asignación automática')).toBeVisible();
      expect(createEditor.getAllByRole('textbox')).toHaveLength(6);
      expect(createEditor.getByRole('combobox', { name: 'Prioridad' })).toHaveValue('programado');
      const modality = createEditor.getByRole('combobox', { name: 'Tipo de cliente' });
      expect(modality).toHaveValue('visita');
      fireEvent.change(modality, { target: { value: 'taller' } });
      for (const [name, value] of Object.entries({
        Hora: '17:30',
        Técnico: 'Técnico demo',
        Cliente: 'Cliente demo',
        Servicio: 'Revisión demo',
        Máquina: 'DTF',
        Estado: 'Terminado',
      })) {
        const input = screen.getByRole('textbox', { name }) as HTMLInputElement;
        fireEvent.click(input);
        fireEvent.change(input, { target: { value } });
        fireEvent.submit(input.form!);
      }
      fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

      expect(screen.getByText('Página 2/2')).toBeInTheDocument();
      expect(screen.getByText('Cliente demo')).toBeInTheDocument();
      const editNew = screen.getByRole('button', { name: 'Editar servicio #0158' });
      expect(editNew).toHaveFocus();
      expect(screen.getByText('servicios hoy').parentElement?.parentElement).toHaveTextContent(
        '10',
      );

      fireEvent.click(editNew);
      expect(screen.getByRole('combobox', { name: 'Tipo de cliente' })).toHaveValue('taller');
      fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
      expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(screen.getByRole('heading', { name: 'Editar servicio #0158' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar eliminación' }));
      expect(
        screen.queryByRole('button', { name: 'Editar servicio #0158' }),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Página 1/1')).toBeInTheDocument();
      expect(screen.getByText('servicios hoy').parentElement?.parentElement).toHaveTextContent('9');

      fireEvent.click(add);
      expect(screen.getByRole('heading', { name: 'Nuevo servicio #0159' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Cerrar edición' }));
      fireEvent.click(add);
      expect(screen.getByRole('heading', { name: 'Nuevo servicio #0159' })).toBeInTheDocument();
    } finally {
      unmount();
      restoreDialog();
      useScreenPlayerStore.setState(existing);
    }
  });

  it('alterna anuncios activos dentro del tiempo de la vista', () => {
    const other = { ...mockAnnouncement, id: 'other', title: 'Preparación del taller' };
    const announcements = [
      mockAnnouncement,
      { ...mockAnnouncement, id: 'inactive', title: 'Oculto', active: false },
      other,
    ];
    useScreenPlayerStore.setState({ progressPercent: 0, secondsPerSlide: 10 });
    render(<AnnouncementSlide announcements={announcements} />);

    expect(screen.getByRole('heading', { name: mockAnnouncement.title })).toBeInTheDocument();
    expect(screen.getByLabelText('Segundos para el siguiente anuncio')).toHaveTextContent('5');

    act(() => useScreenPlayerStore.setState({ progressPercent: 60 }));

    expect(screen.getByRole('heading', { name: other.title })).toBeInTheDocument();
    expect(screen.getByLabelText('Segundos para el siguiente anuncio')).toHaveTextContent('4');
  });
});
