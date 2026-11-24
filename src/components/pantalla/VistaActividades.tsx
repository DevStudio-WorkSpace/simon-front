import type { ActividadDisponible, ActividadInterna } from "@/types/pantalla";

const estadoClases: Record<string, string> = {
  Asignada: "bg-gray-200 text-gray-800",
  "En curso": "bg-blue-600 text-white",
  "Pausada por servicio": "bg-amber-500 text-black",
  Bloqueada: "bg-red-600 text-white",
  "Lista para revisión": "bg-green-600 text-white",
};

export function VistaActividades({
  actividades,
  disponible,
}: {
  actividades: ActividadInterna[];
  disponible: ActividadDisponible;
}) {
  const visibles = actividades.filter((actividad) => actividad.estado !== "Validada");
  return (
    <div>
      <h2 className="mb-6 text-[28px] font-bold">Qué avanzar cuando estás disponible</h2>
      <div className="grid grid-cols-4 gap-4 border-b-2 border-gray-300 pb-3 font-bold">
        <span>Técnico</span>
        <span>Actividad interna</span>
        <span>Estado</span>
        <span>Siguiente paso</span>
      </div>
      <div className="divide-y divide-gray-200">
        {visibles.map((actividad) => (
          <div key={actividad.id} className="grid grid-cols-4 items-center gap-4 py-5">
            <strong>{actividad.tecnico}</strong>
            <span>{actividad.actividad_interna}</span>
            <span className={`rounded-lg px-3 py-2 text-center ${estadoClases[actividad.estado] || "bg-gray-200"}`}>
              {actividad.estado}
            </span>
            <span>{actividad.siguiente_paso}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border-l-8 border-green-600 bg-green-50 p-5">
        <strong>Disponible: </strong>{disponible.titulo}
        <span className="ml-3">· {disponible.condicion}</span>
      </div>
    </div>
  );
}
