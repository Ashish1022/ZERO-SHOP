import { create } from "zustand";
import toast from "react-hot-toast";
import { createJSONStorage, persist } from "zustand/middleware";

import { Product } from "@/modules/products/server/procedure";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    totalQuantity: number;
    shippingAmount: number;
    setShippingAmount: (amount: number) => void;
    updateQuantity: (id: string, quantity: number) => void;
    addItem: (data: Product, quantity?: number) => void;
    removeItem: (id: string) => void;
    removeAll: () => void
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
};

const useCart = create(
    persist<CartStore>((set, get) => ({
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        shippingAmount: 0,
        setShippingAmount: (amount: number) => set({ shippingAmount: amount }),
        addItem: (data: Product, quantity: number = 1) => {
            const currentItem = get().items;
            const existingItem = currentItem.find((items) => items.product.id === data.id)

            if (existingItem) {
                set({
                    items: currentItem.map((item) =>
                        item.product.id === data.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                    totalQuantity: get().totalQuantity + quantity,
                });
            } else {
                set({
                    items: [...currentItem, { product: data, quantity }],
                    totalQuantity: get().totalQuantity + quantity,
                });
            }

            toast.success("Item added to cart.")
        },
        removeItem: (id: string) => {
            const currentItems = get().items;
            const removedItem = currentItems.find((item) => item.product.id === id);
            if (!removedItem) return;
            set({
                items: currentItems.filter((item) => item.product.id !== id),
                totalQuantity: get().totalQuantity - removedItem.quantity,
            });

            toast.success("Item removed from cart.");
        },
        updateQuantity: (id: string, quantity: number) => {
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.product.id === id);
            if (!existingItem) return;
            const quantityDifference = quantity - existingItem.quantity;
            if (quantity <= 0) {
                set({
                    items: currentItems.filter((item) => item.product.id !== id),
                    totalQuantity: get().totalQuantity - existingItem.quantity,
                });
                toast.success("Item removed from cart.");
            } else {
                set({
                    items: currentItems.map((item) =>
                        item.product.id === id ? { ...item, quantity } : item
                    ),
                    totalQuantity: get().totalQuantity + quantityDifference,
                });
            }
        },
        increaseQuantity: (id: string) => {
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.product.id === id);

            if (!existingItem) return;

            set({
                items: currentItems.map((item) =>
                    item.product.id === id ? { ...item, quantity: item.quantity + 1 } : item
                ),
                totalQuantity: get().totalQuantity + 1,
            });
        },

        decreaseQuantity: (id: string) => {
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.product.id === id);

            if (!existingItem) return;

            if (existingItem.quantity === 1) {
                set({
                    items: currentItems.filter((item) => item.product.id !== id),
                    totalQuantity: get().totalQuantity - 1,
                });
                toast.success("Item removed from cart.");
            } else {
                set({
                    items: currentItems.map((item) =>
                        item.product.id === id ? { ...item, quantity: item.quantity - 1 } : item
                    ),
                    totalQuantity: get().totalQuantity - 1,
                });
            }
        },
        removeAll: () => set({ items: [], totalQuantity: 0 }),
    }), {
        name: 'cart-storage',
        storage: createJSONStorage(() => localStorage),
    })
)


export default useCart;