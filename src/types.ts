export interface Product {
  id: string;
  name: string;
  badge: 'Doubles' | 'Big Smash' | 'Extras' | 'Bebidas';
  category: 'favorites' | 'doubles' | 'big-smash' | 'extras' | 'bebidas';
  tags: string[];
  description: string;
  priceSolo: number;
  priceCombo: number;
  image: string;
  isFavorite?: boolean;
  highlight?: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  badge?: string;
  address: string;
  hours: string;
  phone: string;
  whatsapp: string;
  gmapsUrl: string;
  image: string;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export type ComboType = 'solo' | 'combo_papas' | 'combo_completo';

export type OrderType = 'delivery' | 'takeaway' | 'salon';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  comboType: ComboType;
  selectedExtras: string[]; // ExtraOption IDs
  notes?: string;
}

export interface MultiItemOrder {
  items: CartItem[];
  branchId: string;
  orderType: OrderType;
  deliveryAddress: string;
  customerName: string;
  generalNotes: string;
}

export interface OrderItemCustomization {
  product: Product;
  quantity: number;
  comboType: ComboType;
  selectedExtras: string[]; // ExtraOption IDs
  branchId: string;
  orderType: OrderType;
  deliveryAddress: string;
  customerName: string;
  notes: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  quote: string;
  date: string;
  city: string;
  avatarText: string;
}
