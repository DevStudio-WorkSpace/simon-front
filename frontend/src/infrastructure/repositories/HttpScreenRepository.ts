import {
  ActivityLogEntry,
  AnnouncementData,
  DEFAULT_REALTIME_OPTIONS,
  InternalActivitiesData,
  MonthlyGoalData,
  PunctualityData,
  RankingData,
  RealtimeConnectionOptions,
  ScreenAllData,
  ScreenDataUpdate,
  ScreenState,
  ScreenSyncStatus,
  ScreenTickerItem,
  ServicesData,
} from '../../domain/models';
import {
  IScreenRepository,
  ScreenConnectionErrorListener,
  ScreenStateListener,
  Unsubscribe,
} from '../../domain/repositories';

export class HttpScreenRepository implements IScreenRepository {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    const configured =
      baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    this.baseUrl = configured.replace(/\/$/, '');
  }

  private async fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      cache: 'no-store',
      ...init,
    });

    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} en ${path}`);
    }

    return res.json() as Promise<T>;
  }

  private visibleServices(data: ServicesData): ServicesData {
    return {
      ...data,
      items: data.items.filter((item) => !item.closed && !item.cancelled),
    };
  }

  async getAllScreenData(screenCode: string): Promise<ScreenAllData> {
    const data = await this.fetchJson<ScreenAllData>(`/pantallas/${screenCode}/datos`);

    return {
      ...data,
      services: this.visibleServices(data.services),
      announcements: data.announcements.filter((item) => item.active),
      tickerItems: data.tickerItems.filter((item) => item.active),
    };
  }

  async getScreenState(screenCode: string): Promise<ScreenState> {
    return this.fetchJson<ScreenState>(`/pantallas/${screenCode}/estado`);
  }

  async getSyncStatus(screenCode: string): Promise<ScreenSyncStatus> {
    return this.fetchJson<ScreenSyncStatus>(`/pantallas/${screenCode}/sincronizacion`);
  }

  async getServices(screenCode: string): Promise<ServicesData> {
    const services = await this.fetchJson<ServicesData>(
      `/pantallas/${screenCode}/vistas/servicios`,
    );
    return this.visibleServices(services);
  }

  async getPunctuality(screenCode: string): Promise<PunctualityData> {
    return this.fetchJson<PunctualityData>(`/pantallas/${screenCode}/vistas/puntualidad`);
  }

  async getRanking(screenCode: string): Promise<RankingData> {
    return this.fetchJson<RankingData>(`/pantallas/${screenCode}/vistas/ranking`);
  }

  async getGoal(screenCode: string): Promise<MonthlyGoalData> {
    return this.fetchJson<MonthlyGoalData>(`/pantallas/${screenCode}/vistas/meta`);
  }

  async getAnnouncement(screenCode: string): Promise<AnnouncementData> {
    const announcements = await this.getAnnouncements(screenCode);
    return announcements[0];
  }

  async getAnnouncements(screenCode: string): Promise<AnnouncementData[]> {
    const announcements = await this.fetchJson<AnnouncementData[]>(
      `/pantallas/${screenCode}/anuncios`,
    );
    return announcements.filter((item) => item.active);
  }

  async getActivities(screenCode: string): Promise<InternalActivitiesData> {
    return this.fetchJson<InternalActivitiesData>(`/pantallas/${screenCode}/vistas/actividades`);
  }

  async getActivityLog(screenCode: string, activityId?: string): Promise<ActivityLogEntry[]> {
    const path = activityId
      ? `/pantallas/${screenCode}/actividades/${activityId}/bitacora`
      : `/pantallas/${screenCode}/actividades/bitacora`;
    return this.fetchJson<ActivityLogEntry[]>(path);
  }

  async getTickerMessages(screenCode: string): Promise<ScreenTickerItem[]> {
    const items = await this.fetchJson<ScreenTickerItem[]>(`/pantallas/${screenCode}/marquesina`);
    return items.filter((item) => item.active);
  }

  async sendOrder(
    screenCode: string,
    action: 'anterior' | 'siguiente' | 'pausa' | 'play' | 'ir_a',
    slideIndex?: number,
  ): Promise<ScreenState> {
    return this.fetchJson<ScreenState>(`/pantallas/${screenCode}/ordenes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: action, vista: slideIndex }),
    });
  }

  subscribeToScreenState(
    screenCode: string,
    onState: ScreenStateListener,
    onError?: ScreenConnectionErrorListener,
    options: RealtimeConnectionOptions = DEFAULT_REALTIME_OPTIONS,
  ): Unsubscribe {
    let stopped = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      if (stopped) return;

      try {
        const state = await this.getScreenState(screenCode);
        if (stopped) return;
        attempt = 0;
        onState(state);
        if (!stopped) timer = setTimeout(poll, options.pollIntervalMs);
        return;
      } catch (error) {
        if (stopped) return;
        attempt += 1;
        const normalized =
          error instanceof Error ? error : new Error(`Error de conexión: ${String(error)}`);
        onError?.(normalized);

        if (options.maxRetries !== undefined && attempt >= options.maxRetries) return;

        // El retroceso exponencial evita saturar la API cuando la TV pierde red.
        const exponential = options.initialRetryDelayMs * options.backoffFactor ** (attempt - 1);
        const delay = Math.min(
          options.maxRetryDelayMs,
          Math.max(options.initialRetryDelayMs, exponential),
        );
        if (!stopped) timer = setTimeout(poll, delay);
      }
    };

    void poll();

    return () => {
      stopped = true;
      if (timer !== undefined) clearTimeout(timer);
    };
  }

  async updateScreenData(screenCode: string, patch: ScreenDataUpdate): Promise<ScreenAllData> {
    return this.fetchJson<ScreenAllData>(`/pantallas/${screenCode}/datos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  }
}
