export function isDynamicContent(s: string): boolean {
  return /{{\s*(\w+)(.*?)}}/g.test(s);
}
