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

function resolveSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
  const initialTheme = getStoredTheme();
  const initialResolved = initialTheme === 'system' ? resolveSystemTheme() : initialTheme;

  return {
    theme: initialTheme,
    resolvedTheme: initialResolved,

    initTheme: () => {
      if (typeof window === 'undefined') return;
      const stored = getStoredTheme();
      const resolved = stored === 'system' ? resolveSystemTheme() : stored;

      applyHtmlClass(resolved);
      set({ theme: stored, resolvedTheme: resolved });

      // Listen for system theme changes if mode is 'system'
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        if (get().theme === 'system') {
          const newResolved = e.matches ? 'dark' : 'light';
          applyHtmlClass(newResolved);
          set({ resolvedTheme: newResolved });
        }
      };

      try {
        mediaQuery.addEventListener('change', listener);
      } catch (e) {
        mediaQuery.addListener(listener);
      }
    },

    setTheme: (newTheme: ThemeMode) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch (e) {
        console.error('Error saving theme to localStorage', e);
      }

      const resolved = newTheme === 'system' ? resolveSystemTheme() : newTheme;
      applyHtmlClass(resolved);
      set({ theme: newTheme, resolvedTheme: resolved });
    },

    toggleTheme: () => {
      const { resolvedTheme, setTheme } = get();
      const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    },
  };
});
