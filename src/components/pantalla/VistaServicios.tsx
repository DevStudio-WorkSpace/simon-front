import type { EstadoServicio, ServicioHoy } from "@/types/pantalla";

export function ordenarServicios(servicios: ServicioHoy[]): ServicioHoy[] {
  return [...servicios]
    .sort((a, b) => {
      if (a.prioridad !== b.prioridad) return a.prioridad === "Urgente" ? -1 : 1;
      if (a.estado === "Atendido" && b.estado !== "Atendido") return 1;
      if (b.estado === "Atendido" && a.estado !== "Atendido") return -1;
      return a.hora.localeCompare(b.hora);
    });
}

export function obtenerPagina(servicios: ServicioHoy[], pagina: number) {
  const ordenados = ordenarServicios(servicios);
  const porPagina = 9;
  const total = Math.ceil(ordenados.length / porPagina);
  const actual = Math.min(Math.max(1, pagina), total);
  return {
    datos: ordenados.slice((actual - 1) * porPagina, actual * porPagina),
    actual,
    total,
  };
}

const estadoClases: Record<EstadoServicio, string> = {
  "Por programar": "bg-[var(--sin-tecnico)] text-white",
  Programado: "bg-blue-600 text-white",
  "En atención": "bg-blue-600 text-white",
  "En espera": "bg-amber-500 text-black",
  Atendido: "bg-green-600 text-white",
};

export function VistaServicios({ servicios, pagina }: { servicios: ServicioHoy[]; pagina: number }) {
  const paginaActual = obtenerPagina(servicios, pagina);
  return (
    <div>
      <div className="grid grid-cols-8 gap-3 border-b-2 border-gray-300 pb-3 text-[28px] font-bold">
        <span>N°</span><span>Prioridad</span><span>Hora</span><span>Técnico</span>
        <span>Cliente</span><span>Servicio</span><span>Máquina</span><span>Estado</span>
      </div>
      <div className="divide-y divide-gray-200">
        {paginaActual.datos.map((servicio) => {
          const estado = servicio.estado === "Por programar"
            ? "Sin técnico"
            : servicio.estado === "En atención"
              ? "Atendiendo"
              : servicio.estado === "En espera"
                ? `Espera · ${servicio.motivo_espera || "Motivo"}`
                : servicio.estado === "Atendido"
                  ? "Terminado"
                  : "Programado";
          const modalidad = servicio.modalidad === "visita" ? "📍" : servicio.modalidad === "remoto" ? "▣" : "🔧";
          return (
            <div key={servicio.numero} className={`grid grid-cols-8 items-center gap-3 py-3 text-[28px] ${servicio.prioridad === "Urgente" ? "border-l-8 border-red-600 pl-3" : ""}`}>
              <span>{servicio.numero}</span>
              <span className={servicio.prioridad === "Urgente" ? "font-bold text-red-700" : ""}>
                {servicio.prioridad === "Urgente" ? "Urgente" : "Normal"}
              </span>
              <span>{servicio.hora}</span>
              <span>{servicio.tecnico}</span>
              <span>{modalidad} {servicio.cliente}</span>
              <span>{servicio.servicio}</span>
              <span>{servicio.maquina}</span>
              <span className={`rounded px-3 py-2 text-center ${estadoClases[servicio.estado]}`}>{estado}</span>
            </div>
          );
        })}
      </div>
      {paginaActual.total > 1 && (
        <div className="mt-4 text-right text-[28px]">Página {paginaActual.actual}/{paginaActual.total}</div>
      )}
    </div>
  );
}
