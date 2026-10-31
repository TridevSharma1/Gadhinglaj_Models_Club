import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export default function Hero() {
  const { banners } = useStore();
  const active = banners.filter((b) => b.active);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (active.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % active.length), 6000);
    return () => clearInterval(t);
  }, [active.length]);

  if (!active.length) return null;

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {active.map((b, idx) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i % active.length ? "opacity-100" : "opacity-0"}`}
        >
          <img src={b.image} alt={b.title} className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
        </div>
      ))}

      <div className="container-lux relative flex h-full items-center">
        <div key={i} className="animate-fade-up max-w-xl text-white">
          <p className="eyebrow text-accent">Gadhinglaj Models Club</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            {active[i % active.length]!.title}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            {active[i % active.length]!.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={active[i % active.length]!.link}
              className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              {active[i % active.length]!.cta}
            </Link>
            <Link
              href="/rental"
              className="rounded-full border border-white/60 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Rental Collection
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2.5">
        {active.map((b, idx) => (
          <button
            key={b.id}
            aria-label={`Banner ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === i % active.length ? "w-10 bg-accent" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
