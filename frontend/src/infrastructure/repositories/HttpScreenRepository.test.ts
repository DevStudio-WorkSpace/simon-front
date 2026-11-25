import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScreenAllData, ScreenState } from '../../domain/models';
import { HttpScreenRepository } from './HttpScreenRepository';

function fakeResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

function makeState(overrides: Partial<ScreenState> = {}): ScreenState {
  return {
    currentSlide: 1,
    isPaused: false,
    totalSlides: 6,
    secondsPerSlide: 10,
    lastUpdated: '25 nov 2026 · 10:00',
    lastDataAt: '2026-11-25T15:00:00.000Z',
    connectionStatus: 'connected',
    ...overrides,
  };
}

describe('HttpScreenRepository', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('filtra servicios y mensajes no visibles', async () => {
    const responseBody = {
      services: {
        metrics: {
          totalToday: 2,
          urgentCount: 0,
          inProgressCount: 0,
          unassignedCount: 0,
          pendingFollowupCount: 0,
        },
        items: [
          { id: 'visible', closed: false, cancelled: false },
          { id: 'cerrado', closed: true, cancelled: false },
          { id: 'anulado', closed: false, cancelled: true },
        ],
      },
      announcements: [
        { id: 'activo', active: true },
        { id: 'inactivo', active: false },
      ],
      tickerItems: [
        { id: 'tick-1', active: true },
        { id: 'tick-2', active: false },
      ],
    } as unknown as ScreenAllData;
    const fetchMock = vi.fn().mockResolvedValue(fakeResponse(responseBody));
    vi.stubGlobal('fetch', fetchMock);

    const repository = new HttpScreenRepository('https://api.test/api/');
    const data = await repository.getAllScreenData('TV-1');

    expect(data.services.items.map((item) => item.id)).toEqual(['visible']);
    expect(data.announcements.map((item) => item.id)).toEqual(['activo']);
    expect(data.tickerItems.map((item) => item.id)).toEqual(['tick-1']);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/api/pantallas/TV-1/datos',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('envía actualizaciones del administrador con PATCH', async () => {
    const fetchMock = vi.fn().mockResolvedValue(fakeResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const repository = new HttpScreenRepository('https://api.test/api');
    await repository.updateScreenData('TV-2', { goal: { progressPercentage: 75 } });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/api/pantallas/TV-2/datos',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ goal: { progressPercentage: 75 } }),
      }),
    );
  });

  it('reintenta con retroceso exponencial y se detiene al cancelar', async () => {
    vi.useFakeTimers();
    const state = makeState({ currentSlide: 3 });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(fakeResponse(null, false, 503))
      .mockResolvedValueOnce(fakeResponse(state));
    vi.stubGlobal('fetch', fetchMock);

    const repository = new HttpScreenRepository('https://api.test/api');
    const errors: Error[] = [];
    const states: ScreenState[] = [];
    const unsubscribe = repository.subscribeToScreenState(
      'TV-3',
      (nextState) => states.push(nextState),
      (error) => errors.push(error),
      {
        pollIntervalMs: 1000,
        initialRetryDelayMs: 100,
        maxRetryDelayMs: 400,
        backoffFactor: 2,
        maxRetries: 5,
      },
    );

    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('503');

    await vi.advanceTimersByTimeAsync(100);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(states).toEqual([state]);

    unsubscribe();
    await vi.advanceTimersByTimeAsync(1000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
