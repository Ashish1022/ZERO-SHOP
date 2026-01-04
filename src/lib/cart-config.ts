export const CART_CONFIG = {
    TAX_RATE: 0.18,
    FREE_SHIPPING_THRESHOLD: 150,
    SHIPPING_COST: 5.99,
} as const;

export const calculateCartTotals = (subtotal: number) => {
    const shipping = subtotal >= CART_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CART_CONFIG.SHIPPING_COST;
    const tax = subtotal * CART_CONFIG.TAX_RATE;
    const total = subtotal + shipping + tax;

    return {
        subtotal,
        shipping,
        tax,
        total,
        remainingForFreeShipping: Math.max(0, CART_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal)
    };
};