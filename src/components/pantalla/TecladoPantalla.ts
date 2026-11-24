"use client";

import { useEffect } from "react";
import type { AccionPantalla } from "@/lib/api";

export function accionPorTecla(key: string, keyCode: number): AccionPantalla | null {
  if (key === "ArrowLeft" || keyCode === 21) return "anterior";
  if (key === "ArrowRight" || keyCode === 22) return "siguiente";
  if (key === "Enter" || key === " " || keyCode === 23) return "pausa";
  if (key === "PageDown") return "siguiente";
  if (key === "PageUp") return "anterior";
  return null;
}

export function useTecladoPantalla(
  codigo: string,
  enviarOrden: (codigo: string, accion: AccionPantalla) => Promise<void>,
) {
  useEffect(() => {
    let ultimoMovimiento = 0;
    const manejar = (evento: KeyboardEvent) => {
      const ahora = Date.now();
      if (ahora - ultimoMovimiento < 250) return;
      const accion = accionPorTecla(evento.key, evento.keyCode);
      if (!accion) return;
      ultimoMovimiento = ahora;
      evento.preventDefault();
      void enviarOrden(codigo, accion);
    };
    window.addEventListener("keydown", manejar);
    return () => window.removeEventListener("keydown", manejar);
  }, [codigo, enviarOrden]);
}
