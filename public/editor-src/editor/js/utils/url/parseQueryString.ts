export function parseQueryString(queryString: string): Record<string, string> {
  return queryString.split("&").reduce((acc, part) => {
    const [key, value] = part.split("=");
    acc[key] = value;

    return acc;
  }, {} as Record<string, string>);
}
