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
 * Normalizes and analyzes a product's stock across both total product quantity
 * and individual sizes, taking color variants into account.
 */
export function analyzeProductStock(product: Product, threshold: number = 3): ProductStockAnalysis {
  const totalStock = Math.max(0, Number(product.stock) || 0);
  const sizeMap = new Map<string, { stock: number; byColor: { color: string; stock: number }[] }>();

  // Determine all available sizes for this product
  const productSizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : [];

  if (Array.isArray(product.colors) && product.colors.length > 0) {
    product.colors.forEach((col) => {
      const colorName = col.name || product.color || "Standard";
      const colSizes = Array.isArray(col.sizes) && col.sizes.length > 0
        ? col.sizes
        : productSizes;

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
      } else if (colSizes.length > 0) {
        const colTotal = Math.max(0, Number(col.stock) || 0);
        const even = Math.floor(colTotal / colSizes.length);
        const rem = colTotal % colSizes.length;
        colSizes.forEach((sz, idx) => {
          const stock = even + (idx === 0 ? rem : 0);
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
  } else if (productSizes.length > 0) {
    const even = Math.floor(totalStock / productSizes.length);
    const rem = totalStock % productSizes.length;
    productSizes.forEach((sz, idx) => {
      const stock = even + (idx === 0 ? rem : 0);
      sizeMap.set(sz, {
        stock,
        byColor: [{ color: product.color || "Standard", stock }],
      });
    });
  } else {
    sizeMap.set("Standard", {
      stock: totalStock,
      byColor: [{ color: product.color || "Standard", stock: totalStock }],
    });
  }

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

  const isCritical = totalStock <= 2 || outOfStockSizes.length > 0 || (lowSizes.some((s) => s.stock <= 1));

  // Determine display status badge
  let statusBadge: ProductStockAnalysis["statusBadge"];
  if (isProductOutOfStock) {
    statusBadge = {
      label: "Out of Stock",
      variant: "rose",
      reason: "Product totally out of stock (0 units)",
    };
  } else if (outOfStockSizes.length > 0) {
    const names = outOfStockSizes.map((s) => s.size).join(", ");
    statusBadge = {
      label: `Sizes [${names}] Out`,
      variant: "rose",
      reason: `Size(s) ${names} completely depleted`,
    };
  } else if (isProductLow) {
    statusBadge = {
      label: `${totalStock} Units Left`,
      variant: totalStock <= 2 ? "amber" : "yellow",
      reason: `Overall product quantity low (≤ ${threshold})`,
    };
  } else if (hasLowSizes) {
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
      reason: "Inventory levels adequate across sizes",
    };
  }

  return {
    product,
    totalStock,
    sizeStocks,
    allSizes: sizeStocks.map((s) => s.size),
    isProductLow,
    isProductOutOfStock,
    hasLowSizes,
    hasOutOfStockSizes,
    lowSizes,
    outOfStockSizes,
    isCritical,
    statusBadge,
  };
}

/**
 * Returns true if a product has low stock according to total quantity OR any size quantity.
 */
export function isProductLowStock(product: Product, threshold: number = 3): boolean {
  if (product.stock <= threshold) return true;
  const analysis = analyzeProductStock(product, threshold);
  return analysis.hasLowSizes || analysis.hasOutOfStockSizes;
}

/**
 * Helper to update a product's stock by size or total quantity,
 * preserving and synchronizing color variants and sizes.
 */
export function updateProductStockDetails(
  product: Product,
  newSizeQuantities: { [size: string]: number },
  targetColorIdx: number = 0
): Product {
  const allSizes = Object.keys(newSizeQuantities);
  const totalCalculated = Object.values(newSizeQuantities).reduce((sum, val) => sum + Math.max(0, val), 0);

  const newSizeStocks: ProductSizeStock[] = allSizes.map((sz) => ({
    size: sz,
    stock: Math.max(0, newSizeQuantities[sz] ?? 0),
  }));

  if (Array.isArray(product.colors) && product.colors.length > 0) {
    const updatedColors = [...product.colors];
    const targetIdx = Math.min(targetColorIdx, updatedColors.length - 1);
    const targetColor = { ...updatedColors[targetIdx] };

    targetColor.sizeStocks = newSizeStocks;
    targetColor.sizes = allSizes;
    targetColor.stock = totalCalculated;
    updatedColors[targetIdx] = targetColor;

    const overallStock = updatedColors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
    const combinedSizes = Array.from(
      new Set(
        updatedColors.flatMap((c) =>
          Array.isArray(c.sizeStocks) && c.sizeStocks.length > 0
            ? c.sizeStocks.map((s) => s.size)
            : c.sizes || []
        )
      )
    );

    return {
      ...product,
      colors: updatedColors,
      stock: overallStock,
      sizes: combinedSizes.length > 0 ? combinedSizes : product.sizes,
    };
  }

  const defaultVariant: ProductColorVariant = {
    id: "col-default",
    name: product.color || "Standard",
    stock: totalCalculated,
    image: product.image || "",
    hasSizes: true,
    sizes: allSizes,
    sizeStocks: newSizeStocks,
  };

  return {
    ...product,
    colors: [defaultVariant],
    stock: totalCalculated,
    sizes: allSizes.length > 0 ? allSizes : product.sizes,
  };
}
