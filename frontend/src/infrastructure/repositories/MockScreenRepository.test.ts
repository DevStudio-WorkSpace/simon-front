import { beforeEach, describe, expect, it } from 'vitest';
import { ScreenState, ServiceItem } from '../../domain/models';
import { MockScreenRepository } from './MockScreenRepository';
import { mockServices, mockServicesMetrics } from '../mocks/services.mock';

const loadServices = async () => ({ metrics: mockServicesMetrics, items: mockServices });

const flush = () => Promise.resolve();

describe('MockScreenRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('entrega el contrato completo y oculta servicios cerrados o anulados', async () => {
    const repository = new MockScreenRepository(loadServices);
    const data = await repository.getAllScreenData('TV-1');

    expect(data.lastDataAt).toEqual(expect.any(String));
    expect(data.syncStatus.connection).toBe('connected');
    expect(data.screenState.lastDataAt).toEqual(expect.any(String));
    expect(data.announcements.length).toBeGreaterThan(0);
    expect(data.tickerItems.every((item) => item.startsAt && item.endsAt)).toBe(true);
    expect(data.activities.activityLog.length).toBeGreaterThan(0);
    expect(data.services.items.length).toBe(9);

    const closed: ServiceItem = { ...data.services.items[0], id: 'cerrado', closed: true };
    const cancelled: ServiceItem = { ...data.services.items[0], id: 'anulado', cancelled: true };
    await repository.updateScreenData('TV-1', {
      services: { items: [...data.services.items, closed, cancelled] },
    });

    const updated = await repository.getServices('TV-1');
    expect(updated.items.map((item) => item.id)).not.toContain('cerrado');
    expect(updated.items.map((item) => item.id)).not.toContain('anulado');
  });

  it('recoge el nuevo dato de servicios y conserva la última versión si falla la lectura', async () => {
    let technician = 'Héctor';
    let readable = true;
    const repository = new MockScreenRepository(async () => {
      if (!readable) throw new Error('Archivo no disponible');
      return {
        metrics: mockServicesMetrics,
        items: [{ ...mockServices[0], technicianName: technician }, ...mockServices.slice(1)],
      };
    });
    const first = await repository.getAllScreenData('TV-1');
    expect(first.services.items[0].technicianName).toBe('Héctor');

    technician = 'Rodrigo';
    const second = await repository.getServices('TV-1');
    expect(second.items[0].technicianName).toBe('Rodrigo');

    readable = false;
    const retained = await repository.getServices('TV-1');
    expect(retained.items[0].technicianName).toBe('Rodrigo');
  });

  it('notifica cada cambio de estado y deja de notificar al cancelar', async () => {
    const repository = new MockScreenRepository(loadServices);
    const received: ScreenState[] = [];
    const unsubscribe = repository.subscribeToScreenState('TV-2', (state) => {
      received.push(state);
    });

    await flush();
    expect(received).toHaveLength(1);
    expect(received[0].currentSlide).toBe(1);

    await repository.sendOrder('TV-2', 'siguiente');
    expect(received.at(-1)?.currentSlide).toBe(2);

    unsubscribe();
    await repository.sendOrder('TV-2', 'pausa');
    expect(received).toHaveLength(2);
    expect(received.at(-1)?.isPaused).toBe(false);
  });

  it('aplica actualizaciones del administrador sin recargar la pantalla', async () => {
    const repository = new MockScreenRepository(loadServices);
    const before = await repository.getAllScreenData('TV-3');
    const updated = await repository.updateScreenData('TV-3', {
      goal: { progressPercentage: 82 },
      announcement: { active: false, title: 'Anuncio retirado' },
      tickerItems: [],
    });

    expect(before.goal.progressPercentage).not.toBe(82);
    expect(updated.goal.progressPercentage).toBe(82);
    expect(updated.tickerItems).toHaveLength(0);
    expect(Date.parse(updated.lastDataAt)).not.toBeNaN();
    expect(updated.syncStatus.lastDataAt).toBe(updated.lastDataAt);
  });
});
