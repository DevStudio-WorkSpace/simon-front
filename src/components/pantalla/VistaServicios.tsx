import type { EstadoServicio, IndicadoresServicios, ServicioHoy } from "@/types/pantalla";

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

export function VistaServicios({
  servicios,
  pagina,
  indicadores,
}: {
  servicios: ServicioHoy[];
  pagina: number;
  indicadores?: IndicadoresServicios;
}) {
  const paginaActual = obtenerPagina(servicios, pagina);
  return (
    <div>
      {indicadores && (
        <div className="mb-5 grid grid-cols-5 gap-4">
          {[
            ["servicios_hoy", String(indicadores.servicios_hoy), "servicios hoy", "text-[#26324d]"],
            ["urgentes", String(indicadores.urgentes), "urgentes", "text-red-600"],
            ["atendiendo", String(indicadores.atendiendo_ahora), "atendiendo\nahora", "text-blue-600"],
            ["sin_tecnico", String(indicadores.sin_tecnico), "sin técnico", "text-violet-700"],
            ["por_llamar", String(indicadores.por_llamar), "por llamar\n(seguimiento)", "text-amber-700"],
          ].map(([clave, valor, etiqueta, color]) => (
            <div key={clave} className="flex h-[110px] items-center justify-center gap-4 rounded-xl bg-gray-50 px-5">
              <strong className={`text-[66px] leading-none ${color}`}>{valor}</strong>
              <span className="whitespace-pre-line text-[24px] font-bold leading-tight text-[#26324d]">{etiqueta}</span>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-[110px_150px_120px_180px_240px_300px_180px_1fr] gap-3 border-b-2 border-gray-300 pb-2 text-[24px] font-bold text-[#69758a]">
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
            <div key={servicio.numero} className={`grid grid-cols-[110px_150px_120px_180px_240px_300px_180px_1fr] items-center gap-3 py-2 text-[24px] ${servicio.prioridad === "Urgente" ? "border-l-8 border-red-600 pl-3" : ""}`}>
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
