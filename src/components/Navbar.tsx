import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Flame } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion } from '../utils/motion';

interface NavbarProps {
  onOpenOrder: (productId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrder }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, eventLabel: string) => {
    setMobileMenuOpen(false);
    trackEvent('click_ver_menu', { section: sectionId, label: eventLabel });
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    trackEvent('click_pedir_ahora', { location: 'navbar' });
    onOpenOrder();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0908]/95 backdrop-blur-xl border-b border-[#e2231a]/25 shadow-xl shadow-black/60 py-1'
          : 'bg-[#0a0908]/80 backdrop-blur-md border-b border-[#211c19]/60 py-2 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('hero', 'logo_home');
          }}
          className="flex items-center gap-3 group focus:outline-none"
          id="nav-logo"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <img
              src="./assets/taitashu-logo.png"
              alt="TaitaShu Burgers al Fuego"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(226,35,26,0.35)]"
            />
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display text-2xl tracking-wider text-[#f5f2eb] leading-none group-hover:text-[#ff7a1a] transition-colors">
              TAITASHU
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ff7a1a] mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e2231a] animate-pulse" />
              Smash al Fuego
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold text-[#f5f2eb]/80">
          {[
            { id: 'hero', label: 'Inicio', tag: 'nav_inicio' },
            { id: 'favoritos', label: '⭐ Favoritos', tag: 'nav_favoritos' },
            { id: 'menu', label: 'Menú Completo', tag: 'nav_menu' },
            { id: 'sucursales', label: '5 Sucursales', tag: 'nav_sucursales' },
            { id: 'opiniones', label: 'Opiniones', tag: 'nav_opiniones' },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id, link.tag)}
              className="relative px-3.5 py-2 rounded-lg text-sm text-[#f5f2eb]/75 hover:text-white hover:bg-[#211c19]/60 transition-all cursor-pointer group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#e2231a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
            </button>
          ))}
        </nav>

        {/* Header Right Action (Magnetic / Reactive Button) */}
        <div className="hidden sm:flex items-center gap-4">
          <motion.button
            id="navbar-cta-btn"
            onClick={handleCtaClick}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={buttonTapMotion}
            className="flame-glow bg-[#e2231a] hover:bg-[#b81710] text-[#f5f2eb] font-bold text-sm tracking-wide px-5 py-2.5 rounded-full shadow-lg shadow-red-950/40 transition-colors flex items-center gap-2 cursor-pointer border border-[#ff7a1a]/40"
          >
            <Flame className="w-4 h-4 text-[#ffb703] fill-[#ffb703]" />
            <span>PEDIR AHORA</span>
          </motion.button>
        </div>

        {/* Mobile Menu Button (Accessible touch target >= 44px) */}
        <div className="flex items-center gap-2 md:hidden">
          <motion.button
            whileTap={buttonTapMotion}
            onClick={handleCtaClick}
            className="bg-[#e2231a] text-white text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1 shadow-md shadow-red-950/50"
          >
            <Flame className="w-3.5 h-3.5 fill-[#ffb703] text-[#ffb703]" />
            <span>PEDIR</span>
          </motion.button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-[#f5f2eb] hover:text-[#ff7a1a] rounded-lg focus:outline-none cursor-pointer active:scale-95 transition-transform"
            aria-label="Abrir menú de navegación"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#14110f]/98 backdrop-blur-2xl border-b border-[#211c19] px-5 pt-3 pb-6 space-y-4"
          >
            <div className="grid grid-cols-1 gap-1.5 text-base font-semibold text-[#f5f2eb]">
              <button
                onClick={() => handleNavClick('hero', 'm_inicio')}
                className="text-left py-3 px-3 rounded-xl hover:bg-[#211c19] transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => handleNavClick('favoritos', 'm_favoritos')}
                className="text-left py-3 px-3 rounded-xl hover:bg-[#211c19] transition-colors flex items-center justify-between"
              >
                <span>⭐ Los Favoritos de Taitashu</span>
                <span className="text-xs bg-[#e2231a]/20 text-[#ff7a1a] px-2.5 py-0.5 rounded-full font-bold">
                  Top
                </span>
              </button>
              <button
                onClick={() => handleNavClick('menu', 'm_menu')}
                className="text-left py-3 px-3 rounded-xl hover:bg-[#211c19] transition-colors"
              >
                🍔 Menú Completo
              </button>
              <button
                onClick={() => handleNavClick('sucursales', 'm_sucursales')}
                className="text-left py-3 px-3 rounded-xl hover:bg-[#211c19] transition-colors flex items-center justify-between"
              >
                <span>📍 Nuestras 5 Sucursales</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Abierto hoy
                </span>
              </button>
              <button
                onClick={() => handleNavClick('opiniones', 'm_opiniones')}
                className="text-left py-3 px-3 rounded-xl hover:bg-[#211c19] transition-colors"
              >
                💬 Lo que dicen los clientes
              </button>
            </div>

            <div className="pt-2 border-t border-[#211c19]">
              <motion.button
                id="mobile-drawer-cta"
                whileTap={buttonTapMotion}
                onClick={handleCtaClick}
                className="w-full bg-[#e2231a] hover:bg-[#b81710] text-[#f5f2eb] font-bold text-base py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer font-display tracking-wider"
              >
                <Flame className="w-5 h-5 text-[#ffb703] fill-[#ffb703]" />
                <span>PEDIR AHORA POR WHATSAPP</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
