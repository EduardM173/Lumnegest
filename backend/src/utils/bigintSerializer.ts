// backend/src/utils/bigintSerializer.ts

/**
 * Replacer para JSON.stringify que convierte BigInt en string.
 */
export function bigintReplacer(key: string, value: unknown) {
  return typeof value === 'bigint' ? value.toString() : value;
}
