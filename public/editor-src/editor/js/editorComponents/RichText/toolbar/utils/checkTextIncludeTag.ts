export const checkTextIncludeTag = (text: string, tag: string): boolean => {
  if (!text || !tag) {
    return false;
  }
  const exp = `<${tag} .*?>|<${tag}>`;
  const regex = new RegExp(exp, "gi");
  return text.match(regex) !== null;
};
