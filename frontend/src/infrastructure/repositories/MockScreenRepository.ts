import { IScreenRepository } from '../../domain/repositories';
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
} from '../../domain/models';

import {
  mockServices,
  mockServicesMetrics,
  mockPunctuality,
  mockRanking,
  mockGoal,
  mockAnnouncement,
  mockActivities,
  mockTickerItems
} from '../mocks';
import { formatSimonDateTime } from '../../application/hooks/useCurrentDateTime';

export class MockScreenRepository implements IScreenRepository {
  private screenState: ScreenState = {
    currentSlide: 1,
    isPaused: false,
    totalSlides: 6,
    secondsPerSlide: 10,
    get lastUpdated() {
      return formatSimonDateTime(new Date());
    },
  };

  async getAllScreenData(screenCode: string): Promise<ScreenAllData> {
    return {
      screenState: { ...this.screenState },
      services: {
        metrics: mockServicesMetrics,
        items: mockServices,
      },
      punctuality: mockPunctuality,
      ranking: mockRanking,
      goal: mockGoal,
      announcement: mockAnnouncement,
      activities: mockActivities,
      tickerItems: mockTickerItems,
    };
  }

  async getScreenState(screenCode: string): Promise<ScreenState> {
    return { ...this.screenState };
  }

  async getServices(screenCode: string): Promise<{ metrics: ServicesMetrics; items: ServiceItem[] }> {
    return {
      metrics: mockServicesMetrics,
      items: mockServices,
    };
  }

  async getPunctuality(screenCode: string): Promise<PunctualityData> {
    return mockPunctuality;
  }

  async getRanking(screenCode: string): Promise<{ monthName: string; contributors: RankingContributor[] }> {
    return mockRanking;
  }

  async getGoal(screenCode: string): Promise<MonthlyGoalData> {
    return mockGoal;
  }

  async getAnnouncement(screenCode: string): Promise<AnnouncementData> {
    return mockAnnouncement;
  }

  async getActivities(screenCode: string): Promise<InternalActivitiesData> {
    return mockActivities;
  }

  async getTickerMessages(screenCode: string): Promise<ScreenTickerItem[]> {
    return mockTickerItems;
  }

  async sendOrder(
    screenCode: string, 
    action: 'anterior' | 'siguiente' | 'pausa' | 'play' | 'ir_a', 
    slideIndex?: number
  ): Promise<ScreenState> {
    switch (action) {
      case 'anterior':
        this.screenState.currentSlide = 
          this.screenState.currentSlide === 1 
            ? this.screenState.totalSlides 
            : this.screenState.currentSlide - 1;
        break;
      case 'siguiente':
        this.screenState.currentSlide = 
          this.screenState.currentSlide === this.screenState.totalSlides 
            ? 1 
            : this.screenState.currentSlide + 1;
        break;
      case 'pausa':
        this.screenState.isPaused = true;
        break;
      case 'play':
        this.screenState.isPaused = false;
        break;
      case 'ir_a':
        if (slideIndex && slideIndex >= 1 && slideIndex <= this.screenState.totalSlides) {
          this.screenState.currentSlide = slideIndex;
        }
        break;
    }
    return { ...this.screenState };
  }
}

