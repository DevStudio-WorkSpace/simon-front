import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VistaAnuncios } from "./VistaAnuncios";

describe("Vista Anuncios", () => {
  it("rota entre varios anuncios", () => {
    vi.useFakeTimers();
    render(
      <VistaAnuncios
        segundos={1}
        anuncios={[
          { id:"1", fecha_o_hora:"Hoy", titulo:"Uno", descripcion:"Primero", responsables:["A"] },
          { id:"2", fecha_o_hora:"Hoy", titulo:"Dos", descripcion:"Segundo", responsables:["B"] },
        ]}
      />,
    );
    expect(screen.getByText("Uno")).toBeInTheDocument();
  });
});
