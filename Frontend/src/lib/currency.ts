/**
 * Currency formatting utilities for Indonesian Rupiah
 * Uses Indonesian abbreviations: Jt (Juta), Rb (Ribu), M (Miliar), T (Triliun)
 */

/**
 * Format currency with Indonesian abbreviations
 * - Triliun (T): >= 1.000.000.000.000
 * - Miliar (M): >= 1.000.000.000  
 * - Juta (Jt): >= 1.000.000
 * - Ribu (Rb): >= 1.000
 * - Full number for < 1.000
 */
export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 1_000_000_000_000) {
    // Triliun
    return `${sign}Rp ${(absAmount / 1_000_000_000_000).toFixed(1).replace('.0', '')} T`;
  } else if (absAmount >= 1_000_000_000) {
    // Miliar
    return `${sign}Rp ${(absAmount / 1_000_000_000).toFixed(1).replace('.0', '')} M`;
  } else if (absAmount >= 1_000_000) {
    // Juta
    return `${sign}Rp ${(absAmount / 1_000_000).toFixed(1).replace('.0', '')} Jt`;
  } else if (absAmount >= 1_000) {
    // Ribu
    return `${sign}Rp ${(absAmount / 1_000).toFixed(0)} Rb`;
  } else {
    // Full number
    return `${sign}Rp ${absAmount.toLocaleString('id-ID')}`;
  }
}

/**
 * Format currency with full number (no abbreviation)
 * e.g. Rp 10.000.000
 */
export function formatCurrencyFull(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}Rp ${Math.abs(amount).toLocaleString('id-ID')}`;
}

/**
 * Format currency for input display (without Rp prefix)
 * e.g. 10.000.000
 */
export function formatNumber(amount: number): string {
  return Math.abs(amount).toLocaleString('id-ID');
}
