import type { PuntualidadHoy } from "@/types/pantalla";

export function personasSinNombresTarde(puntualidad: PuntualidadHoy): number {
  return puntualidad.personas.filter((persona) => persona.llegada_tarde).length;
}

export function VistaPuntualidad({ puntualidad }: { puntualidad: PuntualidadHoy }) {
  const aTiempo = puntualidad.personas.filter((persona) => !persona.llegada_tarde).slice(0, 8);
  const tardanzas = personasSinNombresTarde(puntualidad);

  return (
    <div className="grid h-full grid-cols-[610px_1fr] gap-6">
      <section>
        <h3 className="mb-4 text-[34px] font-bold text-[#26324d]">Llegaron a tiempo</h3>
        <ol className="grid grid-cols-1 gap-1">
          {aTiempo.map((persona, index) => (
            <li key={persona.nombre} className="flex h-[48px] items-center justify-between border-b border-gray-100">
              <span><strong className="mr-3">{index + 1}</strong>{persona.nombre}</span>
              <strong>{persona.hora_llegada}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="grid grid-cols-[1fr_1fr] gap-5">
          <div className="rounded-xl border border-green-100 bg-green-50 p-5 text-center">
            <span className="block text-[22px] font-bold text-green-800">A tiempo hoy</span>
            <strong className="mt-2 block text-[64px] leading-none text-green-700">
              {puntualidad.a_tiempo_hoy} de {puntualidad.total_hoy}
            </strong>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 text-center">
            <span className="block text-[22px] font-bold text-amber-800">Tardanzas hoy</span>
            <strong className="mt-2 block text-[64px] leading-none text-amber-700">
              {puntualidad.tardanzas_hoy}
            </strong>
            <span className="text-[20px]">minutos en total</span>
          </div>
        </div>

        <h3 className="mt-7 text-[28px] font-bold text-[#26324d]">Tardanzas del equipo por semana</h3>
        <div className="mt-4 flex h-[330px] items-end gap-10 border-b-2 border-gray-300 px-10">
          {puntualidad.ultimas_semanas.map((semana) => (
            <div key={semana.etiqueta} className="flex h-full flex-1 flex-col items-center justify-end">
              <strong className="text-[30px]">{semana.minutos}</strong>
              <div
                className={`mt-2 w-24 ${semana.actual ? "bg-[#08776e]" : "bg-blue-200"}`}
                style={{ height: `${Math.max(60, semana.minutos * 5)}px` }}
              />
              <span className="mt-3 h-14 text-center text-[20px]">{semana.etiqueta}</span>
            </div>
          ))}
        </div>

        {tardanzas > 0 && (
          <div className="mt-4 rounded-lg bg-gray-100 px-5 py-3 text-center text-gray-700">
            <strong>+{tardanzas}</strong> llegaron tarde
          </div>
        )}
        <div className="mt-4 text-center font-bold text-green-700">
          Racha más larga: {puntualidad.racha_puntualidad} días
        </div>
      </section>

      <div className="col-span-2 mt-2 rounded-xl bg-amber-50 px-6 py-4 text-amber-900">
        <strong>Por mejorar:</strong> {puntualidad.meta_siguiente_dia}. Horario: {puntualidad.horario_meta}.
      </div>
    </div>
  );
}
