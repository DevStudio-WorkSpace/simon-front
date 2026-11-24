export function siguienteVista(vistaActual: number): number {
  return vistaActual === 6 ? 1 : vistaActual + 1;
}

export function vistaAnterior(vistaActual: number): number {
  return vistaActual === 1 ? 6 : vistaActual - 1;
}

export function segundosRotacion(segundos?: number): number {
  return segundos && segundos > 0 ? segundos : 10;
}
