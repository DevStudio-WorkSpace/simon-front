'use client';

import { useState, useEffect } from 'react';

/**
 * Formats a Date object into SIMON TV standard format: "DD mmm YYYY · HH:mm"
 * Example: "23 nov 2026 · 18:09"
 */
export function formatSimonDateTime(date: Date = new Date()): string {
  const day = date.getDate().toString().padStart(2, '0');
  const months = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} · ${hours}:${minutes}`;
}

/**
 * Returns current formatted date/time, updating every 10 seconds.
 * Avoids React hydration mismatch by rendering on client mount.
 */
export function useCurrentDateTime(): string {
  const [dateTimeStr, setDateTimeStr] = useState<string>('');

  useEffect(() => {
    setDateTimeStr(formatSimonDateTime(new Date()));

    const interval = setInterval(() => {
      setDateTimeStr(formatSimonDateTime(new Date()));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return dateTimeStr;
}
