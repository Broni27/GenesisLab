import { FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import SEO from '@/components/SEO';

type LocationState = {
  analysisId?: string;
  analysisName?: string;
};

export default function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    state.analysisName
      ? t('contact.prefillAnalysis', { name: state.analysisName })
      : ''
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Phase 1: local stub. Phase 2: POST /api/feedback
    console.info('[feedback stub]', { name, phone, message, analysisId: state.analysisId });
    setSent(true);
  };

  return (
    <div className="page-container pt-24 sm:pt-28 pb-24 md:pb-12 relative overflow-hidden">
      <SEO title={t('contact.title')} description={t('contact.subtitle')} keywords={t('home.seo.keywords')} />
      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-15 pointer-events-none" />

      <section className="section-container relative !py-6 sm:!py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('contact.title')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          {t('contact.subtitle')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-lab-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t('footer.address')}</p>
                <p className="text-sm text-gray-500">{t('footer.location')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-lab-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t('footer.phone')}</p>
                <a href="tel:+994" className="text-sm text-lab-primary">+994 XX XXX XX XX</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-lab-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t('footer.email')}</p>
                <a href="mailto:info@genesislab.az" className="text-sm text-lab-primary">info@genesislab.az</a>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('footer.hours.title')}</p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between gap-4">
                  <span>{t('footer.hours.weekdays')}</span>
                  <span>{t('footer.hours.weekdays_hours')}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>{t('footer.hours.saturday')}</span>
                  <span>{t('footer.hours.saturday_hours')}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>{t('footer.hours.sunday')}</span>
                  <span>{t('footer.hours.sunday_hours')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {sent ? (
              <div className="rounded-2xl border border-lab-primary/30 bg-lab-primary/5 p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-lab-primary mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('contact.successTitle')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('contact.successText')}</p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 space-y-4"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('contact.formHint')}</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="name">
                    {t('contact.name')}
                  </label>
                  <input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lab-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="phone">
                    {t('contact.phone')}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lab-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="message">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lab-primary/40 resize-y min-h-[120px]"
                  />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px]">
                  <Send className="w-4 h-4" />
                  {t('contact.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
