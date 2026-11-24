import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PuntualidadHoy } from "@/types/pantalla";
import { VistaPuntualidad } from "./VistaPuntualidad";

describe("Vista Puntualidad", () => {
  it("muestra la cantidad de tardanzas sin nombres", () => {
    const puntualidad: PuntualidadHoy = {
      a_tiempo_hoy: 8,
      total_hoy: 10,
      tardanzas_hoy: 25,
      faltas_hoy: 1,
      personas: [
        { nombre:"Ana", hora_llegada:"08:00", llegada_tarde:false, minutos_tarde:0 },
        { nombre:"Nombre privado tarde", hora_llegada:"08:20", llegada_tarde:true, minutos_tarde:20 },
      ],
      ultimas_semanas: [],
      racha_puntualidad: 4,
      meta_siguiente_dia:"Llegar antes",
      horario_meta:"08:00",
    };
    render(<VistaPuntualidad puntualidad={puntualidad} />);
    expect(screen.queryByText(/Nombre privado tarde/)).not.toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });
});
