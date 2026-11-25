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

interface ScreenPlayerState {
  screenCode: string;
  data: ScreenAllData | null;
  currentSlide: number; // 1-based index among active views
  currentViewIndex: number; // 0-based index in activeViews
  viewsConfig: SlideViewConfig[];
  isPaused: boolean;
  totalSlides: number;
  secondsPerSlide: number;
  progressPercent: number; // 0 to 100
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: (code: string) => Promise<void>;
  nextSlide: () => void;
  prevSlide: () => void;
  togglePause: () => void;
  setPause: (paused: boolean) => void;
  goToSlide: (index: number) => void;
  goToViewId: (id: number) => void;
  tick: () => void;
  refreshData: () => Promise<void>;

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
  const getActive = (configs: SlideViewConfig[]) =>
    configs.filter((v) => v.active).sort((a, b) => a.order - b.order);

  const initialActive = getActive(initialViews);

  return {
    screenCode: 'TV-SALA-01',
    data: null,
    currentSlide: 1,
    currentViewIndex: 0,
    viewsConfig: initialViews,
    isPaused: false,
    totalSlides: initialActive.length || 6,
    secondsPerSlide: initialActive[0]?.seconds || 10,
    progressPercent: 0,
    isLoading: true,
    error: null,

    getActiveViews: () => {
      const { viewsConfig } = get();
      return viewsConfig.filter((v) => v.active).sort((a, b) => a.order - b.order);
    },

    getCurrentView: () => {
      const active = get().getActiveViews();
      const { currentViewIndex } = get();
      if (active.length === 0) {
        return get().viewsConfig[0] || DEFAULT_VIEWS_CONFIG[0];
      }
      return active[currentViewIndex] || active[0];
    },

    initialize: async (code: string) => {
      try {
        set({ isLoading: true, screenCode: code });
        const initialData = await screenRepository.getAllScreenData(code);
        const storedViews = loadStoredViewsConfig();
        const active = storedViews.filter((v) => v.active).sort((a, b) => a.order - b.order);

        set({
          data: initialData,
          viewsConfig: storedViews,
          totalSlides: active.length || 6,
          secondsPerSlide: active[0]?.seconds || 10,
          currentSlide: 1,
          currentViewIndex: 0,
          isPaused: initialData.screenState.isPaused,
          progressPercent: 0,
          isLoading: false,
          error: null,
        });

        // Setup sync across tabs and local events if in browser
        if (typeof window !== 'undefined') {
          const syncHandler = (_e: StorageEvent | CustomEvent) => {
            const updatedViews = loadStoredViewsConfig();
            const activeNow = updatedViews
              .filter((v) => v.active)
              .sort((a, b) => a.order - b.order);
            const { currentViewIndex } = get();
            const safeIndex = currentViewIndex >= activeNow.length ? 0 : currentViewIndex;

            set({
              viewsConfig: updatedViews,
              totalSlides: activeNow.length || 1,
              currentViewIndex: safeIndex,
              currentSlide: safeIndex + 1,
              secondsPerSlide: activeNow[safeIndex]?.seconds || 10,
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
      set({
        currentViewIndex: nextIndex,
        currentSlide: nextIndex + 1,
        secondsPerSlide: active[nextIndex]?.seconds || 10,
        progressPercent: 0,
      });
      screenRepository.sendOrder(screenCode, 'siguiente');
    },

    prevSlide: () => {
      const active = get().getActiveViews();
      if (active.length === 0) return;
      const { currentViewIndex, screenCode } = get();
      const prevIndex = currentViewIndex <= 0 ? active.length - 1 : currentViewIndex - 1;
      set({
        currentViewIndex: prevIndex,
        currentSlide: prevIndex + 1,
        secondsPerSlide: active[prevIndex]?.seconds || 10,
        progressPercent: 0,
      });
      screenRepository.sendOrder(screenCode, 'anterior');
    },

    togglePause: () => {
      const { isPaused, screenCode } = get();
      const newPause = !isPaused;
      set({ isPaused: newPause });
      screenRepository.sendOrder(screenCode, newPause ? 'pausa' : 'play');
    },

    setPause: (paused: boolean) => {
      const { screenCode } = get();
      set({ isPaused: paused });
      screenRepository.sendOrder(screenCode, paused ? 'pausa' : 'play');
    },

    goToSlide: (index: number) => {
      const active = get().getActiveViews();
      if (active.length === 0) return;
      const { screenCode } = get();
      const targetIndex = Math.max(0, Math.min(index - 1, active.length - 1));
      set({
        currentViewIndex: targetIndex,
        currentSlide: targetIndex + 1,
        secondsPerSlide: active[targetIndex]?.seconds || 10,
        progressPercent: 0,
      });
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
      const { isPaused, progressPercent } = get();
      if (isPaused) return;

      const currentView = get().getCurrentView();
      const seconds = currentView?.seconds || 10;

      // Tick every 100ms
      const step = 100 / (seconds * 10);
      const newPercent = progressPercent + step;

      if (newPercent >= 100) {
        get().nextSlide();
      } else {
        set({ progressPercent: newPercent });
      }
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
      const active = reordered.filter((v) => v.active).sort((a, b) => a.order - b.order);

      set({
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
      const active = reordered.filter((v) => v.active).sort((a, b) => a.order - b.order);

      set({
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
      set({ viewsConfig: updated });
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
      const active = updated.filter((v) => v.active).sort((a, b) => a.order - b.order);

      set({
        viewsConfig: updated,
        totalSlides: active.length || 1,
        currentViewIndex: 0,
        currentSlide: 1,
        progressPercent: 0,
      });
    },

    setGlobalSeconds: (seconds: number) => {
      const parsed = Number(seconds);
      const clamped = !parsed || parsed <= 3 ? 3 : Math.min(300, Math.round(parsed));
      const { viewsConfig } = get();
      const updated = viewsConfig.map((v) => ({ ...v, seconds: clamped }));

      saveStoredViewsConfig(updated);
      set({
        viewsConfig: updated,
        secondsPerSlide: clamped,
      });
    },

    resetToDefaultViews: () => {
      const defaults = DEFAULT_VIEWS_CONFIG.map((v) => ({ ...v }));
      saveStoredViewsConfig(defaults);
      const active = defaults.filter((v) => v.active).sort((a, b) => a.order - b.order);

      set({
        viewsConfig: defaults,
        totalSlides: active.length,
        secondsPerSlide: 10,
        currentSlide: 1,
        currentViewIndex: 0,
        progressPercent: 0,
      });
    },
  };
});
