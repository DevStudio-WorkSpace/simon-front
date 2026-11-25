'use client';

import React from 'react';
import { ScreenContainer } from '../presentation/components/layout/ScreenContainer';
import { SlideRenderer, getSlideTitle } from '../presentation/components/slides/SlideRenderer';
import { useScreenPlayerStore } from '../application/store/screenPlayerStore';

export default function HomePage() {
  const { currentSlide } = useScreenPlayerStore();
  const title = getSlideTitle(currentSlide);

  return (
    <ScreenContainer title={title}>
      <SlideRenderer />
    </ScreenContainer>
  );
}
