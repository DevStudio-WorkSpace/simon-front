'use client';

import React from 'react';
import { ScreenTickerItem } from '../../../domain/models';
import { Badge, BadgeVariant } from '../ui/Badge';

interface ScreenTickerProps {
  items: ScreenTickerItem[];
}

const typeVariantMap: Record<string, BadgeVariant> = {
  urgente: 'urgent',
  alerta: 'alert',
  anuncio: 'scheduled',
  por_mejorar: 'waiting',
  logro: 'success',
};

const typeLabelMap: Record<string, string> = {
  urgente: 'Urgente',
  alerta: 'Alerta',
  anuncio: 'Anuncio',
  por_mejorar: 'Por mejorar',
  logro: 'Logro',
};

const priorityRank: Record<string, number> = {
  urgente: 0,
  alerta: 1,
  anuncio: 2,
  por_mejorar: 3,
  logro: 4,
};

export const ScreenTicker: React.FC<ScreenTickerProps> = ({ items }) => {
  const orderedItems = [...items].sort(
    (a, b) => (priorityRank[a.type] ?? 9) - (priorityRank[b.type] ?? 9),
  );
  const loopedItems = [...orderedItems, ...orderedItems];

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-3 px-5 overflow-hidden z-20">
      {orderedItems.length === 0 ? (
        <div className="tv-body font-semibold text-slate-500 dark:text-slate-400">
          Sin mensajes activos en la marquesina
        </div>
      ) : (
        <div className="flex items-center overflow-hidden">
          <div className="animate-ticker flex items-center">
            {loopedItems.map((item, index) => {
              const variant = typeVariantMap[item.type] || 'neutral';
              const label = typeLabelMap[item.type] || item.type;

              return (
                <div key={`${item.id}-${index}`} className="flex items-center gap-4 pr-12 shrink-0">
                  <Badge variant={variant} size="md">
                    {label}
                  </Badge>
                  <span className="tv-body font-semibold text-slate-800 dark:text-slate-200">
                    {item.text}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 mx-3 xl:text-[28px]" aria-hidden="true">
                    ·
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </footer>
  );
};
