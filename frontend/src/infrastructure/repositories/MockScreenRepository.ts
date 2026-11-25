import {
  ActivityLogEntry,
  AnnouncementData,
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
import {
  mockActivities,
  mockAnnouncement,
  mockAnnouncements,
  mockGoal,
  mockPunctuality,
  mockRanking,
  mockServices,
  mockServicesMetrics,
  mockTickerItems,
} from '../mocks';
import { formatSimonDateTime } from '../../application/hooks/useCurrentDateTime';

const STORAGE_KEY = 'simon_mock_screen_data';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowLabel(): string {
  return formatSimonDateTime(new Date());
}

function nowIso(): string {
  return new Date().toISOString();
}

function activeAnnouncement(items: AnnouncementData[]): AnnouncementData {
  return items.find((item) => item.active) ?? items[0] ?? mockAnnouncement;
}

export class MockScreenRepository implements IScreenRepository {
  private readonly dataByScreen = new Map<string, ScreenAllData>();
  private readonly listenersByScreen = new Map<string, Set<ScreenStateListener>>();
  private readonly storageListener?: (event: StorageEvent) => void;

  constructor() {
    if (typeof window === 'undefined') return;

    this.storageListener = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const stored = JSON.parse(event.newValue) as Record<string, ScreenAllData>;
        for (const [screenCode, data] of Object.entries(stored)) {
          this.dataByScreen.set(screenCode, data);
          this.notify(screenCode);
        }
      } catch {
        // Un estado inválido en otra pestaña no debe romper la pantalla actual.
      }
    };

    window.addEventListener('storage', this.storageListener);
  }

  private createScreenData(): ScreenAllData {
    const timestamp = nowIso();

    return {
      screenState: {
        currentSlide: 1,
        isPaused: false,
        totalSlides: 6,
        secondsPerSlide: 10,
        lastUpdated: nowLabel(),
        lastDataAt: timestamp,
        connectionStatus: 'connected',
      },
      services: {
        metrics: clone(mockServicesMetrics),
        items: clone(mockServices),
      },
      punctuality: clone(mockPunctuality),
      ranking: clone(mockRanking),
      goal: clone(mockGoal),
      announcement: clone(mockAnnouncement),
      announcements: clone(mockAnnouncements),
      activities: clone(mockActivities),
      tickerItems: clone(mockTickerItems),
      lastDataAt: timestamp,
      syncStatus: {
        connection: 'connected',
        lastDataAt: timestamp,
        retryCount: 0,
      },
    };
  }

  private getData(screenCode: string): ScreenAllData {
    const existing = this.dataByScreen.get(screenCode);
    if (existing) return existing;

    const created = this.createScreenData();
    this.dataByScreen.set(screenCode, created);
    return created;
  }

  private sanitize(data: ScreenAllData): ScreenAllData {
    return {
      ...clone(data),
      services: {
        ...clone(data.services),
        items: data.services.items.filter((item) => !item.closed && !item.cancelled),
      },
      announcement: activeAnnouncement(data.announcements),
      announcements: data.announcements.filter((item) => item.active),
      tickerItems: data.tickerItems.filter((item) => item.active),
    };
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(this.dataByScreen)));
    } catch {
      // localStorage puede estar deshabilitado en modo kiosco; la memoria sigue funcionando.
    }
  }

  private notify(screenCode: string): void {
    const listeners = this.listenersByScreen.get(screenCode);
    if (!listeners) return;
    const state = this.sanitize(this.getData(screenCode)).screenState;
    listeners.forEach((listener) => listener(state));
  }

  async getAllScreenData(screenCode: string): Promise<ScreenAllData> {
    return this.sanitize(this.getData(screenCode));
  }

  async getScreenState(screenCode: string): Promise<ScreenState> {
    return this.sanitize(this.getData(screenCode)).screenState;
  }

  async getSyncStatus(screenCode: string): Promise<ScreenSyncStatus> {
    return clone(this.getData(screenCode).syncStatus);
  }

  async getServices(screenCode: string): Promise<ServicesData> {
    return this.sanitize(this.getData(screenCode)).services;
  }

  async getPunctuality(screenCode: string): Promise<PunctualityData> {
    return clone(this.getData(screenCode).punctuality);
  }

  async getRanking(screenCode: string): Promise<RankingData> {
    return clone(this.getData(screenCode).ranking);
  }

  async getGoal(screenCode: string): Promise<MonthlyGoalData> {
    return clone(this.getData(screenCode).goal);
  }

  async getAnnouncement(screenCode: string): Promise<AnnouncementData> {
    return activeAnnouncement(this.getData(screenCode).announcements);
  }

  async getAnnouncements(screenCode: string): Promise<AnnouncementData[]> {
    return this.getData(screenCode).announcements.filter((item) => item.active);
  }

  async getActivities(screenCode: string): Promise<InternalActivitiesData> {
    return clone(this.getData(screenCode).activities);
  }

  async getActivityLog(screenCode: string, activityId?: string): Promise<ActivityLogEntry[]> {
    const log = this.getData(screenCode).activities.activityLog;
    return activityId ? log.filter((entry) => entry.activityId === activityId) : clone(log);
  }

  async getTickerMessages(screenCode: string): Promise<ScreenTickerItem[]> {
    return this.getData(screenCode).tickerItems.filter((item) => item.active);
  }

  async sendOrder(
    screenCode: string,
    action: 'anterior' | 'siguiente' | 'pausa' | 'play' | 'ir_a',
    slideIndex?: number,
  ): Promise<ScreenState> {
    const data = this.getData(screenCode);
    const state = data.screenState;

    switch (action) {
      case 'anterior':
        state.currentSlide = state.currentSlide === 1 ? state.totalSlides : state.currentSlide - 1;
        break;
      case 'siguiente':
        state.currentSlide = state.currentSlide === state.totalSlides ? 1 : state.currentSlide + 1;
        break;
      case 'pausa':
        state.isPaused = true;
        break;
      case 'play':
        state.isPaused = false;
        break;
      case 'ir_a':
        if (slideIndex && slideIndex >= 1 && slideIndex <= state.totalSlides) {
          state.currentSlide = slideIndex;
        }
        break;
    }

    state.lastUpdated = nowLabel();
    data.syncStatus = { ...data.syncStatus, connection: 'connected', retryCount: 0 };
    this.persist();
    this.notify(screenCode);
    return clone(state);
  }

  subscribeToScreenState(
    screenCode: string,
    onState: ScreenStateListener,
    _onError?: ScreenConnectionErrorListener,
    _options?: RealtimeConnectionOptions,
  ): Unsubscribe {
    const listeners = this.listenersByScreen.get(screenCode) ?? new Set<ScreenStateListener>();
    listeners.add(onState);
    this.listenersByScreen.set(screenCode, listeners);

    queueMicrotask(() => {
      if (listeners.has(onState)) onState(this.sanitize(this.getData(screenCode)).screenState);
    });

    return () => {
      listeners.delete(onState);
      if (listeners.size === 0) this.listenersByScreen.delete(screenCode);
    };
  }

  async updateScreenData(screenCode: string, patch: ScreenDataUpdate): Promise<ScreenAllData> {
    const current = this.getData(screenCode);
    const timestamp = nowIso();

    const updated: ScreenAllData = {
      ...current,
      ...patch,
      screenState: {
        ...current.screenState,
        ...patch.screenState,
        lastDataAt: timestamp,
        lastUpdated: nowLabel(),
        connectionStatus: 'connected',
      },
      services: { ...current.services, ...patch.services },
      punctuality: { ...current.punctuality, ...patch.punctuality },
      ranking: { ...current.ranking, ...patch.ranking },
      goal: { ...current.goal, ...patch.goal },
      announcement: { ...current.announcement, ...patch.announcement },
      announcements: patch.announcements ?? current.announcements,
      activities: { ...current.activities, ...patch.activities },
      tickerItems: patch.tickerItems ?? current.tickerItems,
      lastDataAt: timestamp,
      syncStatus: {
        connection: 'connected',
        lastDataAt: timestamp,
        retryCount: 0,
      },
    };

    this.dataByScreen.set(screenCode, updated);
    this.persist();
    this.notify(screenCode);
    return this.sanitize(updated);
  }
}
