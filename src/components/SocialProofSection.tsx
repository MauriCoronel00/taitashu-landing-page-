import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Star, Instagram, Flame, Sparkles } from 'lucide-react';
import { REVIEWS } from '../data/menuData';
import { buttonTapMotion, EASE_EXPO } from '../utils/motion';

export const SocialProofSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE_EXPO },
    },
  };

  return (
    <section id="opiniones" className="py-16 sm:py-24 bg-[#0d0b09] px-4 sm:px-6 lg:px-8 border-t border-[#211c19] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#ff7a1a] font-bold mb-2">
            <Star className="w-4 h-4 text-[#ffb703] fill-[#ffb703]" />
            <span>Comunidad Fiel</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#f5f2eb] uppercase tracking-tight">
            ⭐ Lo que dicen nuestros clientes
          </h2>
          <p className="text-sm sm:text-base text-[#f5f2eb]/75 mt-2">
            La mejor prueba de que el fuego y la plancha de verdad hacen la diferencia.
          </p>
        </motion.div>

        {/* Reviews Grid with Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {REVIEWS.map((review) => (
            <motion.div
              key={review.id}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -5,
                      borderColor: 'rgba(255, 183, 3, 0.4)',
                    }
              }
              className="bg-[#14110f] border border-[#211c19] rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-colors"
            >
              <div>
                {/* 5 Stars with subtle glow */}
                <div className="flex items-center gap-1 text-[#ffb703] mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffb703]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-[#f5f2eb]/85 italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              {/* Author & City Footer */}
              <div className="mt-6 pt-4 border-t border-[#211c19] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e2231a]/20 text-[#ff7a1a] font-bold text-xs flex items-center justify-center border border-[#ff7a1a]/30">
                    {review.avatarText}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#f5f2eb]">
                      — {review.author}
                    </div>
                    <div className="text-[10px] text-[#f5f2eb]/50">
                      {review.city}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-white/40">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social community strip (Instagram / TikTok) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 bg-[#161311] border border-[#211c19] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-lg">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl text-[#f5f2eb] uppercase">
                Etiquetanos en tus historias
              </h3>
              <p className="text-xs sm:text-sm text-[#f5f2eb]/70 mt-0.5">
                Subí tu smash recién llegada con el hashtag <strong className="text-[#ff7a1a]">#TaitashuBurgers</strong>
              </p>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={buttonTapMotion}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#211c19] hover:bg-[#2c2521] text-[#f5f2eb] hover:text-[#ff7a1a] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-[#2d2622] transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow"
          >
            <Instagram className="w-4 h-4" />
            <span>Ver fotos de clientes</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
