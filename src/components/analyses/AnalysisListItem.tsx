import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import type { Analysis } from '@/data/catalog.types';
import { formatPriceAzn } from '@/api/analyses';
import { tLocal } from '@/lib/locale';

type Props = {
  analysis: Analysis;
  categoryId: string;
};

export default function AnalysisListItem({ analysis, categoryId }: Props) {
  const { t, i18n } = useTranslation();
  const price = formatPriceAzn(
    analysis.priceAzn,
    i18n.language,
    t('analyses.priceOnRequest')
  );

  return (
    <Link
      to={`/analyses/${categoryId}/${analysis.id}`}
      className="group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3.5 sm:py-4
        border-b border-gray-100 dark:border-gray-800
        hover:bg-lab-primary/5 active:bg-lab-primary/10 transition-colors
        min-h-[72px]"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-lab-primary transition-colors">
          {tLocal(analysis.name, i18n.language)}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {tLocal(analysis.description, i18n.language)}
        </p>
        {analysis.turnaround && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {t('analyses.turnaround')}: {analysis.turnaround}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-sm sm:text-base font-bold text-lab-primary whitespace-nowrap">
          {price}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-lab-primary" />
      </div>
    </Link>
  );
}
