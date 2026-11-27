'use client';

import React from 'react';
import { ScreenContainer } from '../presentation/components/layout/ScreenContainer';
import { SlideRenderer, getSlideTitle } from '../presentation/components/slides/SlideRenderer';
import { useScreenPlayerStore } from '../application/store/screenPlayerStore';

export default function HomePage() {
  const currentSlide = useScreenPlayerStore((state) => state.currentSlide);
  const title = getSlideTitle(currentSlide);

  return (
    <ScreenContainer title={title}>
      <SlideRenderer />
    </ScreenContainer>
  );
}
