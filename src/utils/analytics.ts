/**
 * Centralized Analytics & Event Tracker for TaitaShu Landing
 * Supports Google Analytics (gtag), Meta Pixel (fbq), TikTok Pixel, and local dataLayer.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventName =
  | 'click_pedir_ahora'
  | 'click_ver_menu'
  | 'view_product'
  | 'select_product'
  | 'add_to_order'
  | 'add_to_cart'
  | 'select_branch'
  | 'whatsapp_order_sent'
  | 'whatsapp_order_sent_direct'
  | 'whatsapp_multi_order_sent'
  | 'branch_maps_clicked';

export function trackEvent(eventName: AnalyticsEventName, payload: Record<string, unknown> = {}) {
  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Push to dataLayer if available
  if (typeof window !== 'undefined') {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(eventData);
    }
    // Google Analytics gtag support
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
    // Meta / Facebook Pixel support
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, payload);
    }
  }

  // Debug logging
  try {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.info(`[Analytics] 📊 ${eventName}`, payload);
    }
  } catch {
    // ignore
  }
}
