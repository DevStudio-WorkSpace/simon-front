import { ScreenTickerItem } from '../../domain/models';

export const mockTickerItems: ScreenTickerItem[] = [
  {
    id: 'tick-1',
    type: 'urgente',
    text: 'OS-0152 · Jazmín · máquina parada · York atendiendo',
    origin: 'automatico',
    startsAt: '2026-11-25T00:00:00Z',
    endsAt: '2026-11-26T00:00:00Z',
    active: true,
  },
  {
    id: 'tick-2',
    type: 'alerta',
    text: 'OS-0157 · Quto · 16:00 sin técnico asignado',
    origin: 'automatico',
    startsAt: '2026-11-25T00:00:00Z',
    endsAt: '2026-11-26T00:00:00Z',
    active: true,
  },
  {
    id: 'tick-3',
    type: 'anuncio',
    text: '10:00 evaluación práctica de técnicos nuevos',
    origin: 'manual',
    startsAt: '2026-11-25T08:00:00Z',
    endsAt: '2026-11-25T18:00:00Z',
    active: true,
  },
  {
    id: 'tick-4',
    type: 'por_mejorar',
    text: '3 clientes por llamar (seguimiento)',
    origin: 'automatico',
    startsAt: '2026-11-25T00:00:00Z',
    endsAt: '2026-11-26T00:00:00Z',
    active: true,
  },
  {
    id: 'tick-5',
    type: 'logro',
    text: 'Meta del mes: 75% alcanzado',
    origin: 'manual',
    startsAt: '2026-11-25T00:00:00Z',
    endsAt: '2026-11-26T00:00:00Z',
    active: true,
  },
];
