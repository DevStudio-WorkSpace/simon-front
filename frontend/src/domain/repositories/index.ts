import {
  ActivityLogEntry,
  AnnouncementData,
  InternalActivitiesData,
  MonthlyGoalData,
  PunctualityData,
  RankingData,
  RealtimeConnectionOptions,
  ScreenAllData,
  ScreenDataUpdate,
  ScreenState,
  ScreenSyncStatus,
  ScreenTickerItem,
  ServicesData,
} from '../models';

export type ScreenStateListener = (state: ScreenState) => void;
export type ScreenConnectionErrorListener = (error: Error) => void;
export type Unsubscribe = () => void;

export interface IScreenRepository {
  getAllScreenData(screenCode: string): Promise<ScreenAllData>;
  getScreenState(screenCode: string): Promise<ScreenState>;
  getSyncStatus(screenCode: string): Promise<ScreenSyncStatus>;
  getServices(screenCode: string): Promise<ServicesData>;
  getPunctuality(screenCode: string): Promise<PunctualityData>;
  getRanking(screenCode: string): Promise<RankingData>;
  getGoal(screenCode: string): Promise<MonthlyGoalData>;
  getAnnouncement(screenCode: string): Promise<AnnouncementData>;
  getAnnouncements(screenCode: string): Promise<AnnouncementData[]>;
  getActivities(screenCode: string): Promise<InternalActivitiesData>;
  getActivityLog(screenCode: string, activityId?: string): Promise<ActivityLogEntry[]>;
  getTickerMessages(screenCode: string): Promise<ScreenTickerItem[]>;
  sendOrder(
    screenCode: string,
    action: 'anterior' | 'siguiente' | 'pausa' | 'play' | 'ir_a',
    slideIndex?: number,
  ): Promise<ScreenState>;
  subscribeToScreenState(
    screenCode: string,
    onState: ScreenStateListener,
    onError?: ScreenConnectionErrorListener,
    options?: RealtimeConnectionOptions,
  ): Unsubscribe;
  updateScreenData(screenCode: string, patch: ScreenDataUpdate): Promise<ScreenAllData>;
}
