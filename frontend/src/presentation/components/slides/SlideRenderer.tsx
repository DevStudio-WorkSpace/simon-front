'use client';

import React from 'react';
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
  const { data, getCurrentView } = useScreenPlayerStore();
  const currentView = getCurrentView();

  if (!data || !currentView) return null;

  switch (currentView.tipo) {
    case 'servicios':
      return <ServicesSlide metrics={data.services.metrics} services={data.services.items} />;
    case 'puntualidad':
      return <PunctualitySlide data={data.punctuality} />;
    case 'ranking':
      return (
        <RankingSlide monthName={data.ranking.monthName} contributors={data.ranking.contributors} />
      );
    case 'meta':
      return <GoalSlide data={data.goal} />;
    case 'anuncio':
      return <AnnouncementSlide data={data.announcement} />;
    case 'actividades':
      return <ActivitiesSlide data={data.activities} />;
    default:
      return <ServicesSlide metrics={data.services.metrics} services={data.services.items} />;
  }
};
