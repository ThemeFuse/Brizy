export function isAbsoluteUrl(url: string): boolean {
  return /^(https?:)?\/\//.test(url);
}
