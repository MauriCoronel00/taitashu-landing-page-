import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Plus, Minus, Flame, MapPin, Check, Send, Sparkles } from 'lucide-react';
import { ComboType, ExtraOption, OrderItemCustomization, OrderType, Product } from '../types';
import { BRANCHES } from '../data/branchesData';
import { EXTRA_OPTIONS } from '../data/menuData';
import { calculateOrderTotal, formatGs, getWhatsAppOrderUrl } from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';
import { buttonTapMotion, EASE_EXPO } from '../utils/motion';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  defaultBranchId?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  product,
  allProducts,
  onSelectProduct,
  defaultBranchId,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [quantity, setQuantity] = useState<number>(1);
  const [comboType, setComboType] = useState<ComboType>('combo_completo');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [branchId, setBranchId] = useState<string>(defaultBranchId || 'luque');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const isDrinkOrExtra = product.category === 'extras' || product.category === 'bebidas';

  // Reset or adjust configuration when product opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedExtras([]);
      setComboType(isDrinkOrExtra ? 'solo' : 'combo_completo');
      if (defaultBranchId) {
        setBranchId(defaultBranchId);
      }
      trackEvent('view_product', { productId: product.id, productName: product.name });
    }
  }, [isOpen, product, defaultBranchId, isDrinkOrExtra]);

  const currentCustomization: OrderItemCustomization = {
    product,
    quantity,
    comboType,
    selectedExtras,
    branchId,
    orderType,
    deliveryAddress,
    customerName,
    notes,
  };

  const currentTotal = calculateOrderTotal(currentCustomization);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const handleSendToWhatsApp = () => {
    trackEvent('whatsapp_order_sent', {
      productId: product.id,
      productName: product.name,
      quantity,
      comboType,
      branchId,
      orderType,
      total: currentTotal,
    });

    const url = getWhatsAppOrderUrl(currentCustomization);
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
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: shouldReduceMotion ? 0 : 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: 20 }}
            transition={{ duration: 0.28, ease: EASE_EXPO }}
            className="relative w-full max-w-xl bg-[#14110f] border border-[#2d2622] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-[#14110f]/95 backdrop-blur-md px-5 py-4 border-b border-[#211c19] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a] animate-pulse" />
                <h2 className="font-display text-xl text-[#f5f2eb] uppercase tracking-wide">
                  Personalizá tu Pedido
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#f5f2eb]/70 hover:text-white hover:bg-[#211c19] rounded-full transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Product Summary Header Card */}
              <div className="flex gap-4 items-center bg-[#1a1614] border border-[#28211d] rounded-2xl p-3 sm:p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0 bg-black shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold bg-[#e2231a] text-white px-2 py-0.5 rounded">
                      {product.badge}
                    </span>
                    <span className="text-xs text-[#ffb703] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> TaitaShu Smash
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-[#f5f2eb] uppercase tracking-wide truncate mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#f5f2eb]/70 line-clamp-2 mt-0.5">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Quick Product Switcher if user wants another burger */}
              {!isDrinkOrExtra && (
                <div>
                  <label className="block text-xs uppercase font-bold text-[#ff7a1a] mb-2 tracking-wider">
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
                              ? 'bg-[#e2231a] text-white border-[#ff7a1a]'
                              : 'bg-[#1e1916] text-[#f5f2eb]/75 border-[#2b2420] hover:bg-[#28201b]'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector with Animated Pop */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-2 tracking-wider">
                  Cantidad:
                </label>
                <div className="flex items-center gap-4 bg-[#1a1614] border border-[#2b2420] rounded-xl p-2 w-fit">
                  <motion.button
                    whileTap={buttonTapMotion}
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg bg-[#251f1b] hover:bg-[#322a25] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <motion.span
                    key={quantity}
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="font-display text-2xl text-[#f5f2eb] px-3 w-8 text-center"
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    whileTap={buttonTapMotion}
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-lg bg-[#e2231a] hover:bg-[#b81710] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Combo Option (For Burgers) with Microinteractions */}
              {!isDrinkOrExtra && (
                <div>
                  <label className="block text-xs uppercase font-bold text-[#f5f2eb]/80 mb-2 tracking-wider">
                    Modalidad del Pedido:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Solo */}
                    <button
                      type="button"
                      onClick={() => setComboType('solo')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        comboType === 'solo'
                          ? 'bg-[#e2231a]/15 border-[#e2231a] text-white ring-1 ring-[#e2231a]'
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
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        comboType === 'combo_papas'
                          ? 'bg-[#e2231a]/15 border-[#e2231a] text-white ring-1 ring-[#e2231a]'
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

                    {/* Combo Completo (Recomendado) */}
                    <button
                      type="button"
                      onClick={() => setComboType('combo_completo')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                        comboType === 'combo_completo'
                          ? 'bg-[#e2231a]/20 border-[#ff7a1a] text-white shadow-lg ring-1 ring-[#ff7a1a]'
                          : 'bg-[#1a1614] border-[#2b2420] text-[#f5f2eb]/70 hover:bg-[#201b18]'
                      }`}
                    >
                      <span className="absolute -top-2 right-2 bg-[#ff7a1a] text-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow">
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
                        <motion.button
                          whileTap={buttonTapMotion}
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra.id)}
                          className={`px-3 py-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-[#ff7a1a]/15 border-[#ff7a1a] text-white'
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
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sucursal Selector */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#ff7a1a] mb-2 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>¿En qué sucursal querés pedir?</span>
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
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        branchId === b.id
                          ? 'bg-[#e2231a]/15 border-[#e2231a] text-white ring-1 ring-[#e2231a]'
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
                      className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        orderType === type.id
                          ? 'bg-[#ff7a1a] text-black border-[#ff7a1a] shadow'
                          : 'bg-[#1a1614] border-[#2b2420] text-white/70 hover:bg-[#221c19]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Delivery Address & Customer Details */}
              <div className="space-y-3">
                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-semibold">
                      Dirección de entrega o Barrio (opcional para agilizar):
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Ej: Barrio San Juan, Luque / Calle y nro."
                      className="w-full bg-[#1e1916] border border-[#2b2420] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff7a1a]"
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
                      className="w-full bg-[#1e1916] border border-[#2b2420] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/80 mb-1 font-semibold">
                      Aclaración para cocina (opcional):
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej: Sin cebolla, extra servilletas"
                      className="w-full bg-[#1e1916] border border-[#2b2420] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Sticky Bottom / Footer with Dynamic Total & WhatsApp CTA */}
            <div className="sticky bottom-0 bg-[#14110f] border-t border-[#211c19] px-5 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-20">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <span className="text-xs uppercase font-bold text-white/60">Total a pagar:</span>
                <motion.span
                  key={currentTotal}
                  initial={{ scale: 1.1, color: '#ff7a1a' }}
                  animate={{ scale: 1, color: '#ffb703' }}
                  transition={{ duration: 0.2 }}
                  className="font-display text-2xl sm:text-3xl font-bold"
                >
                  {formatGs(currentTotal)}
                </motion.span>
              </div>

              <motion.button
                id="modal-btn-confirm-whatsapp"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={buttonTapMotion}
                onClick={handleSendToWhatsApp}
                className="flame-glow bg-[#25d366] hover:bg-[#20ba59] text-black font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2.5 cursor-pointer font-display tracking-wider"
              >
                {/* WhatsApp official SVG icon */}
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>PEDIR POR WHATSAPP</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
