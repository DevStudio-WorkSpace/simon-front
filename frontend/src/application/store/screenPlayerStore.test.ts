import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScreenPlayerStore } from './screenPlayerStore';

describe('Reloj de rotación de TV', () => {
  afterEach(() => {
    useScreenPlayerStore.setState(useScreenPlayerStore.getInitialState());
    vi.restoreAllMocks();
  });

  it('mide el tiempo real, respeta las pausas superpuestas y reinicia al cambiar de vista', () => {
    const clock = vi.spyOn(performance, 'now').mockReturnValue(0);
    const { goToSlide, tick, setPause, setEditingServices } = useScreenPlayerStore.getState();
    useScreenPlayerStore.setState({ isLoading: false });
    goToSlide(1);
    const duration = useScreenPlayerStore.getState().secondsPerSlide * 1000;

    clock.mockReturnValue(duration / 4);
    tick();
    expect(useScreenPlayerStore.getState().progressPercent).toBe(25);

    clock.mockReturnValue(duration / 2);
    setEditingServices(true);
    setPause(true);
    clock.mockReturnValue(duration);
    setEditingServices(false);
    tick();
    expect(useScreenPlayerStore.getState().progressPercent).toBe(50);
    expect(useScreenPlayerStore.getState().currentSlide).toBe(1);

    setPause(false);
    clock.mockReturnValue(1.5 * duration - 1);
    tick();
    expect(useScreenPlayerStore.getState().currentSlide).toBe(1);

    clock.mockReturnValue(1.5 * duration);
    tick();
    expect(useScreenPlayerStore.getState().currentSlide).toBe(2);
    expect(useScreenPlayerStore.getState().progressPercent).toBe(0);
  });

  it('reinicia el progreso al volver a la misma vista mientras sigue pausada', () => {
    const clock = vi.spyOn(performance, 'now').mockReturnValue(0);
    const { goToSlide, setPause, tick } = useScreenPlayerStore.getState();
    useScreenPlayerStore.setState({ isLoading: false });
    goToSlide(1);
    clock.mockReturnValue(2000);
    setPause(true);
    expect(useScreenPlayerStore.getState().progressPercent).toBeGreaterThan(0);

    goToSlide(1);
    clock.mockReturnValue(5000);
    tick();
    expect(useScreenPlayerStore.getState().rotationClock.startedAt).toBeNull();
    expect(useScreenPlayerStore.getState().progressPercent).toBe(0);
  });
});
