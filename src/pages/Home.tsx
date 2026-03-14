import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Microscope, Zap, MapPin, Users, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import SEO from '@/components/SEO';
import logoDark from '@/imgs/png/Logo_for_dark_theme(Labor_Group).png';
import logoLight from '@/imgs/png/Logo_for_light_theme_(Labor_Group).png';

const Home = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const features = [
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
    <div className="page-container relative overflow-hidden">
      <SEO 
        title={t('home.title')}
        description={t('home.description')}
        keywords={t('home.seo.keywords')}
      />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <section className="section-container pt-32 pb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center mb-8 bg-transparent"
          >
            <div className="bg-transparent">
              <img 
                src={theme === 'dark' ? logoDark : logoLight}
                alt="GENESIS LAB"
                className="h-32 sm:h-40 md:h-48 w-auto"
                style={{ 
                  background: 'transparent',
                  imageRendering: 'auto',
                  mixBlendMode: 'normal',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </motion.div>
          
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {t('home.description')}
          </p>
          
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>{t('home.cta')}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="card-tech"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="section-container">
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
          className="card p-12 text-center bg-gradient-to-br from-lab-primary/10 to-lab-secondary/10 dark:from-lab-primary/20 dark:to-lab-secondary/20 border-lab-primary/30"
        >
          <h2 className="heading-3 mb-4 text-gray-900 dark:text-white">
            {t('partnership.tagline')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            {t('partnership.description')}
          </p>
          <Link to="/partnership">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              {t('nav.partnership')}
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

