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
    <div className="mx-auto max-w-[1500px] text-center">
      <strong className="block text-[80px] text-[var(--magenta)]">{meta.porcentaje}%</strong>
      <p className="mt-2 text-[28px]">
        Hito alcanzado: <strong>{meta.hito_alcanzado}</strong>
      </p>
      <p className="mt-2 text-[28px]">
        Próximo hito: <strong>{meta.proximo_hito}</strong>
      </p>
      <div className="relative mt-16 h-14 rounded-full bg-gray-200">
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
            <span className="absolute left-1 top-16 whitespace-nowrap">{marca}%</span>
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
