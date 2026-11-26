import { getProductsByVariant } from "@/shared/api/api";
import { create } from "zustand";

export interface CartStorageItem {
  variantId: string;
  cartQuantity: number;
}

export interface CartProductItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | string | null;
  stock: number;
  previewImage: string | null;
  cartQuantity: number;
  isOutOfStock: boolean;
}

export interface AddToCartResult {
  added: number;
  totalInCart: number;
  reachedLimit: boolean;
  outOfStock: boolean;
}

const CART_STORAGE_KEY = "cart";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeCartStorage(raw: unknown): CartStorageItem[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<string, number>();

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rawId = (item as Record<string, unknown>).variantId;
    const rawQty = (item as Record<string, unknown>).cartQuantity;
    const variantId = typeof rawId === "string" ? rawId.trim() : String(rawId ?? "").trim();
    const qty = Number(rawQty);
    if (!variantId || !Number.isFinite(qty) || qty <= 0) continue;
    merged.set(variantId, (merged.get(variantId) ?? 0) + Math.trunc(qty));
  }

  return Array.from(merged.entries()).map(([variantId, cartQuantity]) => ({
    variantId,
    cartQuantity,
  }));
}

function readCartFromStorage(): CartStorageItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return normalizeCartStorage(parsed);
  } catch {
    return [];
  }
}

function writeCartToStorage(cart: CartStorageItem[]): void {
  if (!isBrowser()) return;
  try {
    if (cart.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

function storageEquals(a: CartStorageItem[], b: CartStorageItem[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (
      a[i].variantId !== b[i].variantId ||
      a[i].cartQuantity !== b[i].cartQuantity
    ) {
      return false;
    }
  }
  return true;
}

let activeFetchToken = 0;
let inFlightKey: string | null = null;
let inFlightPromise: Promise<void> | null = null;
let storageListenerBound = false;

interface CartStore {
  cartStorage: CartStorageItem[];
  cartItems: CartProductItem[];
  hasInitialized: boolean;
  isLoadingProducts: boolean;
  isError: boolean;
  cartNotices: string[];
  initCart: () => void;
  fetchCartProducts: () => Promise<void>;
  dismissNotices: () => void;
  addToCart: (params: {
    variantId: string;
    stock: number;
    quantity?: number;
  }) => AddToCartResult;
  removeFromCart: (variantId: string) => void;
  removeUnavailableItems: () => void;
  clearCart: () => void;
  changeQuantity: (
    variantId: string,
    newQuantity: number,
    stock: number,
  ) => void;
}

export const useCartStore = create<CartStore>((set, get) => {
  const bindCrossTabSync = () => {
    if (!isBrowser() || storageListenerBound) return;
    storageListenerBound = true;
    window.addEventListener("storage", (event) => {
      if (event.key !== CART_STORAGE_KEY) return;
      const nextStorage = readCartFromStorage();
      set({
        cartStorage: nextStorage,
        hasInitialized: true,
        isError: false,
      });
      void get().fetchCartProducts();
    });
  };

  return {
    cartStorage: [],
    cartItems: [],
    hasInitialized: false,
    isLoadingProducts: false,
    isError: false,
    cartNotices: [],

    dismissNotices: () => set({ cartNotices: [] }),

    initCart: () => {
      bindCrossTabSync();
      const cart = readCartFromStorage();
      set({
        cartStorage: cart,
        hasInitialized: true,
      });
      void get().fetchCartProducts();
    },

    fetchCartProducts: async () => {
      const currentStorage = get().cartStorage;
      if (currentStorage.length === 0) {
        activeFetchToken += 1;
        inFlightKey = null;
        inFlightPromise = null;
        set({
          cartItems: [],
          isLoadingProducts: false,
          isError: false,
        });
        return;
      }

      const requestIds = currentStorage.map((item) => item.variantId);
      const requestKey = [...requestIds].sort().join("|");

      if (inFlightPromise && inFlightKey === requestKey) {
        return inFlightPromise;
      }

      const token = ++activeFetchToken;
      inFlightKey = requestKey;
      set({ isLoadingProducts: true, isError: false });

      const promise = (async () => {
        try {
          const response = await getProductsByVariant(requestIds);
          if (token !== activeFetchToken) return;

          if (response.isError) {
            set({
              isError: true,
              isLoadingProducts: false,
            });
            return;
          }

          const rows = Array.isArray(response.data) ? response.data : [];
          const byVariantId = new Map<string, any>();
          for (const row of rows) {
            const vid = String(row?.variantId ?? row?.id ?? "").trim();
            if (vid) byVariantId.set(vid, row);
          }

          // Re-read latest cartStorage in case user modified cart while fetch was in flight
          const latestStorage = get().cartStorage;
          const nextStorage: CartStorageItem[] = [];
          const nextCartItems: CartProductItem[] = [];
          const notices: string[] = [];
          let removedMissingCount = 0;

          for (const storageItem of latestStorage) {
            const fetched = byVariantId.get(storageItem.variantId);
            if (!fetched) {
              // Item no longer exists in DB — remove from cartStorage
              removedMissingCount += 1;
              continue;
            }

            const serverStock = Math.max(
              0,
              Math.trunc(Number(fetched.stock) || 0),
            );
            const productName = String(fetched.productName ?? "Товар");
            const variantName = String(fetched.name ?? "").trim();
            const fullLabel = variantName
              ? `${productName} (${variantName})`
              : productName;

            let reconciledQty = storageItem.cartQuantity;
            if (serverStock > 0 && reconciledQty > serverStock) {
              reconciledQty = serverStock;
              notices.push(
                `Количество «${fullLabel}» уменьшено до ${serverStock} шт. (доступный остаток).`,
              );
            } else if (serverStock <= 0) {
              notices.push(
                `«${fullLabel}» закончился на складе — удалите позицию для оформления заказа.`,
              );
            }

            nextStorage.push({
              variantId: storageItem.variantId,
              cartQuantity: reconciledQty,
            });

            nextCartItems.push({
              id: String(fetched.id ?? storageItem.variantId),
              variantId: String(fetched.variantId ?? storageItem.variantId),
              productId: String(fetched.productId ?? ""),
              productName,
              name: variantName || "Стандарт",
              slug: String(fetched.slug || fetched.productId || ""),
              price: Math.max(0, Number(fetched.price) || 0),
              oldPrice: fetched.oldPrice ?? null,
              stock: serverStock,
              previewImage: fetched.previewImage ?? null,
              cartQuantity: reconciledQty,
              isOutOfStock: serverStock <= 0,
            });
          }

          if (removedMissingCount > 0) {
            notices.push(
              removedMissingCount === 1
                ? "Один снятый с продажи товар был удалён из корзины."
                : `Снятые с продажи товары (${removedMissingCount} шт.) были удалены из корзины.`,
            );
          }

          if (!storageEquals(latestStorage, nextStorage)) {
            writeCartToStorage(nextStorage);
          }

          set({
            cartStorage: nextStorage,
            cartItems: nextCartItems,
            isLoadingProducts: false,
            isError: false,
            cartNotices: notices,
          });
        } finally {
          if (token === activeFetchToken) {
            inFlightKey = null;
            inFlightPromise = null;
          }
        }
      })();

      inFlightPromise = promise;
      return promise;
    },

    addToCart: ({ variantId, stock, quantity = 1 }): AddToCartResult => {
      const normalizedVariantId = String(variantId ?? "").trim();
      const maxStock = Math.max(0, Math.trunc(Number(stock) || 0));

      if (!get().hasInitialized) {
        bindCrossTabSync();
        const hydrated = readCartFromStorage();
        set({ cartStorage: hydrated, hasInitialized: true });
      }

      const currentStorage = get().cartStorage;
      const existingItem = currentStorage.find(
        (item) => item.variantId === normalizedVariantId,
      );

      if (!normalizedVariantId || maxStock <= 0) {
        return {
          added: 0,
          totalInCart: existingItem?.cartQuantity ?? 0,
          reachedLimit: true,
          outOfStock: true,
        };
      }

      const requested =
        Number.isFinite(quantity) && quantity >= 1 ? Math.trunc(quantity) : 1;

      if (existingItem) {
        const prevQty = existingItem.cartQuantity;
        const nextQty = Math.min(prevQty + requested, maxStock);
        const added = Math.max(0, nextQty - prevQty);
        const reachedLimit = prevQty + requested > maxStock || added === 0;

        if (added > 0) {
          const updatedStorage = currentStorage.map((item) =>
            item.variantId === normalizedVariantId
              ? { ...item, cartQuantity: nextQty }
              : item,
          );
          const updatedItems = get().cartItems.map((item) =>
            item.variantId === normalizedVariantId
              ? {
                  ...item,
                  cartQuantity: nextQty,
                  stock: maxStock,
                  isOutOfStock: false,
                }
              : item,
          );
          writeCartToStorage(updatedStorage);
          set({
            cartStorage: updatedStorage,
            cartItems: updatedItems,
          });
          const hasLoadedProduct = updatedItems.some(
            (item) => item.variantId === normalizedVariantId,
          );
          if (!hasLoadedProduct) {
            void get().fetchCartProducts();
          }
        }

        return {
          added,
          totalInCart: nextQty,
          reachedLimit,
          outOfStock: false,
        };
      }

      const initialQty = Math.min(requested, maxStock);
      const updatedStorage: CartStorageItem[] = [
        ...currentStorage,
        { variantId: normalizedVariantId, cartQuantity: initialQty },
      ];
      writeCartToStorage(updatedStorage);
      set({ cartStorage: updatedStorage });
      void get().fetchCartProducts();

      return {
        added: initialQty,
        totalInCart: initialQty,
        reachedLimit: requested > maxStock,
        outOfStock: false,
      };
    },

    removeFromCart: (variantId: string) => {
      const normalizedId = String(variantId ?? "").trim();
      const updatedStorage = get().cartStorage.filter(
        (item) => item.variantId !== normalizedId,
      );
      const updatedItems = get().cartItems.filter(
        (item) => item.variantId !== normalizedId,
      );

      writeCartToStorage(updatedStorage);
      set({
        cartStorage: updatedStorage,
        cartItems: updatedItems,
        isError: updatedStorage.length === 0 ? false : get().isError,
        cartNotices: [],
      });
    },

    removeUnavailableItems: () => {
      const oosIds = new Set(
        get()
          .cartItems.filter((item) => item.stock <= 0 || item.isOutOfStock)
          .map((item) => item.variantId),
      );
      if (oosIds.size === 0) return;

      const updatedStorage = get().cartStorage.filter(
        (item) => !oosIds.has(item.variantId),
      );
      const updatedItems = get().cartItems.filter(
        (item) => !oosIds.has(item.variantId),
      );
      writeCartToStorage(updatedStorage);
      set({
        cartStorage: updatedStorage,
        cartItems: updatedItems,
        isError: updatedStorage.length === 0 ? false : get().isError,
        cartNotices: [],
      });
    },

    clearCart: () => {
      activeFetchToken += 1;
      inFlightKey = null;
      inFlightPromise = null;
      writeCartToStorage([]);
      set({
        cartStorage: [],
        cartItems: [],
        isLoadingProducts: false,
        isError: false,
        cartNotices: [],
      });
    },

    changeQuantity: (
      variantId: string,
      newQuantity: number,
      stock: number,
    ) => {
      const normalizedId = String(variantId ?? "").trim();
      if (!normalizedId || !Number.isFinite(newQuantity)) return;

      const parsedQty = Math.trunc(newQuantity);
      if (parsedQty < 1) {
        get().removeFromCart(normalizedId);
        return;
      }

      const loadedItem = get().cartItems.find(
        (item) => item.variantId === normalizedId,
      );
      const maxStock = Math.max(
        0,
        Math.trunc(Number(loadedItem?.stock ?? stock) || 0),
      );

      // Do not permit increasing/setting quantity on out-of-stock items
      if (maxStock <= 0) return;

      const finalQuantity = Math.min(parsedQty, maxStock);

      const updatedStorage = get().cartStorage.map((item) =>
        item.variantId === normalizedId
          ? { ...item, cartQuantity: finalQuantity }
          : item,
      );
      const updatedItems = get().cartItems.map((item) =>
        item.variantId === normalizedId
          ? { ...item, cartQuantity: finalQuantity }
          : item,
      );

      writeCartToStorage(updatedStorage);
      set({
        cartStorage: updatedStorage,
        cartItems: updatedItems,
      });
    },
  };
});
