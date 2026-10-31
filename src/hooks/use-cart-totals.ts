import { useStore } from "@/lib/store";

export function useCartTotals() {
  const { cart, products, settings } = useStore();
  const lines = cart
    .map((c) => {
      const product = products.find((p) => p.id === c.productId);
      return product ? { ...c, product } : null;
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const mrpTotal = lines.reduce((n, l) => n + l.product.mrp * l.qty, 0);
  const discount = mrpTotal - subtotal;
  const delivery = subtotal > 0 ? settings.delivery : 0;
  const tax = Math.round((subtotal * settings.tax) / 100);
  const total = subtotal + delivery + tax;
  return { lines, subtotal, discount, delivery, tax, total };
}
