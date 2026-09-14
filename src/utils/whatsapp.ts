import { BRANCHES, CENTRAL_WHATSAPP } from '../data/branchesData';
import { EXTRA_OPTIONS } from '../data/menuData';
import { CartItem, MultiItemOrder, OrderItemCustomization } from '../types';

/**
 * Formats a number into Paraguayan Guaraníes (e.g., 50000 -> "50.000 Gs.")
 */
export function formatGs(amount: number): string {
  return `${amount.toLocaleString('es-PY')} Gs.`;
}

/**
 * Calculates the total cost for a cart item
 */
export function calculateCartItemTotal(item: CartItem): number {
  let baseUnit = item.product.priceSolo;

  if (item.comboType === 'combo_completo') {
    baseUnit = item.product.priceCombo;
  } else if (item.comboType === 'combo_papas') {
    baseUnit =
      item.product.category === 'extras' || item.product.category === 'bebidas'
        ? item.product.priceSolo
        : item.product.priceSolo + 10000;
  }

  const extrasCost = item.selectedExtras.reduce((sum, extraId) => {
    const found = EXTRA_OPTIONS.find((e) => e.id === extraId);
    return sum + (found ? found.price : 0);
  }, 0);

  return (baseUnit + extrasCost) * Math.max(1, item.quantity);
}

/**
 * Calculates total for the whole multi-item order
 */
export function calculateMultiOrderTotal(order: MultiItemOrder): number {
  return order.items.reduce((sum, item) => sum + calculateCartItemTotal(item), 0);
}

/**
 * Calculates the total cost for a customized order item (legacy/single item)
 */
export function calculateOrderTotal(item: OrderItemCustomization): number {
  return calculateCartItemTotal({
    id: 'single',
    product: item.product,
    quantity: item.quantity,
    comboType: item.comboType,
    selectedExtras: item.selectedExtras,
    notes: item.notes,
  });
}

/**
 * Generates formatted WhatsApp message for multi-item order
 */
export function generateMultiOrderWhatsAppMessage(order: MultiItemOrder): string {
  const branch = BRANCHES.find((b) => b.id === order.branchId) || BRANCHES[0];
  const total = calculateMultiOrderTotal(order);

  const orderTypeLabel =
    order.orderType === 'delivery'
      ? '🛵 Delivery directo a domicilio'
      : order.orderType === 'takeaway'
      ? '🥡 Para pasar a retirar (Take Away)'
      : '🍽️ Consumo en salón';

  let message = `Hola TaitaShu 👋\n\n`;
  message += `Quiero realizar este pedido:\n\n`;

  order.items.forEach((item, index) => {
    const isBurger = item.product.category === 'doubles' || item.product.category === 'big-smash' || item.product.category === 'favorites';
    const isDrink = item.product.category === 'bebidas';
    const isSide = item.product.category === 'extras';
    
    let icon = '🍔';
    if (isDrink) icon = '🥤';
    else if (isSide) icon = '🍟';

    const comboLabel = isBurger
      ? item.comboType === 'combo_completo'
        ? ' [Combo Completo: +papas y gaseosa]'
        : item.comboType === 'combo_papas'
        ? ' [Hamburguesa + Papas]'
        : ' [Solo hamburguesa]'
      : '';

    const itemTotal = calculateCartItemTotal(item);

    message += `${icon} *${item.quantity}x ${item.product.name}*${comboLabel} - ${formatGs(itemTotal)}\n`;

    if (item.selectedExtras.length > 0) {
      const extrasList = item.selectedExtras
        .map((id) => {
          const extra = EXTRA_OPTIONS.find((e) => e.id === id);
          return extra ? `   ➕ ${extra.name}` : '';
        })
        .filter(Boolean)
        .join('\n');
      if (extrasList) message += `${extrasList}\n`;
    }

    if (item.notes && item.notes.trim()) {
      message += `   ✏️ Nota: "${item.notes.trim()}"\n`;
    }

    if (index < order.items.length - 1) {
      message += `\n`;
    }
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL A PAGAR: ${formatGs(total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  message += `📍 *Sucursal:* ${branch.name} (${branch.city})\n`;
  message += `📦 *Modalidad:* ${orderTypeLabel}\n`;

  if (order.orderType === 'delivery' && order.deliveryAddress.trim()) {
    message += `🏠 *Dirección de entrega:* ${order.deliveryAddress.trim()}\n`;
  }

  if (order.customerName.trim()) {
    message += `👤 *Cliente:* ${order.customerName.trim()}\n`;
  }

  if (order.generalNotes.trim()) {
    message += `📝 *Aclaraciones generales:* ${order.generalNotes.trim()}\n`;
  }

  message += `\n¿Me confirman disponibilidad para coordinar? Gracias!`;

  return message;
}

/**
 * Builds the wa.me link for multi-item order
 */
export function getMultiOrderWhatsAppUrl(order: MultiItemOrder): string {
  const branch = BRANCHES.find((b) => b.id === order.branchId);
  const targetPhone = branch?.whatsapp || CENTRAL_WHATSAPP;
  const message = generateMultiOrderWhatsAppMessage(order);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the structured WhatsApp message according to UX requirements (legacy)
 */
export function generateWhatsAppMessage(item: OrderItemCustomization): string {
  return generateMultiOrderWhatsAppMessage({
    items: [
      {
        id: 'single',
        product: item.product,
        quantity: item.quantity,
        comboType: item.comboType,
        selectedExtras: item.selectedExtras,
        notes: item.notes,
      },
    ],
    branchId: item.branchId,
    orderType: item.orderType,
    deliveryAddress: item.deliveryAddress,
    customerName: item.customerName,
    generalNotes: '',
  });
}

/**
 * Builds the wa.me link directed to the branch WhatsApp or central number (legacy)
 */
export function getWhatsAppOrderUrl(item: OrderItemCustomization): string {
  const branch = BRANCHES.find((b) => b.id === item.branchId);
  const targetPhone = branch?.whatsapp || CENTRAL_WHATSAPP;
  const message = generateWhatsAppMessage(item);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a direct inquiry link for general contact
 */
export function getGeneralWhatsAppUrl(
  branchId?: string,
  customText: string = 'Hola TaitaShu, quiero hacer un pedido'
): string {
  const branch = branchId ? BRANCHES.find((b) => b.id === branchId) : null;
  const phone = branch?.whatsapp || CENTRAL_WHATSAPP;
  return `https://wa.me/${phone}?text=${encodeURIComponent(customText)}`;
}
