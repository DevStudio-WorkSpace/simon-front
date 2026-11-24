'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../application/store/authStore';
import { useThemeStore } from '../../../application/store/themeStore';
import {
  Tv,
  CalendarCheck,
  Activity,
  ShieldCheck,
  Send,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export const AdminLogin: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  const { resolvedTheme, toggleTheme, initTheme } = useThemeStore();

  React.useEffect(() => {
    initTheme();
  }, [initTheme]);

  const [email, setEmail] = useState('coordinacion@goservice.pe');
  const [password, setPassword] = useState('simon2026');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleFillDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    setEmail('coordinacion@goservice.pe');
    setPassword('simon2026');
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 pt-20 sm:p-8 sm:pt-24 dot-grid-pattern selection:bg-[#e6007e] selection:text-white transition-colors duration-300">
      <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full bg-gradient-to-tr from-[#e6007e]/10 to-amber-400/10 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-[#e6007e]/10 blur-3xl pointer-events-none animate-float-reverse" />

      <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-30 flex items-center gap-3">
        <Link
          href="/pantalla/TV-SALA-01"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md transition-all"
        >
          <Tv className="w-4 h-4 text-[#e6007e] dark:text-[#ff2d95]" />
          <span>Ver TV</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md transition-colors cursor-pointer"
          title="Alternar tema"
          aria-label="Alternar tema"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="flex flex-col items-center lg:items-start space-y-3">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#e6007e] via-[#D81B60] to-slate-800 p-1 shadow-xl shadow-[#e6007e]/20 flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-goservice.png"
                    alt="GO Service LATAM"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full"
                  />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B0F19] shadow-sm" />
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-slate-900 dark:text-white">
                SIMON
              </h1>
              <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#e6007e] dark:text-[#ff2d95] uppercase">
                Soporte Técnico & Monitoreo
              </p>
            </div>
          </div>

          <div className="w-24 h-0.5 bg-gradient-to-r from-[#e6007e] to-transparent hidden lg:block" />

          <div className="space-y-3 max-w-md text-left w-full">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
              <div className="w-10 h-10 rounded-xl semantic-surface--waiting border flex items-center justify-center semantic-text--waiting shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Gestión de soporte y servicios</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Control operativo de órdenes y técnicos</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-800 transition-colors">
              <div className="w-10 h-10 rounded-xl semantic-surface--brand border flex items-center justify-center semantic-text--brand shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Reportes y bitácora en tiempo real</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Seguimiento de tareas internas sin pérdida de contexto</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
              <div className="w-10 h-10 rounded-xl semantic-surface--scheduled border flex items-center justify-center semantic-text--scheduled shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Acceso seguro por roles</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Coordinación de servicios y gerencia</p>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono tracking-widest text-slate-500 dark:text-slate-400 pt-1">
            VERSIÓN 1.0 · GO SERVICE LATAM 2026
          </div>
        </div>

        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="rounded-2xl p-6 sm:p-9 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-[0_18px_50px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e6007e] via-pink-500 to-amber-500" />

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Bienvenido a SIMON-ADMIN
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Ingresá tus credenciales autorizadas para administrar la rotación, anuncios y bitácora.
              </p>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className="p-3 rounded-xl semantic-surface--urgent border text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 semantic-text--urgent shrink-0" />
                <span className="semantic-text--urgent">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@goservice.pe"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-[#e6007e] focus:ring-2 focus:ring-[#e6007e]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-[#e6007e] focus:ring-2 focus:ring-[#e6007e]/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-[#e6007e] dark:hover:text-[#ff2d95] hover:bg-pink-50 dark:hover:bg-slate-800 z-20 cursor-pointer transition-colors"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl semantic-surface--scheduled border flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-100">
                <Send className="w-4 h-4 semantic-text--scheduled shrink-0 mt-0.5" />
                <span>
                  Acceso directo a la configuración de pantallas, mensajes de marquesina y validación de actividades.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e6007e] to-[#C9006E] hover:from-[#ff2d95] hover:to-[#e6007e] text-white font-black text-sm tracking-wide shadow-lg shadow-[#e6007e]/20 hover:shadow-[#e6007e]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <span>Iniciar Sesión en el Administrador</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={handleFillDemo}
                className="flex items-center gap-1.5 text-[#B45309] dark:text-amber-300 hover:text-[#92400E] dark:hover:text-amber-200 font-bold cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autocompletar demo</span>
              </button>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                coordinacion / simon2026
              </span>
            </div>

            <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
              ¿Problemas para acceder? Contactá al{' '}
              <span className="text-slate-700 dark:text-slate-200 font-bold">
                administrador del sistema
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
