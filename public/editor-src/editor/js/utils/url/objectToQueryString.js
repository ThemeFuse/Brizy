export default function objectToQueryString(obj) {
  if (!obj) {
    return "";
  }

  var arr = [];

  for (var prop in obj) {
    arr.push(prop + "=" + encodeURIComponent(obj[prop]));
  }

  return arr.join("&");
}
