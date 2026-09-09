import { BRANCHES, CENTRAL_WHATSAPP } from '../data/branchesData';
import { EXTRA_OPTIONS } from '../data/menuData';
import { OrderItemCustomization } from '../types';

/**
 * Formats a number into Paraguayan Guaraníes (e.g., 50000 -> "50.000 Gs.")
 */
export function formatGs(amount: number): string {
  return `${amount.toLocaleString('es-PY')} Gs.`;
}

/**
 * Calculates the total cost for a customized order item
 */
export function calculateOrderTotal(item: OrderItemCustomization): number {
  let baseUnit = item.product.priceSolo;

  if (item.comboType === 'combo_completo') {
    baseUnit = item.product.priceCombo;
  } else if (item.comboType === 'combo_papas') {
    // If combo papas only (no drink), standard formula: solo + 10.000 or combo - 5.000
    baseUnit = item.product.category === 'extras' || item.product.category === 'bebidas'
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
 * Generates the structured WhatsApp message according to UX requirements
 */
export function generateWhatsAppMessage(item: OrderItemCustomization): string {
  const branch = BRANCHES.find((b) => b.id === item.branchId) || BRANCHES[0];
  const total = calculateOrderTotal(item);

  const comboName =
    item.comboType === 'combo_completo'
      ? 'Combo Completo (+ papas y gaseosa)'
      : item.comboType === 'combo_papas'
      ? 'Hamburguesa + Papas'
      : 'Solo hamburguesa (Huérfano)';

  const extrasText =
    item.selectedExtras.length > 0
      ? item.selectedExtras
          .map((id) => {
            const extra = EXTRA_OPTIONS.find((e) => e.id === id);
            return extra ? `🥓 + ${extra.name}` : '';
          })
          .filter(Boolean)
          .join('\n')
      : null;

  const orderTypeLabel =
    item.orderType === 'delivery'
      ? '🛵 Delivery directo a domicilio'
      : item.orderType === 'takeaway'
      ? '🥡 Para pasar a retirar (Take Away)'
      : '🍽️ Consumo en salón';

  let message = `Hola TaitaShu 👋\n\n`;
  message += `Quiero realizar este pedido:\n`;
  message += `🍔 ${item.quantity}x ${item.product.name} (${comboName})\n`;

  if (extrasText) {
    message += `${extrasText}\n`;
  }

  message += `\n📍 Sucursal: ${branch.name} (${branch.city})\n`;
  message += `📦 Modalidad: ${orderTypeLabel}\n`;

  if (item.orderType === 'delivery' && item.deliveryAddress.trim()) {
    message += `🏠 Dirección de entrega: ${item.deliveryAddress.trim()}\n`;
  }

  if (item.customerName.trim()) {
    message += `👤 Nombre del cliente: ${item.customerName.trim()}\n`;
  }

  if (item.notes.trim()) {
    message += `📝 Aclaraciones / Cocina: ${item.notes.trim()}\n`;
  }

  message += `\n💰 Total: ${formatGs(total)}\n\n`;
  message += `Quiero coordinar el pedido.`;

  return message;
}

/**
 * Builds the wa.me link directed to the branch WhatsApp or central number
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
