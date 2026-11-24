import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { EstadoPantalla } from "@/types/pantalla";
import { CabeceraPantalla } from "./CabeceraPantalla";

describe("Cabecera aprobada", () => {
  it("muestra soporte técnico, estado, progreso y fecha", () => {
    const estado = {
      vista_actual: 3,
      reproduciendo: true,
    } as EstadoPantalla;

    render(
      <CabeceraPantalla
        estado={estado}
        fecha_hora="24 nov 2026 · 10:15"
        titulo="Ranking del mes"
      />,
    );

    expect(screen.getByText("Soporte técnico")).toBeInTheDocument();
    expect(screen.getByText("Reproduciendo")).toBeInTheDocument();
    expect(screen.getByText("3/6")).toBeInTheDocument();
  });
});
