import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  name: string;
  price: string;
  image: string;
  category: string;
  slug: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  totalQuantity: number;
  shippingAmount: number;
  setShippingAmount: (amount: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeAll: () => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      shippingAmount: 0,
      setShippingAmount: (amount: number) => set({ shippingAmount: amount }),
      addItem: (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (i) => i.productId === item.productId
        );

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
            totalQuantity: get().totalQuantity + quantity,
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity }],
            totalQuantity: get().totalQuantity + quantity,
          });
        }

        toast.success("Item added to cart.");
      },
      removeItem: (productId: string) => {
        const currentItems = get().items;
        const removedItem = currentItems.find(
          (item) => item.productId === productId
        );
        if (!removedItem) return;
        set({
          items: currentItems.filter((item) => item.productId !== productId),
          totalQuantity: get().totalQuantity - removedItem.quantity,
        });

        toast.success("Item removed from cart.");
      },
      updateQuantity: (productId: string, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.productId === productId
        );
        if (!existingItem) return;
        const quantityDifference = quantity - existingItem.quantity;
        if (quantity <= 0) {
          set({
            items: currentItems.filter((item) => item.productId !== productId),
            totalQuantity: get().totalQuantity - existingItem.quantity,
          });
          toast.success("Item removed from cart.");
        } else {
          set({
            items: currentItems.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
            totalQuantity: get().totalQuantity + quantityDifference,
          });
        }
      },
      increaseQuantity: (productId: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.productId === productId
        );

        if (!existingItem) return;

        set({
          items: currentItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalQuantity: get().totalQuantity + 1,
        });
      },

      decreaseQuantity: (productId: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.productId === productId
        );

        if (!existingItem) return;

        if (existingItem.quantity === 1) {
          set({
            items: currentItems.filter((item) => item.productId !== productId),
            totalQuantity: get().totalQuantity - 1,
          });
          toast.success("Item removed from cart.");
        } else {
          set({
            items: currentItems.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
            totalQuantity: get().totalQuantity - 1,
          });
        }
      },
      removeAll: () => set({ items: [], totalQuantity: 0 }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
