import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Target, 
  Activity, 
  CheckCircle2,
  TrendingUp,
  TestTube,
  Baby
} from 'lucide-react';
import SEO from '@/components/SEO';

const Services = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const technicalFeatures = [
    {
      feature: 'services.technical.table.feature.fastseq',
      advantage: 'services.technical.table.advantage.fastseq',
      clinical: 'services.technical.table.clinical.fastseq',
    },
    {
      feature: 'services.technical.table.feature.cnv',
      advantage: 'services.technical.table.advantage.cnv',
      clinical: 'services.technical.table.clinical.cnv',
    },
    {
      feature: 'services.technical.table.feature.mtdna',
      advantage: 'services.technical.table.advantage.mtdna',
      clinical: 'services.technical.table.clinical.mtdna',
    },
    {
      feature: 'services.technical.table.feature.intronic',
      advantage: 'services.technical.table.advantage.intronic',
      clinical: 'services.technical.table.clinical.intronic',
    },
  ];

  const testsList = [
    'services.tests.list.diagnostic_panels',
    'services.tests.list.preimplantation',
    'services.tests.list.screening',
    'services.tests.list.nipt',
    'services.tests.list.exome',
    'services.tests.list.mitochondrial',
    'services.tests.list.hla',
    'services.tests.list.custom_panels',
  ];

  return (
    <div className="page-container pt-32 relative overflow-hidden">
      <SEO 
        title={t('services.title')}
        description={t('services.oncogenetics.description')}
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
          <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">{t('services.title')}</h1>
        </motion.div>
      </section>

      {/* Oncogenetics */}
      <section className="section-container relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="heading-2 mb-4">{t('services.oncogenetics.title')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {t('services.oncogenetics.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto p-2">
            {/* Hereditary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="card-tech"
            >
              <div className="flex items-center mb-4 overflow-visible">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-lab-primary to-lab-secondary text-white flex items-center justify-center mr-4 flex-shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('services.oncogenetics.types.hereditary.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('services.oncogenetics.types.hereditary.description')}
              </p>
              <ul className="space-y-2">
                {['services.oncogenetics.types.hereditary.points.0', 'services.oncogenetics.types.hereditary.points.1'].map((pointKey, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-lab-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t(pointKey)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Somatic */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="card-tech"
            >
              <div className="flex items-center mb-4 overflow-visible">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-lab-primary to-lab-secondary text-white flex items-center justify-center mr-4 flex-shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('services.oncogenetics.types.somatic.title')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('services.oncogenetics.types.somatic.description')}
              </p>
              <ul className="space-y-2">
                {['services.oncogenetics.types.somatic.points.0', 'services.oncogenetics.types.somatic.points.1', 'services.oncogenetics.types.somatic.points.2'].map((pointKey, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-lab-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t(pointKey)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Tests Section */}
      <section className="section-container relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-6">
              <TestTube className="w-8 h-8" />
            </div>
            <h2 className="heading-2 mb-4">{t('services.tests.title')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {t('services.tests.description')}
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
          >
            {testsList.map((testKey, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="card-tech p-6 text-center"
              >
                <CheckCircle2 className="w-6 h-6 text-lab-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t(testKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* NIPT Section */}
      <section className="section-container relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-6">
              <Baby className="w-8 h-8" />
            </div>
            <h2 className="heading-2 mb-4">{t('services.tests.nipt.title')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {t('services.tests.nipt.description')}
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {[
              'services.tests.nipt.packages.basic1',
              'services.tests.nipt.packages.basic2',
              'services.tests.nipt.packages.standard',
              'services.tests.nipt.packages.plus',
              'services.tests.nipt.packages.pro',
            ].map((packageKey, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="card-tech p-6"
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  {t(`${packageKey}.title`)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(`${packageKey}.description`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Technical Advantages */}
      <section className="section-container relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="heading-2 mb-4">{t('services.technical.title')}</h2>
          </div>

          <div className="overflow-x-auto px-2">
            <div className="min-w-full py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="font-semibold text-lab-primary dark:text-lab-primary p-3 bg-lab-primary/10 dark:bg-lab-primary/20 rounded-lg text-center">
                  Технология
                </div>
                <div className="font-semibold text-lab-primary dark:text-lab-primary p-3 bg-lab-primary/10 dark:bg-lab-primary/20 rounded-lg text-center">
                  Техническое преимущество
                </div>
                <div className="font-semibold text-lab-primary dark:text-lab-primary p-3 bg-lab-primary/10 dark:bg-lab-primary/20 rounded-lg text-center">
                  Клиническое значение
                </div>
              </div>

              {technicalFeatures.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                >
                  <motion.div 
                    className="card-tech p-4"
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {t(item.feature)}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="card-tech p-4"
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {t(item.advantage)}
                    </div>
                  </motion.div>
                  <motion.div 
                    className="card-tech p-4"
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {t(item.clinical)}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;

