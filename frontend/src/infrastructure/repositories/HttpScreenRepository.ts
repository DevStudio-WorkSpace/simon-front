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

/**
 * Concrete implementation for connecting to the future NestJS backend via HTTP REST / WebSocket.
 * In Sprint 1, if NEXT_PUBLIC_DATA_SOURCE=api is selected, it points to the API base URL.
 */
export class HttpScreenRepository implements IScreenRepository {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  }

  async getAllScreenData(screenCode: string): Promise<ScreenAllData> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/datos`);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} al consultar datos de pantalla ${screenCode}`);
    }
    return res.json();
  }

  async getScreenState(screenCode: string): Promise<ScreenState> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/estado`);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} al consultar estado de pantalla`);
    }
    return res.json();
  }

  async getServices(screenCode: string): Promise<{ metrics: ServicesMetrics; items: ServiceItem[] }> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/vistas/servicios`);
    if (!res.ok) throw new Error('Error al obtener servicios de la API');
    return res.json();
  }

  async getPunctuality(screenCode: string): Promise<PunctualityData> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/vistas/puntualidad`);
    if (!res.ok) throw new Error('Error al obtener puntualidad de la API');
    return res.json();
  }

  async getRanking(screenCode: string): Promise<{ monthName: string; contributors: RankingContributor[] }> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/vistas/ranking`);
    if (!res.ok) throw new Error('Error al obtener ranking de la API');
    return res.json();
  }

  async getGoal(screenCode: string): Promise<MonthlyGoalData> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/vistas/meta`);
    if (!res.ok) throw new Error('Error al obtener meta de la API');
    return res.json();
  }

  async getAnnouncement(screenCode: string): Promise<AnnouncementData> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/vistas/anuncio`);
    if (!res.ok) throw new Error('Error al obtener anuncio de la API');
    return res.json();
  }

  async getActivities(screenCode: string): Promise<InternalActivitiesData> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/vistas/actividades`);
    if (!res.ok) throw new Error('Error al obtener actividades de la API');
    return res.json();
  }

  async getTickerMessages(screenCode: string): Promise<ScreenTickerItem[]> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/marquesina`);
    if (!res.ok) throw new Error('Error al obtener marquesina de la API');
    return res.json();
  }

  async sendOrder(
    screenCode: string, 
    action: 'anterior' | 'siguiente' | 'pausa' | 'play' | 'ir_a', 
    slideIndex?: number
  ): Promise<ScreenState> {
    const res = await fetch(`${this.baseUrl}/pantallas/${screenCode}/ordenes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: action, vista: slideIndex }),
    });
    if (!res.ok) throw new Error('Error al enviar orden a la API');
    return res.json();
  }
}

