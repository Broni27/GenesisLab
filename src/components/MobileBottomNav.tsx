import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FlaskConical, Building2, Phone } from 'lucide-react';

const links = [
  { to: '/', labelKey: 'nav.home', icon: Home, end: true },
  { to: '/analyses', labelKey: 'nav.analyses', icon: FlaskConical },
  { to: '/about', labelKey: 'nav.about', icon: Building2 },
  { to: '/contact', labelKey: 'nav.contact', icon: Phone },
];

export default function MobileBottomNav() {
  const { t } = useTranslation();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50
        bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg
        border-t border-gray-200 dark:border-gray-800
        pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile"
    >
      <div className="grid grid-cols-4 h-16">
        {links.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors
              ${isActive ? 'text-lab-primary' : 'text-gray-500 dark:text-gray-400'}`
            }
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
