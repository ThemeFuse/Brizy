var KEY = "MC43NDQwMzkxMDQwNjc4MDM0";

function caesarShift(str, amount) {
  if (amount < 0) return caesarShift(str, amount + 26);
  var output = "";

  for (var i = 0; i < str.length; i++) {
    var c = str[i];

    if (c.match(/[a-z]/i)) {
      var code = str.charCodeAt(i);

      if (code >= 65 && code <= 90)
        c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      else if (code >= 97 && code <= 122)
        c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
    }

    output += c;
  }

  return output;
}

function encrypt(base64) {
  var half = parseInt(base64.length / 2);
  var base64Encoded = base64.slice(0, half) + KEY + base64.slice(half);

  return caesarShift(base64Encoded, 20);
}

function decrypt(crypted) {
  var decrypted = caesarShift(crypted, -20);

  return decrypted.replace(KEY, "");
}

function responseToSvg(r) {
  return /^<svg/.test(r) ? r : atob(decrypt(r));
}

// Intentionally left commonjs export because it is used in gulpfile
module.exports = { encrypt, decrypt, responseToSvg };
