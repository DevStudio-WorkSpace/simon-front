import type { PunctualityData } from '../../../domain/models';

const positions = [
  'bg-amber-100 text-amber-900',
  'bg-slate-200 text-slate-800',
  'bg-orange-100 text-orange-900',
];

export function PunctualitySlide({ data }: { data: PunctualityData }) {
  const weeks = data.weeklyTardinessHistory.slice(-3);
  const maxTardiness = Math.max(1, ...weeks.map((week) => week.count));

  return (
    <section className="grid w-full gap-2.5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-5">
      <div className="rounded-lg bg-slate-100/75 p-3 xl:p-5">
        <h2 className="mb-2 text-lg font-extrabold xl:text-3xl">Llegaron a tiempo</h2>
        <ol className="space-y-0.5 text-sm xl:space-y-1 xl:text-xl">
          {data.onTimeList.map(({ position, technicianName, arrivalTime }) => (
            <li
              key={position}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 even:bg-white/70 xl:py-2"
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold xl:h-8 xl:w-8 xl:text-lg ${positions[position - 1] ?? 'bg-slate-200 text-slate-700'}`}
              >
                {position}
              </span>
              <strong className="min-w-0 flex-1 break-words">{technicianName}</strong>
              <time className="shrink-0 tabular-nums text-slate-600">{arrivalTime}</time>
            </li>
          ))}
        </ol>
        {!data.onTimeList.length && (
          <p className="text-sm text-slate-600">Aún no hay llegadas a tiempo registradas.</p>
        )}
      </div>

      <div className="flex flex-col gap-2.5 xl:gap-4">
        <div className="grid grid-cols-2 gap-2.5 xl:gap-4">
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800 xl:px-5 xl:py-4">
            <h2 className="text-sm font-bold xl:text-xl">A tiempo hoy</h2>
            <strong className="block text-[28px] leading-tight xl:text-5xl">
              {data.onTimeCount} de {data.totalTeamCount}
            </strong>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900 xl:px-5 xl:py-4">
            <h2 className="text-sm font-bold xl:text-xl">Tardanzas hoy</h2>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <strong className="text-[28px] leading-tight xl:text-5xl">
                {data.tardinessCountToday}
              </strong>
              <span className="text-xs xl:text-lg">{data.totalTardinessMinutes} min en total</span>
            </div>
          </div>
        </div>

        <div className="min-w-0 px-2 xl:px-4">
          <h2 className="text-base font-extrabold xl:text-2xl">Tardanzas del equipo por semana</h2>
          <div className="mt-3 flex items-end justify-between gap-2 xl:mt-4 xl:gap-4">
            {weeks.map((week, index) => (
              <div key={week.weekLabel} className="min-w-0 flex-1 text-center">
                <div className="flex h-32 flex-col items-center justify-end xl:h-44">
                  <strong className="mb-0.5 text-base xl:text-2xl">{week.count}</strong>
                  <div
                    className={`w-10 rounded-t-sm xl:w-20 ${week.isCurrentWeek ? 'bg-emerald-700' : index === 0 ? 'bg-slate-300' : 'bg-blue-200'}`}
                    style={{ height: `${Math.max(3, (week.count / maxTardiness) * 72)}%` }}
                  />
                </div>
                <div className="mt-1 text-xs font-bold xl:text-lg">{week.weekLabel}</div>
                <div className="min-h-4 text-[11px] text-slate-600 xl:text-base">
                  {week.isCurrentWeek ? 'esta semana' : index === 0 ? 'marcha blanca' : ''}
                </div>
              </div>
            ))}
            {data.anonymousTardinessBadge > 0 && (
              <span
                className="mb-8 shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-600 xl:text-xl"
                aria-label={`${data.anonymousTardinessBadge} llegadas tarde`}
              >
                +{data.anonymousTardinessBadge}
              </span>
            )}
          </div>
          {!weeks.length && <p className="text-sm text-slate-600">Aún no hay historial semanal.</p>}
        </div>
        <p className="rounded-md bg-emerald-50 px-3 py-1.5 text-center text-sm font-bold text-emerald-800 xl:py-2 xl:text-xl">
          Racha más larga: {data.longestStreak.technicianName} ·{' '}
          {data.longestStreak.consecutiveDays} días puntual
        </p>
      </div>

      <p className="rounded-md bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 md:col-span-2 xl:py-2.5 xl:text-lg">
        <strong>Por mejorar:</strong> {data.tardinessCountToday} tardanzas hoy. Meta de mañana:{' '}
        {data.improvementNotice.targetTardiness} · Entrada {data.improvementNotice.entryTime}{' '}
        (tolerancia {data.improvementNotice.toleranceTime})
      </p>
    </section>
  );
}
