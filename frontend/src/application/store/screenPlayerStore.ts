import { create } from 'zustand';
import { ScreenAllData, SlideViewConfig, DEFAULT_VIEWS_CONFIG } from '../../domain/models';
import { ScreenRepositoryFactory } from '../../infrastructure/repositories/ScreenRepositoryFactory';

const screenRepository = ScreenRepositoryFactory.getRepository();
const STORAGE_KEY = 'simon_views_config';

function loadStoredViewsConfig(): SlideViewConfig[] {
  if (typeof window === 'undefined') return DEFAULT_VIEWS_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VIEWS_CONFIG;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error reading simon_views_config from localStorage', e);
  }
  return DEFAULT_VIEWS_CONFIG;
}

function saveStoredViewsConfig(configs: SlideViewConfig[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
      window.dispatchEvent(new CustomEvent('simon_views_updated', { detail: configs }));
    } catch (e) {
      console.error('Error saving simon_views_config to localStorage', e);
    }
  }
}

interface RotationClock {
  elapsedMs: number;
  startedAt: number | null;
}

function getActiveViews(configs: SlideViewConfig[]) {
  return configs.filter((view) => view.active).sort((a, b) => a.order - b.order);
}

export function selectCurrentView({ viewsConfig, currentViewIndex }: ScreenPlayerState) {
  const active = getActiveViews(viewsConfig);
  return active[currentViewIndex] ?? active[0] ?? viewsConfig[0] ?? DEFAULT_VIEWS_CONFIG[0];
}

export function getRotationElapsed(clock: RotationClock, now: number) {
  return clock.elapsedMs + (clock.startedAt === null ? 0 : Math.max(0, now - clock.startedAt));
}

interface ScreenPlayerState {
  screenCode: string;
  data: ScreenAllData | null;
  currentSlide: number; // 1-based index among active views
  currentViewIndex: number; // 0-based index in activeViews
  viewsConfig: SlideViewConfig[];
  isPaused: boolean;
  isEditingServices: boolean;
  totalSlides: number;
  secondsPerSlide: number;
  progressPercent: number; // 0 to 100
  rotationClock: RotationClock;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: (code: string) => Promise<void>;
  nextSlide: () => void;
  prevSlide: () => void;
  togglePause: () => void;
  setPause: (paused: boolean) => void;
  setEditingServices: (editing: boolean) => void;
  goToSlide: (index: number) => void;
  goToViewId: (id: number) => void;
  tick: () => void;
  refreshData: () => Promise<void>;
  refreshDemoServices: () => Promise<void>;

  // Views & Duration Management
  reorderViews: (sourceId: number, targetId: number) => void;
  moveViewOrder: (id: number, direction: 'up' | 'down') => void;
  updateViewSeconds: (id: number, seconds: number) => void;
  toggleViewActive: (id: number) => void;
  setGlobalSeconds: (seconds: number) => void;
  resetToDefaultViews: () => void;
  getActiveViews: () => SlideViewConfig[];
  getCurrentView: () => SlideViewConfig;
}

export const useScreenPlayerStore = create<ScreenPlayerState>((set, get) => {
  const initialViews = loadStoredViewsConfig();
  const initialActive = getActiveViews(initialViews);

  function updatePlayback(patch: Partial<ScreenPlayerState>, restart = false) {
    const state = get();
    const next = { ...state, ...patch };
    const secondsPerSlide = selectCurrentView(next).seconds || 10;
    const running = !next.isLoading && !next.isPaused && !next.isEditingServices;
    const runningBefore = state.rotationClock.startedAt !== null;

    if (!restart && secondsPerSlide === state.secondsPerSlide && running === runningBefore) {
      set({ ...patch, secondsPerSlide });
      return;
    }

    const now = performance.now();
    const progress = restart
      ? 0
      : Math.min(1, getRotationElapsed(state.rotationClock, now) / (state.secondsPerSlide * 1000));

    set({
      ...patch,
      secondsPerSlide,
      progressPercent: progress * 100,
      rotationClock: {
        elapsedMs: progress * secondsPerSlide * 1000,
        startedAt: running ? now : null,
      },
    });
  }

  return {
    screenCode: 'TV-SALA-01',
    data: null,
    currentSlide: 1,
    currentViewIndex: 0,
    viewsConfig: initialViews,
    isPaused: false,
    isEditingServices: false,
    totalSlides: initialActive.length || 6,
    secondsPerSlide: initialActive[0]?.seconds || 10,
    progressPercent: 0,
    rotationClock: { elapsedMs: 0, startedAt: null },
    isLoading: true,
    error: null,

    getActiveViews: () => getActiveViews(get().viewsConfig),

    getCurrentView: () => selectCurrentView(get()),

    initialize: async (code: string) => {
      try {
        updatePlayback({ isLoading: true, screenCode: code });
        const initialData = await screenRepository.getAllScreenData(code);
        const storedViews = loadStoredViewsConfig();
        const active = getActiveViews(storedViews);

        updatePlayback(
          {
            data: initialData,
            viewsConfig: storedViews,
            totalSlides: active.length || 6,
            currentSlide: 1,
            currentViewIndex: 0,
            isPaused: initialData.screenState.isPaused,
            isLoading: false,
            error: null,
          },
          true,
        );

        // Setup sync across tabs and local events if in browser
        if (typeof window !== 'undefined') {
          const syncHandler = (_e: StorageEvent | CustomEvent) => {
            const updatedViews = loadStoredViewsConfig();
            const activeNow = getActiveViews(updatedViews);
            const { currentViewIndex } = get();
            const safeIndex = currentViewIndex >= activeNow.length ? 0 : currentViewIndex;

            updatePlayback({
              viewsConfig: updatedViews,
              totalSlides: activeNow.length || 1,
              currentViewIndex: safeIndex,
              currentSlide: safeIndex + 1,
            });
          };

          window.addEventListener('storage', syncHandler as EventListener);
          window.addEventListener('simon_views_updated', syncHandler as EventListener);
        }
      } catch (err: unknown) {
        set({
          isLoading: false,
          error: err instanceof Error ? err.message : 'Error cargando datos de pantalla',
        });
      }
    },

    nextSlide: () => {
      const active = get().getActiveViews();
      if (active.length === 0) return;
      const { currentViewIndex, screenCode } = get();
      const nextIndex = (currentViewIndex + 1) % active.length;
      updatePlayback({ currentViewIndex: nextIndex, currentSlide: nextIndex + 1 }, true);
      screenRepository.sendOrder(screenCode, 'siguiente');
    },

    prevSlide: () => {
      const active = get().getActiveViews();
      if (active.length === 0) return;
      const { currentViewIndex, screenCode } = get();
      const prevIndex = currentViewIndex <= 0 ? active.length - 1 : currentViewIndex - 1;
      updatePlayback({ currentViewIndex: prevIndex, currentSlide: prevIndex + 1 }, true);
      screenRepository.sendOrder(screenCode, 'anterior');
    },

    togglePause: () => {
      get().setPause(!get().isPaused);
    },

    setPause: (paused: boolean) => {
      const { screenCode } = get();
      updatePlayback({ isPaused: paused });
      screenRepository.sendOrder(screenCode, paused ? 'pausa' : 'play');
    },

    setEditingServices: (editing) => {
      if (editing !== get().isEditingServices) updatePlayback({ isEditingServices: editing });
    },

    goToSlide: (index: number) => {
      const active = get().getActiveViews();
      if (active.length === 0) return;
      const { screenCode } = get();
      const targetIndex = Math.max(0, Math.min(index - 1, active.length - 1));
      updatePlayback({ currentViewIndex: targetIndex, currentSlide: targetIndex + 1 }, true);
      screenRepository.sendOrder(screenCode, 'ir_a', targetIndex + 1);
    },

    goToViewId: (id: number) => {
      const active = get().getActiveViews();
      const index = active.findIndex((v) => v.id === id);
      if (index !== -1) {
        get().goToSlide(index + 1);
      }
    },

    tick: () => {
      const { rotationClock, secondsPerSlide, progressPercent } = get();
      if (rotationClock.startedAt === null) return;

      const elapsed = getRotationElapsed(rotationClock, performance.now());
      const nextPercent = (elapsed / (secondsPerSlide * 1000)) * 100;
      if (nextPercent >= 100) {
        get().nextSlide();
      } else if (nextPercent !== progressPercent) {
        set({ progressPercent: nextPercent });
      }
    },

    refreshDemoServices: async () => {
      const { screenCode, data } = get();
      if (!data || process.env.NEXT_PUBLIC_DATA_SOURCE === 'api') return;
      const services = await screenRepository.getServices(screenCode);
      const current = get();
      if (!current.data || current.screenCode !== screenCode) return;
      if (JSON.stringify(current.data.services) === JSON.stringify(services)) return;
      set({ data: { ...current.data, services } });
    },

    refreshData: async () => {
      const { screenCode } = get();
      try {
        const refreshed = await screenRepository.getAllScreenData(screenCode);
        set({ data: refreshed });
      } catch (err: unknown) {
        console.error('Error refreshing data:', err);
      }
    },

    reorderViews: (sourceId: number, targetId: number) => {
      if (sourceId === targetId) return;
      const { viewsConfig } = get();
      const sorted = [...viewsConfig].sort((a, b) => a.order - b.order);
      const sourceIndex = sorted.findIndex((v) => v.id === sourceId);
      const targetIndex = sorted.findIndex((v) => v.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return;

      const [movedItem] = sorted.splice(sourceIndex, 1);
      sorted.splice(targetIndex, 0, movedItem);

      // Re-assign clean sequential order: 1, 2, 3...
      const reordered = sorted.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));

      saveStoredViewsConfig(reordered);
      const active = getActiveViews(reordered);
      updatePlayback({
        viewsConfig: reordered,
        totalSlides: active.length || 1,
      });
    },

    moveViewOrder: (id: number, direction: 'up' | 'down') => {
      const { viewsConfig } = get();
      const sorted = [...viewsConfig].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((v) => v.id === id);

      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === sorted.length - 1) return;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = sorted[index];
      sorted[index] = sorted[targetIndex];
      sorted[targetIndex] = temp;

      // Re-assign clean sequential order: 1, 2, 3...
      const reordered = sorted.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));

      saveStoredViewsConfig(reordered);
      const active = getActiveViews(reordered);
      updatePlayback({
        viewsConfig: reordered,
        totalSlides: active.length || 1,
      });
    },

    updateViewSeconds: (id: number, seconds: number) => {
      const parsed = Number(seconds);
      const safe = isNaN(parsed) ? 3 : Math.max(0, Math.min(300, Math.round(parsed)));
      const { viewsConfig } = get();
      const updated = viewsConfig.map((v) => (v.id === id ? { ...v, seconds: safe } : v));

      saveStoredViewsConfig(updated);
      updatePlayback({ viewsConfig: updated });
    },

    toggleViewActive: (id: number) => {
      const { viewsConfig } = get();
      const target = viewsConfig.find((v) => v.id === id);
      if (!target) return;

      // Ensure at least one view remains active
      const currentlyActive = viewsConfig.filter((v) => v.active);
      if (target.active && currentlyActive.length <= 1) {
        return; // Don't allow disabling the only active view
      }

      const updated = viewsConfig.map((v) => (v.id === id ? { ...v, active: !v.active } : v));

      saveStoredViewsConfig(updated);
      updatePlayback(
        {
          viewsConfig: updated,
          totalSlides: getActiveViews(updated).length || 1,
          currentViewIndex: 0,
          currentSlide: 1,
        },
        true,
      );
    },

    setGlobalSeconds: (seconds: number) => {
      const parsed = Number(seconds);
      const clamped = !parsed || parsed <= 3 ? 3 : Math.min(300, Math.round(parsed));
      const { viewsConfig } = get();
      const updated = viewsConfig.map((v) => ({ ...v, seconds: clamped }));

      saveStoredViewsConfig(updated);
      updatePlayback({ viewsConfig: updated });
    },

    resetToDefaultViews: () => {
      const defaults = DEFAULT_VIEWS_CONFIG.map((v) => ({ ...v }));
      saveStoredViewsConfig(defaults);
      updatePlayback(
        {
          viewsConfig: defaults,
          totalSlides: getActiveViews(defaults).length,
          currentSlide: 1,
          currentViewIndex: 0,
        },
        true,
      );
    },
  };
});
