export type ServicePriority = 'urgente' | 'programado';
export type ServiceState = 'atendiendo' | 'programado' | 'espera_repuesto' | 'sin_tecnico' | 'terminado';
export type ServiceModality = 'visita' | 'remoto' | 'taller';

export type ActivityState = 
  | 'asignada' 
  | 'en_curso' 
  | 'pausada_por_servicio' 
  | 'bloqueada' 
  | 'lista_para_revision' 
  | 'validada';

export type TickerMessageType = 'urgente' | 'alerta' | 'anuncio' | 'por_mejorar' | 'logro';

export interface ServiceItem {
  id: string;
  orderNumber: string;        // ej. "#0151"
  priority: ServicePriority;
  time: string;               // ej. "09:30"
  technicianName: string;     // ej. "Héctor"
  clientName: string;         // ej. "Antony"
  modality: ServiceModality;
  serviceDescription: string; // ej. "Perfil desde cero"
  machineModel: string;       // ej. "Sublimación"
  state: ServiceState;
  waitReason?: string;        // ej. "Espera repuesto"
}

export interface ServicesMetrics {
  totalToday: number;
  urgentCount: number;
  inProgressCount: number;
  unassignedCount: number;
  pendingFollowupCount: number;
}

export interface OnTimeRecord {
  position: number;
  technicianName: string;
  arrivalTime: string;
}

export interface WeeklyTardiness {
  weekLabel: string;
  count: number;
  isCurrentWeek?: boolean;
}

export interface LateArrivalRecord {
  id: string;
  technicianName: string;
  arrivalTime: string;
  minutesLate: number;
}

export interface PunctualityData {
  onTimeCount: number;
  totalTeamCount: number;
  tardinessCountToday: number;
  totalTardinessMinutes: number;
  onTimeList: OnTimeRecord[];
  weeklyTardinessHistory: WeeklyTardiness[];
  anonymousTardinessBadge: number; // ej. 2 (representado como +2 sin nombres)
  lateArrivalsList?: LateArrivalRecord[];
  longestStreak: {
    technicianName: string;
    consecutiveDays: number;
  };
  improvementNotice: {
    targetTardiness: number;
    entryTime: string;
    toleranceTime: string;
  };
}

export interface RankingContributor {
  position: 1 | 2 | 3;
  technicianName: string;
  totalPoints: number;
  breakdown: {
    punctuality: number;
    attendance: number;
    training: number;
    services: number;
  };
  attitudeSubtotal: number;    // Puntualidad + Asistencia
  aptitudeSubtotal: number;    // Capacitación + Servicios
  dominantFactor: string;      // ej. "Capacitación"
  growthHighlight: {
    factor: string;
    gain: number;              // ej. 180
  };
}

export interface MonthlyGoalMilestone {
  level: 'bronce' | 'plata' | 'oro' | 'meta';
  label: string;
  percentage: number;
  reached: boolean;
}

export interface MonthlyGoalData {
  monthName: string;
  progressPercentage: number;
  currentMilestone: string;
  nextMilestone: string;
  milestones: MonthlyGoalMilestone[];
}

export interface AnnouncementData {
  timeTag: string;
  title: string;
  description: string;
  responsibleGuides: string[];
  remainingSeconds?: number;
}

export interface InternalActivityItem {
  id: string;
  technicianName: string;
  activityTitle: string;
  state: ActivityState;
  nextStep: string;
}

export interface InternalActivitiesData {
  inProgressCount: number;
  pausedByServiceCount: number;
  readyForReviewCount: number;
  activities: InternalActivityItem[];
  availableToTake: {
    title: string;
    requirement: string;
  };
}

export interface ScreenTickerItem {
  id: string;
  type: TickerMessageType;
  text: string;
}

export interface ScreenState {
  currentSlide: number; // 1 to 6
  isPaused: boolean;
  totalSlides: number;
  secondsPerSlide: number;
  lastUpdated: string;
}

export interface ScreenAllData {
  screenState: ScreenState;
  services: {
    metrics: ServicesMetrics;
    items: ServiceItem[];
  };
  punctuality: PunctualityData;
  ranking: {
    monthName: string;
    contributors: RankingContributor[];
  };
  goal: MonthlyGoalData;
  announcement: AnnouncementData;
  activities: InternalActivitiesData;
  tickerItems: ScreenTickerItem[];
}

export type SlideViewType = 'servicios' | 'puntualidad' | 'ranking' | 'meta' | 'anuncio' | 'actividades';

export interface SlideViewConfig {
  id: number;
  tipo: SlideViewType;
  title: string;
  order: number;
  seconds: number;
  active: boolean;
}

export const DEFAULT_VIEWS_CONFIG: SlideViewConfig[] = [
  { id: 1, tipo: 'servicios', title: 'Servicios de hoy', order: 1, seconds: 10, active: true },
  { id: 2, tipo: 'puntualidad', title: 'Puntualidad de hoy', order: 2, seconds: 10, active: true },
  { id: 3, tipo: 'ranking', title: 'Ranking del mes', order: 3, seconds: 10, active: true },
  { id: 4, tipo: 'meta', title: 'Meta del mes', order: 4, seconds: 10, active: true },
  { id: 5, tipo: 'anuncio', title: 'Anuncio de hoy', order: 5, seconds: 10, active: true },
  { id: 6, tipo: 'actividades', title: 'Actividades internas', order: 6, seconds: 10, active: true },
];

