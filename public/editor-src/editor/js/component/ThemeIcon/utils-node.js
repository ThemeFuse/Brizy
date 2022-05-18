// WARNING:
// This is intentionally not converted to TS and left in commonjs.
// It's because it is also imported in gulpfile (thus node environment)

const KEY = "MC43NDQwMzkxMDQwNjc4MDM0";

/**
 * @param {string} str
 * @param {number} amount
 * @returns {string}
 */
function caesarShift(str, amount) {
  if (amount < 0) return caesarShift(str, amount + 26);
  let output = "";

  for (let i = 0; i < str.length; i++) {
    let c = str[i];

    if (c.match(/[a-z]/i)) {
      let code = str.charCodeAt(i);

      if (code >= 65 && code <= 90)
        c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      else if (code >= 97 && code <= 122)
        c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
    }

    output += c;
  }

  return output;
}

/**
 * @param {string} base64
 * @returns {string}
 */
module.exports.encrypt = function encrypt(base64) {
  const half = parseInt(base64.length / 2);
  const base64Encoded = base64.slice(0, half) + KEY + base64.slice(half);

  return caesarShift(base64Encoded, 20);
};

/**
 * @param {string} encrypted
 * @returns {string}
 */
module.exports.decrypt = function decrypt(encrypted) {
  const decrypted = caesarShift(encrypted, -20);

  return decrypted.replace(KEY, "");
};
