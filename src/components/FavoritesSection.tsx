import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Star, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatGs } from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion, EASE_EXPO } from '../utils/motion';

interface FavoritesSectionProps {
  products: Product[];
  onOpenOrder: (productId: string) => void;
  onScrollToMenu: () => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  products,
  onOpenOrder,
  onScrollToMenu,
}) => {
  const shouldReduceMotion = useReducedMotion();
  // Highlighted best-sellers: Dobletón, BBQ, Crispy, Trouble, Honey
  const favorites = products.filter((p) => p.isFavorite).slice(0, 5);

  const handleOrderClick = (product: Product) => {
    trackEvent('select_product', {
      productId: product.id,
      productName: product.name,
      section: 'favoritos',
    });
    onOpenOrder(product.id);
  };

  const handleViewAllMenu = () => {
    trackEvent('click_ver_menu', { section: 'favoritos_cta_bottom' });
    onScrollToMenu();
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE_EXPO },
    },
  };

  return (
    <section id="favoritos" className="py-16 sm:py-24 bg-[#0a0908] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#e2231a]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#ff7a1a] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffb703] fill-[#ffb703]" />
              <span>Los más pedidos de la semana</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#f5f2eb] uppercase tracking-tight">
              ⭐ Los Favoritos de <span className="text-[#e2231a]">TaitaShu</span>
            </h2>
            <p className="text-sm sm:text-base text-[#f5f2eb]/75 mt-2 max-w-xl">
              Si es tu primera vez o querés ir a lo seguro: estas son las combinaciones que nunca fallan al fuego.
            </p>
          </motion.div>

          <motion.button
            onClick={handleViewAllMenu}
            whileHover={{ x: 4 }}
            whileTap={buttonTapMotion}
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#ff7a1a] hover:text-[#f5f2eb] transition-colors group cursor-pointer"
          >
            <span>Ver menú completo</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </div>

        {/* 5 Featured Cards Grid with Stagger & Micro-interactions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {favorites.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -8,
                      borderColor: 'rgba(255, 122, 26, 0.5)',
                      boxShadow: '0 20px 30px -10px rgba(226, 35, 26, 0.2)',
                    }
              }
              transition={{ duration: 0.25, ease: EASE_EXPO }}
              className={`bg-[#14110f] border rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-colors ${
                idx === 0
                  ? 'border-[#ff7a1a]/60 shadow-orange-950/20'
                  : 'border-[#211c19] hover:border-[#ff7a1a]/40'
              }`}
            >
              <div>
                {/* Product Thumbnail with Badges and hover scale */}
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.07 }}
                    transition={{ duration: 0.4, ease: EASE_EXPO }}
                    className="w-full h-full object-cover transform transition-transform duration-500"
                  />

                  {/* Highlight pill */}
                  {item.highlight && (
                    <div className="absolute top-3 left-3 bg-[#0a0908]/90 backdrop-blur-md border border-[#ff7a1a]/40 text-[#ffb703] text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Flame className="w-3 h-3 text-[#ff7a1a] fill-[#ff7a1a]" />
                      <span>{item.highlight}</span>
                    </div>
                  )}

                  {/* Badge category */}
                  <div className="absolute top-3 right-3 bg-[#e2231a] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                    {item.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  {/* Name */}
                  <h3 className="font-display text-2xl text-[#f5f2eb] uppercase tracking-wide group-hover:text-[#ff7a1a] transition-colors">
                    {item.name}
                  </h3>

                  {/* Ingredient Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5 mb-3">
                    {item.tags.slice(0, 4).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-[11px] font-medium bg-[#211c19] text-[#f5f2eb]/80 px-2.5 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Short description */}
                  <p className="text-xs sm:text-sm text-[#f5f2eb]/70 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Pricing & Call-To-Action Footer */}
              <div className="p-5 sm:p-6 pt-0 border-t border-[#211c19]/60 mt-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase font-bold text-[#ff7a1a]">
                    Combo completo
                  </div>
                  <div className="font-display text-2xl text-[#f5f2eb]">
                    {formatGs(item.priceCombo)}
                  </div>
                  <div className="text-[10px] text-[#f5f2eb]/50">
                    Huérfano: {formatGs(item.priceSolo)}
                  </div>
                </div>

                <motion.button
                  id={`btn-fav-pedir-${item.id}`}
                  onClick={() => handleOrderClick(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={buttonTapMotion}
                  className="btn-tactile bg-[#e2231a] hover:bg-[#c91d15] text-[#f5f2eb] font-display text-base tracking-wider px-5 py-2.5 rounded-xl border border-[#b81710] transition-colors flex items-center gap-1.5 cursor-pointer active:translate-y-0.5"
                >
                  <Flame className="w-4 h-4 text-[#ffb703] fill-[#ffb703]" />
                  <span>PEDIR</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View full menu CTA at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <motion.button
            id="btn-ver-menu-completo"
            onClick={handleViewAllMenu}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTapMotion}
            className="btn-tactile inline-flex items-center gap-3 bg-[#1c1917] hover:bg-[#292524] text-[#f5f2eb] hover:text-[#ff7a1a] font-bold text-base px-8 py-3.5 rounded-xl border border-[#3a322c] transition-colors group cursor-pointer active:translate-y-0.5"
          >
            <span>VER MENÚ COMPLETO →</span>
            <Flame className="w-4 h-4 text-[#ff7a1a]" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
