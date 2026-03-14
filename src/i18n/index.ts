import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import az from './locales/az.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Получаем сохраненный язык из localStorage или используем язык по умолчанию
const getStoredLanguage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('i18nextLng');
    if (stored && ['az', 'en', 'ru'].includes(stored)) {
      return stored;
    }
  }
  return 'az';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      az: { translation: az },
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'az',
    interpolation: {
      escapeValue: false,
    },
  });

// Сохраняем язык в localStorage при изменении
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
});

export default i18n;

