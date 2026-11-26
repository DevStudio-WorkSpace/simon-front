import type { AnnouncementData } from '../../../domain/models';

interface AnnouncementSlideProps {
  announcements: AnnouncementData[];
  progressPercent: number;
  secondsPerSlide: number;
}

export function AnnouncementSlide({
  announcements,
  progressPercent,
  secondsPerSlide,
}: AnnouncementSlideProps) {
  const active = announcements.filter((announcement) => announcement.active);
  const elapsed = Math.min(100, Math.max(0, progressPercent)) / 100;
  const index = Math.min(active.length - 1, Math.floor(elapsed * active.length));
  const announcement = active[index];
  if (!announcement) {
    return (
      <p className="m-auto py-6 text-center text-lg text-slate-600">No hay anuncios vigentes.</p>
    );
  }
  const remaining = Math.max(
    0,
    Math.ceil(((index + 1) / active.length - elapsed) * secondsPerSlide),
  );

  return (
    <article className="mx-auto my-2 flex min-h-[320px] w-full flex-1 flex-col justify-between gap-4 rounded-r-xl border-l-4 border-blue-600 bg-blue-50/90 p-5 sm:px-7 sm:py-5 xl:gap-8 xl:px-12 xl:py-8">
      <div className="flex items-center justify-between gap-4 text-blue-700">
        <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold xl:text-lg">
          {announcement.timeTag}
        </span>
        <span
          className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-lg font-extrabold tabular-nums xl:h-14 xl:w-14 xl:text-2xl"
          aria-label="Segundos para el siguiente anuncio"
        >
          {remaining}
        </span>
      </div>
      <div className="max-w-4xl space-y-3 xl:space-y-4">
        <h2 className="max-w-[23ch] break-words text-3xl leading-tight font-extrabold md:text-4xl xl:text-6xl">
          {announcement.title}
        </h2>
        <p className="max-w-[42ch] break-words text-base text-slate-600 md:text-xl xl:text-3xl">
          {announcement.description}
        </p>
      </div>
      <p className="border-t border-blue-100 pt-2.5 text-sm font-bold text-blue-700 md:text-base xl:pt-4 xl:text-2xl">
        Guías: {announcement.responsibleGuides.join(', ')}
      </p>
    </article>
  );
}
