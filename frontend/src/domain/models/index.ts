export type ServicePriority = 'urgente' | 'programado';
export type ServiceState =
  'atendiendo' | 'programado' | 'espera_repuesto' | 'sin_tecnico' | 'terminado';
export type ServiceModality = 'visita' | 'remoto' | 'taller';

export type ActivityState =
  | 'asignada'
  | 'en_curso'
  | 'pausada_por_servicio'
  | 'bloqueada'
  | 'lista_para_revision'
  | 'validada';

export type ActivityLogAction =
  'inicio' | 'avance' | 'pausa' | 'retoma' | 'bloqueo' | 'entrega' | 'validacion';

export type TickerMessageType = 'urgente' | 'alerta' | 'anuncio' | 'por_mejorar' | 'logro';
export type TickerOrigin = 'manual' | 'automatico';
export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

export interface ServiceItem {
  id: string;
  orderNumber: string;
  priority: ServicePriority;
  time: string;
  technicianName: string;
  clientName: string;
  modality: ServiceModality;
  serviceDescription: string;
  machineModel: string;
  state: ServiceState;
  waitReason?: string;
  closed: boolean;
  cancelled: boolean;
}

export interface ServicesMetrics {
  totalToday: number;
  urgentCount: number;
  inProgressCount: number;
  unassignedCount: number;
  pendingFollowupCount: number;
}

export interface ServicesData {
  metrics: ServicesMetrics;
  items: ServiceItem[];
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
  anonymousTardinessBadge: number;
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
  attitudeSubtotal: number;
  aptitudeSubtotal: number;
  dominantFactor: string;
  growthHighlight: {
    factor: string;
    gain: number;
  };
}

export interface RankingData {
  monthName: string;
  contributors: RankingContributor[];
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
  id: string;
  timeTag: string;
  title: string;
  description: string;
  responsibleGuides: string[];
  remainingSeconds?: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface InternalActivityItem {
  id: string;
  technicianName: string;
  activityTitle: string;
  state: ActivityState;
  nextStep: string;
}

export interface ActivityLogEntry {
  id: string;
  activityId: string;
  authorName: string;
  action: ActivityLogAction;
  whatDidYouDo: string;
  pending: string;
  reason?: string;
  nextStep: string;
  createdAt: string;
}

export interface InternalActivitiesData {
  inProgressCount: number;
  pausedByServiceCount: number;
  readyForReviewCount: number;
  activities: InternalActivityItem[];
  activityLog: ActivityLogEntry[];
  availableToTake: {
    title: string;
    requirement: string;
  };
}

export interface ScreenTickerItem {
  id: string;
  type: TickerMessageType;
  text: string;
  origin: TickerOrigin;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface ScreenSyncStatus {
  connection: ConnectionStatus;
  lastDataAt: string;
  lastErrorAt?: string;
  retryCount: number;
}

export interface ScreenState {
  currentSlide: number;
  isPaused: boolean;
  totalSlides: number;
  secondsPerSlide: number;
  lastUpdated: string;
  lastDataAt: string;
  connectionStatus: ConnectionStatus;
}

export interface ScreenAllData {
  screenState: ScreenState;
  services: ServicesData;
  punctuality: PunctualityData;
  ranking: RankingData;
  goal: MonthlyGoalData;
  announcement: AnnouncementData;
  announcements: AnnouncementData[];
  activities: InternalActivitiesData;
  tickerItems: ScreenTickerItem[];
  lastDataAt: string;
  syncStatus: ScreenSyncStatus;
}

export interface RealtimeConnectionOptions {
  pollIntervalMs: number;
  initialRetryDelayMs: number;
  maxRetryDelayMs: number;
  backoffFactor: number;
  maxRetries?: number;
}

export const DEFAULT_REALTIME_OPTIONS: RealtimeConnectionOptions = {
  pollIntervalMs: 1000,
  initialRetryDelayMs: 1000,
  maxRetryDelayMs: 30000,
  backoffFactor: 2,
  maxRetries: 10,
};

export interface ScreenDataUpdate {
  screenState?: Partial<ScreenState>;
  services?: Partial<ServicesData>;
  punctuality?: Partial<PunctualityData>;
  ranking?: Partial<RankingData>;
  goal?: Partial<MonthlyGoalData>;
  announcement?: Partial<AnnouncementData>;
  announcements?: AnnouncementData[];
  activities?: Partial<InternalActivitiesData>;
  tickerItems?: ScreenTickerItem[];
}

export type SlideViewType =
  'servicios' | 'puntualidad' | 'ranking' | 'meta' | 'anuncio' | 'actividades';

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
  {
    id: 6,
    tipo: 'actividades',
    title: 'Actividades internas',
    order: 6,
    seconds: 10,
    active: true,
  },
];
