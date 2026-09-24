import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';
import SearchInput from '@/components/analyses/SearchInput';
import CategoryCard from '@/components/analyses/CategoryCard';
import AnalysisListItem from '@/components/analyses/AnalysisListItem';
import {
  getFeaturedCategories,
  listAnalyses,
  listCategories,
  searchAnalyses,
} from '@/api/analyses';
import { tLocal } from '@/lib/locale';

export default function Analyses() {
  const { t, i18n } = useTranslation();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [localQ, setLocalQ] = useState(q);

  const featured = useMemo(() => getFeaturedCategories(), []);
  const allCategories = useMemo(() => listCategories(), []);
  const featuredTests = useMemo(() => listAnalyses({ featuredOnly: true }).slice(0, 8), []);
  const searchResults = useMemo(() => (q.trim() ? searchAnalyses(q, 50) : []), [q]);

  const setQuery = (value: string) => {
    setLocalQ(value);
    const next = new URLSearchParams(params);
    if (value.trim()) next.set('q', value.trim());
    else next.delete('q');
    setParams(next, { replace: true });
  };

  return (
    <div className="page-container pt-24 sm:pt-28 pb-24 md:pb-12 relative overflow-hidden">
      <SEO title={t('analyses.title')} description={t('analyses.subtitle')} keywords={t('home.seo.keywords')} />
      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-15 pointer-events-none" />

      <section className="section-container relative !py-6 sm:!py-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          {t('analyses.title')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-6">
          {t('analyses.subtitle')}
        </p>

        <div className="sticky top-20 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
          <SearchInput value={localQ} onChange={setQuery} />
        </div>
      </section>

      {q.trim() ? (
        <section className="section-container relative !pt-2 !pb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('analyses.searchResults', { count: searchResults.length })}
          </h2>
          {searchResults.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-8 text-center">
              {t('analyses.noResults')}
            </p>
          ) : (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              {searchResults.map((a) => (
                <AnalysisListItem key={a.id} analysis={a} categoryId={a.categoryId} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="section-container relative !pt-2 !pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {t('analyses.popularCategories')}
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto snap-x pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide md:hidden">
              {featured.map((c) => (
                <CategoryCard key={c.id} category={c} compact />
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          </section>

          <section className="section-container relative !py-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-lab-primary" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {t('analyses.featuredTests')}
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              {featuredTests.map((a) => (
                <AnalysisListItem key={a.id} analysis={a} categoryId={a.categoryId} />
              ))}
            </div>
          </section>

          <section className="section-container relative !py-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('analyses.allCategories')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-2xl">
              {t('analyses.allCategoriesHint')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {allCategories.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          </section>

          <section className="section-container relative !py-8">
            <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-lab-primary/10 to-lab-accent/30 dark:from-lab-primary/20 dark:to-lab-secondary/20 border border-lab-primary/20">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('analyses.helpTitle')}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-5 max-w-xl">
                {t('analyses.helpText')}
              </p>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base">
                {t('analyses.helpCta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {tLocal(
                  {
                    az: 'Nəticəni həmişə həkiminizlə müzakirə edin.',
                    ru: 'Всегда обсуждайте результат с вашим врачом.',
                    en: 'Always discuss results with your doctor.',
                  },
                  i18n.language
                )}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
