import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { useTheme } from '@/contexts/ThemeContext';
import InstrumentNavDropdown from './InstrumentNavDropdown';
import { NavbarLoginDropdown } from './NavbarLoginDropdown';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { mode } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Categories', path: '/categories' },
    { name: 'Play with friends', path: '/music-rooms' },
    { name: 'Play', path: '/' },
  ];

  return (
    <header
      role="navigation"
      aria-label="Main navigation"
      className="
        fixed top-0 inset-x-0 z-50
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-lg
        border-b border-gray-200/60 dark:border-gray-800/60
      "
    >
      {/* MAIN BAR */}
      <nav className="container mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div
            className="
              w-10 h-10 rounded-xl
              bg-gradient-to-br from-indigo-600 to-purple-600
              dark:from-indigo-500 dark:to-purple-400
              flex items-center justify-center
              text-white font-bold text-lg
              shadow-md group-hover:shadow-lg
              transition-transform duration-300 group-hover:scale-105
            "
          >
            H
          </div>
          <span
            className="
              text-lg sm:text-xl font-bold
              bg-gradient-to-r from-indigo-600 to-purple-600
              dark:from-indigo-400 dark:to-purple-400
              bg-clip-text text-transparent
            "
          >
            HarmonyHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            if (link.name === 'Play') {
              return <InstrumentNavDropdown key="play-desktop" />;
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-sm font-medium transition-colors
                  ${isActive(link.path)
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'}
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <NavbarLoginDropdown />
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="
              p-2 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors
            "
            onClick={() => setMobileMenuOpen((p) => !p)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="
            md:hidden
            bg-white dark:bg-gray-900
            border-t border-gray-200/60 dark:border-gray-800/60
            shadow-lg
          "
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) =>
              link.name !== 'Play' ? (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    rounded-lg px-3 py-2 text-base
                    transition-colors
                    ${isActive(link.path)
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `}
                >
                  {link.name}
                </Link>
              ) : (
                <InstrumentNavDropdown key="play-mobile" />
              )
            )}

            <NavbarLoginDropdown />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
