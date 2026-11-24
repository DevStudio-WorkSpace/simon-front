import { describe, expect, it } from "vitest";
import type { ServicioHoy } from "@/types/pantalla";
import { obtenerPagina, ordenarServicios } from "./VistaServicios";

const servicios: ServicioHoy[] = [
  { numero:"1", prioridad:"Normal", hora:"12:00", tecnico:"A", cliente:"C", modalidad:"visita", servicio:"S", maquina:"M", estado:"Atendido" },
  { numero:"2", prioridad:"Urgente", hora:"11:00", tecnico:"B", cliente:"C", modalidad:"remoto", servicio:"S", maquina:"M", estado:"Programado" },
  { numero:"3", prioridad:"Normal", hora:"10:00", tecnico:"C", cliente:"C", modalidad:"taller", servicio:"S", maquina:"M", estado:"En atención" },
];

describe("Vista Servicios", () => {
  it("ordena urgentes primero y terminados al final", () => {
    expect(ordenarServicios(servicios).map((item) => item.numero)).toEqual(["2", "3", "1"]);
  });

  it("pagina cada 9 servicios sin cambiar el tamaño", () => {
    const diez = Array.from({ length: 10 }, (_, index) => ({
      ...servicios[0],
      numero: String(index + 1),
    }));
    expect(obtenerPagina(diez, 1).datos).toHaveLength(9);
    expect(obtenerPagina(diez, 2).datos).toHaveLength(1);
    expect(obtenerPagina(diez, 2).total).toBe(2);
  });
});
