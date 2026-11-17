/**
 * Normalizes a single line of code for comparison: drops comments,
 * trailing semicolons and all whitespace, so `i<n` equals `i < n;`.
 * `#include` and `#define` are kept because they are C code, not comments.
 * Whitespace inside string literals is not preserved, which is fine for
 * the short DSA fixes this app compares.
 */
export function normalizeLine(line: string): string {
  return line
    .replace(/\/\/.*$/, '')
    .replace(/(^|\s)#(?!include|define).*$/, '')
    .replace(/\s+/g, '')
    .replace(/;+$/, '')
    .toLowerCase();
}

/** Makes `O(n^2)`, `O(n²)` and `o( n**2 )` compare equal. */
export function normalizeComplexity(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/\*\*/g, '^')
    .replace(/log2|log₂/g, 'log')
    .replace(/^o\((.*)\)$/, '$1')
    .replace(/\*/g, '');
}
