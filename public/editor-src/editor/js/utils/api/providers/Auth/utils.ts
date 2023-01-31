import { Base64 } from "js-base64";

const KEY = "MC43NDQwMzkxMDQwNjc4MDM0";

function caesarShift(str: string, amount: number): string {
  if (amount < 0) return caesarShift(str, amount + 26);
  let output = "";

  for (let i = 0; i < str.length; i++) {
    let c = str[i];

    if (c.match(/[a-z]/i)) {
      const code = str.charCodeAt(i);

      if (code >= 65 && code <= 90)
        c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      else if (code >= 97 && code <= 122)
        c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
    }

    output += c;
  }

  return output;
}

export const encrypt = function (str: string) {
  const base64 = Base64.toBase64(str);
  const half = parseInt(`${base64.length / 2}`);
  const base64Encoded = base64.slice(0, half) + KEY + base64.slice(half);

  return caesarShift(base64Encoded, 20);
};

export const decrypt = function (src: string): string {
  const decrypted = caesarShift(src, -20);

  return Base64.fromBase64(decrypted.replace(KEY, ""));
};
