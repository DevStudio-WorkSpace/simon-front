"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CabeceraPantalla } from "@/components/pantalla/CabeceraPantalla";
import { FranjaMensajes } from "@/components/pantalla/FranjaMensajes";
import { VistaServicios } from "@/components/pantalla/VistaServicios";
import { VistaPuntualidad } from "@/components/pantalla/VistaPuntualidad";
import { VistaRanking } from "@/components/pantalla/VistaRanking";
import { VistaMeta } from "@/components/pantalla/VistaMeta";
import { useTecladoPantalla } from "@/components/pantalla/TecladoPantalla";
import { pantallaApi } from "@/lib/api";
import type { AccionPantalla } from "@/lib/api";
import type { EstadoPantalla } from "@/types/pantalla";

export default function Pantalla({ params }: { params: Promise<{ codigo: string }> }) {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState<EstadoPantalla | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const [ultimaHora, setUltimaHora] = useState("");
  const [fechaHora, setFechaHora] = useState("");

  useEffect(() => {
    params.then(({ codigo: valor }) => setCodigo(valor));
  }, [params]);

  useEffect(() => {
    const inicio = window.setTimeout(() => {
      setFechaHora(new Intl.DateTimeFormat("es-PE", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date()));
    }, 0);
    const reloj = window.setInterval(() => {
      setFechaHora(new Intl.DateTimeFormat("es-PE", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date()));
    }, 1000);
    return () => {
      window.clearTimeout(inicio);
      window.clearInterval(reloj);
    };
  }, []);

  useEffect(() => {
    if (!codigo) return;
    let activo = true;
    const actualizar = (nuevo: EstadoPantalla) => {
      if (!activo) return;
      setEstado(nuevo);
      setUltimaHora(nuevo.ultima_actualizacion);
      setSinConexion(false);
    };

    const cargar = async () => {
      try {
        actualizar(await pantallaApi.obtenerEstado(codigo));
      } catch {
        setSinConexion(true);
      }
    };
    void cargar();
    const cancelar = pantallaApi.suscribirse(codigo, actualizar);
    const vigilar = window.setInterval(() => {
      setSinConexion(!window.navigator.onLine);
    }, 1000);
    return () => {
      activo = false;
      cancelar();
      window.clearInterval(vigilar);
    };
  }, [codigo]);

  const enviarOrden = useCallback(async (codigoActual: string, accion: AccionPantalla) => {
    try {
      const accionReal = accion === "pausa"
        ? (estado?.reproduciendo ? "pausa" : "play")
        : accion;
      await pantallaApi.enviarOrden(codigoActual, accionReal);
    } catch {
      setSinConexion(true);
    }
  }, [estado]);

  useTecladoPantalla(codigo, enviarOrden);

  useEffect(() => {
    if (!codigo || !estado?.reproduciendo) return;
    const segundos = estado.segundos_rotacion || 10;
    const temporizador = window.setInterval(() => {
      void enviarOrden(codigo, "siguiente");
    }, segundos * 1000);
    return () => window.clearInterval(temporizador);
  }, [codigo, estado?.reproduciendo, estado?.segundos_rotacion, enviarOrden]);

  const horaUltimoDato = useMemo(() => {
    if (!ultimaHora) return "";
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(ultimaHora));
  }, [ultimaHora]);

  const titulo = estado?.vista_actual === 1
    ? "Servicios de hoy"
    : estado?.vista_actual === 2
      ? "Puntualidad de hoy"
      : estado?.vista_actual === 3
        ? "Ranking del mes"
        : estado?.vista_actual === 4
          ? "Meta del mes"
          : `Vista ${estado?.vista_actual}/6`;

  if (!estado) {
    return (
      <main className="flex h-screen items-center justify-center bg-white text-[28px]">
        Cargando datos de la pantalla…
        {horaUltimoDato && <span>Último dato: {horaUltimoDato}</span>}
      </main>
    );
  }

  return (
    <main className="mx-auto h-screen max-h-[1080px] w-full max-w-[1920px] overflow-hidden bg-white text-[28px]">
      {sinConexion && (
        <div role="alert" className="absolute left-1/2 top-32 z-10 -translate-x-1/2 rounded-lg bg-amber-100 px-8 py-5 text-amber-900">
          Sin conexión. Último dato recibido: {horaUltimoDato || "no disponible"}
        </div>
      )}
      <CabeceraPantalla estado={estado} fecha_hora={fechaHora} titulo={titulo} />
      <div className="h-3 bg-gray-100">
        <div
          className="h-full bg-[var(--magenta)]"
          style={{ width: `${(estado.vista_actual / 6) * 100}%` }}
        />
      </div>
      <section className="h-[790px] border-b-2 border-gray-100 px-10 py-8">
        {estado.vista_actual === 1 && (
          <VistaServicios servicios={estado.servicios} pagina={1} />
        )}
        {estado.vista_actual === 2 && (
          <VistaPuntualidad puntualidad={estado.puntualidad} />
        )}
        {estado.vista_actual === 3 && (
          <VistaRanking personas={estado.ranking} />
        )}
        {estado.vista_actual === 4 && (
          <VistaMeta meta={estado.meta_mes} />
        )}
        {estado.vista_actual > 4 && (
          <h2 className="text-[80px] font-bold text-[var(--magenta)]">
            Vista {estado.vista_actual}/6
          </h2>
        )}
      </section>
      <FranjaMensajes mensajes={estado.mensajes} />
    </main>
  );
}
