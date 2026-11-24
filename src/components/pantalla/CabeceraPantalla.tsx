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
    <header className="grid h-[124px] grid-cols-[360px_1fr_420px] items-stretch border-b-2 border-[var(--magenta)] bg-white px-[34px]">
      <div className="flex items-center gap-5">
        <Image src="/logo-go-service.svg" alt="GO Service LATAM" width={190} height={49} priority />
        <div className="h-14 w-px bg-gray-300" />
        <span className="text-[28px] font-bold text-[#26324d]">Soporte técnico</span>
      </div>
      <div className="flex items-center justify-center">
        <h1 className="text-[38px] font-bold text-[#26324d]">{titulo}</h1>
      </div>
      <div className="flex items-center justify-end gap-7 text-[24px]">
        <div className="flex items-center gap-3 font-semibold text-[#08776e]">
          <span aria-hidden="true">{estado.reproduciendo ? "●" : "Ⅱ"}</span>
          <span>{estadoTexto}</span>
        </div>
        <span className="text-[30px] font-bold text-[#26324d]">{estado.vista_actual}/6</span>
        <time className="min-w-[180px] text-right text-[#69758a]">{fecha_hora}</time>
      </div>
    </header>
  );
}
