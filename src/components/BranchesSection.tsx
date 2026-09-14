import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MapPin, Clock, Phone, ExternalLink, Flame } from 'lucide-react';
import { BRANCHES } from '../data/branchesData';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion, EASE_EXPO } from '../utils/motion';

interface BranchesSectionProps {
  onSelectBranchAndOrder: (branchId: string) => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({ onSelectBranchAndOrder }) => {
  const shouldReduceMotion = useReducedMotion();

  const handleBranchOrder = (branchId: string, branchName: string) => {
    trackEvent('select_branch', { branchId, branchName, source: 'branches_grid_btn' });
    onSelectBranchAndOrder(branchId);
  };

  const handleMapsClick = (branchName: string, url: string) => {
    trackEvent('branch_maps_clicked', { branchName, url });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
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
    <section id="sucursales" className="py-16 sm:py-24 bg-[#0a0908] px-4 sm:px-6 lg:px-8 border-t border-[#211c19] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#ff7a1a] font-bold mb-2">
            <MapPin className="w-4 h-4 text-[#e2231a]" />
            <span>Red de fuegos en Gran Asunción</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#f5f2eb] uppercase tracking-tight">
            📍 ¿Dónde querés pedir?
          </h2>
          <p className="text-sm sm:text-base text-[#f5f2eb]/75 mt-3">
            Elegí tu sucursal más cercana para pasar a retirar, disfrutar en el salón o pedir delivery directo con atención inmediata por WhatsApp.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-[#211c19]/80 border border-[#e2231a]/30 text-xs sm:text-sm font-semibold text-[#f5f2eb] px-4 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Horario unificado: Lunes a Domingos de 19:30 a 00:30 hs.</span>
          </div>
        </motion.div>

        {/* 5 Branches Cards Grid with Motion Frame */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {BRANCHES.map((b) => (
            <motion.div
              key={b.id}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -6,
                      borderColor: 'rgba(255, 122, 26, 0.45)',
                      boxShadow: '0 16px 24px -8px rgba(0, 0, 0, 0.5)',
                    }
              }
              className="bg-[#14110f] border border-[#211c19] rounded-3xl overflow-hidden shadow-xl transition-colors flex flex-col justify-between group"
            >
              <div>
                {/* Branch Real Image */}
                <div className="relative aspect-[16/9] bg-black overflow-hidden">
                  <motion.img
                    src={b.image}
                    alt={b.name}
                    loading="lazy"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                    transition={{ duration: 0.35, ease: EASE_EXPO }}
                    className="w-full h-full object-cover transform transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-transparent opacity-80" />

                  {b.badge && (
                    <div className="absolute top-3 left-3 bg-[#e2231a] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
                      {b.badge}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#0a0908]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-emerald-400 font-semibold border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-2.5" />
                    <span>Planchas activas • Abierto</span>
                  </div>
                </div>

                {/* Branch Info */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="font-display text-2xl text-[#f5f2eb] uppercase tracking-wide group-hover:text-[#ff7a1a] transition-colors">
                    {b.name}
                  </h3>

                  <div className="space-y-2 text-xs text-[#f5f2eb]/80">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#ff7a1a] shrink-0 mt-0.5" />
                      <span>{b.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#ffb703] shrink-0" />
                      <span>{b.hours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#25d366] shrink-0" />
                      <span>WhatsApp: {b.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 space-y-2 border-t border-[#211c19]/60 mt-2">
                <motion.button
                  id={`btn-order-branch-${b.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={buttonTapMotion}
                  onClick={() => handleBranchOrder(b.id, b.name)}
                  className="btn-tactile w-full bg-[#e2231a] hover:bg-[#c91d15] text-[#f5f2eb] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-[#b81710] transition-colors flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  <Flame className="w-4 h-4 text-[#ffb703] fill-[#ffb703]" />
                  <span>PEDIR EN ESTA SUCURSAL</span>
                </motion.button>

                <motion.a
                  whileTap={buttonTapMotion}
                  href={b.gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleMapsClick(b.name, b.gmapsUrl)}
                  className="btn-tactile w-full bg-[#1c1917] hover:bg-[#28211d] text-[#f5f2eb]/80 hover:text-white font-medium text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#2d2622] active:translate-y-0.5"
                >
                  <span>Ver ubicación en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
