import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockAnnouncement } from '../../../infrastructure/mocks/announcements.mock';
import { mockServices, mockServicesMetrics } from '../../../infrastructure/mocks/services.mock';
import { AnnouncementSlide } from './AnnouncementSlide';
import { ServicesSlide } from './ServicesSlide';

describe('Vistas de TV', () => {
  it('pagina los servicios de nueve en nueve y deja el terminado al final', () => {
    const extra = {
      ...mockServices[2],
      id: 'test-service',
      orderNumber: '#9999',
      time: '08:00',
    };
    const services = [extra, ...mockServices];
    const { rerender } = render(
      <ServicesSlide metrics={mockServicesMetrics} services={services} progressPercent={0} />,
    );

    const table = within(screen.getByRole('table'));
    expect(table.getAllByRole('row')).toHaveLength(10);
    expect(table.getAllByRole('row')[1]).toHaveTextContent('#0151');
    expect(screen.getByText('Página 1/2')).toBeInTheDocument();
    expect(table.queryByText('Terminado')).not.toBeInTheDocument();

    rerender(
      <ServicesSlide metrics={mockServicesMetrics} services={services} progressPercent={50} />,
    );

    expect(screen.getByText('Página 2/2')).toBeInTheDocument();
    expect(table.getAllByRole('row')).toHaveLength(2);
    expect(table.getByText('Terminado')).toBeInTheDocument();
  });

  it('alterna anuncios activos dentro del tiempo de la vista', () => {
    const other = { ...mockAnnouncement, id: 'other', title: 'Preparación del taller' };
    const announcements = [
      mockAnnouncement,
      { ...mockAnnouncement, id: 'inactive', title: 'Oculto', active: false },
      other,
    ];
    const { rerender } = render(
      <AnnouncementSlide announcements={announcements} progressPercent={0} secondsPerSlide={10} />,
    );

    expect(screen.getByRole('heading', { name: mockAnnouncement.title })).toBeInTheDocument();
    expect(screen.getByLabelText('Segundos para el siguiente anuncio')).toHaveTextContent('5');

    rerender(
      <AnnouncementSlide announcements={announcements} progressPercent={60} secondsPerSlide={10} />,
    );

    expect(screen.getByRole('heading', { name: other.title })).toBeInTheDocument();
    expect(screen.getByLabelText('Segundos para el siguiente anuncio')).toHaveTextContent('4');
  });
});
