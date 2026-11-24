import { createClient } from "@supabase/supabase-js";
import type { EstadoPantalla } from "@/types/pantalla";
import type { AccionPantalla, PantallaApi } from "./index";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const realApi: PantallaApi = {
  async obtenerEstado(codigo: string) {
    if (!supabase) throw new Error("Supabase no está configurado");
    const { data, error } = await supabase
      .from("pantallas_estado")
      .select("*")
      .eq("codigo", codigo)
      .single();
    if (error) throw error;
    return data as EstadoPantalla;
  },
  async enviarOrden(codigo: string, accion: AccionPantalla, vista?: number) {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) throw new Error("NEXT_PUBLIC_API_URL no está configurado");
    const respuesta = await fetch(`${url}/pantallas/${codigo}/ordenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, vista }),
    });
    if (!respuesta.ok) throw new Error("No se pudo enviar la orden");
  },
  suscribirse(codigo: string, callback: (estado: EstadoPantalla) => void) {
    if (!supabase) return () => undefined;

    const canal = supabase
      .channel(`pantalla-${codigo}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pantallas_estado",
          filter: `codigo=eq.${codigo}`,
        },
        (payload) => callback(payload.new as EstadoPantalla),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(canal);
    };
  },
};
