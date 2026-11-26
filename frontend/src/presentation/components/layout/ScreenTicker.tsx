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
  const ordered = [...items].sort(
    (a, b) => Number(b.type === 'urgente') - Number(a.type === 'urgente'),
  );
  const loopedItems = [...ordered, ...ordered];

  return (
    <footer
      className={
        'z-20 w-full overflow-hidden border-t border-slate-200 bg-slate-100 px-4 py-1.5 backdrop-blur-md'
      }
    >
      <div className="flex items-center overflow-hidden">
        <div className="animate-ticker flex items-center gap-10">
          {loopedItems.map((item, index) => {
            const variant = typeVariantMap[item.type] || 'neutral';
            const label = typeLabelMap[item.type] || item.type;

            return (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3 shrink-0">
                <Badge variant={variant} size="sm" className="!border-0">
                  {label}
                </Badge>
                <span className={'text-xs font-semibold text-slate-800 xl:text-base'}>
                  {item.text}
                </span>
                <span className="text-slate-300 mx-2">·</span>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
