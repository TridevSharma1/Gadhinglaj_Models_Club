import { inr, type Category } from "@/data/catalog";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export type Filters = {
  q: string;
  category: string;
  type: string;
  occasion: string;
  size: string;
  color: string;
  maxPrice: number;
  minRating: number;
  sort: string;
};

export const defaultFilters: Filters = {
  q: "",
  category: "All",
  type: "All",
  occasion: "All",
  size: "All",
  color: "All",
  maxPrice: 50000,
  minRating: 0,
  sort: "Newest",
};

export const sortOptions = ["Newest", "Price Low to High", "Price High to Low", "Popular", "Best Rated"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

const selectClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-rose";

export default function SearchFilter({
  filters,
  setFilters,
  categories,
  sizes,
  colors,
  occasions,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  categories: Category[];
  sizes: string[];
  colors: string[];
  occasions: string[];
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters({ ...filters, [k]: v });

  return (
    <aside className="space-y-6 rounded-3xl border border-border/80 bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="font-display text-xl text-primary font-medium">Refine Edit</h3>
        </div>
        <button
          onClick={() => setFilters(defaultFilters)}
          className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Keyword Search */}
      <Field label="Search by keyword">
        <input
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="e.g. Velvet, Gown, Red…"
          className={selectClass}
        />
      </Field>

      {/* Outfit Format (All / Ready-Made / Rental) */}
      <Field label="Acquisition Type">
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border">
          {["All", "Ready-Made", "Rental"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("type", t)}
              className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                filters.type === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {/* Category Dropdown */}
      <Field label="Atelier Collection">
        <select value={filters.category} onChange={(e) => set("category", e.target.value)} className={selectClass}>
          {["All", ...categories.map((c) => c.name)].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>

      {/* Price Slider */}
      <Field label={`Budget Up To: ${inr(filters.maxPrice)}`}>
        <div className="space-y-2 pt-1">
          <input
            type="range"
            min={1000}
            max={50000}
            step={500}
            value={filters.maxPrice}
            onChange={(e) => set("maxPrice", Number(e.target.value))}
            className="w-full accent-[var(--primary)] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground font-light">
            <span>{inr(1000)}</span>
            <span>{inr(50000)}</span>
          </div>
        </div>
      </Field>

      {/* Sizes Pill Selector */}
      <Field label="Available Size">
        <div className="flex flex-wrap gap-1.5">
          {["All", ...sizes].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("size", s)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                filters.size === s
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border border-border bg-background hover:bg-blush text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      {/* Occasion */}
      <Field label="Celebration / Occasion">
        <select value={filters.occasion} onChange={(e) => set("occasion", e.target.value)} className={selectClass}>
          {["All", ...occasions].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </Field>

      {/* Colour */}
      <Field label="Colour Palette">
        <select value={filters.color} onChange={(e) => set("color", e.target.value)} className={selectClass}>
          {["All", ...colors].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>

      {/* Minimum Rating */}
      <Field label="Minimum Rating">
        <select
          value={filters.minRating}
          onChange={(e) => set("minRating", Number(e.target.value))}
          className={selectClass}
        >
          {[0, 4, 4.5, 4.8].map((r) => (
            <option key={r} value={r}>
              {r === 0 ? "All Ratings" : `★ ${r} & Above`}
            </option>
          ))}
        </select>
      </Field>
    </aside>
  );
}

export function applyFilters<
  T extends {
    name: string;
    category: string;
    type: string;
    price: number;
    rating: number;
    sizes: string[];
    color: string;
    occasion: string;
    id: number;
    reviews: number;
    active: boolean;
  },
>(items: T[], f: Filters): T[] {
  const q = f.q.trim().toLowerCase();
  const out = items.filter(
    (p) =>
      p.active &&
      (!q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q)) &&
      (f.category === "All" ||
        p.category === f.category ||
        (f.category === "Rental Collection" && p.type === "rental")) &&
      (f.type === "All" ||
        (f.type === "Rental" ? p.type === "rental" : p.type === "readymade")) &&
      (f.size === "All" || p.sizes.includes(f.size)) &&
      (f.color === "All" || p.color === f.color) &&
      (f.occasion === "All" || p.occasion === f.occasion) &&
      p.price <= f.maxPrice &&
      p.rating >= f.minRating,
  );

  const sorted = [...out];
  if (f.sort === "Price Low to High") sorted.sort((a, b) => a.price - b.price);
  else if (f.sort === "Price High to Low") sorted.sort((a, b) => b.price - a.price);
  else if (f.sort === "Popular") sorted.sort((a, b) => b.reviews - a.reviews);
  else if (f.sort === "Best Rated") sorted.sort((a, b) => b.rating - a.rating);
  else sorted.sort((a, b) => b.id - a.id);
  return sorted;
}
