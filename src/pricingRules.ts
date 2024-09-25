import { CartItem, OfferType } from "./cartItem";

export class PricingRule {
  sku: string;
  type: OfferType;
  threshold: number;
  discount: number | null;

  constructor(sku: string, type: OfferType, threshold: number, discount: number | null) {
    this.sku = sku;
    this.type = type;
    this.threshold = threshold;
    this.discount = discount;
  }

  applyRule(cartItems: CartItem[]): number {
    let totalPrice = 0;
    let item = cartItems.find(item => item.sku === this.sku);
    
    if (!item) return 0;  // no items with given sku 

    let quantity = item.quantity;
    
    switch (this.type) {
      case 'buyXpayY':
        const offeredItemsPrice = (Math.floor(quantity / this.threshold) * (this.threshold - 1) * item.price)
        const remainingItemsPrice = (quantity % this.threshold * item.price);
        totalPrice = offeredItemsPrice + remainingItemsPrice; 
        break;

      case 'discountOnBulk':
        if (quantity >= this.threshold) {
          totalPrice = quantity * (item.price - (this.discount || 0));
        } else {
          totalPrice = quantity * item.price;
        }
        break;

      default:
        totalPrice = quantity * item.price; // No Discount
    }

    return totalPrice;
  }
}