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
  defaultPageHeaders,
  bookingStatuses,
  categories as seedCategories,
  customers as seedCustomers,
  offers as seedOffers,
  orderStatuses,
  products as seedProducts,
  reviews as seedReviews,
  seedBookings,
  seedOrders,
  seedSubCategories,
  seedInquiries,
  settings as seedSettings,
  siteContent as seedContent,
  type Banner,
  type PageHeader,
  type Booking,
  type Category,
  type SubCategory,
  type Customer,
  type Offer,
  type Order,
  type Product,
  type Review,
  type Inquiry,
} from "@/data/catalog";

export { bookingStatuses, orderStatuses } from "@/data/catalog";

export type UserAddress = {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: UserAddress;
  preferredSize?: string;
  role: "user" | "admin";
};

export type CartItem = { productId: number; size: string; color?: string; qty: number };
export type WishItem = { productId: number };

type Content = typeof seedContent;
type Settings = typeof seedSettings;

type State = {
  products: Product[];
  categories: Category[];
  subcategories: SubCategory[];
  inquiries: Inquiry[];
  banners: Banner[];
  pageHeaders: PageHeader[];
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
  currentUser: AuthUser | null;
};

const seed: State = {
  products: seedProducts,
  categories: seedCategories,
  subcategories: seedSubCategories,
  inquiries: seedInquiries,
  banners: seedBanners,
  pageHeaders: defaultPageHeaders,
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
  currentUser: null,
};

const KEY = "gmc-store-v2";

type Ctx = State & {
  hydrated: boolean;
  addToCart: (productId: number, size: string, qty?: number, color?: string) => void;
  removeFromCart: (productId: number, size: string, color?: string) => void;
  setQty: (productId: number, size: string, qty: number, color?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  inWishlist: (productId: number) => boolean;
  placeOrder: (order: Order) => Promise<void> | void;
  deleteOrder: (id: string) => Promise<void> | void;
  updateOrder: (order: Order) => Promise<void> | void;
  addBooking: (booking: Booking) => void;
  addInquiry: (inquiry: Partial<Inquiry>) => Promise<Inquiry>;
  deleteInquiry: (id: string) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: Inquiry["status"], notes?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean> | boolean;
  logout: () => void;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
  
  // Real MongoDB & Cloudinary Integration Methods
  saveCategory: (category: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<boolean>;
  saveSubcategory: (sub: Partial<SubCategory>) => Promise<SubCategory>;
  deleteSubcategory: (id: number) => Promise<boolean>;
  saveProduct: (product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<boolean>;
  saveBanner: (banner: Partial<Banner>) => Promise<Banner>;
  deleteBanner: (id: number) => Promise<boolean>;
  savePageHeader: (header: Partial<PageHeader>) => Promise<PageHeader>;
  deletePageHeader: (pageKey: string) => Promise<boolean>;
  getPageHeader: (pageKeyOrRoute: string) => string;
  saveSiteContent: (content: Partial<Content>) => Promise<Content>;
  uploadImage: (fileOrBase64: File | string, folder?: string) => Promise<string>;
  refetchCatalog: () => Promise<void>;
  registerCustomer: (email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  loginCustomer: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => void;
  updateUserProfile: (profileData: {
    name?: string;
    phone?: string;
    address?: UserAddress;
    preferredSize?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  submitReview: (reviewData: {
    productId?: number;
    productName?: string;
    productImage?: string;
    name: string;
    rating: number;
    text: string;
  }) => Promise<{ success: boolean; review?: Review; error?: string }>;
  updateReviewStatus: (id: number | string, approved: boolean) => Promise<boolean>;
  deleteReview: (id: number | string) => Promise<boolean>;
  editReviewItem: (review: Partial<Review> & { id: number | string }) => Promise<boolean>;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(seed);
  const [hydrated, setHydrated] = useState(false);

  // 1. Load cached state on client mount
  useEffect(() => {
    try {
      localStorage.removeItem("gmc-store-v1");
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          ...seed,
          ...parsed,
          products: parsed.products || [],
          categories: parsed.categories || [],
          subcategories: parsed.subcategories || [],
          inquiries: parsed.inquiries || [],
          banners: parsed.banners || seedBanners,
          pageHeaders: parsed.pageHeaders || defaultPageHeaders,
          currentUser: parsed.currentUser || null,
          admin: parsed.currentUser?.role === "admin" || parsed.admin || false,
        });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // 2. Fetch live data from MongoDB Atlas backend
  const refetchCatalog = useCallback(async () => {
    try {
      const [catRes, subRes, prodRes, bookRes, banRes, headRes, contRes, ordRes, inqRes, revRes] = await Promise.all([
        fetch("/api/categories").then((r) => r.json()).catch(() => ({ categories: null })),
        fetch("/api/subcategories").then((r) => r.json()).catch(() => ({ subcategories: null })),
        fetch("/api/products").then((r) => r.json()).catch(() => ({ products: null })),
        fetch("/api/bookings").then((r) => r.json()).catch(() => ({ bookings: null })),
        fetch("/api/banners").then((r) => r.json()).catch(() => ({ banners: null })),
        fetch("/api/page-headers").then((r) => r.json()).catch(() => ({ headers: null })),
        fetch("/api/site-content").then((r) => r.json()).catch(() => ({ content: null })),
        fetch("/api/orders").then((r) => r.json()).catch(() => ({ orders: null })),
        fetch("/api/inquiries").then((r) => r.json()).catch(() => ({ inquiries: null })),
        fetch("/api/reviews").then((r) => r.json()).catch(() => ({ reviews: null })),
      ]);

      setState((s) => ({
        ...s,
        categories: Array.isArray(catRes?.categories) ? catRes.categories : s.categories,
        subcategories: Array.isArray(subRes?.subcategories) ? subRes.subcategories : s.subcategories,
        products: Array.isArray(prodRes?.products) ? prodRes.products : s.products,
        bookings: Array.isArray(bookRes?.bookings) && bookRes.bookings.length > 0 ? bookRes.bookings : s.bookings,
        banners: Array.isArray(banRes?.banners) && banRes.banners.length > 0 ? banRes.banners : s.banners,
        pageHeaders: Array.isArray(headRes?.headers) && headRes.headers.length > 0 ? headRes.headers : s.pageHeaders,
        content: contRes?.content ? { ...s.content, ...contRes.content } : s.content,
        orders: Array.isArray(ordRes?.orders) && ordRes.orders.length > 0 ? ordRes.orders : s.orders,
        inquiries: Array.isArray(inqRes?.inquiries) && inqRes.inquiries.length > 0 ? inqRes.inquiries : s.inquiries,
        reviews: Array.isArray(revRes?.reviews) && revRes.reviews.length > 0 ? revRes.reviews : s.reviews,
      }));
    } catch (err) {
      console.warn("Could not sync with MongoDB backend, using local state:", err);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      refetchCatalog();
    }
  }, [hydrated, refetchCatalog]);

  // 3. Keep local storage in sync
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

  // 4. Cloudinary Image Uploader
  const uploadImage = useCallback(async (fileOrBase64: File | string, folder = "gmc_atelier"): Promise<string> => {
    if (typeof fileOrBase64 === "string" && fileOrBase64.startsWith("http")) {
      return fileOrBase64; // already a hosted URL
    }

    if (fileOrBase64 instanceof File) {
      const formData = new FormData();
      formData.append("file", fileOrBase64);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Cloudinary");
      }
      return data.url;
    } else {
      // Base64 string
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: fileOrBase64, folder }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Cloudinary");
      }
      return data.url;
    }
  }, []);

  // 5. Category MongoDB Actions
  const saveCategory = useCallback(async (cat: Partial<Category>): Promise<Category> => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cat),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to save category to MongoDB");
    }

    const savedCat = data.category as Category;
    setState((s) => {
      const exists = s.categories.some((c) => c.id === savedCat.id);
      return {
        ...s,
        categories: exists
          ? s.categories.map((c) => (c.id === savedCat.id ? savedCat : c))
          : [...s.categories, savedCat],
      };
    });
    return savedCat;
  }, []);

  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete category from MongoDB");
    }

    setState((s) => ({
      ...s,
      categories: s.categories.filter((c) => c.id !== id),
      subcategories: s.subcategories.filter((sub) => sub.categoryId !== id),
    }));
    return true;
  }, []);

  // 6. Subcategory MongoDB Actions
  const saveSubcategory = useCallback(async (sub: Partial<SubCategory>): Promise<SubCategory> => {
    const res = await fetch("/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to save subcategory to MongoDB");
    }

    const savedSub = data.subcategory as SubCategory;
    setState((s) => {
      const exists = s.subcategories.some((sc) => sc.id === savedSub.id);
      return {
        ...s,
        subcategories: exists
          ? s.subcategories.map((sc) => (sc.id === savedSub.id ? savedSub : sc))
          : [...s.subcategories, savedSub],
      };
    });
    return savedSub;
  }, []);

  const deleteSubcategory = useCallback(async (id: number): Promise<boolean> => {
    const res = await fetch(`/api/subcategories?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete subcategory from MongoDB");
    }

    setState((s) => ({
      ...s,
      subcategories: s.subcategories.filter((sub) => sub.id !== id),
    }));
    return true;
  }, []);

  // 7. Product MongoDB Actions
  const saveProduct = useCallback(async (prod: Partial<Product>): Promise<Product> => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prod),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to save product to MongoDB");
    }

    const savedProd = data.product as Product;
    setState((s) => {
      const exists = s.products.some((p) => p.id === savedProd.id);
      return {
        ...s,
        products: exists
          ? s.products.map((p) => (p.id === savedProd.id ? savedProd : p))
          : [savedProd, ...s.products],
      };
    });
    return savedProd;
  }, []);

  const registerCustomer = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, confirmPassword }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Registration failed." };
        }
        setState((s) => ({
          ...s,
          currentUser: data.user,
          admin: data.user.role === "admin",
        }));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Network error. Please try again." };
      }
    },
    [],
  );

  const loginCustomer = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Login failed." };
      }
      setState((s) => ({
        ...s,
        currentUser: data.user,
        admin: data.user.role === "admin",
      }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  }, []);

  const logoutCustomer = useCallback(() => {
    setState((s) => ({ ...s, currentUser: null, admin: false }));
  }, []);

  const updateUserProfile = useCallback(
    async (profileData: {
      name?: string;
      phone?: string;
      address?: UserAddress;
      preferredSize?: string;
    }) => {
      if (!state.currentUser?.email) {
        return { success: false, error: "Not logged in" };
      }
      try {
        const res = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: state.currentUser.email,
            ...profileData,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to update profile." };
        }
        setState((s) => ({
          ...s,
          currentUser: data.user,
        }));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to update profile." };
      }
    },
    [state.currentUser],
  );

  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete product from MongoDB");
    }

    setState((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
    }));
    return true;
  }, []);

  const saveBanner = useCallback(async (banner: Partial<Banner>): Promise<Banner> => {
    const res = await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(banner),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to save banner to MongoDB");
    }

    const saved = data.banner as Banner;
    setState((s) => {
      const exists = s.banners.some((b) => b.id === saved.id);
      return {
        ...s,
        banners: exists
          ? s.banners.map((b) => (b.id === saved.id ? saved : b))
          : [...s.banners, saved],
      };
    });
    return saved;
  }, []);

  const deleteBanner = useCallback(async (id: number): Promise<boolean> => {
    const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete banner from MongoDB");
    }
    setState((s) => ({
      ...s,
      banners: s.banners.filter((b) => b.id !== id),
    }));
    return true;
  }, []);

  const savePageHeader = useCallback(async (header: Partial<PageHeader>): Promise<PageHeader> => {
    const res = await fetch("/api/page-headers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(header),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to save page header banner to MongoDB");
    }

    const saved = data.header as PageHeader;
    setState((s) => {
      const exists = s.pageHeaders.some((h) => h.pageKey === saved.pageKey);
      return {
        ...s,
        pageHeaders: exists
          ? s.pageHeaders.map((h) => (h.pageKey === saved.pageKey ? saved : h))
          : [...s.pageHeaders, saved],
      };
    });
    return saved;
  }, []);

  const deletePageHeader = useCallback(async (pageKey: string): Promise<boolean> => {
    const res = await fetch(`/api/page-headers?pageKey=${encodeURIComponent(pageKey)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to reset page header banner");
    }
    const def = defaultPageHeaders.find((d) => d.pageKey === pageKey);
    setState((s) => ({
      ...s,
      pageHeaders: s.pageHeaders.map((h) =>
        h.pageKey === pageKey ? (def ? def : { ...h, imageUrl: "/assets/hero1.jpg" }) : h,
      ),
    }));
    return true;
  }, []);

  const getPageHeader = useCallback(
    (pageKeyOrRoute: string): string => {
      if (!pageKeyOrRoute) return "/assets/hero1.jpg";
      const cleaned = pageKeyOrRoute.replace(/^\//, "").toLowerCase().split("/")[0] || "default";

      // Match by pageKey or route
      const match = state.pageHeaders.find(
        (h) =>
          h.active &&
          (h.pageKey.toLowerCase() === cleaned ||
            h.route.toLowerCase() === `/${cleaned}` ||
            h.route.toLowerCase() === pageKeyOrRoute.toLowerCase()),
      );

      if (match?.imageUrl) return match.imageUrl;

      // Fallback to default curated headers
      const defMatch = defaultPageHeaders.find(
        (h) =>
          h.pageKey.toLowerCase() === cleaned ||
          h.route.toLowerCase() === `/${cleaned}` ||
          h.route.toLowerCase() === pageKeyOrRoute.toLowerCase(),
      );
      if (defMatch?.imageUrl) return defMatch.imageUrl;

      // Fallback to default header or hero1
      const def = state.pageHeaders.find((h) => h.pageKey === "default" && h.active);
      return def?.imageUrl || "/assets/hero1.jpg";
    },
    [state.pageHeaders],
  );

  const saveSiteContent = useCallback(
    async (newContent: Partial<Content>): Promise<Content> => {
      const res = await fetch("/api/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save site content to MongoDB");
      }
      const saved = { ...state.content, ...data.content };
      setState((s) => ({ ...s, content: saved }));
      return saved;
    },
    [state.content],
  );

  const submitReview = useCallback(
    async (reviewData: {
      productId?: number;
      productName?: string;
      productImage?: string;
      name: string;
      rating: number;
      text: string;
    }): Promise<{ success: boolean; review?: Review; error?: string }> => {
      const now = new Date();
      const tempId = `REV-${Date.now()}`;
      const initials =
        reviewData.name
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "CL";

      const newReview: Review = {
        id: tempId,
        productId: reviewData.productId,
        productName: reviewData.productName,
        productImage: reviewData.productImage,
        name: reviewData.name.trim(),
        initials,
        rating: reviewData.rating,
        text: reviewData.text.trim(),
        date: now.toISOString().split("T")[0],
        approved: false, // Default: Pending approval from admin panel!
      };

      // Immediate optimistic update in state
      setState((s) => ({
        ...s,
        reviews: [newReview, ...(s.reviews || [])],
      }));

      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
        const data = await res.json();
        if (data.success && data.review) {
          const serverRev = data.review as Review;
          setState((s) => ({
            ...s,
            reviews: s.reviews.map((r) => (r.id === tempId ? serverRev : r)),
          }));
          return { success: true, review: serverRev };
        }
      } catch (err: any) {
        console.warn("Review saved locally, failed to sync with MongoDB backend:", err);
      }
      return { success: true, review: newReview };
    },
    [],
  );

  const updateReviewStatus = useCallback(
    async (id: number | string, approved: boolean): Promise<boolean> => {
      setState((s) => ({
        ...s,
        reviews: (s.reviews || []).map((r) =>
          String(r.id) === String(id) ? { ...r, approved } : r
        ),
      }));

      try {
        const res = await fetch("/api/reviews", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: String(id), approved }),
        });
        const data = await res.json();
        return !!data.success;
      } catch (err) {
        console.warn("Failed to update review status in MongoDB:", err);
        return false;
      }
    },
    [],
  );

  const deleteReview = useCallback(
    async (id: number | string): Promise<boolean> => {
      setState((s) => ({
        ...s,
        reviews: (s.reviews || []).filter((r) => String(r.id) !== String(id)),
      }));

      try {
        const res = await fetch(`/api/reviews?id=${encodeURIComponent(String(id))}`, {
          method: "DELETE",
        });
        const data = await res.json();
        return !!data.success;
      } catch (err) {
        console.warn("Failed to delete review from MongoDB:", err);
        return false;
      }
    },
    [],
  );

  const editReviewItem = useCallback(
    async (rev: Partial<Review> & { id: number | string }): Promise<boolean> => {
      setState((s) => ({
        ...s,
        reviews: (s.reviews || []).map((r) =>
          String(r.id) === String(rev.id) ? { ...r, ...rev } : r
        ),
      }));

      try {
        const res = await fetch("/api/reviews", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...rev, id: String(rev.id) }),
        });
        const data = await res.json();
        return !!data.success;
      } catch (err) {
        console.warn("Failed to edit review in MongoDB:", err);
        return false;
      }
    },
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      hydrated,
      update,
      saveCategory,
      deleteCategory,
      saveSubcategory,
      deleteSubcategory,
      saveProduct,
      deleteProduct,
      saveBanner,
      deleteBanner,
      savePageHeader,
      deletePageHeader,
      getPageHeader,
      saveSiteContent,
      uploadImage,
      refetchCatalog,
      registerCustomer,
      loginCustomer,
      logoutCustomer,
      updateUserProfile,
      submitReview,
      updateReviewStatus,
      deleteReview,
      editReviewItem,
      addToCart: (productId, size, qty = 1, color = "") =>
        setState((s) => {
          const existing = s.cart.find(
            (c) => c.productId === productId && c.size === size && (color ? c.color === color : true),
          );
          return {
            ...s,
            cart: existing
              ? s.cart.map((c) =>
                  c.productId === productId && c.size === size && (color ? c.color === color : true)
                    ? { ...c, qty: c.qty + qty }
                    : c,
                )
              : [...s.cart, { productId, size, color, qty }],
          };
        }),
      removeFromCart: (productId, size, color) =>
        setState((s) => ({
          ...s,
          cart: s.cart.filter(
            (c) => !(c.productId === productId && c.size === size && (!color || c.color === color)),
          ),
        })),
      setQty: (productId, size, qty, color) =>
        setState((s) => ({
          ...s,
          cart: s.cart
            .map((c) =>
              c.productId === productId && c.size === size && (!color || c.color === color)
                ? { ...c, qty: Math.max(1, qty) }
                : c,
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
      placeOrder: async (order) => {
        setState((s) => ({
          ...s,
          orders: [order, ...s.orders.filter((o) => o.id !== order.id)],
          cart: [],
        }));
        try {
          await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
        } catch (e) {
          console.warn("Failed to persist order to MongoDB:", e);
        }
      },
      deleteOrder: async (id) => {
        setState((s) => ({ ...s, orders: s.orders.filter((o) => o.id !== id) }));
        try {
          await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
        } catch (e) {
          console.warn("Failed to delete order from MongoDB:", e);
        }
      },
      updateOrder: async (order) => {
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === order.id ? order : o)),
        }));
        try {
          await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
        } catch (e) {
          console.warn("Failed to update order in MongoDB:", e);
        }
      },
      addBooking: async (booking) => {
        setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }));
        try {
          await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking),
          });
        } catch (e) {
          console.warn("Failed to persist rental booking to MongoDB:", e);
        }
      },
      addInquiry: async (inquiryData: Partial<Inquiry>): Promise<Inquiry> => {
        const now = new Date();
        const tempId = inquiryData.id || `INQ-${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
        const fullInquiry: Inquiry = {
          id: tempId,
          name: inquiryData.name || "",
          phone: inquiryData.phone || "",
          email: inquiryData.email || "",
          subject: inquiryData.subject || "In-Studio Fitting Consultation",
          preferredDate: inquiryData.preferredDate || "",
          preferredTime: inquiryData.preferredTime || "",
          message: inquiryData.message || "",
          date: inquiryData.date || now.toISOString().split("T")[0],
          status: inquiryData.status || "New",
          source: inquiryData.source || "Visit Page",
        };

        // Optimistic update
        setState((s) => ({ ...s, inquiries: [fullInquiry, ...(s.inquiries || [])] }));

        try {
          const res = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullInquiry),
          });
          const data = await res.json();
          if (data.success && data.inquiry) {
            setState((s) => ({
              ...s,
              inquiries: s.inquiries.map((x) => (x.id === tempId ? data.inquiry : x)),
            }));
            return data.inquiry;
          }
        } catch (e) {
          console.warn("Failed to persist inquiry to MongoDB:", e);
        }
        return fullInquiry;
      },
      deleteInquiry: async (id: string): Promise<boolean> => {
        setState((s) => ({
          ...s,
          inquiries: (s.inquiries || []).filter((x) => x.id !== id),
        }));
        try {
          const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
          const data = await res.json();
          return !!data.success;
        } catch (e) {
          console.warn("Failed to delete inquiry from MongoDB:", e);
          return false;
        }
      },
      updateInquiryStatus: async (id: string, status: Inquiry["status"], notes?: string): Promise<boolean> => {
        setState((s) => ({
          ...s,
          inquiries: (s.inquiries || []).map((x) =>
            x.id === id ? { ...x, status, ...(notes !== undefined ? { notes } : {}) } : x
          ),
        }));
        try {
          const res = await fetch("/api/inquiries", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status, notes }),
          });
          const data = await res.json();
          return !!data.success;
        } catch (e) {
          console.warn("Failed to update inquiry status in MongoDB:", e);
          return false;
        }
      },
      login: async (email, password) => {
        try {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success) {
            setState((s) => ({ ...s, admin: true }));
            return true;
          }
        } catch {
          // fallback
        }
        const ok =
          (email.trim().toLowerCase() === "gandhiglaj@gmail.com" && password === "Gandhiglaj@123") ||
          (email.trim().toLowerCase() === adminCredentials.email &&
            password === adminCredentials.password);
        if (ok) setState((s) => ({ ...s, admin: true }));
        return ok;
      },
      logout: () => setState((s) => ({ ...s, admin: false })),
    }),
    [
      state,
      hydrated,
      update,
      saveCategory,
      deleteCategory,
      saveSubcategory,
      deleteSubcategory,
      saveProduct,
      deleteProduct,
      saveBanner,
      deleteBanner,
      savePageHeader,
      deletePageHeader,
      getPageHeader,
      saveSiteContent,
      uploadImage,
      refetchCatalog,
      registerCustomer,
      loginCustomer,
      logoutCustomer,
      updateUserProfile,
      submitReview,
      updateReviewStatus,
      deleteReview,
      editReviewItem,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
