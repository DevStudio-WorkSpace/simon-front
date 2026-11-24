import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const STORAGE_KEY = 'simon-theme';
const SCHEDULE_CHECK_MS = 60_000;

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch (e) {
    console.error('Error reading theme from localStorage', e);
  }
  return 'system';
}

function resolveScheduledTheme(date: Date = new Date()): 'light' | 'dark' {
  const hour = date.getHours();
  return hour >= 18 || hour < 6 ? 'dark' : 'light';
}

function applyHtmlClass(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeState>((set, get) => {
  let scheduleTimer: ReturnType<typeof setInterval> | null = null;

  const startScheduleWatcher = () => {
    if (scheduleTimer) return;
    scheduleTimer = setInterval(() => {
      if (get().theme !== 'system') return;
      const resolved = resolveScheduledTheme();
      if (get().resolvedTheme !== resolved) {
        applyHtmlClass(resolved);
        set({ resolvedTheme: resolved });
      }
    }, SCHEDULE_CHECK_MS);
  };

  const initialTheme = getStoredTheme();
  const initialResolved = initialTheme === 'system' ? resolveScheduledTheme() : initialTheme;

  return {
    theme: initialTheme,
    resolvedTheme: initialResolved,

    initTheme: () => {
      if (typeof window === 'undefined') return;
      const stored = getStoredTheme();
      const resolved = stored === 'system' ? resolveScheduledTheme() : stored;

      applyHtmlClass(resolved);
      set({ theme: stored, resolvedTheme: resolved });
      startScheduleWatcher();
    },

    setTheme: (newTheme: ThemeMode) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch (e) {
        console.error('Error saving theme to localStorage', e);
      }

      const resolved = newTheme === 'system' ? resolveScheduledTheme() : newTheme;
      applyHtmlClass(resolved);
      set({ theme: newTheme, resolvedTheme: resolved });
      startScheduleWatcher();
    },

    toggleTheme: () => {
      const { resolvedTheme, setTheme } = get();
      const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    },
  };
});
