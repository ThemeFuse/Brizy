export const isParentOf = (p: Node, t: Node): boolean => {
  return !!(
    t?.parentNode &&
    (t.parentNode === p || isParentOf(p, t.parentNode as Node))
  );
};
