'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ServiceItem } from '../../../domain/models';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';
import { ServicesSlide } from './ServicesSlide';
import { PunctualitySlide } from './PunctualitySlide';
import { RankingSlide } from './RankingSlide';
import { GoalSlide } from './GoalSlide';
import { AnnouncementSlide } from './AnnouncementSlide';
import { ActivitiesSlide } from './ActivitiesSlide';

export function getSlideTitle(_slideIndex?: number): string {
  const store = useScreenPlayerStore.getState();
  const currentView = store.getCurrentView();
  if (currentView) return currentView.title;
  return 'SIMON';
}

export const SlideRenderer: React.FC = () => {
  const { data, getCurrentView, progressPercent, secondsPerSlide } = useScreenPlayerStore();
  const currentView = getCurrentView();
  const [serviceEdits, setServiceEdits] = useState<Partial<Record<string, ServiceItem>>>({});
  const [deletedServiceIds, setDeletedServiceIds] = useState<ReadonlySet<string>>(new Set());
  const isDemo = process.env.NEXT_PUBLIC_DATA_SOURCE !== 'api';
  const sourceServices = data?.services.items;
  const previousServices = useRef(sourceServices);

  useEffect(() => {
    const previous = previousServices.current;
    previousServices.current = sourceServices;
    if (!isDemo || !previous || !sourceServices || sourceServices === previous) return;
    const currentById = new Map(sourceServices.map((service) => [service.id, service]));
    const updated = previous.filter(
      (service) => JSON.stringify(service) !== JSON.stringify(currentById.get(service.id)),
    );
    if (!updated.length) return;

    // Leave local demo edits in place until the source changes that same row.
    setServiceEdits((edits) => {
      if (!updated.some(({ id }) => id in edits)) return edits;
      const current = { ...edits };
      for (const { id } of updated) delete current[id];
      return current;
    });
  }, [isDemo, sourceServices]);
  const editService = isDemo
    ? (service: ServiceItem) => setServiceEdits((edits) => ({ ...edits, [service.id]: service }))
    : undefined;

  const deleteService = isDemo
    ? (id: string) => setDeletedServiceIds((ids) => new Set(ids).add(id))
    : undefined;

  if (!data || !currentView) return null;

  switch (currentView.tipo) {
    case 'servicios':
      return (
        <ServicesSlide
          metrics={data.services.metrics}
          services={data.services.items}
          progressPercent={progressPercent}
          serviceEdits={serviceEdits}
          deletedServiceIds={deletedServiceIds}
          onEditService={editService}
          onDeleteService={deleteService}
        />
      );
    case 'puntualidad':
      return <PunctualitySlide data={data.punctuality} />;
    case 'ranking':
      return (
        <RankingSlide monthName={data.ranking.monthName} contributors={data.ranking.contributors} />
      );
    case 'meta':
      return <GoalSlide data={data.goal} />;
    case 'anuncio':
      return (
        <AnnouncementSlide
          announcements={data.announcements}
          progressPercent={progressPercent}
          secondsPerSlide={secondsPerSlide}
        />
      );
    case 'actividades':
      return <ActivitiesSlide data={data.activities} />;
    default:
      return (
        <ServicesSlide
          metrics={data.services.metrics}
          services={data.services.items}
          progressPercent={progressPercent}
          serviceEdits={serviceEdits}
          deletedServiceIds={deletedServiceIds}
          onEditService={editService}
          onDeleteService={deleteService}
        />
      );
  }
};
