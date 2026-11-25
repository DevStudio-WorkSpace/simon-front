import { AnnouncementData } from '../../domain/models';

export const mockAnnouncement: AnnouncementData = {
  id: 'anuncio-1',
  timeTag: 'Hoy · 10:00',
  title: 'Evaluación práctica de técnicos nuevos',
  description: 'Piezas, conexión del sistema de tinta y perfilación',
  responsibleGuides: ['Billy', 'Christian', 'Darwin', 'York'],
  remainingSeconds: 10,
  startsAt: '2026-11-25T08:00:00Z',
  endsAt: '2026-11-25T18:00:00Z',
  active: true,
};

export const mockAnnouncements: AnnouncementData[] = [
  mockAnnouncement,
  {
    id: 'anuncio-2',
    timeTag: 'Mañana · 09:00',
    title: 'Revisión de inventario de repuestos',
    description: 'Traer el listado de puntas y conexiones pendientes',
    responsibleGuides: ['Coordinación'],
    startsAt: '2026-11-26T08:00:00Z',
    endsAt: '2026-11-26T18:00:00Z',
    active: false,
  },
];
