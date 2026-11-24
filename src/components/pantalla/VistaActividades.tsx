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
  const enCurso = visibles.filter((actividad) => actividad.estado === "En curso").length;
  const pausadas = visibles.filter((actividad) => actividad.estado === "Pausada por servicio").length;
  const revision = visibles.filter((actividad) => actividad.estado === "Lista para revisión").length;
  return (
    <div>
      <h2 className="mb-5 text-[38px] font-bold text-[#26324d]">Qué avanzar cuando estás disponible</h2>
      <div className="mb-5 grid grid-cols-3 gap-5">
        <div className="flex h-[90px] items-center justify-center gap-5 rounded-xl bg-blue-50">
          <strong className="text-[62px] text-blue-600">{enCurso}</strong>
          <span className="text-[24px] font-bold text-blue-700">en curso</span>
        </div>
        <div className="flex h-[90px] items-center justify-center gap-5 rounded-xl bg-amber-50">
          <strong className="text-[62px] text-amber-700">{pausadas}</strong>
          <span className="text-[24px] font-bold text-amber-800">pausadas por servicio</span>
        </div>
        <div className="flex h-[90px] items-center justify-center gap-5 rounded-xl bg-green-50">
          <strong className="text-[62px] text-green-700">{revision}</strong>
          <span className="text-[24px] font-bold text-green-700">listas para revisión</span>
        </div>
      </div>
      <div className="grid grid-cols-[220px_480px_280px_1fr] gap-4 border-b-2 border-gray-300 pb-3 text-[24px] font-bold text-[#69758a]">
        <span>Técnico</span>
        <span>Actividad interna</span>
        <span>Estado</span>
        <span>Siguiente paso</span>
      </div>
      <div className="divide-y divide-gray-200">
        {visibles.map((actividad) => (
          <div key={actividad.id} className="grid grid-cols-[220px_480px_280px_1fr] items-center gap-4 py-4 text-[24px]">
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
