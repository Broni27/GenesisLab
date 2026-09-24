import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
};

export default function SearchInput({ value, onChange, autoFocus, className = '' }: Props) {
  const { t } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder={t('analyses.searchPlaceholder')}
        className="w-full h-12 sm:h-14 pl-11 pr-11 rounded-xl
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          text-base text-gray-900 dark:text-white
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-lab-primary/40 focus:border-lab-primary
          transition-shadow"
        enterKeyHint="search"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg
            text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px]
            flex items-center justify-center"
          aria-label={t('analyses.clearSearch')}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
