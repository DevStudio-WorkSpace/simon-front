import { InternalActivitiesData } from '../../domain/models';

export const mockActivities: InternalActivitiesData = {
  inProgressCount: 2,
  pausedByServiceCount: 1,
  readyForReviewCount: 1,
  activities: [
    {
      id: 'act-1',
      technicianName: 'Billy',
      activityTitle: 'Completar maletín 2',
      state: 'pausada_por_servicio',
      nextStep: 'Al quedar disponible: reponer puntas.',
    },
    {
      id: 'act-2',
      technicianName: 'Adriana',
      activityTitle: 'Actualizar guía de instalación',
      state: 'en_curso',
      nextStep: 'Añadir capturas del procedimiento.',
    },
    {
      id: 'act-3',
      technicianName: 'Darwin',
      activityTitle: 'Preparar equipo de demostración',
      state: 'en_curso',
      nextStep: 'Realizar prueba y registrar resultado.',
    },
    {
      id: 'act-4',
      technicianName: 'Jean',
      activityTitle: 'Clasificar repuestos',
      state: 'lista_para_revision',
      nextStep: 'Coordinadora: validar inventario.',
    },
  ],
  availableToTake: {
    title: 'revisar insumos del taller',
    requirement: 'según nivel y autorización',
  },
};

