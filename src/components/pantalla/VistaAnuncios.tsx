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
    <article className="relative mx-auto max-w-[1740px] border-l-[9px] border-blue-600 rounded-r-2xl bg-white p-12">
      <span className="rounded-full bg-blue-50 px-6 py-3 text-[24px] font-bold text-blue-700">{anuncio.fecha_o_hora}</span>
      <h2 className="mt-8 max-w-[1450px] text-[72px] font-bold leading-tight text-[#26324d]">{anuncio.titulo}</h2>
      <p className="mt-8 max-w-[1450px] text-[34px] text-[#69758a]">{anuncio.descripcion}</p>
      <div className="mt-10 border-t border-gray-200 pt-6 text-[28px]">
        <strong className="text-blue-700">Responsables:</strong> {anuncio.responsables.join(", ")}
      </div>
    </article>
  );
}
