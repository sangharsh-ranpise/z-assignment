import { Checkout } from "../src/checkout";
import { PricingRule } from "../src/pricingRules";
import { Product } from "../src/products";

// Products list
const product1 = new Product('ipd', 'Super iPad', 549.99);
const product2 = new Product('mbp', 'MacBook Pro', 1399.99);
const product3 = new Product('atv', 'Apple Tv', 109.50);
const product4 = new Product('vga', 'VGA adapter', 30);

// Pricing rules
const buy3PayFor2 = new PricingRule('atv', 'buyXpayY', 3, null);
const bulkDiscount = new PricingRule('ipd', 'discountOnBulk', 4, 50);

describe('Checkout System', () => {
    test('should apply rule buy 3 Apple TVs and pay for 2 rule', () => {
        const checkout = new Checkout([buy3PayFor2]);

        checkout.scan(product3, 3);
        const total = checkout.total();

        expect(total).toBe(2 * 109.50);
    });

    test('should apply bulk discount rule on Super iPads when buying 5 i.e 50 off per product if product quantity >=4', () => {
        const checkout = new Checkout([bulkDiscount]);

        checkout.scan(product1, 5);
        const total = checkout.total();

        expect(total).toBe(5 * (549.99 - 50));
    });

    test('should calculate total for a mixed cart without discount on some items', () => {
        const checkout = new Checkout([buy3PayFor2, bulkDiscount]);

        checkout.scan(product1, 5);  // 5 Super iPads (bulk discount)
        checkout.scan(product3, 3);  // 3 Apple TVs (buy 3 pay for 2)
        checkout.scan(product4, 2);  // 2 VGA Adapters (no discount)

        const total = checkout.total();

        const expectedTotal = (5 * (549.99 - 50)) + (2 * 109.50) + (2 * 30);

        expect(total).toBe(expectedTotal);
    });


    test('should calculate total when no pricing rule applies', () => {
        const checkout = new Checkout([]);

        checkout.scan(product1, 1);  // 1 Super iPad
        checkout.scan(product2, 1);  // 1 MacBook Pro
        checkout.scan(product3, 1);  // 1 Apple TV

        const total = checkout.total();

        const expectedTotal = (549.99) + (1399.99) + (109.50);

        expect(total).toBe(expectedTotal);
    });
});