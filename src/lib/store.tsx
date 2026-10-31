"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  adminCredentials,
  banners as seedBanners,
  bookingStatuses,
  categories as seedCategories,
  customers as seedCustomers,
  offers as seedOffers,
  orderStatuses,
  products as seedProducts,
  reviews as seedReviews,
  seedBookings,
  seedOrders,
  settings as seedSettings,
  siteContent as seedContent,
  type Banner,
  type Booking,
  type Category,
  type Customer,
  type Offer,
  type Order,
  type Product,
  type Review,
} from "@/data/catalog";

export type CartItem = { productId: number; size: string; qty: number };
export type WishItem = { productId: number };

type Content = typeof seedContent;
type Settings = typeof seedSettings;

type State = {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  reviews: Review[];
  offers: Offer[];
  orders: Order[];
  bookings: Booking[];
  customers: Customer[];
  content: Content;
  settings: Settings;
  cart: CartItem[];
  wishlist: number[];
  admin: boolean;
};

const seed: State = {
  products: seedProducts,
  categories: seedCategories,
  banners: seedBanners,
  reviews: seedReviews,
  offers: seedOffers,
  orders: seedOrders,
  bookings: seedBookings,
  customers: seedCustomers,
  content: seedContent,
  settings: seedSettings,
  cart: [],
  wishlist: [],
  admin: false,
};

const KEY = "gmc-store-v1";

type Ctx = State & {
  hydrated: boolean;
  addToCart: (productId: number, size: string, qty?: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  setQty: (productId: number, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  inWishlist: (productId: number) => boolean;
  placeOrder: (order: Order) => void;
  addBooking: (booking: Booking) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...seed, ...(JSON.parse(raw) as Partial<State>) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state, hydrated]);

  const update = useCallback(<K extends keyof State>(key: K, value: State[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      hydrated,
      update,
      addToCart: (productId, size, qty = 1) =>
        setState((s) => {
          const existing = s.cart.find((c) => c.productId === productId && c.size === size);
          return {
            ...s,
            cart: existing
              ? s.cart.map((c) =>
                  c.productId === productId && c.size === size ? { ...c, qty: c.qty + qty } : c,
                )
              : [...s.cart, { productId, size, qty }],
          };
        }),
      removeFromCart: (productId, size) =>
        setState((s) => ({
          ...s,
          cart: s.cart.filter((c) => !(c.productId === productId && c.size === size)),
        })),
      setQty: (productId, size, qty) =>
        setState((s) => ({
          ...s,
          cart: s.cart
            .map((c) =>
              c.productId === productId && c.size === size ? { ...c, qty: Math.max(1, qty) } : c,
            )
            .filter((c) => c.qty > 0),
        })),
      clearCart: () => setState((s) => ({ ...s, cart: [] })),
      toggleWishlist: (productId) =>
        setState((s) => ({
          ...s,
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      inWishlist: (productId) => state.wishlist.includes(productId),
      placeOrder: (order) => setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [] })),
      addBooking: (booking) => setState((s) => ({ ...s, bookings: [booking, ...s.bookings] })),
      login: (email, password) => {
        const ok =
          email.trim().toLowerCase() === adminCredentials.email &&
          password === adminCredentials.password;
        if (ok) setState((s) => ({ ...s, admin: true }));
        return ok;
      },
      logout: () => setState((s) => ({ ...s, admin: false })),
    }),
    [state, hydrated, update],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useCartCount() {
  const { cart } = useStore();
  return cart.reduce((n, c) => n + c.qty, 0);
}

export { bookingStatuses, orderStatuses };
