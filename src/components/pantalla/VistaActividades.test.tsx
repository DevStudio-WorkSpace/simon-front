import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VistaActividades } from "./VistaActividades";

describe("Vista Actividades", () => {
  it("oculta validadas y muestra disponible", () => {
    render(
      <VistaActividades
        disponible={{ titulo:"Inventariar", condicion:"Cuando termine" }}
        actividades={[
          { id:"1", tecnico:"Ana", actividad_interna:"Documento", estado:"En curso", siguiente_paso:"Continuar" },
          { id:"2", tecnico:"Luis", actividad_interna:"Secreta", estado:"Validada", siguiente_paso:"Publicada" },
        ]}
      />,
    );
    expect(screen.queryByText("Secreta")).not.toBeInTheDocument();
    expect(screen.getByText(/Disponible:/)).toBeInTheDocument();
  });
});
