"use client";

import { useEffect, useState } from "react";
import type { AnuncioHoy } from "@/types/pantalla";

export function VistaAnuncios({
  anuncios,
  segundos,
}: {
  anuncios: AnuncioHoy[];
  segundos: number;
}) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (anuncios.length < 2) return;
    const temporizador = window.setInterval(() => {
      setIndice((actual) => (actual + 1) % anuncios.length);
    }, segundos * 1000);
    return () => window.clearInterval(temporizador);
  }, [anuncios.length, segundos]);

  if (!anuncios.length) {
    return <p className="text-[28px]">No hay anuncios vigentes.</p>;
  }
  const anuncio = anuncios[indice];
  return (
    <article className="mx-auto max-w-[1500px] rounded-3xl border-4 border-blue-600 p-12 text-center">
      <span className="rounded-full bg-blue-600 px-6 py-3 text-white">Anuncio</span>
      <p className="mt-8 text-[28px] font-bold text-blue-700">{anuncio.fecha_o_hora}</p>
      <h2 className="mt-6 text-[80px] font-bold">{anuncio.titulo}</h2>
      <p className="mt-8 text-[28px]">{anuncio.descripcion}</p>
      <p className="mt-8 text-[28px]">
        <strong>Responsables:</strong> {anuncio.responsables.join(", ")}
      </p>
    </article>
  );
}
