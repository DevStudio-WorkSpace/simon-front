export type EstadoServicio =
  | "Por programar"
  | "Programado"
  | "En atención"
  | "En espera"
  | "Atendido";

export type Modalidad = "visita" | "remoto" | "taller";

export interface ServicioHoy {
  numero: string;
  prioridad: "Urgente" | "Normal";
  hora: string;
  tecnico: string;
  cliente: string;
  modalidad: Modalidad;
  servicio: string;
  maquina: string;
  estado: EstadoServicio;
  motivo_espera?: string;
}

export interface IndicadoresServicios {
  servicios_hoy: number;
  urgentes: number;
  atendiendo_ahora: number;
  sin_tecnico: number;
  por_llamar: number;
}

export interface PersonaPuntualidad {
  nombre: string;
  hora_llegada: string;
  llegada_tarde: boolean;
  minutos_tarde: number;
}

export interface SemanaTardanzas {
  etiqueta: string;
  minutos: number;
  actual: boolean;
}

export interface PuntualidadHoy {
  a_tiempo_hoy: number;
  total_hoy: number;
  tardanzas_hoy: number;
  personas: PersonaPuntualidad[];
  faltas_hoy: number;
  ultimas_semanas: SemanaTardanzas[];
  racha_puntualidad: number;
  meta_siguiente_dia: string;
  horario_meta: string;
}

export interface PersonaRanking {
  puesto: number;
  nombre: string;
  total: number;
  puntualidad: number;
  asistencia: number;
  capacitacion: number;
  servicios: number;
  mas_pesa: string;
  crecio: boolean;
}

export interface MetaMes {
  porcentaje: number;
  hito_alcanzado: string;
  proximo_hito: string;
}

export interface AnuncioHoy {
  id: string;
  fecha_o_hora: string;
  titulo: string;
  descripcion: string;
  responsables: string[];
}

export type TipoMensaje = "Urgente" | "Alerta" | "Anuncio" | "Por mejorar" | "Logro";

export interface MensajeMarquesina {
  tipo: TipoMensaje;
  texto: string;
}

export type EstadoActividad =
  | "Asignada"
  | "En curso"
  | "Pausada por servicio"
  | "Bloqueada"
  | "Lista para revisión"
  | "Validada";

export interface ActividadInterna {
  id: string;
  tecnico: string;
  actividad_interna: string;
  estado: EstadoActividad;
  siguiente_paso: string;
}

export interface ActividadDisponible {
  titulo: string;
  condicion: string;
}

export interface EstadoPantalla {
  codigo: string;
  vista_actual: number;
  reproduciendo: boolean;
  segundos_rotacion: number;
  ultima_actualizacion: string;
  servicios: ServicioHoy[];
  indicadores_servicios: IndicadoresServicios;
  puntualidad: PuntualidadHoy;
  ranking: PersonaRanking[];
  meta_mes: MetaMes;
  anuncios: AnuncioHoy[];
  mensajes: MensajeMarquesina[];
  actividades: ActividadInterna[];
  actividad_disponible: ActividadDisponible;
}
