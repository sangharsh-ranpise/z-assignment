export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}
export type OfferType = 'buyXpayY' | 'discountOnBulk';
