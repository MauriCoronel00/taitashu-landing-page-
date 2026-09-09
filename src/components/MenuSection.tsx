import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Flame } from 'lucide-react';
import { Product } from '../types';
import { formatGs } from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion, EASE_EXPO } from '../utils/motion';

interface MenuSectionProps {
  products: Product[];
  onOpenOrder: (productId: string) => void;
}

type MenuTab = 'all' | 'doubles' | 'big-smash' | 'extras' | 'bebidas';

interface TabItem {
  id: MenuTab;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'all', label: 'Todas las opciones' },
  { id: 'doubles', label: 'Doubles' },
  { id: 'big-smash', label: 'Big Smash' },
  { id: 'extras', label: 'Extras & Papas' },
  { id: 'bebidas', label: 'Bebidas Heladas' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({ products, onOpenOrder }) => {
  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const shouldReduceMotion = useReducedMotion();

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'doubles') return p.category === 'doubles';
    if (activeTab === 'big-smash') return p.category === 'big-smash';
    if (activeTab === 'extras') return p.category === 'extras';
    if (activeTab === 'bebidas') return p.category === 'bebidas';
    return true;
  });

  const handleSelectProduct = (product: Product) => {
    trackEvent('select_product', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      section: 'menu_grid',
    });
    onOpenOrder(product.id);
  };

  const handleTabChange = (tab: MenuTab) => {
    setActiveTab(tab);
    trackEvent('click_ver_menu', { category_tab: tab });
  };

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#0d0b09] px-4 sm:px-6 lg:px-8 border-t border-[#211c19] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#ff7a1a] font-bold mb-2">
            <Flame className="w-4 h-4 text-[#e2231a] fill-[#e2231a]" />
            <span>La Carta al Hierro</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#f5f2eb] uppercase tracking-tight">
            Menú Completo <span className="text-[#e2231a]">TaitaShu</span>
          </h2>
          <p className="text-sm sm:text-base text-[#f5f2eb]/75 mt-2">
            Elegí tu burger, personalizala con tus extras favoritos y mandá el pedido directo por WhatsApp en segundos.
          </p>
        </motion.div>

        {/* Animated Sliding Pill Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? 'text-white' : 'text-[#f5f2eb]/70 hover:text-white bg-[#1a1614] hover:bg-[#241e1a]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-[#e2231a] rounded-full shadow-lg shadow-red-950/60 border border-[#ff7a1a]/40"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid with Smooth Layout Animation */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const isDrinkOrExtra =
                product.category === 'extras' || product.category === 'bebidas';

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE_EXPO }}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -6,
                          borderColor: 'rgba(255, 122, 26, 0.45)',
                          boxShadow: '0 16px 24px -8px rgba(0, 0, 0, 0.5)',
                        }
                  }
                  className="bg-[#14110f] border border-[#211c19] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group transition-colors"
                >
                  <div>
                    {/* Large appetizing image with smooth hover zoom */}
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                        transition={{ duration: 0.35, ease: EASE_EXPO }}
                        className="w-full h-full object-cover transform transition-transform"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#e2231a] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                        {product.badge}
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-display text-xl text-[#f5f2eb] uppercase tracking-wide group-hover:text-[#ff7a1a] transition-colors">
                        {product.name}
                      </h3>

                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-2">
                          {product.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] bg-[#1e1916] text-[#f5f2eb]/70 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-[#f5f2eb]/70 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Strip: PRODUCTO + PRECIO + PEDIR */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-[#211c19]/50 mt-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#ff7a1a]">
                        {isDrinkOrExtra ? 'Precio' : 'Combo'}
                      </div>
                      <div className="font-display text-xl text-[#f5f2eb]">
                        {formatGs(product.priceCombo)}
                      </div>
                      {!isDrinkOrExtra && (
                        <div className="text-[10px] text-[#f5f2eb]/50">
                          Solo: {formatGs(product.priceSolo)}
                        </div>
                      )}
                    </div>

                    <motion.button
                      id={`menu-item-order-${product.id}`}
                      onClick={() => handleSelectProduct(product)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={buttonTapMotion}
                      className="bg-[#e2231a] hover:bg-[#b81710] text-[#f5f2eb] font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer border border-[#ff7a1a]/30"
                    >
                      <Flame className="w-3.5 h-3.5 text-[#ffb703] fill-[#ffb703]" />
                      <span>PEDIR</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Note banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 bg-[#161311] border border-[#211c19] rounded-2xl p-4 sm:p-5 text-center text-xs sm:text-sm text-[#f5f2eb]/70 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
        >
          <span className="font-bold text-[#ffb703]">ℹ️ ¿Qué incluye el Combo?</span>
          <span>Todas las hamburguesas en combo incluyen papas rústicas y gaseosa de 500ml.</span>
        </motion.div>
      </div>
    </section>
  );
};
