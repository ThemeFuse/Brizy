export default function parseQueryString(queryString = "") {
  return queryString.split("&").reduce((acc, part) => {
    const [key, value] = part.split("=");
    acc[key] = value;

    return acc;
  }, {});
}
