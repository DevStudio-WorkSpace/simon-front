import { ScreenTickerItem } from '../../domain/models';

export const mockTickerItems: ScreenTickerItem[] = [
  {
    id: 'tick-1',
    type: 'urgente',
    text: 'OS-0152 · Jazmín · máquina parada · York atendiendo',
  },
  {
    id: 'tick-2',
    type: 'alerta',
    text: 'OS-0157 · Quto · 16:00 sin técnico asignado',
  },
  {
    id: 'tick-3',
    type: 'anuncio',
    text: '10:00 evaluación práctica de técnicos nuevos',
  },
  {
    id: 'tick-4',
    type: 'por_mejorar',
    text: '3 clientes por llamar (seguimiento)',
  },
];

