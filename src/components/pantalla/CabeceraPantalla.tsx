import Image from "next/image";
import type { EstadoPantalla } from "@/types/pantalla";

interface Props {
  estado: EstadoPantalla;
  fecha_hora: string;
  titulo: string;
}

export function CabeceraPantalla({ estado, fecha_hora, titulo }: Props) {
  const estadoTexto = estado.reproduciendo ? "Reproduciendo" : "Pausado";
  return (
    <header className="flex h-[140px] items-center justify-between border-b-4 border-[var(--magenta)] bg-white px-10">
      <div className="flex min-w-[520px] items-center gap-6">
        <Image src="/logo-go-service.svg" alt="GO Service LATAM" width={280} height={72} priority />
        <span className="text-[28px] font-semibold">Soporte técnico</span>
      </div>
      <div className="flex-1 text-center">
        <h1 className="text-[28px] font-bold">{titulo}</h1>
      </div>
      <div className="flex min-w-[520px] items-center justify-end gap-6 text-[28px]">
        <span aria-label={`Estado ${estadoTexto}`} className="font-semibold">
          {estado.reproduciendo ? "▶" : "Ⅱ"} {estadoTexto}
        </span>
        <span>{estado.vista_actual}/6</span>
        <time>{fecha_hora}</time>
      </div>
    </header>
  );
}
