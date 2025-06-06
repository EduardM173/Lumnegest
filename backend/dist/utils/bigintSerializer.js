"use strict";
// backend/src/utils/bigintSerializer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigintReplacer = bigintReplacer;
/**
 * Replacer para JSON.stringify que convierte BigInt en string.
 */
function bigintReplacer(key, value) {
    return typeof value === 'bigint' ? value.toString() : value;
}
//# sourceMappingURL=bigintSerializer.js.map