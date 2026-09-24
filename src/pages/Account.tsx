import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, UserRound } from 'lucide-react';
import SEO from '@/components/SEO';

/** Stub for future auth / personal cabinet. Not wired to a backend yet. */
export default function Account() {
  const { t } = useTranslation();

  return (
    <div className="page-container pt-24 sm:pt-28 pb-24 md:pb-12">
      <SEO title={t('account.title')} description={t('account.subtitle')} keywords={t('home.seo.keywords')} />
      <section className="section-container max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lab-primary/10 text-lab-primary mb-5">
          <UserRound className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('account.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('account.subtitle')}</p>
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-left space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            {t('account.comingSoon')}
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
            <li>{t('account.featureResults')}</li>
            <li>{t('account.featureOrders')}</li>
            <li>{t('account.featureAppointments')}</li>
          </ul>
        </div>
        <Link to="/contact" className="btn-primary inline-flex">
          {t('account.contactCta')}
        </Link>
      </section>
    </div>
  );
}
