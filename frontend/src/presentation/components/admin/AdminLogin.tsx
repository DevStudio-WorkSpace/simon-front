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
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0A0C10] text-slate-100 flex items-center justify-center p-4 sm:p-8 dot-grid-pattern selection:bg-[#E6007E] selection:text-white">
      {/* Floating Animated Bokeh Orbs (GO Service LATAM Brand Colors) */}
      <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full bg-gradient-to-tr from-[#E6007E]/25 to-amber-500/20 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/25 to-[#E6007E]/20 blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-2/3 left-1/3 w-56 h-56 rounded-full bg-amber-400/15 blur-2xl pointer-events-none animate-float-slow" />

      {/* Top Bar with Screen Link & Theme Toggle */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-30 flex items-center gap-3">
        <Link
          href="/pantalla/TV-SALA-01"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs sm:text-sm font-bold text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-md"
        >
          <Tv className="w-4 h-4 text-[#E6007E]" />
          <span>Ver TV</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
          title="Alternar tema"
          aria-label="Alternar tema"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main 2-Column Responsive Card Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Left Column: Brand, Mascot & Features */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* Logo / Brand Avatar */}
          <div className="flex flex-col items-center lg:items-start space-y-3">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#E6007E] via-[#D81B60] to-slate-900 p-1 shadow-2xl shadow-[#E6007E]/30 flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-[22px] bg-[#141824] flex items-center justify-center overflow-hidden p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-goservice.png"
                    alt="GO Service LATAM"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full drop-shadow-md"
                  />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0A0C10] shadow-sm" />
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white">
                SIMON
              </h1>
              <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#E6007E] uppercase">
                Soporte Técnico & Monitoreo
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-[#E6007E] to-transparent hidden lg:block" />

          {/* Feature List (Matching reference image) */}
          <div className="space-y-3 max-w-md text-left w-full">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#141824]/80 border border-white/[0.08] hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">Gestión de soporte y servicios</p>
                <p className="text-xs text-slate-400">Control operativo de órdenes y técnicos</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#141824]/80 border border-white/[0.08] hover:border-[#E6007E]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E6007E]/15 border border-[#E6007E]/30 flex items-center justify-center text-[#FF2D95] shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">
                  Reportes y bitácora en tiempo real
                </p>
                <p className="text-xs text-slate-400">
                  Seguimiento de tareas internas sin pérdida de contexto
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#141824]/80 border border-white/[0.08] hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">Acceso seguro por roles</p>
                <p className="text-xs text-slate-400">Coordinación de servicios y gerencia</p>
              </div>
            </div>
          </div>

          {/* Version Footer */}
          <div className="text-xs font-mono tracking-widest text-slate-500 pt-1">
            VERSIÓN 1.0 · GO SERVICE LATAM 2026
          </div>
        </div>

        {/* Right Column: High-Contrast Dark Card (Self-Contained Styling, NO glass-panel collision) */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="rounded-3xl p-6 sm:p-9 bg-[#13151D] border border-slate-700/80 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E6007E] via-pink-500 to-amber-500" />

            {/* Card Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Bienvenido a SIMON-ADMIN
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ingresá tus credenciales autorizadas para administrar la rotación, anuncios y
                bitácora.
              </p>
            </div>

            {/* Error banner if any */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@goservice.pe"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#090B10] border border-slate-700 focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/30 text-white placeholder-slate-500 text-sm font-medium transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Input with Interactive Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#090B10] border border-slate-700 focus:border-[#E6007E] focus:ring-2 focus:ring-[#E6007E]/30 text-white placeholder-slate-500 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 z-20 cursor-pointer transition-colors"
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security notice (matching reference image) */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                <Send className="w-4 h-4 text-[#E6007E] shrink-0 mt-0.5" />
                <span>
                  Acceso directo a la configuración de pantallas, mensajes de marquesina y
                  validación de actividades.
                </span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#C9006E] hover:from-[#FF2D95] hover:to-[#E6007E] text-white font-black text-sm tracking-wide shadow-lg shadow-[#E6007E]/30 hover:shadow-[#E6007E]/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
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

            {/* Demo Helper Button */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={handleFillDemo}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autocompletar demo</span>
              </button>

              <span className="text-[11px] text-slate-400 font-mono">coordinacion / simon2026</span>
            </div>

            {/* Support link */}
            <div className="text-center pt-2 text-xs text-slate-400">
              ¿Problemas para acceder? Contactá al{' '}
              <span className="text-[#E6007E] hover:underline cursor-pointer font-bold">
                administrador del sistema
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
