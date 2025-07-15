export const parseUrlParameters = (_url: string): Record<string, string> => {
  const url = new URL(_url);
  const params: { [k: string]: string } = {};

  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};
