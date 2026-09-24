import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/data/catalog.types';
import { countAnalysesByCategory } from '@/api/analyses';
import { tLocal } from '@/lib/locale';
import { getCategoryIcon } from './categoryIcons';

type Props = {
  category: Category;
  compact?: boolean;
};

export default function CategoryCard({ category, compact = false }: Props) {
  const { i18n, t } = useTranslation();
  const Icon = getCategoryIcon(category.icon);
  const count = countAnalysesByCategory(category.id);

  if (compact) {
    return (
      <Link
        to={`/analyses/${category.id}`}
        className="flex-shrink-0 snap-start inline-flex items-center gap-2 px-3.5 py-2.5
          rounded-full border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900 text-sm font-medium
          text-gray-800 dark:text-gray-100
          hover:border-lab-primary hover:text-lab-primary
          active:scale-[0.98] transition-all min-h-[44px]"
      >
        <Icon className="w-4 h-4 text-lab-primary" />
        <span>{tLocal(category.name, i18n.language)}</span>
        <span className="text-xs text-gray-400">{count}</span>
      </Link>
    );
  }

  return (
    <Link
      to={`/analyses/${category.id}`}
      className="block p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
        hover:border-lab-primary/50 hover:shadow-lg
        active:scale-[0.99] transition-all h-full"
    >
      <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12
        rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-3">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
        {tLocal(category.name, i18n.language)}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-3">
        {tLocal(category.description, i18n.language)}
      </p>
      <span className="text-xs font-medium text-lab-primary">
        {t('analyses.testsCount', { count })}
      </span>
    </Link>
  );
}
