import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, Zap, Shield, Globe } from 'lucide-react';
import SEO from '@/components/SEO';

const Partnership = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container pt-32 relative overflow-hidden">
      <SEO 
        title={t('partnership.title')}
        description={t('partnership.description')}
        keywords={t('home.seo.keywords')}
      />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-20 pointer-events-none" />

      {/* Header */}
      <section className="section-container text-center relative pt-8 pb-8 sm:pt-12 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-6">
            <Users className="w-10 h-10" />
          </div>
          <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">{t('partnership.title')}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t('partnership.description')}
          </p>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="section-container relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <ul className="space-y-4 mb-12">
            {['partnership.points.0', 'partnership.points.1', 'partnership.points.2'].map((pointKey, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="flex items-start card-tech p-6"
              >
                <CheckCircle2 className="w-6 h-6 text-lab-primary mr-4 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-lg">{t(pointKey)}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Tagline */}
      <section className="section-container relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ 
            scale: 1.02, 
            y: -5,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          viewport={{ once: true }}
          transition={{ 
            opacity: { duration: 0.5 },
            scale: { duration: 0.2, ease: "easeOut" },
            y: { duration: 0.2, ease: "easeOut" },
            boxShadow: { duration: 0.2, ease: "easeOut" }
          }}
          className="card p-12 text-center max-w-4xl mx-auto bg-gradient-to-br from-lab-primary/10 to-lab-secondary/10 dark:from-lab-primary/20 dark:to-lab-secondary/20 border-lab-primary/30"
        >
          <h2 className="heading-3 mb-4 text-gray-900 dark:text-white">
            {t('partnership.tagline')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('partnership.location')}
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Partnership;

