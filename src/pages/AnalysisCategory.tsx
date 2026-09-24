import { useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import SEO from '@/components/SEO';
import SearchInput from '@/components/analyses/SearchInput';
import AnalysisListItem from '@/components/analyses/AnalysisListItem';
import { getCategoryIcon } from '@/components/analyses/categoryIcons';
import { getCategoryById, listAnalyses } from '@/api/analyses';
import { tLocal } from '@/lib/locale';

type SortKey = 'name' | 'price-asc' | 'price-desc';

export default function AnalysisCategory() {
  const { categoryId = '' } = useParams();
  const { t, i18n } = useTranslation();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const tag = params.get('tag') || '';
  const [localQ, setLocalQ] = useState(q);
  const [sort, setSort] = useState<SortKey>('name');

  const category = getCategoryById(categoryId);

  const items = useMemo(() => {
    if (!category) return [];
    let list = listAnalyses({
      categoryId,
      query: q,
      tag: tag || undefined,
    });
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return (a.priceAzn ?? Infinity) - (b.priceAzn ?? Infinity);
      if (sort === 'price-desc') return (b.priceAzn ?? -1) - (a.priceAzn ?? -1);
      return tLocal(a.name, i18n.language).localeCompare(tLocal(b.name, i18n.language), i18n.language);
    });
    return list;
  }, [category, categoryId, q, tag, sort, i18n.language]);

  if (!category) return <Navigate to="/analyses" replace />;

  const Icon = getCategoryIcon(category.icon);

  const setQuery = (value: string) => {
    setLocalQ(value);
    const next = new URLSearchParams(params);
    if (value.trim()) next.set('q', value.trim());
    else next.delete('q');
    setParams(next, { replace: true });
  };

  const setTag = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('tag', value);
    else next.delete('tag');
    setParams(next, { replace: true });
  };

  return (
    <div className="page-container pt-24 sm:pt-28 pb-24 md:pb-12 relative overflow-hidden">
      <SEO
        title={tLocal(category.name, i18n.language)}
        description={tLocal(category.description, i18n.language)}
        keywords={t('home.seo.keywords')}
      />
      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-10 pointer-events-none" />

      <section className="section-container relative !py-4 sm:!py-8">
        <Link
          to="/analyses"
          className="inline-flex items-center gap-1.5 text-sm text-lab-primary font-medium mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('analyses.backToCatalog')}
        </Link>

        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white flex items-center justify-center">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {tLocal(category.name, i18n.language)}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              {tLocal(category.description, i18n.language)}
            </p>
          </div>
        </div>

        <div className="sticky top-20 z-30 py-2 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md space-y-3">
          <SearchInput value={localQ} onChange={setQuery} />
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none h-10 pl-3 pr-9 rounded-lg border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
              >
                <option value="name">{t('analyses.sortName')}</option>
                <option value="price-asc">{t('analyses.sortPriceAsc')}</option>
                <option value="price-desc">{t('analyses.sortPriceDesc')}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs text-gray-500 ml-auto">
              {t('analyses.testsCount', { count: items.length })}
            </span>
          </div>

          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto snap-x pb-1 -mx-1 px-1 scrollbar-hide">
              <button
                type="button"
                onClick={() => setTag('')}
                className={`flex-shrink-0 snap-start px-3 py-2 rounded-full text-xs font-medium min-h-[40px] border transition-colors
                  ${!tag ? 'bg-lab-primary text-white border-lab-primary' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                {t('analyses.all')}
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setTag(sub.id)}
                  className={`flex-shrink-0 snap-start px-3 py-2 rounded-full text-xs font-medium min-h-[40px] border transition-colors
                    ${tag === sub.id ? 'bg-lab-primary text-white border-lab-primary' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {tLocal(sub.name, i18n.language)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-container relative !pt-2 !pb-8">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{t('analyses.noResults')}</p>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden max-w-4xl mx-auto lg:max-w-5xl">
            {items.map((a) => (
              <AnalysisListItem key={a.id} analysis={a} categoryId={category.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
