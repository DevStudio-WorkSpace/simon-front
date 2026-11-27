import type { ServicesData } from '../../domain/models';
import fixture from '../../../public/demo/services.json';

const services = fixture as ServicesData;

export const mockServicesMetrics = services.metrics;
export const mockServices = services.items;
