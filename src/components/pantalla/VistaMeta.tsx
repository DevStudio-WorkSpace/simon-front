import type { MetaMes } from "@/types/pantalla";

export function claseHito(porcentaje: number) {
  if (porcentaje >= 100) return "Meta";
  if (porcentaje >= 75) return "Oro";
  if (porcentaje >= 50) return "Plata";
  if (porcentaje >= 25) return "Bronce";
  return "Inicio";
}

export function VistaMeta({ meta }: { meta: MetaMes }) {
  return (
    <div className="mx-auto max-w-[1550px] text-center">
      <h2 className="text-[38px] font-bold text-[#26324d]">Meta comercial de noviembre</h2>
      <strong className="mt-5 block text-[130px] leading-none text-[#26324d]">{meta.porcentaje}%</strong>
      <div className="mt-5 rounded-lg bg-green-50 px-6 py-3 text-[24px] text-green-700">
        Hito alcanzado: <strong>{meta.hito_alcanzado}</strong>
      </div>
      <p className="mt-4 text-[34px] text-[#69758a]">Próximo hito: <strong>{meta.proximo_hito}</strong></p>
      <div className="relative mt-14 h-10 rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[var(--magenta)]"
          style={{ width: `${Math.min(100, meta.porcentaje)}%` }}
        />
        {[25, 50, 75, 100].map((marca) => (
          <span
            key={marca}
            className="absolute top-0 h-20 border-l-4 border-gray-700"
            style={{ left: `${marca}%` }}
          >
            <span className="absolute left-1 top-14 whitespace-nowrap">{marca}%</span>
          </span>
        ))}
      </div>
      <div className="mt-20 grid grid-cols-4 gap-4 text-[28px]">
        <strong>25% Bronce</strong>
        <strong>50% Plata</strong>
        <strong>75% Oro</strong>
        <strong>100% Meta</strong>
      </div>
    </div>
  );
}
