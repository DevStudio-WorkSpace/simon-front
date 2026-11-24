import { describe, expect, it } from "vitest";
import { mockApi } from "./mock";

describe("API mock", () => {
  it("obtiene un estado ficticio completo", async () => {
    const estado = await mockApi.obtenerEstado("sala");
    expect(estado.codigo).toBe("sala");
    expect(estado.servicios).toHaveLength(9);
    expect(estado.ranking).toHaveLength(3);
  });

  it("aplica una orden y publica el nuevo estado", async () => {
    await mockApi.enviarOrden("sala", "siguiente");
    const estado = await mockApi.obtenerEstado("sala");
    expect(estado.vista_actual).toBe(2);
  });
});
