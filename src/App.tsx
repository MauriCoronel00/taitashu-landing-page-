import React, { useState, useEffect } from 'react';
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
import { CartItem, Product } from './types';
import { calculateMultiOrderTotal } from './utils/whatsapp';

const CART_STORAGE_KEY = 'taitashu_cart_items_v2';

export default function App() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'customize' | 'cart'>('customize');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]); // Dobletón by default
  const [activeBranchId, setActiveBranchId] = useState<string>('luque');

  // Multi-item cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage error
    }
  }, [cart]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = calculateMultiOrderTotal({
    items: cart,
    branchId: activeBranchId,
    orderType: 'delivery',
    deliveryAddress: '',
    customerName: '',
    generalNotes: '',
  });

  const handleAddToCart = (newItemData: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      // Check if identical item already exists
      const existingIndex = prev.findIndex(
        (it) =>
          it.product.id === newItemData.product.id &&
          it.comboType === newItemData.comboType &&
          it.notes === newItemData.notes &&
          it.selectedExtras.length === newItemData.selectedExtras.length &&
          it.selectedExtras.every((e) => newItemData.selectedExtras.includes(e))
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItemData.quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        ...newItemData,
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      };
      return [...prev, newItem];
    });
  };

  const handleUpdateCartItemQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

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
    setModalMode('customize');
    setIsOrderModalOpen(true);
  };

  const handleOpenCart = () => {
    if (cart.length > 0) {
      setModalMode('cart');
    } else {
      setModalMode('customize');
    }
    setIsOrderModalOpen(true);
  };

  const handleSelectBranchAndOrder = (branchId: string) => {
    setActiveBranchId(branchId);
    if (cart.length > 0) {
      setModalMode('cart');
    } else {
      setModalMode('customize');
    }
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
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#e2231a] via-[#ff7a1a] to-[#ffb703] origin-left z-50 pointer-events-none"
      />

      {/* Subtle background grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        }}
      />

      {/* Main Navigation with Multi-Item Cart Indicator */}
      <Navbar
        onOpenOrder={handleOpenCart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
      />

      <main>
        {/* Step 1: Cinematic Hero */}
        <Hero
          onOpenOrder={handleOpenOrder}
          onScrollToMenu={handleScrollToMenu}
        />

        {/* Step 2: Understand What is TaitaShu */}
        <QuickExplainer />

        {/* Step 3: Los Favoritos de TaitaShu */}
        <FavoritesSection
          products={PRODUCTS}
          onOpenOrder={handleOpenOrder}
          onScrollToMenu={handleScrollToMenu}
        />

        {/* Step 4: Full Categorized Visual Menu */}
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

      {/* Sticky Bottom Bar on Mobile */}
      <StickyMobileBar
        onOpenOrder={handleOpenCart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
      />

      {/* Order Customizer & Multi-Item Cart Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        allProducts={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
        defaultBranchId={activeBranchId}
        cart={cart}
        onAddToCart={handleAddToCart}
        onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
        onRemoveCartItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        initialMode={modalMode}
      />
    </div>
  );
}
