import { PunctualityData } from '../../domain/models';

export const mockPunctuality: PunctualityData = {
  onTimeCount: 8,
  totalTeamCount: 10,
  tardinessCountToday: 2,
  totalTardinessMinutes: 47,
  anonymousTardinessBadge: 2,
  lateArrivalsList: [
    { id: 'late-1', technicianName: 'Pedro Quispe (Técnico Nivel 1)', arrivalTime: '09:18', minutesLate: 13 },
    { id: 'late-2', technicianName: 'Lucas Morales (Técnico Nivel 2)', arrivalTime: '09:39', minutesLate: 34 },
  ],
  onTimeList: [
    { position: 1, technicianName: 'Billy', arrivalTime: '8:41' },
    { position: 2, technicianName: 'York', arrivalTime: '8:47' },
    { position: 3, technicianName: 'Jean', arrivalTime: '8:52' },
    { position: 4, technicianName: 'Christian', arrivalTime: '8:55' },
    { position: 5, technicianName: 'Adriana', arrivalTime: '8:57' },
    { position: 6, technicianName: 'Fabián', arrivalTime: '8:59' },
    { position: 7, technicianName: 'Darwin', arrivalTime: '9:02' },
    { position: 8, technicianName: 'Héctor', arrivalTime: '9:04' },
  ],
  weeklyTardinessHistory: [
    { weekLabel: '12 oct', count: 18 },
    { weekLabel: '19 oct', count: 15 },
    { weekLabel: '26 oct', count: 14 },
    { weekLabel: '2 nov', count: 9 },
    { weekLabel: '9 nov', count: 5, isCurrentWeek: true },
  ],
  longestStreak: {
    technicianName: 'Billy',
    consecutiveDays: 12,
  },
  improvementNotice: {
    targetTardiness: 0,
    entryTime: '9:00',
    toleranceTime: '9:05',
  },
};
