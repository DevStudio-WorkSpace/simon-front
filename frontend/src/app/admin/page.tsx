'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useScreenPlayerStore } from '../../application/store/screenPlayerStore';
import { useThemeStore } from '../../application/store/themeStore';
import { useAuthStore } from '../../application/store/authStore';
import { AdminLogin } from '../../presentation/components/admin/AdminLogin';
import { 
  Tv, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  ListOrdered, 
  Megaphone, 
  Target, 
  ClipboardList, 
  Sun, 
  Moon,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  LogOut,
  Clock,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  GripVertical
} from 'lucide-react';

export default function AdminPage() {
  const { isAuthenticated, user, logout, checkAuth } = useAuthStore();

  const { 
    currentSlide, 
    totalSlides,
    isPaused, 
    secondsPerSlide, 
    nextSlide, 
    prevSlide, 
    togglePause, 
    goToSlide, 
    goToViewId,
    viewsConfig,
    reorderViews,
    moveViewOrder,
    updateViewSeconds,
    toggleViewActive,
    setGlobalSeconds,
    resetToDefaultViews,
    getActiveViews,
    getCurrentView,
    data 
  } = useScreenPlayerStore();

  const { resolvedTheme, toggleTheme, initTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'control' | 'anuncios' | 'meta' | 'actividades' | 'marquesina'>('control');
  const [globalTimeInput, setGlobalTimeInput] = useState<number>(10);
  const [draggedViewId, setDraggedViewId] = useState<number | null>(null);
  const [dragOverViewId, setDragOverViewId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const sortedViews = [...viewsConfig].sort((a, b) => a.order - b.order);
  const activeViews = getActiveViews();
  const currentView = getCurrentView();
  const totalCycleSeconds = activeViews.reduce((acc, curr) => acc + curr.seconds, 0);

  useEffect(() => {
    checkAuth();
    initTheme();
    setIsAuthChecked(true);
  }, [checkAuth, initTheme]);

  // Set initial global time input once on mount from stored views
  useEffect(() => {
    if (viewsConfig && viewsConfig.length > 0) {
      const active = viewsConfig.filter((v) => v.active).sort((a, b) => a.order - b.order);
      const initialSec = active[0]?.seconds || viewsConfig[0]?.seconds || 10;
      setGlobalTimeInput(Math.max(3, initialSec));
    }
  }, []);

  // Prevent flash while checking localStorage session
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0C10] text-slate-400">
        <div className="w-8 h-8 border-2 border-[#E6007E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, guard route and display animated login
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Simulated Bitácora for activity demo
  const sampleLogbook = [
    { time: '09:10', author: 'Billy', action: 'Inicio', note: 'Inicia "Completar maletín 2". Resultado esperado: inventario completo.' },
    { time: '10:20', author: 'Billy', action: 'Pausa por servicio', note: 'Surge servicio urgente #0152. Inventario terminado; faltan dos puntas. Próximo paso: reponer puntas.' },
    { time: '12:30', author: 'Billy', action: 'Retoma', note: 'Terminó atención técnica. Confirma disponibilidad y retoma maletín.' },
    { time: '13:00', author: 'Billy', action: 'Lista para revisión', note: 'Repone puntas, adjunta lista de verificación.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Floating Notification */}
        {notification && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span className="text-sm font-bold">{notification}</span>
          </div>
        )}

        {/* Admin Header */}
        <header className="glass-panel neumorph-shadow rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-goservice.png"
              alt="GO Service LATAM"
              className="w-12 h-12 rounded-full object-contain shadow-md"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                SIMON — Panel Administrador
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Gestión operativa, anuncios, actividades internas y control de sala TV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Info Badge */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-800 dark:text-slate-200 font-bold">{user.email}</span>
                <span className="text-slate-400 capitalize">({user.role})</span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cambiar tema"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              href="/pantalla/TV-SALA-01"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E6007E] hover:bg-[#C9006E] text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Tv className="w-4 h-4" />
              <span>Abrir TV en vivo</span>
            </Link>

            {/* Logout button */}
            <button
              type="button"
              onClick={() => logout()}
              className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
              title="Cerrar sesión de administrador"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('control')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'control'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Control de TV</span>
          </button>
          <button
            onClick={() => setActiveTab('actividades')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'actividades'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Actividades & Bitácora</span>
          </button>
          <button
            onClick={() => setActiveTab('anuncios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'anuncios'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Anuncio de hoy</span>
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'meta'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Meta comercial</span>
          </button>
          <button
            onClick={() => setActiveTab('marquesina')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'marquesina'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Marquesina</span>
          </button>
        </div>

        {/* Tab Content: Control de Pantalla */}
        {activeTab === 'control' && (
          <div className="space-y-6">
            {/* Top grid: TV Status & Remote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TV State card */}
              <div className="glass-panel neumorph-shadow rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#E6007E]" />
                  <span>Estado de Transmisión (TV-SALA-01)</span>
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                    <span className="text-xs text-slate-500 uppercase font-bold">Vista Actual</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {currentSlide} de {totalSlides}
                    </p>
                    <span className="text-xs text-slate-500 font-semibold block truncate">
                      {currentView?.title || 'Rotando'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                    <span className="text-xs text-slate-500 uppercase font-bold">Modo</span>
                    <p className={`text-2xl font-black mt-1 ${isPaused ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {isPaused ? 'Pausado' : 'Reproduciendo'}
                    </p>
                    <span className="text-xs text-slate-500 font-semibold block">
                      {activeViews.length} vistas activas
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-sm">Tiempo de vista en vivo:</span>
                  <span className="font-mono font-bold text-base text-[#E6007E]">
                    {currentView?.seconds || secondsPerSlide} segundos
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-sm">Desconexión / Reanudación:</span>
                  <span className="font-bold text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                    Auto-reanudación a los 10m
                  </span>
                </div>
              </div>

              {/* Direct Remote Controls */}
              <div className="glass-panel neumorph-shadow rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Comandos de Control Remoto
                </h2>

                <div className="flex items-center justify-center gap-4 py-4">
                  <button
                    onClick={prevSlide}
                    className="p-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold shadow transition-all active:scale-95"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>

                  <button
                    onClick={togglePause}
                    className={`p-6 rounded-full text-white font-bold shadow-xl transition-all active:scale-95 ${
                      isPaused ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#E6007E] hover:bg-[#C9006E]'
                    }`}
                    title={isPaused ? 'Reanudar' : 'Pausar'}
                  >
                    {isPaused ? <Play className="w-8 h-8 fill-current" /> : <Pause className="w-8 h-8 fill-current" />}
                  </button>

                  <button
                    onClick={nextSlide}
                    className="p-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold shadow transition-all active:scale-95"
                    title="Siguiente"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-2">
                    Saltar directamente a diapositiva activa:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeViews.map((v, idx) => (
                      <button
                        key={v.id}
                        onClick={() => goToSlide(idx + 1)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                          currentView?.id === v.id
                            ? 'bg-[#E6007E] text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="truncate">{idx + 1}. {v.title.split(' ')[0]}</span>
                        {currentView?.id === v.id && <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* View Order & Rotation Timing Manager */}
            <div className="glass-panel neumorph-shadow rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#E6007E]" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Gestión de Secuencia, Orden y Tiempos de Vistas
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Arrastrá las tarjetas para reordenar la secuencia fácilmente o activá/ocultá vistas de la rotación.
                  </p>
                </div>

                {/* Default Reset Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      resetToDefaultViews();
                      setGlobalTimeInput(10);
                      setNotification('Valores restaurados al estado inicial por defecto (Default)');
                      setTimeout(() => setNotification(null), 3500);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs shadow-sm transition-all active:scale-95 border border-slate-300 dark:border-slate-700"
                    title="Restablecer el orden y tiempos iniciales por defecto"
                  >
                    <RotateCcw className="w-4 h-4 text-[#E6007E]" />
                    <span>Restablecer por Defecto</span>
                  </button>
                </div>
              </div>

              {/* Global Duration Setter & Cycle Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#E6007E]" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Aplicar duración uniforme a todas las vistas
                    </span>
                    <span className="text-xs text-slate-500">
                      Ciclo total actual: {totalCycleSeconds}s (aprox. {(totalCycleSeconds / 60).toFixed(1)} min) en {activeViews.length} vistas activas
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={3}
                    max={300}
                    value={globalTimeInput === 0 ? '' : globalTimeInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        setGlobalTimeInput(0);
                      } else {
                        const val = parseInt(raw, 10);
                        setGlobalTimeInput(isNaN(val) ? 3 : val);
                      }
                    }}
                    onBlur={() => {
                      if (!globalTimeInput || globalTimeInput < 3) {
                        setGlobalTimeInput(3);
                      }
                    }}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-center"
                  />
                  <span className="text-xs font-semibold text-slate-500">segundos</span>
                  <button
                    onClick={() => {
                      const finalSecs = Math.max(3, globalTimeInput || 3);
                      setGlobalTimeInput(finalSecs);
                      setGlobalSeconds(finalSecs);
                      setNotification(`Se actualizaron todas las vistas a ${finalSecs} segundos`);
                      setTimeout(() => setNotification(null), 3500);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all active:scale-95"
                  >
                    Aplicar a todas
                  </button>
                </div>
              </div>

              {/* View Configuration List with Drag and Drop */}
              <div className="space-y-3">
                {sortedViews.map((view, index) => {
                  const isFirst = index === 0;
                  const isLast = index === sortedViews.length - 1;
                  const isActiveNow = currentView?.id === view.id;
                  const isBeingDragged = draggedViewId === view.id;
                  const isDropTarget = dragOverViewId === view.id;

                  return (
                    <div
                      key={view.id}
                      draggable={true}
                      onDragStart={(e) => {
                        setDraggedViewId(view.id);
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', String(view.id));
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (dragOverViewId !== view.id) {
                          setDragOverViewId(view.id);
                        }
                      }}
                      onDragLeave={() => {
                        if (dragOverViewId === view.id) {
                          setDragOverViewId(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedViewId !== null && draggedViewId !== view.id) {
                          reorderViews(draggedViewId, view.id);
                          setNotification(`Secuencia actualizada: ${view.title}`);
                          setTimeout(() => setNotification(null), 2500);
                        }
                        setDraggedViewId(null);
                        setDragOverViewId(null);
                      }}
                      onDragEnd={() => {
                        setDraggedViewId(null);
                        setDragOverViewId(null);
                      }}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-grab active:cursor-grabbing select-none ${
                        isBeingDragged
                          ? 'opacity-40 scale-[0.98] border-dashed border-[#E6007E] bg-[#E6007E]/10'
                          : isDropTarget
                          ? 'border-2 border-[#E6007E] bg-[#E6007E]/15 scale-[1.01] shadow-lg'
                          : view.active
                          ? isActiveNow
                            ? 'bg-[#E6007E]/5 border-[#E6007E]/60 shadow-sm'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          : 'bg-slate-100/50 dark:bg-slate-900/20 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      {/* Drag Handle, Order arrows & Info */}
                      <div className="flex items-center gap-3">
                        {/* Drag Handle */}
                        <div
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title="Arrastrar para reordenar"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Order buttons (accessible alternative) */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            disabled={isFirst}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveViewOrder(view.id, 'up');
                            }}
                            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                              isFirst ? 'opacity-20 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300'
                            }`}
                            title="Subir de posición en el orden"
                            aria-label={`Subir ${view.title}`}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={isLast}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveViewOrder(view.id, 'down');
                            }}
                            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                              isLast ? 'opacity-20 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300'
                            }`}
                            title="Bajar de posición en el orden"
                            aria-label={`Bajar ${view.title}`}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono font-black text-xs sm:text-sm px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0">
                          #{view.order}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                              {view.title}
                            </span>
                            {isActiveNow && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E6007E] text-white">
                                En Pantalla TV
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono">tipo: {view.tipo}</span>
                        </div>
                      </div>

                      {/* Controls: Active toggle & Jump */}
                      <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                        {/* Active Toggle Switch */}
                        <button
                          onClick={() => toggleViewActive(view.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            view.active
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                          }`}
                          title={view.active ? 'Haga clic para ocultar de la rotación' : 'Haga clic para activar en la rotación'}
                        >
                          {view.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{view.active ? 'Activa' : 'Oculta'}</span>
                        </button>

                        {/* Jump button */}
                        <button
                          onClick={() => goToViewId(view.id)}
                          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Mostrar esta vista de inmediato en la TV"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Actividades & Bitácora */}
        {activeTab === 'actividades' && (
          <div className="space-y-6">
            <div className="glass-panel neumorph-shadow rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Historial de Bitácora de Actividades Internas
                </h2>
                <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-bold">
                  Trazabilidad Completa
                </span>
              </div>

              <div className="space-y-3">
                {sampleLogbook.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {log.time}
                      </span>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {log.author}
                      </span>
                      <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold text-slate-600 dark:text-slate-400">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {log.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Anuncios */}
        {activeTab === 'anuncios' && (
          <div className="glass-panel neumorph-shadow rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#E6007E]" />
              <span>Publicar Anuncio del Día</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Este mensaje aparecerá destacado en la vista rotativa de Anuncios en la TV.
            </p>
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs uppercase font-bold text-slate-500 block mb-1">Título</label>
                <input
                  type="text"
                  defaultValue={data?.announcement.title || 'Capacitación en Mantenimiento UV'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-slate-500 block mb-1">Mensaje</label>
                <textarea
                  rows={4}
                  defaultValue={data?.announcement.description || 'Se realizará este viernes a las 15:00 en la sala principal.'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold"
                />
              </div>
              <button
                onClick={() => {
                  setNotification('Anuncio actualizado para la pantalla de sala');
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#E6007E] hover:bg-[#C9006E] text-white font-bold text-sm shadow transition-all active:scale-95"
              >
                Actualizar Anuncio
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Meta Comercial */}
        {activeTab === 'meta' && (
          <div className="glass-panel neumorph-shadow rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#E6007E]" />
              <span>Progreso de Meta Comercial del Mes</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Modificá el porcentaje de avance general. Por política ética de SIMON, no se visualizan importes en soles en la pantalla pública.
            </p>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs uppercase font-bold text-slate-500 block mb-1">
                  Porcentaje alcanzado (%)
                </label>
                <input
                  type="number"
                  defaultValue={data?.goal.progressPercentage || 74}
                  min={0}
                  max={100}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold font-mono"
                />
              </div>
              <button
                onClick={() => {
                  setNotification('Meta mensual actualizada');
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#E6007E] hover:bg-[#C9006E] text-white font-bold text-sm shadow transition-all active:scale-95"
              >
                Guardar Porcentaje
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Marquesina */}
        {activeTab === 'marquesina' && (
          <div className="glass-panel neumorph-shadow rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[#E6007E]" />
              <span>Mensajes de la Marquesina Inferior (Ticker)</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mensajes en cinta continua en la parte inferior de la TV para todo el equipo técnico.
            </p>
            <div className="space-y-3">
              {data?.tickerItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#E6007E]/10 text-[#E6007E]">
                      {item.type}
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {item.text}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Cinta activa
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
