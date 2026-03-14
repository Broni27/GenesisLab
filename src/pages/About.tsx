import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Microscope, 
  MapPin, 
  Users, 
  Shield, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import SEO from '@/components/SEO';

const About = () => {
  const { t } = useTranslation();

  const whyItems = [
    {
      icon: <Zap className="w-6 h-6" />,
      titleKey: 'about.why.items.access.title',
      descriptionKey: 'about.why.items.access.description',
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      titleKey: 'about.why.items.technology.title',
      descriptionKey: 'about.why.items.technology.description',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      titleKey: 'about.why.items.location.title',
      descriptionKey: 'about.why.items.location.description',
    },
    {
      icon: <Users className="w-6 h-6" />,
      titleKey: 'about.why.items.expertise.title',
      descriptionKey: 'about.why.items.expertise.description',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      titleKey: 'about.why.items.support.title',
      descriptionKey: 'about.why.items.support.description',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      titleKey: 'about.why.items.reports.title',
      descriptionKey: 'about.why.items.reports.description',
    },
  ];

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

  return (
    <div className="page-container pt-32 relative overflow-hidden">
      <SEO 
        title={t('about.title')}
        description={t('home.description')}
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
          <h1 className="heading-1 mb-4 text-gray-900 dark:text-white">{t('about.title')}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t('home.description')}
          </p>
        </motion.div>
      </section>

      {/* Why GENESIS LAB */}
      <section className="section-container relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">{t('about.why.title')}</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {whyItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="card-tech"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(item.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default About;

