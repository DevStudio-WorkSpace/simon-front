import { 
  ScreenAllData, 
  ScreenState, 
  ServiceItem, 
  ServicesMetrics, 
  PunctualityData, 
  RankingContributor, 
  MonthlyGoalData, 
  AnnouncementData, 
  InternalActivitiesData, 
  ScreenTickerItem 
} from '../models';

export interface IScreenRepository {
  getAllScreenData(screenCode: string): Promise<ScreenAllData>;
  getScreenState(screenCode: string): Promise<ScreenState>;
  getServices(screenCode: string): Promise<{ metrics: ServicesMetrics; items: ServiceItem[] }>;
  getPunctuality(screenCode: string): Promise<PunctualityData>;
  getRanking(screenCode: string): Promise<{ monthName: string; contributors: RankingContributor[] }>;
  getGoal(screenCode: string): Promise<MonthlyGoalData>;
  getAnnouncement(screenCode: string): Promise<AnnouncementData>;
  getActivities(screenCode: string): Promise<InternalActivitiesData>;
  getTickerMessages(screenCode: string): Promise<ScreenTickerItem[]>;
  sendOrder(screenCode: string, action: 'anterior' | 'siguiente' | 'pausa' | 'play' | 'ir_a', slideIndex?: number): Promise<ScreenState>;
}

