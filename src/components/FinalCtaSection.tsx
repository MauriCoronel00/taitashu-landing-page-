import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Flame, ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion, EASE_EXPO } from '../utils/motion';

interface FinalCtaSectionProps {
  onOpenOrder: (productId?: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenOrder }) => {
  const shouldReduceMotion = useReducedMotion();

  const handleClick = () => {
    trackEvent('click_pedir_ahora', { location: 'final_cta_section' });
    onOpenOrder('dobleton');
  };

  return (
    <section className="relative py-20 sm:py-28 bg-[#0a0908] px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-[#211c19]">
      {/* Background with real flame atmosphere and neon wall */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="./assets/scene-neon-wall.jpg"
          alt="TaitaShu Cartel de Neón"
          className="w-full h-full object-cover object-center opacity-20 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/90 to-[#0a0908]" />

        {/* Ambient flame light pulse */}
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e2231a] rounded-full blur-[120px] pointer-events-none"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2231a]/15 border border-[#e2231a]/30 text-xs sm:text-sm font-bold text-[#ff7a1a] mb-6 shadow-sm">
          <Flame className="w-4 h-4 fill-[#ff7a1a] animate-bounce" />
          <span>Atención al toque por WhatsApp</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#f5f2eb] uppercase tracking-tight leading-[1.05]">
          ¿Ya sabés qué vas a comer?
        </h2>

        <p className="mt-4 sm:mt-5 text-base sm:text-xl text-[#f5f2eb]/80 max-w-xl mx-auto leading-relaxed">
          Las planchas ya están calientes en nuestras 5 sucursales. Armá tu pedido en menos de 1 minuto y coordiná directo por WhatsApp.
        </p>

        <div className="mt-8 sm:mt-10 flex justify-center">
          <motion.button
            id="final-cta-btn-order"
            onClick={handleClick}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={buttonTapMotion}
            className="flame-glow bg-[#e2231a] hover:bg-[#b81710] text-[#f5f2eb] font-display text-2xl tracking-wider px-10 py-5 rounded-2xl shadow-2xl transition-colors flex items-center justify-center gap-3 cursor-pointer border border-[#ff7a1a]/50"
          >
            <Flame className="w-7 h-7 text-[#ffb703] fill-[#ffb703] animate-pulse" />
            <span>PEDIR AHORA 🍔</span>
            <ArrowRight className="w-6 h-6 text-white/90" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};
