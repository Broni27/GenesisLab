import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Microscope, Zap, MapPin, Search } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import SEO from '@/components/SEO';
import CategoryCard from '@/components/analyses/CategoryCard';
import { getFeaturedCategories } from '@/api/analyses';
import logoDark from '@/imgs/png/Logo_for_dark_theme(Labor_Group).png';
import logoLight from '@/imgs/png/Logo_for_light_theme_(Labor_Group).png';

const Home = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const featured = getFeaturedCategories().slice(0, 6);

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

  return (
    <div className="page-container relative overflow-hidden pb-20 md:pb-0">
      <SEO
        title={t('home.title')}
        description={t('home.description')}
        keywords={t('home.seo.keywords')}
      />

      <div className="absolute inset-0 grid-pattern dark:grid-pattern-dark opacity-30 pointer-events-none" />

      {/* Hero — brand first, one CTA group */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <img
              src={theme === 'dark' ? logoDark : logoLight}
              alt="GENESIS LAB"
              className="h-24 sm:h-36 md:h-44 w-auto mx-auto mb-6 sm:mb-8"
            />
            <p className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">
              {t('home.subtitle')}
            </p>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed px-1">
              {t('home.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Link to="/analyses" className="btn-primary inline-flex items-center justify-center gap-2 min-h-[48px]">
                <Search className="w-5 h-5" />
                <span>{t('home.ctaAnalyses')}</span>
              </Link>
              <Link to="/contact" className="btn-secondary inline-flex items-center justify-center gap-2 min-h-[48px]">
                <span>{t('home.ctaContact')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured categories for patients */}
      <section className="section-container !py-8 sm:!py-12 relative">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('home.categoriesTitle')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.categoriesSubtitle')}</p>
          </div>
          <Link to="/analyses" className="hidden sm:inline-flex text-sm font-medium text-lab-primary items-center gap-1">
            {t('home.seeAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto snap-x pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 md:hidden scrollbar-hide">
          {featured.map((c) => (
            <div key={c.id} className="min-w-[260px] snap-start">
              <CategoryCard category={c} />
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
        <Link
          to="/analyses"
          className="sm:hidden mt-4 btn-secondary w-full inline-flex items-center justify-center gap-2 min-h-[48px]"
        >
          {t('home.seeAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <section className="section-container !py-8 sm:!py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-tech"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-lab-primary to-lab-secondary text-white mb-3">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4">
                {t(feature.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-container !py-8 sm:!py-14">
        <div className="rounded-2xl p-6 sm:p-10 text-center bg-gradient-to-br from-lab-primary/10 to-lab-accent/40 dark:from-lab-primary/20 dark:to-lab-secondary/20 border border-lab-primary/20">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {t('home.helpTitle')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-5 max-w-xl mx-auto">
            {t('home.helpText')}
          </p>
          <Link to="/contact" className="btn-primary inline-flex min-h-[48px] items-center">
            {t('home.ctaContact')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
