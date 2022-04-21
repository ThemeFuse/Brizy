export default function objectToQueryString(
  obj: Record<string, string | number | boolean>
): string {
  if (!obj) {
    return "";
  }

  return Object.entries<string | number | boolean>(obj)
    .map(item => {
      return item[0] + "=" + encodeURIComponent(item[1]);
    })
    .join("&");
}
