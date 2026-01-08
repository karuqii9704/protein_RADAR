/**
 * Currency formatting utilities for Indonesian Rupiah
 * Always displays full numbers without abbreviations
 */

/**
 * Format currency with full number (no abbreviation)
 * e.g. Rp 10.000.000
 */
export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}Rp ${Math.abs(amount).toLocaleString('id-ID')}`;
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
