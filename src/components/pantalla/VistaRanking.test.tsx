import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PersonaRanking } from "@/types/pantalla";
import { VistaRanking } from "./VistaRanking";

describe("Vista Ranking", () => {
  it("muestra como máximo tres personas", () => {
    const personas: PersonaRanking[] = [1, 2, 3, 4].map((puesto) => ({
      puesto,
      nombre:`Persona ${puesto}`,
      total:100 - puesto,
      puntualidad:20,
      asistencia:20,
      capacitacion:20,
      servicios:20,
      mas_pesa:"Actitud",
      crecio:true,
    }));
    render(<VistaRanking personas={personas} />);
    expect(screen.queryByText("Persona 4")).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
});
