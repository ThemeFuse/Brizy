export const getContentType = (url: string): Promise<string | null> =>
  fetch(url).then((response) => response.headers.get("content-type"));
