import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Stethoscope } from 'lucide-react';
import SEO from '@/components/SEO';

/** Former Partnership page — doctor-facing entry, secondary to patient catalog. */
export default function Doctors() {
  const { t } = useTranslation();
  const points = [
    'doctors.points.0',
    'doctors.points.1',
    'doctors.points.2',
  ];

  return (
    <div className="page-container pt-24 sm:pt-28 pb-24 md:pb-12 relative overflow-hidden">
      <SEO title={t('doctors.title')} description={t('doctors.description')} keywords={t('home.seo.keywords')} />
      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-15 pointer-events-none" />

      <section className="section-container relative !py-6 sm:!py-10 max-w-3xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-5">
          <Stethoscope className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t('doctors.title')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {t('doctors.description')}
        </p>
        <ul className="space-y-3 mb-8">
          {points.map((key) => (
            <li key={key} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-lab-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{t(key)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/analyses" className="btn-primary text-center">{t('doctors.catalogCta')}</Link>
          <Link to="/contact" className="btn-secondary text-center">{t('doctors.contactCta')}</Link>
        </div>
        <p className="mt-8 text-sm font-medium text-lab-primary">{t('doctors.tagline')}</p>
      </section>
    </div>
  );
}
