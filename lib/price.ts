// lib/price.ts
// Centralised pricing utilities used across cards, detail pages,
// and the checkout. One place to change pricing logic.

export interface PriceInfo {
    displayPrice:    number   // the price shown to the user
    originalPrice:   number   // full price before discount
    discountAmount:  number   // how much they save (0 if no sale)
    discountPercent: number   // rounded % off (0 if no sale)
    isOnSale:        boolean
  }
  
  // Takes raw product price fields and returns everything the UI needs
  export function getPriceInfo(
    price:     number,
    salePrice: number | null
  ): PriceInfo {
    const isOnSale      = salePrice !== null && salePrice < price
    const displayPrice  = isOnSale ? salePrice! : price
    const discountAmount  = isOnSale ? price - salePrice! : 0
    const discountPercent = isOnSale
      ? Math.round(((price - salePrice!) / price) * 100)
      : 0
  
    return {
      displayPrice,
      originalPrice: price,
      discountAmount,
      discountPercent,
      isOnSale,
    }
  }
  
  // Format a number as Philippine Peso
  export function formatPHP(amount: number): string {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`
  }
  
  // Determine stock status label and style
  export function getStockStatus(inStock: boolean, stockCount: number | null) {
    if (!inStock) {
      return {
        label:      "Out of stock",
        className:  "bg-red-900/50 text-red-400",
        canAdd:     false,
      }
    }
    if (stockCount !== null && stockCount <= 5) {
      return {
        label:      `Only ${stockCount} left`,
        className:  "bg-amber-900/50 text-amber-400",
        canAdd:     true,
      }
    }
    return {
      label:      "In stock",
      className:  "bg-green-900/50 text-green-400",
      canAdd:     true,
    }
  }