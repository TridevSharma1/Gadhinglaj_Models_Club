import Link from "next/link";
import type { Category } from "@/data/catalog";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(category.name)}`}
      className="group animate-fade-up relative block overflow-hidden rounded-3xl border border-border shadow-soft"
    >
      <div className="aspect-[3/4] overflow-hidden bg-blush">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl text-white">{category.name}</h3>
        <p className="mt-1 text-xs text-white/80">{category.blurb}</p>
        <span className="mt-3 inline-block border-b border-accent pb-0.5 text-[11px] uppercase tracking-[0.2em] text-accent">
          Explore
        </span>
      </div>
    </Link>
  );
}
