import { create } from 'zustand';

interface User {
  email: string;
  name: string;
  role: 'coordinacion' | 'gerencia' | 'admin';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  checkAuth: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('simon-auth-session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        set({ isAuthenticated: true, user: parsed });
      } catch {
        localStorage.removeItem('simon-auth-session');
      }
    }
  },

  login: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });

    // Simulate network latency (400ms)
    await new Promise((r) => setTimeout(r, 400));

    // Basic validation for Sprint 1 mock login
    if (!email || !pass) {
      set({ isLoading: false, error: 'Por favor completá todos los campos' });
      return false;
    }

    if (pass.length < 4) {
      set({ isLoading: false, error: 'La contraseña debe tener al menos 4 caracteres' });
      return false;
    }

    const mockUser: User = {
      email,
      name: email.split('@')[0] || 'Coordinador',
      role: 'coordinacion',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('simon-auth-session', JSON.stringify(mockUser));
    }

    set({ isAuthenticated: true, user: mockUser, isLoading: false, error: null });
    return true;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simon-auth-session');
    }
    set({ isAuthenticated: false, user: null, error: null });
  },
}));

