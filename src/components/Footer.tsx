import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import logoDark from '@/imgs/png/Just_logo_(dark_theme).png';
import logoLight from '@/imgs/png/Just_logo(white_theme).png';

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-transparent">
                <img 
                  src={theme === 'dark' ? logoDark : logoLight}
                  alt="GENESIS LAB"
                  className="h-12 w-auto"
                  style={{ 
                    background: 'transparent',
                    imageRendering: 'auto',
                    mixBlendMode: 'normal',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  GENESIS LAB
                </h3>
                <p className="text-xs text-gray-400">{t('header.subtitle')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer.description')}
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-lab-primary">
              {t('footer.contact')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-lab-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('footer.address')}</p>
                  <p className="text-sm text-gray-400">
                    {t('footer.location')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-lab-primary" />
                <div>
                  <p className="text-sm font-medium">{t('footer.phone')}</p>
                  <p className="text-sm text-gray-400">+994 XX XXX XX XX</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-lab-primary" />
                <div>
                  <p className="text-sm font-medium">{t('footer.email')}</p>
                  <p className="text-sm text-gray-400">info@genesislab.az</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-lab-primary">
              {t('footer.hours.title')}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('footer.hours.weekdays')}</span>
                <span className="text-white">{t('footer.hours.weekdays_hours')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('footer.hours.saturday')}</span>
                <span className="text-white">{t('footer.hours.saturday_hours')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('footer.hours.sunday')}</span>
                <span className="text-white">{t('footer.hours.sunday_hours')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between"
        >
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} GENESIS LAB. {t('footer.rights')}.
          </p>
          <div className="flex items-center space-x-1 mt-4 sm:mt-0">
            <span className="text-sm text-gray-400">{t('footer.tagline')}</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

