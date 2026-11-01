import type { Product, ProductColorVariant, ProductSizeStock } from "@/data/catalog";

export interface SizeStockInfo {
  size: string;
  stock: number;
  isLow: boolean;
  isOutOfStock: boolean;
  colorDetails?: { color: string; stock: number }[];
}

export interface ProductStockAnalysis {
  product: Product;
  totalStock: number;
  variants: ProductColorVariant[];
  sizeStocks: SizeStockInfo[];
  allSizes: string[];
  isProductLow: boolean;
  isProductOutOfStock: boolean;
  hasLowSizes: boolean;
  hasOutOfStockSizes: boolean;
  lowSizes: SizeStockInfo[];
  outOfStockSizes: SizeStockInfo[];
  isCritical: boolean;
  statusBadge: {
    label: string;
    variant: "rose" | "amber" | "yellow" | "emerald";
    reason: string;
  };
}

/**
 * Normalizes any product into an array of color variants with their size stocks,
 * matching the exact data shape and fallback logic used in the Inventory section.
 */
export function getProductVariants(p: Product): ProductColorVariant[] {
  if (p.colors && p.colors.length > 0) {
    return p.colors.map((c, idx) => {
      const sizesList =
        c.sizes && c.sizes.length > 0
          ? c.sizes
          : p.sizes && p.sizes.length > 0
          ? p.sizes
          : [];
      let sizeStocks = c.sizeStocks;

      // If color has sizes enabled or sizes exist but sizeStocks is empty, initialize evenly
      if (
        (c.hasSizes || sizesList.length > 0) &&
        (!sizeStocks || sizeStocks.length === 0) &&
        sizesList.length > 0
      ) {
        const evenStock = Math.floor(c.stock / sizesList.length);
        const remainder = c.stock % sizesList.length;
        sizeStocks = sizesList.map((sz, i) => ({
          size: sz,
          stock: evenStock + (i === 0 ? remainder : 0),
        }));
      }

      return {
        id: c.id || `col-${idx}`,
        name: c.name || p.color || `Shade ${idx + 1}`,
        stock: c.stock ?? 0,
        image: c.image || p.image || "",
        hasSizes: c.hasSizes ?? sizesList.length > 0,
        sizes: sizesList,
        sizeStocks: sizeStocks || [],
      };
    });
  }

  const defaultSizes = p.sizes && p.sizes.length > 0 ? p.sizes : [];
  const defaultSizeStocks = defaultSizes.map((sz, i) => {
    const evenStock = Math.floor(p.stock / defaultSizes.length);
    const remainder = p.stock % defaultSizes.length;
    return { size: sz, stock: evenStock + (i === 0 ? remainder : 0) };
  });

  return [
    {
      id: "col-default",
      name: p.color || "Standard Shade",
      stock: p.stock || 0,
      image: p.image || "",
      hasSizes: defaultSizes.length > 0,
      sizes: defaultSizes,
      sizeStocks: defaultSizeStocks,
    },
  ];
}

/**
 * Normalizes and analyzes a product's stock across both total product quantity
 * and individual color & size variants.
 */
export function analyzeProductStock(product: Product, threshold: number = 3): ProductStockAnalysis {
  const totalStock = Math.max(0, Number(product.stock) || 0);
  const variants = getProductVariants(product);
  const sizeMap = new Map<string, { stock: number; byColor: { color: string; stock: number }[] }>();

  // Determine all available sizes for this product
  const productSizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : [];

  variants.forEach((col) => {
    const colorName = col.name || product.color || "Standard";

    if (Array.isArray(col.sizeStocks) && col.sizeStocks.length > 0) {
      col.sizeStocks.forEach((item) => {
        const sz = item.size.trim();
        const stock = Math.max(0, Number(item.stock) || 0);
        const existing = sizeMap.get(sz);
        if (existing) {
          existing.stock += stock;
          existing.byColor.push({ color: colorName, stock });
        } else {
          sizeMap.set(sz, {
            stock,
            byColor: [{ color: colorName, stock }],
          });
        }
      });
    } else {
      const stock = Math.max(0, Number(col.stock) || 0);
      const sz = "Standard";
      const existing = sizeMap.get(sz);
      if (existing) {
        existing.stock += stock;
        existing.byColor.push({ color: colorName, stock });
      } else {
        sizeMap.set(sz, {
          stock,
          byColor: [{ color: colorName, stock }],
        });
      }
    }
  });

  // Ensure all base sizes exist in sizeMap
  productSizes.forEach((sz) => {
    if (!sizeMap.has(sz)) {
      sizeMap.set(sz, {
        stock: 0,
        byColor: [{ color: product.color || "Standard", stock: 0 }],
      });
    }
  });

  const sizeStocks: SizeStockInfo[] = Array.from(sizeMap.entries()).map(([size, data]) => {
    const stock = data.stock;
    return {
      size,
      stock,
      isLow: stock > 0 && stock <= threshold,
      isOutOfStock: stock === 0,
      colorDetails: data.byColor,
    };
  });

  const isProductOutOfStock = totalStock === 0;
  const isProductLow = totalStock > 0 && totalStock <= threshold;

  const lowSizes = sizeStocks.filter((s) => s.isLow);
  const outOfStockSizes = sizeStocks.filter((s) => s.isOutOfStock);

  const hasLowSizes = lowSizes.length > 0;
  const hasOutOfStockSizes = outOfStockSizes.length > 0;

  // Check if any variant or variant size is low/out
  const hasLowColor = variants.some((c) => c.stock > 0 && c.stock <= threshold);
  const hasOutColor = variants.some((c) => c.stock === 0);
  const hasLowVariantSize = variants.some((c) =>
    c.sizeStocks?.some((s) => s.stock > 0 && s.stock <= threshold)
  );
  const hasOutVariantSize = variants.some((c) =>
    c.sizeStocks?.some((s) => s.stock === 0)
  );

  const isCritical =
    totalStock <= 2 ||
    outOfStockSizes.length > 0 ||
    hasOutColor ||
    hasOutVariantSize ||
    lowSizes.some((s) => s.stock <= 1);

  // Determine display status badge
  let statusBadge: ProductStockAnalysis["statusBadge"];
  if (isProductOutOfStock) {
    statusBadge = {
      label: "Out of Stock",
      variant: "rose",
      reason: "Product completely out of stock (0 units)",
    };
  } else if (outOfStockSizes.length > 0) {
    const names = outOfStockSizes.map((s) => s.size).join(", ");
    statusBadge = {
      label: `Sizes [${names}] Out`,
      variant: "rose",
      reason: `Size(s) ${names} completely depleted`,
    };
  } else if (hasOutColor) {
    const names = variants.filter((c) => c.stock === 0).map((c) => c.name).join(", ");
    statusBadge = {
      label: `Colour [${names}] Out`,
      variant: "rose",
      reason: `Shade(s) ${names} out of stock`,
    };
  } else if (isProductLow) {
    statusBadge = {
      label: `${totalStock} Units Left`,
      variant: totalStock <= 2 ? "amber" : "yellow",
      reason: `Overall product quantity low (≤ ${threshold})`,
    };
  } else if (hasLowSizes || hasLowVariantSize) {
    const names = lowSizes.map((s) => `${s.size} (${s.stock})`).join(", ");
    statusBadge = {
      label: `Low Sizes: ${lowSizes.map((s) => s.size).join(", ")}`,
      variant: "amber",
      reason: `Depleted in size(s): ${names}`,
    };
  } else {
    statusBadge = {
      label: `${totalStock} Units (Healthy)`,
      variant: "emerald",
      reason: "Inventory levels adequate across sizes and colours",
    };
  }

  return {
    product,
    totalStock,
    variants,
    sizeStocks,
    allSizes: sizeStocks.map((s) => s.size),
    isProductLow,
    isProductOutOfStock,
    hasLowSizes: hasLowSizes || hasLowVariantSize,
    hasOutOfStockSizes: hasOutOfStockSizes || hasOutVariantSize,
    lowSizes,
    outOfStockSizes,
    isCritical,
    statusBadge,
  };
}

/**
 * Returns true if a product has low stock according to total quantity OR any size/color quantity.
 */
export function isProductLowStock(product: Product, threshold: number = 3): boolean {
  if (product.stock <= threshold) return true;
  const analysis = analyzeProductStock(product, threshold);
  return (
    analysis.hasLowSizes ||
    analysis.hasOutOfStockSizes ||
    analysis.variants.some((c) => c.stock <= threshold)
  );
}

/**
 * Updates a specific size stock within a specific color variant.
 */
export function updateVariantSizeStock(
  product: Product,
  colorIdx: number,
  sizeName: string,
  newQty: number
): Product {
  const currentVariants = getProductVariants(product);
  const targetCol = currentVariants[colorIdx] || currentVariants[0];
  const safeQty = Math.max(0, isNaN(newQty) ? 0 : newQty);

  const updatedSizeStocks: ProductSizeStock[] = targetCol.sizeStocks && targetCol.sizeStocks.length > 0
    ? [...targetCol.sizeStocks]
    : (targetCol.sizes && targetCol.sizes.length > 0 ? targetCol.sizes : [sizeName]).map((s) => ({
        size: s,
        stock: 0,
      }));

  const existingIdx = updatedSizeStocks.findIndex((s) => s.size === sizeName);
  if (existingIdx >= 0) {
    updatedSizeStocks[existingIdx] = {
      ...updatedSizeStocks[existingIdx],
      stock: safeQty,
    };
  } else {
    updatedSizeStocks.push({ size: sizeName, stock: safeQty });
  }

  const newColorStock = updatedSizeStocks.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);
  const newSizesList = Array.from(
    new Set(updatedSizeStocks.map((s) => s.size).concat(targetCol.sizes || []))
  );

  const updatedVariants = currentVariants.map((col, idx) => {
    if (idx !== colorIdx) return col;
    return {
      ...col,
      hasSizes: true,
      sizes: newSizesList,
      sizeStocks: updatedSizeStocks,
      stock: newColorStock,
    };
  });

  const newTotalStock = updatedVariants.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
  const allSizes = Array.from(
    new Set(
      updatedVariants.flatMap((c) =>
        c.sizeStocks && c.sizeStocks.length > 0 ? c.sizeStocks.map((s) => s.size) : c.sizes || []
      )
    )
  );

  return {
    ...product,
    colors: updatedVariants,
    stock: newTotalStock,
    sizes: allSizes.length > 0 ? allSizes : product.sizes,
  };
}

/**
 * Updates full color variant array for a product and recalculates overall totals.
 */
export function saveAllVariants(product: Product, updatedVariants: ProductColorVariant[]): Product {
  const newTotalStock = updatedVariants.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
  const allSizes = Array.from(
    new Set(
      updatedVariants.flatMap((c) =>
        c.sizeStocks && c.sizeStocks.length > 0 ? c.sizeStocks.map((s) => s.size) : c.sizes || []
      )
    )
  );

  return {
    ...product,
    colors: updatedVariants,
    stock: newTotalStock,
    sizes: allSizes.length > 0 ? allSizes : product.sizes,
  };
}
