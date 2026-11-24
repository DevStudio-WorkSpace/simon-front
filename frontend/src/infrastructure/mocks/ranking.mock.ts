import { RankingContributor } from '../../domain/models';

export const mockRanking = {
  monthName: 'Noviembre',
  contributors: [
    {
      position: 1,
      technicianName: 'Billy',
      totalPoints: 1240,
      breakdown: {
        punctuality: 300,
        attendance: 220,
        training: 420,
        services: 300,
      },
      attitudeSubtotal: 520,
      aptitudeSubtotal: 720,
      dominantFactor: 'Capacitación',
      growthHighlight: {
        factor: 'Puntualidad',
        gain: 180,
      },
    },
    {
      position: 2,
      technicianName: 'Christian',
      totalPoints: 1180,
      breakdown: {
        punctuality: 160,
        attendance: 200,
        training: 520,
        services: 300,
      },
      attitudeSubtotal: 360,
      aptitudeSubtotal: 820,
      dominantFactor: 'Capacitación',
      growthHighlight: {
        factor: 'Servicios',
        gain: 120,
      },
    },
    {
      position: 3,
      technicianName: 'York',
      totalPoints: 1050,
      breakdown: {
        punctuality: 340,
        attendance: 240,
        training: 230,
        services: 240,
      },
      attitudeSubtotal: 580,
      aptitudeSubtotal: 470,
      dominantFactor: 'Puntualidad',
      growthHighlight: {
        factor: 'Capacitación',
        gain: 150,
      },
    },
  ] as RankingContributor[],
};

