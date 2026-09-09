import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion } from '../utils/motion';

interface StickyMobileBarProps {
  onOpenOrder: (productId?: string) => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onOpenOrder }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal sticky bar once scrolled past the hero section (e.g., 280px)
      setIsVisible(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    trackEvent('click_pedir_ahora', { location: 'sticky_mobile_bar' });
    onOpenOrder();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Barra de pedido rápido móvil"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0908]/95 backdrop-blur-xl border-t border-[#e2231a]/30 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>5 Sucursales abiertas</span>
              </div>
              <span className="text-[10px] text-white/50">Delivery & Retiro hoy</span>
            </div>

            <motion.button
              id="sticky-mobile-cta-btn"
              whileTap={buttonTapMotion}
              onClick={handleClick}
              className="flame-glow flex-1 bg-[#e2231a] hover:bg-[#b81710] text-white font-display text-base tracking-wider py-3 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#ff7a1a]/40"
            >
              <Flame className="w-4 h-4 text-[#ffb703] fill-[#ffb703]" />
              <span>PEDIR AHORA</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
