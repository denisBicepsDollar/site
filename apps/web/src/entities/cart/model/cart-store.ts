import { create } from "zustand";
import { getProductsByVariant } from "@/shared/api";

export interface CartStorageItem {
  variantId: string;
  cartQuantity: number;
}

export interface CartProductItem {
  id: string;
  variantId: string;
  productId?: string;
  productName?: string;
  name?: string;
  slug?: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  previewImage?: string;
  cartQuantity: number;
}

interface CartState {
  cartStorage: CartStorageItem[];
  cartItems: CartProductItem[];
  isLoadingProducts: boolean;
  hasInitialized: boolean;
  initCart: () => void;
  fetchCartProducts: () => Promise<void>;
  changeQuantity: (variantId: string, newQuantity: number, stock: number) => void;
  removeFromCart: (variantId: string) => void;
  addToCart: (input: {
    variantId: string;
    stock: number;
    quantity?: number;
  }) => void;
}

function readCartFromStorage(): CartStorageItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("cart");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartStorageItem =>
        Boolean(item) &&
        typeof item.variantId === "string" &&
        item.variantId.trim() !== "" &&
        typeof item.cartQuantity === "number" &&
        item.cartQuantity > 0,
    );
  } catch {
    return [];
  }
}

function writeCartToStorage(items: CartStorageItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  cartStorage: [],
  cartItems: [],
  isLoadingProducts: false,
  hasInitialized: false,

  initCart: () => {
    if (typeof window === "undefined") return;
    const cartStorage = readCartFromStorage();
    set({ cartStorage, hasInitialized: true });
    void get().fetchCartProducts();
  },

  fetchCartProducts: async () => {
    const { cartStorage } = get();
    if (!cartStorage || cartStorage.length === 0) {
      set({ cartItems: [], isLoadingProducts: false });
      return;
    }

    try {
      set({ isLoadingProducts: true });
      const variantIds = cartStorage.map(({ variantId }) => variantId);
      const response = await getProductsByVariant(variantIds);
      const backendProducts = Array.isArray(response?.data)
        ? response.data
        : [];

      const mergedProducts: CartProductItem[] = backendProducts.map(
        (product: any) => {
          const targetId = String(product.variantId || product.id);
          const cartItem = cartStorage.find(
            (item) => item.variantId === targetId,
          );
          return {
            ...product,
            variantId: targetId,
            cartQuantity: cartItem ? cartItem.cartQuantity : 1,
          };
        },
      );
      set({ cartItems: mergedProducts });
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
    } finally {
      set({ isLoadingProducts: false });
    }
  },

  changeQuantity: (variantId, newQuantity, stock) => {
    if (newQuantity < 1) {
      get().removeFromCart(variantId);
      return;
    }

    const maxStock = Number.isFinite(stock) && stock > 0 ? stock : 0;
    let finalQuantity = Math.trunc(newQuantity);
    if (maxStock > 0 && finalQuantity > maxStock) {
      finalQuantity = maxStock;
    }

    const updatedStorage = get().cartStorage.map((item) =>
      item.variantId === variantId
        ? { ...item, cartQuantity: finalQuantity }
        : item,
    );

    const updatedItems = get().cartItems.map((item) =>
      item.variantId === variantId
        ? { ...item, cartQuantity: finalQuantity }
        : item,
    );

    writeCartToStorage(updatedStorage);
    set({ cartStorage: updatedStorage, cartItems: updatedItems });
  },

  removeFromCart: (variantId) => {
    const updatedStorage = get().cartStorage.filter(
      (item) => item.variantId !== variantId,
    );
    const updatedItems = get().cartItems.filter(
      (item) => item.variantId !== variantId,
    );

    writeCartToStorage(updatedStorage);
    set({ cartStorage: updatedStorage, cartItems: updatedItems });
  },

  addToCart: ({ variantId, stock, quantity = 1 }) => {
    if (!variantId || stock <= 0) return;

    const currentStorage = get().hasInitialized
      ? get().cartStorage
      : readCartFromStorage();
    if (!get().hasInitialized) {
      set({ cartStorage: currentStorage, hasInitialized: true });
    }

    const existingItem = currentStorage.find(
      (item) => item.variantId === variantId,
    );

    if (existingItem) {
      get().changeQuantity(
        variantId,
        existingItem.cartQuantity + quantity,
        stock,
      );
      if (get().cartItems.every((item) => item.variantId !== variantId)) {
        void get().fetchCartProducts();
      }
      return;
    }

    const finalQuantity = Math.min(Math.max(1, Math.trunc(quantity)), stock);
    const updatedStorage = [
      ...currentStorage,
      { variantId, cartQuantity: finalQuantity },
    ];

    writeCartToStorage(updatedStorage);
    set({ cartStorage: updatedStorage });
    void get().fetchCartProducts();
  },
}));
