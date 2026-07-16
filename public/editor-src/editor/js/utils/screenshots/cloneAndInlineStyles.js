// Visual properties needed for a static thumbnail screenshot.
// Omitted: animations, transitions, cursors, counters, pointer-events —
// none of which affect the appearance of a frozen snapshot.
const KEY_PROPS = [
  // Box model
  "display", "box-sizing", "position",
  "width", "height", "min-width", "min-height", "max-width", "max-height",
  "top", "left", "right", "bottom",
  "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding-top", "padding-right", "padding-bottom", "padding-left",
  "float", "clear", "overflow", "overflow-x", "overflow-y",
  "z-index", "visibility", "opacity",
  "aspect-ratio",
  // Background
  "background-color", "background-image", "background-size",
  "background-position", "background-repeat", "background-origin",
  "background-attachment", "background-clip",
  // Border
  "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "border-top-style", "border-right-style", "border-bottom-style", "border-left-style",
  "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  "border-top-left-radius", "border-top-right-radius",
  "border-bottom-left-radius", "border-bottom-right-radius",
  "box-shadow", "outline", "outline-color", "outline-style", "outline-width",
  // Typography
  "color", "-webkit-text-fill-color", "-webkit-text-stroke-width", "-webkit-text-stroke-color",
  "font-family", "font-size", "font-weight", "font-style", "font-variant",
  "line-height", "letter-spacing", "word-spacing",
  "text-align", "text-decoration", "text-decoration-color", "text-decoration-style",
  "text-transform", "text-shadow", "text-overflow", "text-indent",
  "white-space", "word-break", "overflow-wrap", "vertical-align",
  // Flexbox
  "flex-direction", "flex-wrap", "justify-content", "align-items",
  "align-content", "align-self", "justify-self",
  "flex-grow", "flex-shrink", "flex-basis", "order",
  // Grid
  "grid-template-columns", "grid-template-rows", "grid-column", "grid-row",
  "grid-template-areas", "grid-area",
  "column-gap", "row-gap",
  // Transform, filter & effects
  "transform", "transform-origin",
  "filter", "backdrop-filter",
  "mix-blend-mode",
  "clip-path",
  "object-fit", "object-position",
  // List & table
  "list-style-type", "list-style-position", "list-style-image",
  "border-collapse", "border-spacing",
  // SVG presentation
  "fill", "fill-opacity", "fill-rule",
  "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray", "stroke-dashoffset",
  "stroke-linecap", "stroke-linejoin",
  "stop-color", "stop-opacity",
];

export function cloneAndInlineStyles(node) {
  const originals = [node, ...node.querySelectorAll("*")];

  // Read ALL computed styles before any DOM writes.
  // The original RafScheduler interleaved reads and writes — every write
  // after a read forced a full layout recalculation on the next read.
  // Reading everything first lets the browser batch all calculations in
  // one layout pass.
  const storedStyles = originals.map((el) => {
    if (!(el instanceof HTMLElement) && !(el instanceof SVGElement)) {
      return null;
    }
    const cs = window.getComputedStyle(el);
    const result = {};
    for (const prop of KEY_PROPS) {
      const value = cs.getPropertyValue(prop);
      if (value) result[prop] = value;
    }
    return result;
  });

  const cloned = node.cloneNode(true);
  const clones = [cloned, ...cloned.querySelectorAll("*")];

  clones.forEach((clone, i) => {
    const styles = storedStyles[i];
    if (!styles) return;
    // SVGElement.style exists but is not an HTMLElement — handle both
    const style = clone instanceof HTMLElement || clone instanceof SVGElement
      ? clone.style
      : null;
    if (!style) return;
    for (const [prop, value] of Object.entries(styles)) {
      style.setProperty(prop, value);
    }
  });

  return cloned;
}
