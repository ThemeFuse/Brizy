export const getModifiedField = ([b1, s1, v1, h1], [b2, s2, v2, h2]) => {
  return b1 !== b2
    ? "blur"
    : s1 !== s2
    ? "spread"
    : v1 !== v2
    ? "vertical"
    : h1 !== h2
    ? "horizontal"
    : undefined;
};
