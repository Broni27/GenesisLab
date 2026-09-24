/**
 * Catalog access layer.
 * Phase 1: static JSON. Phase 2: swap implementation to REST without changing callers.
 */
import catalog from '@/data/catalog.json';
import type {
  Analysis,
  Catalog,
  CatalogMeta,
  Category,
  CategoryId,
} from '@/data/catalog.types';

const data = catalog as Catalog;

export type AnalysisFilters = {
  categoryId?: CategoryId | string;
  query?: string;
  tag?: string;
  featuredOnly?: boolean;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function matchesQuery(a: Analysis, q: string): boolean {
  const n = normalize(q);
  if (!n) return true;
  const hay = [
    a.name.az,
    a.name.ru,
    a.name.en,
    a.description.az,
    a.description.ru,
    a.description.en,
    a.explanation?.az,
    a.explanation?.ru,
    a.explanation?.en,
    ...(a.tags || []),
  ]
    .filter(Boolean)
    .map((x) => normalize(String(x)))
    .join(' ');
  return hay.includes(n);
}

export function getCatalogMeta(): CatalogMeta {
  return data.meta;
}

export function listCategories(): Category[] {
  return [...data.categories].sort((a, b) => a.order - b.order);
}

export function getFeaturedCategories(): Category[] {
  return listCategories().filter((c) => c.featured);
}

export function getCategoryById(id: string): Category | undefined {
  return data.categories.find((c) => c.id === id);
}

export function listAnalyses(filters: AnalysisFilters = {}): Analysis[] {
  let items = data.analyses as Analysis[];

  if (filters.categoryId) {
    items = items.filter((a) => a.categoryId === filters.categoryId);
  }
  if (filters.tag) {
    items = items.filter((a) => a.tags.includes(filters.tag!));
  }
  if (filters.featuredOnly) {
    items = items.filter((a) => a.featured);
  }
  if (filters.query?.trim()) {
    items = items.filter((a) => matchesQuery(a, filters.query!));
  }

  return items;
}

export function getAnalysisById(id: string): Analysis | undefined {
  return data.analyses.find((a) => a.id === id);
}

export function getRelatedAnalyses(analysis: Analysis, limit = 4): Analysis[] {
  return listAnalyses({ categoryId: analysis.categoryId })
    .filter((a) => a.id !== analysis.id)
    .slice(0, limit);
}

export function countAnalysesByCategory(categoryId: string): number {
  return data.analyses.filter((a) => a.categoryId === categoryId).length;
}

export function searchAnalyses(query: string, limit = 40): Analysis[] {
  if (!query.trim()) return [];
  return listAnalyses({ query }).slice(0, limit);
}

export function formatPriceAzn(
  amount: number | null,
  locale: string,
  onRequestLabel: string
): string {
  if (amount == null) return onRequestLabel;
  try {
    return new Intl.NumberFormat(locale === 'az' ? 'az-AZ' : locale === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'AZN',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} AZN`;
  }
}
