import { describe, expect, it } from "vitest";
import { segundosRotacion, siguienteVista, vistaAnterior } from "./pantalla";

describe("Rotación de pantallas", () => {
  it("avanza y vuelve al inicio", () => {
    expect(siguienteVista(5)).toBe(6);
    expect(siguienteVista(6)).toBe(1);
  });

  it("retrocede y vuelve a seis", () => {
    expect(vistaAnterior(2)).toBe(1);
    expect(vistaAnterior(1)).toBe(6);
  });

  it("usa 10 segundos si no llega configuración", () => {
    expect(segundosRotacion()).toBe(10);
    expect(segundosRotacion(15)).toBe(15);
  });
});
