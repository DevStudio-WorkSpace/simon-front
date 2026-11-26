import { Check } from 'lucide-react';
import type { MonthlyGoalData } from '../../../domain/models';

const milestoneColors = {
  bronce: 'text-amber-800',
  plata: 'text-slate-600',
  oro: 'text-amber-700',
  meta: 'text-emerald-800',
};

export function GoalSlide({ data }: { data: MonthlyGoalData }) {
  const progress = Math.min(100, Math.max(0, data.progressPercentage));
  return (
    <section className="flex w-full max-w-6xl flex-col items-center justify-center self-center px-5 py-4 text-center sm:px-12 xl:py-8">
      <h2 className="text-2xl font-extrabold xl:text-4xl">Meta comercial de {data.monthName}</h2>
      <strong className="my-2 text-7xl leading-none tracking-tight md:text-[108px] xl:my-3 xl:text-[140px]">
        {progress}%
      </strong>
      <p className="mt-3 w-full max-w-[280px] rounded-md bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-800 xl:text-xl">
        {data.currentMilestone}
      </p>
      <p className="mt-2 text-lg text-slate-600 xl:text-2xl">{data.nextMilestone}</p>
      <div className="relative mt-10 mb-8 w-[90%] rounded-full bg-slate-200 xl:mt-12">
        <div className="h-3.5 rounded-full bg-[#E6007E] xl:h-4" style={{ width: `${progress}%` }} />
        {data.milestones.map((milestone) => (
          <div
            key={milestone.level}
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ${milestoneColors[milestone.level]}`}
            style={{ left: `${milestone.percentage}%` }}
          >
            <span
              className="grid h-4 w-4 place-items-center rounded-full border border-current xl:h-6 xl:w-6"
              aria-label={milestone.reached ? 'Alcanzado' : 'Pendiente'}
            >
              {milestone.reached ? (
                <Check className="h-3 w-3 xl:h-4 xl:w-4" />
              ) : (
                <span className="h-1 w-1 rounded-full bg-current" />
              )}
            </span>
            <span className="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 whitespace-nowrap text-xs font-bold xl:text-lg">
              {milestone.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
