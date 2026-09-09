/** "24,90 kr" - Swedish comma-decimal price, per the reference mockups. */
export function formatPriceSek(price: number): string {
  return `${price.toFixed(2).replace('.', ',')} kr`;
}

/** "0.42 kr/g" - cost-effectiveness ratio, period-decimal per the reference mockups. */
export function formatCostPerGramProtein(pricePerGramProtein: number): string {
  return `${pricePerGramProtein.toFixed(2)} kr/g`;
}
