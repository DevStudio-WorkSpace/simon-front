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

export const ScreenTicker: React.FC<ScreenTickerProps> = ({ items }) => {
  // We duplicate the list so the ticker can loop smoothly
  const loopedItems = [...items, ...items];

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-2.5 px-4 overflow-hidden z-20">
      <div className="flex items-center overflow-hidden">
        <div className="animate-ticker flex items-center gap-10">
          {loopedItems.map((item, index) => {
            const variant = typeVariantMap[item.type] || 'neutral';
            const label = typeLabelMap[item.type] || item.type;

            return (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3 shrink-0">
                <Badge variant={variant} size="sm">
                  {label}
                </Badge>
                <span className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {item.text}
                </span>
                <span className="text-slate-300 dark:text-slate-700 mx-2">·</span>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

