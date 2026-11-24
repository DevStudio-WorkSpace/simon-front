import mockData from "@/mocks/pantalla.json";
import type { EstadoPantalla } from "@/types/pantalla";
import type { AccionPantalla, PantallaApi } from "./index";

const estado: EstadoPantalla = structuredClone(mockData) as EstadoPantalla;
const suscriptores = new Set<(estado: EstadoPantalla) => void>();

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function publicar() {
  for (const callback of suscriptores) callback(structuredClone(estado));
}

export const mockApi: PantallaApi = {
  async obtenerEstado(codigo: string) {
    await esperar(120);
    if (codigo !== estado.codigo) return structuredClone(estado);
    return structuredClone(estado);
  },
  async enviarOrden(codigo: string, accion: AccionPantalla, vista?: number) {
    await esperar(80);
    if (codigo !== estado.codigo) return;

    if (accion === "anterior") {
      estado.vista_actual = estado.vista_actual === 1 ? 6 : estado.vista_actual - 1;
    } else if (accion === "siguiente") {
      estado.vista_actual = estado.vista_actual === 6 ? 1 : estado.vista_actual + 1;
    } else if (accion === "pausa") {
      estado.reproduciendo = false;
    } else if (accion === "play") {
      estado.reproduciendo = true;
    } else if (accion === "ir_a" && vista) {
      estado.vista_actual = Math.min(6, Math.max(1, vista));
    }

    estado.ultima_actualizacion = new Date().toISOString();
    publicar();
  },
  suscribirse(codigo: string, callback: (estado: EstadoPantalla) => void) {
    suscriptores.add(callback);
    void this.obtenerEstado(codigo).then(callback);
    return () => suscriptores.delete(callback);
  },
};
