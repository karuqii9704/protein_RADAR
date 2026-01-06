/**
 * Currency formatting utilities for Indonesian Rupiah
 * Uses Indonesian abbreviations: Jt (Juta), Rb (Ribu), M (Miliar), T (Triliun)
 */

/**
 * Format currency with Indonesian abbreviations
 * - Triliun (T): >= 1.000.000.000.000
 * - Miliar (M): >= 1.000.000.000  
 * - Juta (Jt): >= 1.000.000
 * - Ribu (Rb): >= 10.000 (only abbreviate if >= 10rb for readability)
 * - Full number for < 10.000
 */
export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 1_000_000_000_000) {
    // Triliun
    const value = absAmount / 1_000_000_000_000;
    return `${sign}Rp ${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} T`;
  } else if (absAmount >= 1_000_000_000) {
    // Miliar
    const value = absAmount / 1_000_000_000;
    return `${sign}Rp ${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} M`;
  } else if (absAmount >= 1_000_000) {
    // Juta
    const value = absAmount / 1_000_000;
    return `${sign}Rp ${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} Jt`;
  } else if (absAmount >= 10_000) {
    // Ribu (only for >= 10rb)
    const value = absAmount / 1_000;
    return `${sign}Rp ${value.toFixed(0)} Rb`;
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
 * Format number for display (without Rp prefix)
 * e.g. 10.000.000
 */
export function formatNumber(amount: number): string {
  return Math.abs(amount).toLocaleString('id-ID');
}

/**
 * Format input value with thousand separators
 * Used for formatting user input in real-time
 * Returns string with dots as thousand separators
 */
export function formatInputNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  
  // Convert to number and format with Indonesian locale (dots as separators)
  const number = parseInt(digits, 10);
  if (isNaN(number)) return '';
  
  return number.toLocaleString('id-ID');
}

/**
 * Parse formatted input back to number
 * Removes thousand separators to get raw number
 */
export function parseInputNumber(formattedValue: string): number {
  // Remove all non-digit characters (dots, spaces, etc)
  const digits = formattedValue.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
}
