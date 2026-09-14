import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Flame, MapPin, Zap } from 'lucide-react';
import { EASE_EXPO } from '../utils/motion';

export const QuickExplainer: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE_EXPO },
    },
  };

  return (
    <section className="py-14 sm:py-18 bg-[#0d0b09] border-y border-[#211c19] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual grain & light glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#e2231a]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs uppercase tracking-widest text-[#ff7a1a] font-bold inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-[#ff7a1a]" />
            La Experiencia TaitaShu
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#f5f2eb] mt-1.5 uppercase tracking-wide">
            ¿Por qué nuestras Smash son distintas?
          </h2>
          <p className="text-xs sm:text-sm text-[#f5f2eb]/70 mt-2">
            No hacemos hamburguesas comunes. Combinamos técnica de hierro ardiente con ingredientes frescos cada noche.
          </p>
        </motion.div>

        {/* 3 Pillars with Scroll-Triggered Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Pillar 1: Técnica Smash */}
          <motion.div
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { y: -6, borderColor: 'rgba(255, 122, 26, 0.4)' }}
            className="bg-[#14110f] border border-[#211c19] rounded-2xl p-6 transition-all duration-300 flex flex-col items-start group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e2231a]/15 text-[#e2231a] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#e2231a]/25 transition-transform duration-300">
              <Flame className="w-6 h-6 fill-[#e2231a]" />
            </div>
            <h3 className="font-display text-xl text-[#f5f2eb] uppercase tracking-wide group-hover:text-[#ff7a1a] transition-colors">
              Técnica Smash al Hierro
            </h3>
            <p className="text-xs sm:text-sm text-[#f5f2eb]/75 mt-2 leading-relaxed">
              Carne 100% vacuna prensada con peso a plancha candente. Crea una costra caramelizada crujiente (reacción de Maillard) que sella todos los jugos por dentro.
            </p>
          </motion.div>

          {/* Pillar 2: Ingredientes */}
          <motion.div
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { y: -6, borderColor: 'rgba(255, 122, 26, 0.4)' }}
            className="bg-[#14110f] border border-[#211c19] rounded-2xl p-6 transition-all duration-300 flex flex-col items-start group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-[#ff7a1a]/15 text-[#ff7a1a] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#ff7a1a]/25 transition-transform duration-300">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-[#f5f2eb] uppercase tracking-wide group-hover:text-[#ff7a1a] transition-colors">
              Pan Brioche & Queso Real
            </h3>
            <p className="text-xs sm:text-sm text-[#f5f2eb]/75 mt-2 leading-relaxed">
              Panes horneados a diario dorados al punto con manteca al fuego y abundante queso cheddar fundido que desborda en cada mordisco sin trucos.
            </p>
          </motion.div>

          {/* Pillar 3: 5 Sucursales */}
          <motion.div
            variants={cardVariants}
            whileHover={shouldReduceMotion ? {} : { y: -6, borderColor: 'rgba(255, 122, 26, 0.4)' }}
            className="bg-[#14110f] border border-[#211c19] rounded-2xl p-6 transition-all duration-300 flex flex-col items-start group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-transform duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-[#f5f2eb] uppercase tracking-wide group-hover:text-[#ff7a1a] transition-colors">
              5 Sucursales Activas
            </h3>
            <p className="text-xs sm:text-sm text-[#f5f2eb]/75 mt-2 leading-relaxed">
              Desde Luque hasta Asunción, Lambaré, Fernando y Mariano. Pedís por WhatsApp y coordinás directo con el local más cercano para delivery o retiro al toque.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
