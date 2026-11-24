import { IScreenRepository } from '../../domain/repositories';
import { MockScreenRepository } from './MockScreenRepository';
import { HttpScreenRepository } from './HttpScreenRepository';

/**
 * Factory pattern ensuring Dependency Inversion Principle (DIP).
 * Selects the repository implementation depending on NEXT_PUBLIC_DATA_SOURCE ('mock' vs 'api').
 */
export class ScreenRepositoryFactory {
  private static instance: IScreenRepository | null = null;

  public static getRepository(): IScreenRepository {
    if (!this.instance) {
      const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock';

      if (dataSource === 'api') {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.instance = new HttpScreenRepository(baseUrl);
      } else {
        this.instance = new MockScreenRepository();
      }
    }

    return this.instance;
  }

  /**
   * Allows overriding the repository instance (e.g. for unit tests or switching modes).
   */
  public static setRepository(customRepository: IScreenRepository): void {
    this.instance = customRepository;
  }
}

