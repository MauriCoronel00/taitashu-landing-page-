import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  X,
  Plus,
  Minus,
  Flame,
  MapPin,
  Check,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  CartItem,
  ComboType,
  ExtraOption,
  MultiItemOrder,
  OrderType,
  Product,
} from '../types';
import { BRANCHES } from '../data/branchesData';
import { EXTRA_OPTIONS } from '../data/menuData';
import {
  calculateCartItemTotal,
  calculateMultiOrderTotal,
  formatGs,
  getMultiOrderWhatsAppUrl,
  getWhatsAppOrderUrl,
} from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion, EASE_EXPO } from '../utils/motion';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  defaultBranchId?: string;
  cart: CartItem[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onUpdateCartItemQuantity: (itemId: string, delta: number) => void;
  onRemoveCartItem: (itemId: string) => void;
  onClearCart: () => void;
  initialMode?: 'customize' | 'cart';
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  product,
  allProducts,
  onSelectProduct,
  defaultBranchId,
  cart,
  onAddToCart,
  onUpdateCartItemQuantity,
  onRemoveCartItem,
  onClearCart,
  initialMode = 'customize',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'customize' | 'cart'>(initialMode);

  // Customization state for current product
  const [quantity, setQuantity] = useState<number>(1);
  const [comboType, setComboType] = useState<ComboType>('combo_completo');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [itemNotes, setItemNotes] = useState<string>('');
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // Global order details (Branch, Delivery, Contact)
  const [branchId, setBranchId] = useState<string>(defaultBranchId || 'luque');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [generalNotes, setGeneralNotes] = useState<string>('');

  const isDrinkOrExtra = product.category === 'extras' || product.category === 'bebidas';

  // Synchronize when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setQuantity(1);
      setSelectedExtras([]);
      setItemNotes('');
      setAddedFeedback(false);
      setComboType(isDrinkOrExtra ? 'solo' : 'combo_completo');
      if (defaultBranchId) {
        setBranchId(defaultBranchId);
      }
      trackEvent('view_product', { productId: product.id, productName: product.name });
    }
  }, [isOpen, initialMode, product, defaultBranchId, isDrinkOrExtra]);

  // Current single item pricing preview
  const currentItemDraft: CartItem = {
    id: 'draft',
    product,
    quantity,
    comboType,
    selectedExtras,
    notes: itemNotes,
  };
  const currentItemSubtotal = calculateCartItemTotal(currentItemDraft);

  // Cart totals
  const totalCartUnits = cart.reduce((acc, it) => acc + it.quantity, 0);
  const cartGrandTotal = calculateMultiOrderTotal({
    items: cart,
    branchId,
    orderType,
    deliveryAddress,
    customerName,
    generalNotes,
  });

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      product,
      quantity,
      comboType,
      selectedExtras,
      notes: itemNotes,
    });

    trackEvent('add_to_cart', {
      productId: product.id,
      productName: product.name,
      quantity,
      comboType,
      subtotal: currentItemSubtotal,
    });

    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1800);
  };

  const handleSendSingleDirectToWhatsApp = () => {
    trackEvent('whatsapp_order_sent_direct', {
      productId: product.id,
      productName: product.name,
      quantity,
      comboType,
      branchId,
      orderType,
      total: currentItemSubtotal,
    });

    const singleUrl = getWhatsAppOrderUrl({
      product,
      quantity,
      comboType,
      selectedExtras,
      branchId,
      orderType,
      deliveryAddress,
      customerName,
      notes: itemNotes,
    });

    window.open(singleUrl, '_blank');
    onClose();
  };

  const handleSendMultiOrderToWhatsApp = () => {
    if (cart.length === 0) return;

    const multiOrder: MultiItemOrder = {
      items: cart,
      branchId,
      orderType,
      deliveryAddress,
      customerName,
      generalNotes,
    };

    trackEvent('whatsapp_multi_order_sent', {
      itemCount: totalCartUnits,
      branchId,
      orderType,
      total: cartGrandTotal,
    });

    const url = getMultiOrderWhatsAppUrl(multiOrder);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: EASE_EXPO }}
            className="relative w-full max-w-xl bg-[#14110f] border border-[#2d2622] rounded-t-2xl sm:rounded-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header & Navigation Tabs */}
            <div className="sticky top-0 z-20 bg-[#14110f] border-b border-[#211c19] px-4 sm:px-6 pt-4 pb-0">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e2231a]" />
                  <h2 className="font-display text-xl text-[#f5f2eb] uppercase tracking-wide">
                    {activeTab === 'customize' ? 'Personalizar Producto' : 'Tu Pedido Seleccionado'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#f5f2eb]/70 hover:text-white hover:bg-[#211c19] rounded-lg transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-[#211c19]">
                <button
                  type="button"
                  onClick={() => setActiveTab('customize')}
                  className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                    activeTab === 'customize'
                      ? 'text-[#ff7a1a]'
                      : 'text-[#f5f2eb]/60 hover:text-white'
                  }`}
                >
                  <span>1. Configurar Producto</span>
                  {activeTab === 'customize' && (
                    <motion.div
                      layoutId="modalActiveTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e2231a]"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cart')}
                  className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'cart'
                      ? 'text-[#ff7a1a]'
                      : 'text-[#f5f2eb]/60 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>2. Mi Pedido</span>
                  {totalCartUnits > 0 && (
                    <span className="bg-[#e2231a] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {totalCartUnits}
                    </span>
                  )}
                  {activeTab === 'cart' && (
                    <motion.div
                      layoutId="modalActiveTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e2231a]"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {activeTab === 'customize' ? (
                /* TAB 1: CUSTOMIZE PRODUCT */
                <>
                  {/* Product Summary Header Card */}
                  <div className="flex gap-4 items-center bg-[#1c1917] border border-[#2d2622] rounded-xl p-3 sm:p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-lg shrink-0 bg-black"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold bg-[#e2231a] text-white px-2 py-0.5 rounded">
                          {product.badge}
                        </span>
                        <span className="text-xs text-[#ffb703] font-semibold flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-[#ffb703]" /> TaitaShu Smash
                        </span>
                      </div>
                      <h3 className="font-display text-2xl text-[#f5f2eb] uppercase tracking-wide truncate mt-0.5">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#f5f2eb]/70 line-clamp-2 mt-0.5 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Quick Product Switcher */}
                  {!isDrinkOrExtra && (
                    <div>
                      <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-2 tracking-wider">
                        Elegir otra hamburguesa:
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {allProducts
                          .filter((p) => p.category === 'doubles' || p.category === 'big-smash')
                          .map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => onSelectProduct(p)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                                p.id === product.id
                                  ? 'bg-[#e2231a] text-white border-[#b81710]'
                                  : 'bg-[#1a1614] text-[#f5f2eb]/75 border-[#2b2420] hover:bg-[#28201b]'
                              }`}
                            >
                              {p.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-2 tracking-wider">
                      Cantidad de unidades:
                    </label>
                    <div className="flex items-center gap-4 bg-[#1a1614] border border-[#2b2420] rounded-xl p-2 w-fit">
                      <motion.button
                        whileTap={buttonTapMotion}
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="btn-tactile w-10 h-10 rounded-lg bg-[#26201c] hover:bg-[#332b26] text-white flex items-center justify-center transition-colors cursor-pointer border border-[#3a322c]"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="font-display text-2xl text-[#f5f2eb] px-3 w-8 text-center">
                        {quantity}
                      </span>
                      <motion.button
                        whileTap={buttonTapMotion}
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="btn-tactile w-10 h-10 rounded-lg bg-[#e2231a] hover:bg-[#c91d15] text-white flex items-center justify-center transition-colors cursor-pointer border border-[#b81710]"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Combo Option (For Burgers) */}
                  {!isDrinkOrExtra && (
                    <div>
                      <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-2 tracking-wider">
                        Modalidad:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Solo */}
                        <button
                          type="button"
                          onClick={() => setComboType('solo')}
                          className={`btn-tactile p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                            comboType === 'solo'
                              ? 'bg-[#29221d] border-[#e2231a] text-white'
                              : 'bg-[#1a1614] border-[#2b2420] text-[#f5f2eb]/70 hover:bg-[#201b18]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase">Solo Burger</span>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                comboType === 'solo' ? 'border-[#e2231a] bg-[#e2231a]' : 'border-white/30'
                              }`}
                            >
                              {comboType === 'solo' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/50 mt-1">Huérfano sin acompañamiento</span>
                          <span className="font-display text-sm text-[#ff7a1a] mt-2">
                            {formatGs(product.priceSolo)}
                          </span>
                        </button>

                        {/* Burger + Papas */}
                        <button
                          type="button"
                          onClick={() => setComboType('combo_papas')}
                          className={`btn-tactile p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                            comboType === 'combo_papas'
                              ? 'bg-[#29221d] border-[#e2231a] text-white'
                              : 'bg-[#1a1614] border-[#2b2420] text-[#f5f2eb]/70 hover:bg-[#201b18]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase">+ Papas</span>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                comboType === 'combo_papas'
                                  ? 'border-[#e2231a] bg-[#e2231a]'
                                  : 'border-white/30'
                              }`}
                            >
                              {comboType === 'combo_papas' && (
                                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                              )}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/50 mt-1">Burger + papas rústicas</span>
                          <span className="font-display text-sm text-[#ff7a1a] mt-2">
                            {formatGs(product.priceSolo + 10000)}
                          </span>
                        </button>

                        {/* Combo Completo */}
                        <button
                          type="button"
                          onClick={() => setComboType('combo_completo')}
                          className={`btn-tactile p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer relative ${
                            comboType === 'combo_completo'
                              ? 'bg-[#2a221d] border-[#ff7a1a] text-white'
                              : 'bg-[#1a1614] border-[#2b2420] text-[#f5f2eb]/70 hover:bg-[#201b18]'
                          }`}
                        >
                          <span className="absolute -top-2 right-2 bg-[#ff7a1a] text-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                            Recomendado
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase">Combo Completo</span>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                comboType === 'combo_completo'
                                  ? 'border-[#ff7a1a] bg-[#ff7a1a]'
                                  : 'border-white/30'
                              }`}
                            >
                              {comboType === 'combo_completo' && (
                                <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                              )}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/50 mt-1">Papas + Gaseosa 500ml</span>
                          <span className="font-display text-sm text-[#ffb703] mt-2">
                            {formatGs(product.priceCombo)}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Extras / Adicionales */}
                  {!isDrinkOrExtra && (
                    <div>
                      <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-2 tracking-wider">
                        Adicionales & Extras:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {EXTRA_OPTIONS.map((extra) => {
                          const isChecked = selectedExtras.includes(extra.id);
                          return (
                            <button
                              key={extra.id}
                              type="button"
                              onClick={() => toggleExtra(extra.id)}
                              className={`btn-tactile px-3 py-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                isChecked
                                  ? 'bg-[#2b231d] border-[#ff7a1a] text-white'
                                  : 'bg-[#1a1614] border-[#2b2420] text-[#f5f2eb]/75 hover:bg-[#221c19]'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-xs">
                                <span
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                    isChecked ? 'bg-[#ff7a1a] border-[#ff7a1a]' : 'border-white/30'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 text-black stroke-[3]" />}
                                </span>
                                <span>{extra.name}</span>
                              </div>
                              <span className="text-xs font-semibold text-[#ffb703] shrink-0 ml-2">
                                +{formatGs(extra.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Item Specific Notes */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-1 tracking-wider">
                      Aclaración para esta hamburguesa (opcional):
                    </label>
                    <input
                      type="text"
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                      placeholder="Ej: Sin cebolla, extra servilletas..."
                      className="w-full bg-[#1c1917] border border-[#2b2420] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>
                </>
              ) : (
                /* TAB 2: REVIEW MULTI-ITEM CART */
                <div className="space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-[#1c1917] border border-[#2d2622] rounded-2xl">
                      <ShoppingBag className="w-12 h-12 text-[#f5f2eb]/30 mx-auto mb-3" />
                      <h3 className="font-display text-xl text-[#f5f2eb] uppercase">
                        Tu pedido está vacío
                      </h3>
                      <p className="text-xs text-[#f5f2eb]/60 max-w-sm mx-auto mt-1 mb-6">
                        Seleccioná tus hamburguesas o bebidas favoritas y agregalas con el botón "+ Agregar al pedido".
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('customize')}
                        className="btn-tactile bg-[#e2231a] hover:bg-[#c91d15] text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-[#b81710] cursor-pointer"
                      >
                        Configurar una hamburguesa ahora
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* List of Cart Items */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-[#ff7a1a] tracking-wider">
                            Productos en tu pedido ({totalCartUnits} unidades):
                          </span>
                          <button
                            type="button"
                            onClick={onClearCart}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Vaciar todo</span>
                          </button>
                        </div>

                        {cart.map((item) => {
                          const itemSubtotal = calculateCartItemTotal(item);
                          const isBurger =
                            item.product.category === 'doubles' ||
                            item.product.category === 'big-smash' ||
                            item.product.category === 'favorites';

                          return (
                            <div
                              key={item.id}
                              className="bg-[#1c1917] border border-[#2d2622] rounded-xl p-3 sm:p-4 flex items-start justify-between gap-3"
                            >
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-14 h-14 object-cover rounded-lg shrink-0 bg-black"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-display text-base text-[#f5f2eb] uppercase tracking-wide truncate">
                                      {item.product.name}
                                    </h4>
                                    {isBurger && (
                                      <span className="text-[10px] font-bold bg-[#28211d] text-[#ff7a1a] px-2 py-0.5 rounded border border-[#382e28]">
                                        {item.comboType === 'combo_completo'
                                          ? 'Combo Completo'
                                          : item.comboType === 'combo_papas'
                                          ? '+ Papas'
                                          : 'Solo'}
                                      </span>
                                    )}
                                  </div>

                                  {/* Extras list if any */}
                                  {item.selectedExtras.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.selectedExtras.map((extraId) => {
                                        const extra = EXTRA_OPTIONS.find((e) => e.id === extraId);
                                        return extra ? (
                                          <span
                                            key={extraId}
                                            className="text-[10px] bg-[#29221d] text-[#f5f2eb]/75 px-1.5 py-0.2 rounded"
                                          >
                                            +{extra.name}
                                          </span>
                                        ) : null;
                                      })}
                                    </div>
                                  )}

                                  {item.notes && (
                                    <p className="text-[11px] text-white/50 italic mt-1 truncate">
                                      "{item.notes}"
                                    </p>
                                  )}

                                  <div className="font-display text-sm text-[#ffb703] mt-1.5">
                                    {formatGs(itemSubtotal)}
                                  </div>
                                </div>
                              </div>

                              {/* Item Quantity Controls */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center bg-[#14110f] border border-[#2b2420] rounded-lg p-1">
                                  <button
                                    type="button"
                                    onClick={() => onUpdateCartItemQuantity(item.id, -1)}
                                    className="w-7 h-7 rounded bg-[#211c19] hover:bg-[#2d2521] text-white flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Restar 1"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="font-display text-sm text-white px-2.5">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateCartItemQuantity(item.id, 1)}
                                    className="w-7 h-7 rounded bg-[#e2231a] hover:bg-[#c91d15] text-white flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Sumar 1"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onRemoveCartItem(item.id)}
                                  className="p-2 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Eliminar producto"
                                  aria-label="Eliminar este producto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add more button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('customize')}
                            className="btn-tactile w-full bg-[#1e1916] hover:bg-[#2a231f] text-[#f5f2eb] font-bold text-xs py-3 px-4 rounded-xl border border-[#2e2621] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#ff7a1a]" />
                            <span>AGREGAR OTRA HAMBURGUESA O BEBIDA</span>
                          </button>
                        </div>
                      </div>

                      {/* Sucursal Selector */}
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#ff7a1a] mb-2 tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Sucursal para preparar el pedido:</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {BRANCHES.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setBranchId(b.id);
                                trackEvent('select_branch', { branchId: b.id, branchName: b.name });
                              }}
                              className={`btn-tactile p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                                branchId === b.id
                                  ? 'bg-[#29221d] border-[#e2231a] text-white'
                                  : 'bg-[#1a1614] border-[#2b2420] text-[#f5f2eb]/70 hover:bg-[#201b18]'
                              }`}
                            >
                              <div>
                                <div className="font-bold text-xs text-[#f5f2eb]">{b.name}</div>
                                <div className="text-[10px] text-white/50">{b.city}</div>
                              </div>
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  branchId === b.id ? 'border-[#e2231a] bg-[#e2231a]' : 'border-white/30'
                                }`}
                              >
                                {branchId === b.id && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Order Delivery Type */}
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-2 tracking-wider">
                          Tipo de Entrega:
                        </label>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[
                            { id: 'delivery', label: '🛵 Delivery' },
                            { id: 'takeaway', label: '🥡 Retiro' },
                            { id: 'salon', label: '🍽️ En Salón' },
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setOrderType(type.id as OrderType)}
                              className={`btn-tactile py-2.5 px-1 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                                orderType === type.id
                                  ? 'bg-[#e2231a] text-white border-[#b81710]'
                                  : 'bg-[#1a1614] border-[#2b2420] text-white/70 hover:bg-[#221c19]'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Customer Details & Address */}
                      <div className="space-y-3">
                        {orderType === 'delivery' && (
                          <div>
                            <label className="block text-xs text-white/80 mb-1 font-semibold">
                              Dirección de entrega o Barrio (para el repartidor):
                            </label>
                            <input
                              type="text"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Ej: Barrio San Juan, Luque / Calle y nro."
                              className="w-full bg-[#1c1917] border border-[#2b2420] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff7a1a]"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-white/80 mb-1 font-semibold">
                              Tu nombre (opcional):
                            </label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="Ej: Carlos"
                              className="w-full bg-[#1c1917] border border-[#2b2420] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff7a1a]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/80 mb-1 font-semibold">
                              Aclaraciones generales (opcional):
                            </label>
                            <input
                              type="text"
                              value={generalNotes}
                              onChange={(e) => setGeneralNotes(e.target.value)}
                              placeholder="Ej: Timbre no funciona, pagar con pos..."
                              className="w-full bg-[#1c1917] border border-[#2b2420] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff7a1a]"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Modal Sticky Bottom / Footer with Tactile Clean Buttons */}
            <div className="sticky bottom-0 bg-[#14110f] border-t border-[#211c19] px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-20">
              {activeTab === 'customize' ? (
                <>
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-white/60">Subtotal de este producto:</span>
                      <span className="font-display text-xl sm:text-2xl font-bold text-[#ffb703]">
                        {formatGs(currentItemSubtotal)}
                      </span>
                    </div>

                    {totalCartUnits > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('cart')}
                        className="text-xs text-[#ff7a1a] hover:underline flex items-center gap-1 cursor-pointer sm:ml-3"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Ver pedido ({totalCartUnits})</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Button 1: Add to Cart (Multi-item support) */}
                    <motion.button
                      id="modal-btn-add-to-cart"
                      whileTap={buttonTapMotion}
                      onClick={handleAddToCart}
                      className={`btn-tactile flex-1 sm:flex-initial bg-[#1e1916] hover:bg-[#2c2420] text-[#f5f2eb] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-[#3d322b] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 ${
                        addedFeedback ? 'border-emerald-500 text-emerald-400' : ''
                      }`}
                    >
                      {addedFeedback ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                          <span>¡AGREGADO AL PEDIDO!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-[#ff7a1a]" />
                          <span>AGREGAR AL PEDIDO</span>
                        </>
                      )}
                    </motion.button>

                    {/* Button 2: Direct or Complete Send */}
                    {totalCartUnits > 0 ? (
                      <motion.button
                        id="modal-btn-goto-cart"
                        whileTap={buttonTapMotion}
                        onClick={() => setActiveTab('cart')}
                        className="btn-tactile flex-1 sm:flex-initial bg-[#e2231a] hover:bg-[#c91d15] text-[#f5f2eb] font-bold text-xs sm:text-sm py-3 px-5 rounded-xl border border-[#b81710] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5"
                      >
                        <span>FINALIZAR ({totalCartUnits})</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        id="modal-btn-confirm-direct-whatsapp"
                        whileTap={buttonTapMotion}
                        onClick={handleSendSingleDirectToWhatsApp}
                        className="btn-tactile flex-1 sm:flex-initial bg-[#25d366] hover:bg-[#20ba59] text-black font-bold text-xs sm:text-sm py-3 px-5 rounded-xl border border-[#1ea950] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 font-display tracking-wider"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        <span>PEDIR POR WHATSAPP</span>
                      </motion.button>
                    )}
                  </div>
                </>
              ) : (
                /* CART TAB FOOTER */
                <>
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-white/60">Total a pagar ({totalCartUnits} items):</span>
                      <span className="font-display text-2xl sm:text-3xl font-bold text-[#ffb703]">
                        {formatGs(cartGrandTotal)}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    id="modal-btn-confirm-multi-whatsapp"
                    disabled={cart.length === 0}
                    whileTap={buttonTapMotion}
                    onClick={handleSendMultiOrderToWhatsApp}
                    className={`btn-tactile bg-[#25d366] hover:bg-[#20ba59] text-black font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl border border-[#1ea950] transition-colors flex items-center justify-center gap-2 cursor-pointer font-display tracking-wider active:translate-y-0.5 ${
                      cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>ENVIAR PEDIDO POR WHATSAPP</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
