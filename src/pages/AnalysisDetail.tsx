import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Droplets, FlaskConical, MessageCircle } from 'lucide-react';
import SEO from '@/components/SEO';
import AnalysisListItem from '@/components/analyses/AnalysisListItem';
import {
  formatPriceAzn,
  getAnalysisById,
  getCategoryById,
  getRelatedAnalyses,
} from '@/api/analyses';
import { tLocal } from '@/lib/locale';

export default function AnalysisDetail() {
  const { categoryId = '', analysisId = '' } = useParams();
  const { t, i18n } = useTranslation();

  const analysis = getAnalysisById(analysisId);
  const category = getCategoryById(categoryId) || (analysis ? getCategoryById(analysis.categoryId) : undefined);

  if (!analysis) return <Navigate to="/analyses" replace />;

  const related = getRelatedAnalyses(analysis, 4);
  const price = formatPriceAzn(analysis.priceAzn, i18n.language, t('analyses.priceOnRequest'));
  const backTo = category ? `/analyses/${category.id}` : '/analyses';

  return (
    <div className="page-container pt-24 sm:pt-28 pb-28 md:pb-16 relative overflow-hidden">
      <SEO
        title={tLocal(analysis.name, i18n.language)}
        description={tLocal(analysis.description, i18n.language)}
        keywords={t('home.seo.keywords')}
      />
      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-10 pointer-events-none" />

      <article className="section-container relative !py-4 sm:!py-8 max-w-3xl lg:max-w-4xl">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm text-lab-primary font-medium mb-5 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          {category ? tLocal(category.name, i18n.language) : t('analyses.backToCatalog')}
        </Link>

        <header className="mb-6 sm:mb-8">
          {category && (
            <p className="text-xs sm:text-sm font-medium text-lab-primary mb-2 uppercase tracking-wide">
              {tLocal(category.name, i18n.language)}
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            {tLocal(analysis.name, i18n.language)}
          </h1>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-lab-primary">{price}</span>
            {analysis.turnaround && (
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {t('analyses.turnaround')}: {analysis.turnaround}
              </span>
            )}
          </div>
        </header>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('analyses.whyTitle')}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {tLocal(analysis.description, i18n.language)}
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {analysis.sampleType && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2 text-lab-primary mb-2">
                <Droplets className="w-4 h-4" />
                <h3 className="text-sm font-semibold">{t('analyses.sample')}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {tLocal(analysis.sampleType, i18n.language)}
              </p>
            </div>
          )}
          {analysis.method && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2 text-lab-primary mb-2">
                <FlaskConical className="w-4 h-4" />
                <h3 className="text-sm font-semibold">{t('analyses.method')}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {tLocal(analysis.method, i18n.language)}
              </p>
            </div>
          )}
        </section>

        {analysis.explanation && (
          <section className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('analyses.whatIncluded')}
            </h2>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-lab-accent/20 dark:bg-gray-900">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                {tLocal(analysis.explanation, i18n.language)}
              </p>
            </div>
          </section>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          {t('analyses.disclaimer')}
        </p>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-16 inset-x-0 z-40 md:hidden px-4 pb-2 pt-2 bg-gradient-to-t from-white via-white dark:from-gray-950 dark:via-gray-950 to-transparent">
          <Link
            to="/contact"
            state={{ analysisId: analysis.id, analysisName: tLocal(analysis.name, i18n.language) }}
            className="btn-primary w-full flex items-center justify-center gap-2 min-h-[48px]"
          >
            <MessageCircle className="w-5 h-5" />
            {t('analyses.askCta')}
          </Link>
        </div>

        <div className="hidden md:block mb-10">
          <Link
            to="/contact"
            state={{ analysisId: analysis.id, analysisName: tLocal(analysis.name, i18n.language) }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            {t('analyses.askCta')}
          </Link>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('analyses.related')}
            </h2>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              {related.map((a) => (
                <AnalysisListItem key={a.id} analysis={a} categoryId={a.categoryId} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
