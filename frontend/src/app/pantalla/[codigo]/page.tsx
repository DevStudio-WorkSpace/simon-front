'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ScreenContainer } from '../../../presentation/components/layout/ScreenContainer';
import { SlideRenderer } from '../../../presentation/components/slides/SlideRenderer';
import { useScreenPlayerStore } from '../../../application/store/screenPlayerStore';

export default function PantallaPage() {
  const params = useParams();
  const screenCode = (params?.codigo as string) || 'TV-SALA-01';
  const { getCurrentView } = useScreenPlayerStore();
  const currentView = getCurrentView();
  const title = currentView?.title || 'SIMON';

  return (
    <ScreenContainer title={title}>
      <SlideRenderer />
    </ScreenContainer>
  );
}
