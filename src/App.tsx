import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickExplainer } from './components/QuickExplainer';
import { FavoritesSection } from './components/FavoritesSection';
import { MenuSection } from './components/MenuSection';
import { BranchesSection } from './components/BranchesSection';
import { SocialProofSection } from './components/SocialProofSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { OrderModal } from './components/OrderModal';
import { PRODUCTS } from './data/menuData';
import { Product } from './types';

export default function App() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]); // Dobletón by default
  const [activeBranchId, setActiveBranchId] = useState<string>('luque');

  // Smooth scroll progress bar at top of screen
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleOpenOrder = (productId?: string) => {
    if (productId) {
      const found = PRODUCTS.find((p) => p.id === productId);
      if (found) setSelectedProduct(found);
    }
    setIsOrderModalOpen(true);
  };

  const handleSelectBranchAndOrder = (branchId: string) => {
    setActiveBranchId(branchId);
    setIsOrderModalOpen(true);
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-[#f5f2eb] font-body selection:bg-[#ff7a1a] selection:text-black">
      {/* Scroll Progress Bar at very top */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#e2231a] via-[#ff7a1a] to-[#ffb703] origin-left z-50 pointer-events-none shadow-[0_0_8px_rgba(255,122,26,0.6)]"
      />

      {/* Subtle background grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        }}
      />

      {/* Main Navigation with Motion Frame */}
      <Navbar onOpenOrder={() => handleOpenOrder('dobleton')} />

      <main>
        {/* Step 1: Cinematic Hero — 3-Second High-Conversion Impact */}
        <Hero
          onOpenOrder={handleOpenOrder}
          onScrollToMenu={handleScrollToMenu}
        />

        {/* Step 2: Understand What is TaitaShu (Value Proposition) with Staggered Scroll Trigger */}
        <QuickExplainer />

        {/* Step 3: Los Favoritos de TaitaShu (3-5 top sellers with microinteractions) */}
        <FavoritesSection
          products={PRODUCTS}
          onOpenOrder={handleOpenOrder}
          onScrollToMenu={handleScrollToMenu}
        />

        {/* Step 4: Full Categorized Visual Menu with Fluid Layout Animations */}
        <MenuSection
          products={PRODUCTS}
          onOpenOrder={handleOpenOrder}
        />

        {/* Step 5: Red de Fuegos — 5 Sucursales Activas */}
        <BranchesSection
          onSelectBranchAndOrder={handleSelectBranchAndOrder}
        />

        {/* Step 6: Prueba Social — Opiniones Reales de Clientes */}
        <SocialProofSection />

        {/* Step 7: Final Conversion CTA Before Footer */}
        <FinalCtaSection onOpenOrder={handleOpenOrder} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Bottom Bar on Mobile with AnimatePresence */}
      <StickyMobileBar onOpenOrder={() => handleOpenOrder('dobleton')} />

      {/* Order Customizer Modal (Product Detail -> Customize -> WhatsApp) */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        allProducts={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
        defaultBranchId={activeBranchId}
      />
    </div>
  );
}
