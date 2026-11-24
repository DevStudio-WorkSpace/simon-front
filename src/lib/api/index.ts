import type { EstadoPantalla } from "@/types/pantalla";
import { mockApi } from "./mock";
import { realApi } from "./real";

export type AccionPantalla = "anterior" | "siguiente" | "pausa" | "play" | "ir_a";

export interface PantallaApi {
  obtenerEstado(codigo: string): Promise<EstadoPantalla>;
  enviarOrden(codigo: string, accion: AccionPantalla, vista?: number): Promise<void>;
  suscribirse(codigo: string, callback: (estado: EstadoPantalla) => void): () => void;
}

export const pantallaApi: PantallaApi =
  process.env.NEXT_PUBLIC_USE_MOCK === "false" ? realApi : mockApi;
