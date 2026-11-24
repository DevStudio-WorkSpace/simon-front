"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { pantallaApi } from "@/lib/api";
import type { EstadoActividad, EstadoPantalla, MensajeMarquesina, TipoMensaje } from "@/types/pantalla";

const codigo = "sala";

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(process.env.NEXT_PUBLIC_USE_MOCK !== "false");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [estado, setEstado] = useState<EstadoPantalla | null>(null);
  const [nuevoTipo, setNuevoTipo] = useState<TipoMensaje>("Anuncio");
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [nuevoInicio, setNuevoInicio] = useState("");
  const [nuevoFin, setNuevoFin] = useState("");
  const [porcentajeMeta, setPorcentajeMeta] = useState("75");
  const [actividadEstado, setActividadEstado] = useState<EstadoActividad>("En curso");
  const [bitacoraQueHizo, setBitacoraQueHizo] = useState("");
  const [bitacoraPendiente, setBitacoraPendiente] = useState("");
  const [bitacoraMotivo, setBitacoraMotivo] = useState("");
  const [bitacoraSiguiente, setBitacoraSiguiente] = useState("");
  const [bitacoras, setBitacoras] = useState<string[]>([]);

  useEffect(() => {
    let activo = true;
    void pantallaApi.obtenerEstado(codigo).then((actual) => {
      if (activo) setEstado(actual);
    });
    const cancelar = pantallaApi.suscribirse(codigo, (actual) => {
      if (activo) setEstado(actual);
    });
    return () => {
      activo = false;
      cancelar();
    };
  }, []);

  async function iniciarSesion(evento: FormEvent) {
    evento.preventDefault();
    setError("");
    if (process.env.NEXT_PUBLIC_USE_MOCK !== "false") {
      setAutenticado(true);
      return;
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setError("Falta configurar Supabase.");
      return;
    }
    const supabase = createClient(url, key);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) setError(loginError.message);
    else setAutenticado(true);
  }

  async function enviarOrden(accion: "anterior" | "siguiente" | "pausa" | "play" | "ir_a", vista?: number) {
    await pantallaApi.enviarOrden(codigo, accion, vista);
  }

  async function guardarMensaje(evento: FormEvent) {
    evento.preventDefault();
    if (!estado || !nuevoMensaje.trim()) return;
    const mensaje: MensajeMarquesina = { tipo: nuevoTipo, texto: nuevoMensaje.trim() };
    await pantallaApi.actualizarEstado(codigo, { mensajes: [...estado.mensajes, mensaje] });
    setNuevoMensaje("");
  }

  async function guardarMeta(evento: FormEvent) {
    evento.preventDefault();
    if (!estado) return;
    const porcentaje = Math.min(100, Math.max(0, Number(porcentajeMeta)));
    await pantallaApi.actualizarEstado(codigo, {
      meta_mes: {
        ...estado.meta_mes,
        porcentaje,
      },
    });
  }

  async function cambiarActividad() {
    if (!estado) return;
    if (
      !bitacoraQueHizo.trim() ||
      !bitacoraPendiente.trim() ||
      !bitacoraSiguiente.trim() ||
      (["Pausada por servicio", "Bloqueada"].includes(actividadEstado) && !bitacoraMotivo.trim())
    ) {
      setError("Para cambiar el estado se requiere registrar qué hizo, qué quedó pendiente, siguiente paso y motivo cuando corresponda.");
      return;
    }
    const seleccionada = estado.actividades.find((actividad) => actividad.estado !== "Validada");
    if (!seleccionada) return;
    setError("");
    const registro = `${seleccionada.tecnico}: ${actividadEstado}. Qué hizo: ${bitacoraQueHizo}. Pendiente: ${bitacoraPendiente}. Motivo: ${bitacoraMotivo || "No aplica"}. Siguiente paso: ${bitacoraSiguiente}`;
    setBitacoras((actual) => [registro, ...actual]);
    await pantallaApi.actualizarEstado(codigo, {
      actividades: estado.actividades.map((actividad) =>
        actividad.id === seleccionada.id
          ? { ...actividad, estado: actividadEstado, siguiente_paso: bitacoraSiguiente }
          : actividad,
      ),
    });
  }

  if (!autenticado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <form onSubmit={iniciarSesion} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-[var(--magenta)]">Administrador SIMON</h1>
          <label className="mt-6 block">Correo<input className="mt-2 w-full rounded border p-3" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="mt-4 block">Contraseña<input type="password" className="mt-2 w-full rounded border p-3" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
          <button className="mt-6 w-full rounded bg-[var(--magenta)] p-3 font-bold text-white">Ingresar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--magenta)]">Administrador SIMON</h1>
        {estado && (
          <strong>{estado.reproduciendo ? "▶ Reproduciendo" : "Ⅱ Pausado"} · Vista {estado.vista_actual}/6</strong>
        )}
      </header>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Control de pantalla</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded border px-4 py-3" onClick={() => enviarOrden("anterior")}>Anterior</button>
            <button className="rounded border px-4 py-3" onClick={() => enviarOrden(estado?.reproduciendo ? "pausa" : "play")}>
              {estado?.reproduciendo ? "Pausar" : "Reproducir"}
            </button>
            <button className="rounded border px-4 py-3" onClick={() => enviarOrden("siguiente")}>Siguiente</button>
          </div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((vista) => (
              <button key={vista} className="rounded border px-3 py-2" onClick={() => enviarOrden("ir_a", vista)}>{vista}</button>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Vistas activas y rotación</h2>
          <label className="mt-4 block">Segundos
            <input type="number" min="1" className="ml-3 rounded border p-2" defaultValue={estado?.segundos_rotacion || 10} onBlur={(e) => pantallaApi.actualizarEstado(codigo, { segundos_rotacion: Number(e.target.value) })} />
          </label>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Mensaje de marquesina</h2>
          <form onSubmit={guardarMensaje} className="mt-4 grid gap-3">
            <select className="rounded border p-2" value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value as TipoMensaje)}>
              {["Urgente", "Alerta", "Anuncio", "Por mejorar", "Logro"].map((tipo) => <option key={tipo}>{tipo}</option>)}
            </select>
            <input className="rounded border p-2" placeholder="Texto" value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)} />
            <input type="datetime-local" className="rounded border p-2" value={nuevoInicio} onChange={(e) => setNuevoInicio(e.target.value)} />
            <input type="datetime-local" className="rounded border p-2" value={nuevoFin} onChange={(e) => setNuevoFin(e.target.value)} />
            <button className="rounded bg-blue-600 p-3 font-bold text-white">Guardar mensaje</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Meta del mes</h2>
          <form onSubmit={guardarMeta} className="mt-4 flex gap-3">
            <input type="number" min="0" max="100" className="w-32 rounded border p-2" value={porcentajeMeta} onChange={(e) => setPorcentajeMeta(e.target.value)} />
            <button className="rounded bg-green-600 px-4 py-2 font-bold text-white">Actualizar</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow xl:col-span-2">
          <h2 className="text-xl font-bold">Actividades internas</h2>
          {error && <p role="alert" className="mt-3 text-red-700">{error}</p>}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select className="rounded border p-3" value={actividadEstado} onChange={(e) => setActividadEstado(e.target.value as EstadoActividad)}>
              {["Asignada", "En curso", "Pausada por servicio", "Bloqueada", "Lista para revisión", "Validada"].map((estadoActividad) => (
                <option key={estadoActividad}>{estadoActividad}</option>
              ))}
            </select>
            <input className="rounded border p-3" placeholder="Qué hizo" value={bitacoraQueHizo} onChange={(e) => setBitacoraQueHizo(e.target.value)} />
            <input className="rounded border p-3" placeholder="Qué quedó pendiente" value={bitacoraPendiente} onChange={(e) => setBitacoraPendiente(e.target.value)} />
            <input className="rounded border p-3" placeholder="Motivo si pausa o bloquea" value={bitacoraMotivo} onChange={(e) => setBitacoraMotivo(e.target.value)} />
            <input className="rounded border p-3" placeholder="Siguiente paso" value={bitacoraSiguiente} onChange={(e) => setBitacoraSiguiente(e.target.value)} />
            <button type="button" className="rounded bg-[var(--magenta)] p-3 font-bold text-white" onClick={cambiarActividad}>Cambiar estado con bitácora</button>
          </div>
          <div className="mt-6">
            <h3 className="font-bold">Bitácora completa</h3>
            {bitacoras.map((registro, indice) => <p key={`${registro}-${indice}`} className="mt-2 border-b pb-2">{registro}</p>)}
          </div>
        </section>
      </div>
    </main>
  );
}
