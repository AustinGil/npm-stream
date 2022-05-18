/**
 * Generates a random string of the give length made up of the allowed characters.
 * @param {number} [length=10] - Length of resulting string.
 * @param {string} [allowed=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789] - Characters allowed in the results.
 * @return {string}
 */
export function randomString(
  length = 10,
  allowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += allowed.charAt(Math.floor(Math.random() * allowed.length));
  }
  return result;
}

/**
 * @param {*} v
 * @returns {("string"|"number"|"boolean"|"array"|"function"|"null"|"undefined"|"object")}
 */
export function getRawType(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}
