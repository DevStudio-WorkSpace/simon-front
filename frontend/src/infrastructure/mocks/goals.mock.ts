import { MonthlyGoalData } from '../../domain/models';

export const mockGoal: MonthlyGoalData = {
  monthName: 'noviembre',
  progressPercentage: 68,
  currentMilestone: 'Hito plata alcanzado',
  nextMilestone: 'Próximo hito: oro al 75%',
  milestones: [
    { level: 'bronce', label: 'Bronce 25%', percentage: 25, reached: true },
    { level: 'plata', label: 'Plata 50%', percentage: 50, reached: true },
    { level: 'oro', label: 'Oro 75%', percentage: 75, reached: false },
    { level: 'meta', label: 'Meta 100%', percentage: 100, reached: false },
  ],
};

