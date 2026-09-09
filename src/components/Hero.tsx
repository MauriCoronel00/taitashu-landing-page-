import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Flame, ArrowRight, Sparkles, Clock, MapPin } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion } from '../utils/motion';

interface HeroProps {
  onOpenOrder: (productId?: string) => void;
  onScrollToMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrder, onScrollToMenu }) => {
  const shouldReduceMotion = useReducedMotion();

  const handlePrimaryCta = () => {
    trackEvent('click_pedir_ahora', { location: 'hero_primary_button' });
    onOpenOrder('dobleton'); // pre-select Dobletón (signature #1 best seller)
  };

  const handleSecondaryCta = () => {
    trackEvent('click_ver_menu', { location: 'hero_secondary_button' });
    onScrollToMenu();
  };

  // Staggered sequence timings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const imageCardVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.75, delay: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#0a0908] pt-6 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background with real store Luque atmosphere & cinematic warm gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.03, opacity: 0.22 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src="./assets/scene-principal-luque.jpg"
          alt="Local TaitaShu Luque"
          className="w-full h-full object-cover object-center filter brightness-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/90 to-[#0a0908]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0a0908]/50 to-[#0a0908]" />

        {/* Dynamic Warm Ambient Glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#e2231a]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ff7a1a]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Cinematographic Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* 1. Brand Logo Mark & Live Status Badge */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181412] border border-[#ff7a1a]/30 text-xs sm:text-sm font-semibold text-[#f5f2eb] shadow-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[#ffb703] font-bold">Planchas al rojo vivo</span>
                <span className="text-white/30">•</span>
                <span className="text-white/80">Hoy 19:30 a 00:30 hs</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#211c19]/70 border border-white/10 text-xs text-[#f5f2eb]/75">
                <MapPin className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>5 Sucursales en Gran Asunción</span>
              </div>
            </motion.div>

            {/* 2. Main Headline: Kinetic High-Contrast Motion */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-6xl md:text-7xl xl:text-[5rem] font-bold tracking-tight text-[#f5f2eb] uppercase leading-[0.98] max-w-2xl"
            >
              Hamburguesas <br />
              <span className="text-[#e2231a] relative inline-block">
                Smash
                <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#e2231a]/40 rounded-full blur-[2px]" />
              </span>{' '}
              al Fuego Real
            </motion.h1>

            {/* 3. Subheadline: Clear, Craving-Inducing */}
            <motion.p
              variants={itemVariants}
              className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#f5f2eb]/85 font-normal max-w-xl leading-relaxed"
            >
              Carne 100% vacuna prensada al hierro candente con costra caramelizada crujiente, queso cheddar fundido y pan brioche tostado. Hechas al momento en nuestras <strong className="text-[#ff7a1a] font-semibold">5 sucursales</strong>.
            </motion.p>

            {/* 4. CTAs Block (High-Conversion Stagger) */}
            <motion.div
              variants={itemVariants}
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
            >
              {/* Dominant Primary CTA with Magnetic / Spring Motion */}
              <motion.button
                id="hero-cta-order"
                onClick={handlePrimaryCta}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={buttonTapMotion}
                className="flame-glow bg-[#e2231a] hover:bg-[#b81710] text-[#f5f2eb] font-display text-xl tracking-wider px-8 py-4 sm:py-4.5 rounded-2xl shadow-2xl transition-colors flex items-center justify-center gap-3 cursor-pointer border border-[#ff7a1a]/50"
              >
                <Flame className="w-6 h-6 text-[#ffb703] fill-[#ffb703] animate-pulse" />
                <span>PEDIR AHORA</span>
                <ArrowRight className="w-5 h-5 text-white/90" />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                id="hero-cta-menu"
                onClick={handleSecondaryCta}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(45, 38, 34, 0.95)' }}
                whileTap={buttonTapMotion}
                className="bg-[#211c19]/90 text-[#f5f2eb] hover:text-[#ff7a1a] font-bold text-base px-6 py-4 rounded-2xl border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>VER MENÚ COMPLETO</span>
              </motion.button>
            </motion.div>

            {/* 5. Micro-Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-[#211c19] w-full grid grid-cols-3 gap-2 sm:gap-4 max-w-lg text-center sm:text-left"
            >
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl text-[#ff7a1a]">5 SUCURSALES</span>
                <span className="text-[11px] sm:text-xs text-white/60">Asu • Lambaré • Luque • Fdo • Mariano</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl text-[#ffb703]">WHATSAPP DIRECTO</span>
                <span className="text-[11px] sm:text-xs text-white/60">Atención al instante sin apps intermedias</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl text-[#e2231a]">DELIVERY & SALÓN</span>
                <span className="text-[11px] sm:text-xs text-white/60">Caliente y recién salida de la plancha</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Product Card with Motion Frame & Floating Breathing */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              variants={imageCardVariants}
              initial="hidden"
              animate="visible"
              className="relative w-full max-w-md lg:max-w-none"
            >
              {/* Glowing aura behind burger */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#e2231a]/40 via-[#ff7a1a]/30 to-transparent rounded-3xl blur-2xl opacity-75 pointer-events-none" />

              {/* Floating Container (Gentle organic breathing) */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [-5, 5, -5],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: 'easeInOut',
                }}
                className="relative bg-[#14110f] border border-[#2d2622] rounded-3xl p-3 sm:p-4 shadow-2xl overflow-hidden group hover:border-[#ff7a1a]/50 transition-colors"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    src="./assets/menu-dobleton.jpg"
                    alt="Burger Dobletón - Especialidad de TaitaShu"
                    className="w-full h-full object-cover"
                  />

                  {/* Floating Best Seller Badge */}
                  <div className="absolute top-3 left-3 bg-[#e2231a] text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffb703] fill-[#ffb703]" />
                    <span>#1 Más Vendido</span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-3 bg-[#0a0908]/90 backdrop-blur-md border border-[#ff7a1a]/40 px-3.5 py-1.5 rounded-xl text-right shadow-lg">
                    <div className="text-[10px] uppercase font-bold text-[#ff7a1a]">Combo Completo</div>
                    <div className="text-lg sm:text-xl font-display text-white">65.000 Gs</div>
                  </div>
                </div>

                {/* Card footer details with fast order button */}
                <div className="mt-3.5 px-1 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl text-[#f5f2eb]">DOBLETÓN</h3>
                    <p className="text-xs text-[#f5f2eb]/70 line-clamp-1">
                      Doble carne smash, doble huevo, panceta crocante y cheddar fundido.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={buttonTapMotion}
                    onClick={handlePrimaryCta}
                    className="shrink-0 bg-[#ff7a1a] hover:bg-[#e2231a] text-black hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow"
                  >
                    PEDIR ESTA
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
