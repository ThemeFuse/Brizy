export function styleElementIconBoxIconPosition({ v }) {
  const { iconPosition } = v;

  return iconPosition === "right" ? "row-reverse" : "row";
}

export function styleElementIconBoxMarginLeft({ v }) {
  const { iconSpacing, iconPosition } = v;

  return iconPosition === "right" ? `${iconSpacing}px` : "auto";
}

export function styleElementIconBoxMarginRight({ v }) {
  const { iconSpacing, iconPosition } = v;

  return iconPosition === "left" ? `${iconSpacing}px` : "auto";
}
