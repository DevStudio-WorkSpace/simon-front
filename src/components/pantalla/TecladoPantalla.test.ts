import { describe, expect, it } from "vitest";
import { accionPorTecla } from "./TecladoPantalla";

describe("Teclas de Android TV", () => {
  it("convierte flechas y OK en órdenes", () => {
    expect(accionPorTecla("ArrowLeft", 0)).toBe("anterior");
    expect(accionPorTecla("ArrowRight", 0)).toBe("siguiente");
    expect(accionPorTecla("Enter", 0)).toBe("pausa");
  });

  it("mapea keyCode 21, 22 y 23", () => {
    expect(accionPorTecla("", 21)).toBe("anterior");
    expect(accionPorTecla("", 22)).toBe("siguiente");
    expect(accionPorTecla("", 23)).toBe("pausa");
  });

  it("ignora otras teclas", () => {
    expect(accionPorTecla("A", 65)).toBeNull();
  });
});
