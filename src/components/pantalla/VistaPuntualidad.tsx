import type { PuntualidadHoy } from "@/types/pantalla";

export function personasSinNombresTarde(puntualidad: PuntualidadHoy): number {
  return puntualidad.personas.filter((persona) => persona.llegada_tarde).length;
}

export function VistaPuntualidad({ puntualidad }: { puntualidad: PuntualidadHoy }) {
  const aTiempo = puntualidad.personas.filter((persona) => !persona.llegada_tarde);
  const tardanzas = personasSinNombresTarde(puntualidad);
  return (
    <div className="grid h-full grid-cols-[1.1fr_1fr] gap-8">
      <section>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 text-center">
            <strong className="block text-[80px]">{puntualidad.a_tiempo_hoy}/{puntualidad.total_hoy}</strong>
            <span>A tiempo hoy</span>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <strong className="block text-[80px]">{puntualidad.tardanzas_hoy}</strong>
            <span>Minutos de tardanza</span>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <strong className="block text-[80px]">{puntualidad.racha_puntualidad}</strong>
            <span>Días de racha</span>
          </div>
        </div>
        <h3 className="mt-6 text-[28px] font-bold">Llegaron a tiempo</h3>
        <ol className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
          {aTiempo.map((persona, index) => (
            <li key={persona.nombre} className="flex justify-between border-b py-2">
              <span>{index + 1}. {persona.nombre}</span>
              <strong>{persona.hora_llegada}</strong>
            </li>
          ))}
        </ol>
        {tardanzas > 0 && (
          <div className="mt-4 rounded bg-gray-200 px-4 py-3 text-center text-gray-700">
            <strong>+{tardanzas}</strong> llegaron tarde
          </div>
        )}
      </section>
      <section>
        <h3 className="text-[28px] font-bold">Tardanzas de las últimas 3 semanas</h3>
        <div className="mt-5 flex h-[300px] items-end gap-8 border-b-2 border-gray-300 px-8">
          {puntualidad.ultimas_semanas.map((semana) => (
            <div key={semana.etiqueta} className="flex flex-1 flex-col items-center">
              <strong>{semana.minutos}</strong>
              <div
                className={`mt-2 w-20 ${semana.actual ? "bg-[var(--magenta)]" : "bg-gray-400"}`}
                style={{ height: `${Math.max(20, semana.minutos * 3)}px` }}
              />
              <span className="mt-3 text-center">{semana.etiqueta}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-amber-100 px-6 py-5 text-amber-900">
          <strong>Por mejorar:</strong> {puntualidad.meta_siguiente_dia}. Horario: {puntualidad.horario_meta}.
        </div>
      </section>
    </div>
  );
}
