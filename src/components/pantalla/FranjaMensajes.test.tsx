import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FranjaMensajes } from "./FranjaMensajes";

describe("Franja de leyendas", () => {
  it("reserva una fila independiente para cinco tipos de mensajes", () => {
    render(
      <FranjaMensajes
        mensajes={[
          { tipo: "Urgente", texto: "Urgencia visible" },
          { tipo: "Alerta", texto: "Alerta visible" },
          { tipo: "Anuncio", texto: "Anuncio visible" },
          { tipo: "Por mejorar", texto: "Mejora visible" },
          { tipo: "Logro", texto: "Logro visible" },
        ]}
      />,
    );

    expect(screen.getByText("Urgencia visible")).toBeInTheDocument();
    expect(screen.getAllByText(/visible$/).length).toBe(5);
  });
});
