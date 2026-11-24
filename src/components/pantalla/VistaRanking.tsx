import type { PersonaRanking } from "@/types/pantalla";

const insignias = ["Oro", "Plata", "Bronce"];
const colores = ["bg-yellow-400", "bg-gray-300", "bg-orange-400"];

export function VistaRanking({ personas }: { personas: PersonaRanking[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {personas.slice(0, 3).map((persona, indice) => (
        <article key={persona.nombre} className="rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <span className={`flex h-20 w-20 items-center justify-center rounded-full text-[28px] font-bold ${colores[indice]}`}>
              {persona.puesto}
            </span>
            <div>
              <strong className="text-[28px]">{insignias[indice]}</strong>
              <h3 className="text-[28px] font-bold">{persona.nombre}</h3>
            </div>
            <strong className="ml-auto text-[80px]">{persona.total}</strong>
          </div>
          <div className="mt-6 flex h-10 overflow-hidden rounded-full bg-gray-100" aria-label="Desempeño distribuido">
            <span className="bg-blue-500" style={{ width: `${persona.puntualidad}%` }} />
            <span className="bg-green-500" style={{ width: `${persona.asistencia}%` }} />
            <span className="bg-violet-500" style={{ width: `${persona.capacitacion}%` }} />
            <span className="bg-magenta" style={{ width: `${persona.servicios}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <strong>Actitud</strong>
              <div>{persona.puntualidad + persona.asistencia}</div>
            </div>
            <div className="rounded-lg bg-violet-50 p-3">
              <strong>Aptitud</strong>
              <div>{persona.capacitacion + persona.servicios}</div>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <strong>Más pesa: {persona.mas_pesa}</strong>
            <strong className={persona.crecio ? "text-green-700" : "text-gray-600"}>
              {persona.crecio ? "Creció" : "Se mantiene"}
            </strong>
          </div>
        </article>
      ))}
    </div>
  );
}
