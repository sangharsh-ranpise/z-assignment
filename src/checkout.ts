import { CartItem } from "./cartItem";
import { PricingRule } from "./pricingRules";
import { Product } from "./products";


export class Checkout {
    cartItems: CartItem[] = [];
    pricingRules: PricingRule[];

    constructor(pricingRules: PricingRule[]) {
        this.pricingRules = pricingRules;
    }

    // Method to add products to the cart
    scan(product: Product, quantity: number = 1) {
        const existingItem = this.cartItems.find(item => item.sku === product.sku);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cartItems.push({ ...product, quantity });
        }
    }

    // Method to calculate the total price based on applied rules or without rule
    total(): number {
        let total = 0;

        this.cartItems.forEach(cartItem => {
            const pricingRule = this.pricingRules.find(rule => rule.sku === cartItem.sku);

            if (pricingRule) {
                total += pricingRule.applyRule(this.cartItems);
            } else {
                total += cartItem.price * cartItem.quantity;
            }
        });

        return total;
    }
}

// Products -
const product1 = new Product('ipd', 'Super iPad', 549.99);
const product2 = new Product('mbp', 'MacBook Pro', 1399.99);
const product3 = new Product('atv', 'Apple Tv', 109.50);
const product4 = new Product('vga', 'VGA adapter', 30);

// Rules Per Product
const buy3PayFor2 = new PricingRule('atv', 'buyXpayY', 3, null);
const bulkDiscount = new PricingRule('ipd', 'discountOnBulk', 4, 50);

const pricingRules = [buy3PayFor2, bulkDiscount]
// Add Rules to Checkout constructor
const checkout = new Checkout(pricingRules);

// Add products to the cart
checkout.scan(product3, 3);  // 3 Apple TV
checkout.scan(product1, 5);  // 5 Super iPad
checkout.scan(product4, 2);  // 2 VGA Adapter (no discount on this product)

// Calculate total along with the rules applied and log it
console.log("Total price:", checkout.total()); 
