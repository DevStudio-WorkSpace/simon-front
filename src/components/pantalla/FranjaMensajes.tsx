import type { MensajeMarquesina } from "@/types/pantalla";

const clases = {
  Urgente: "border-red-600 bg-red-50 text-red-700",
  Alerta: "border-[#fb7185] bg-red-50 text-red-700",
  Anuncio: "border-blue-600 bg-blue-50 text-blue-700",
  "Por mejorar": "border-amber-500 bg-amber-50 text-amber-800",
  Logro: "border-green-600 bg-green-50 text-green-700",
};

export function FranjaMensajes({ mensajes }: { mensajes: MensajeMarquesina[] }) {
  const ordenados = [...mensajes].sort((a, b) => {
    const prioridad = { Urgente: 0, Alerta: 1, Anuncio: 2, "Por mejorar": 3, Logro: 4 };
    return prioridad[a.tipo] - prioridad[b.tipo];
  });

  return (
    <footer className="grid h-[120px] grid-cols-5 items-center gap-3 border-t border-gray-200 bg-white px-[34px] py-3">
      {ordenados.map((mensaje) => (
        <div
          key={`${mensaje.tipo}-${mensaje.texto}`}
          className={`h-[88px] overflow-hidden rounded-lg border-l-8 px-3 py-2 text-[28px] leading-[32px] ${clases[mensaje.tipo]}`}
        >
          <strong>{mensaje.tipo}: </strong>
          <span className="line-clamp-2">{mensaje.texto}</span>
        </div>
      ))}
    </footer>
  );
}
