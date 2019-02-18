export function styleHoverTransition({ v }) {
  const { hoverTransition } = v;

  return `all 0.${hoverTransition}s ease-in-out`;
}

export function styleHoverTransitionProperty() {
  return "background, border-radius, color, border-color";
}
