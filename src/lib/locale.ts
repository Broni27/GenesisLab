import type { Locale, LocalizedText } from '@/data/catalog.types';

const SUPPORTED: Locale[] = ['az', 'ru', 'en'];

export function toLocale(lang: string | undefined): Locale {
  const base = (lang || 'az').split('-')[0] as Locale;
  return SUPPORTED.includes(base) ? base : 'az';
}

export function tLocal(
  text: LocalizedText | null | undefined,
  lang: string | undefined,
  fallback = ''
): string {
  if (!text) return fallback;
  const locale = toLocale(lang);
  return text[locale] || text.az || text.ru || text.en || fallback;
}
