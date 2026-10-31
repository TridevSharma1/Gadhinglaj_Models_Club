import Link from "next/link";
import type { Category } from "@/data/catalog";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  productCount?: number;
  subcategories?: string[];
}

export default function CategoryCard({ category, productCount, subcategories = [] }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(category.name)}`}
      className="group relative block overflow-hidden rounded-3xl border border-gold-300/30 bg-card shadow-soft transition-all duration-700 hover:-translate-y-2 hover:shadow-gold hover:border-gold-400/80"
    >
      {/* High Fashion Portrait Canvas */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-blush/60">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />

        {/* Floating Top Pill Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-300 shadow-sm">
            <Sparkles className="h-3 w-3 text-gold-400" />
            <span>Atelier Collection</span>
          </span>

          {productCount !== undefined && (
            <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-xs">
              {productCount} {productCount === 1 ? "Outfit" : "Outfits"}
            </span>
          )}
        </div>

        {/* Sophisticated Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/50" />
      </div>

      {/* Floating Content Drawer */}
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white z-10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300/90 font-mono">
            {category.slug || "HAUTE-COUTURE"}
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white transition-all duration-300 group-hover:bg-primary group-hover:border-gold-300 group-hover:text-gold-300 group-hover:scale-110">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-normal text-white group-hover:text-gold-200 transition-colors tracking-tight">
          {category.name}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-white/80 line-clamp-2 font-light">
          {category.description || category.blurb}
        </p>

        {/* Subcategories preview tags if available */}
        {subcategories.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-white/15">
            {subcategories.slice(0, 3).map((sub, sIdx) => (
              <span
                key={sIdx}
                className="rounded-full bg-white/10 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium text-white/90 border border-white/15"
              >
                {sub}
              </span>
            ))}
            {subcategories.length > 3 && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gold-300/90 font-medium">
                +{subcategories.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/15 text-xs">
          <span className="font-semibold uppercase tracking-[0.2em] text-gold-300 group-hover:text-white transition-colors text-[11px] flex items-center gap-1.5">
            <span>Explore Wardrobe</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
          <span className="text-[10px] text-white/60 uppercase tracking-widest font-light">
            Gadhinglaj Studio
          </span>
        </div>
      </div>
    </Link>
  );
}
