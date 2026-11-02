import Quill from "quill";
import { getColor } from "visual/utils/color";

const Inline = Quill.import("blots/inline");

export function getStyle(backgroundGradient, config) {
  const {
    type,
    radialPosition,
    linearAngle,
    startPointer,
    finishPointer,
    startPalette,
    finishPalette,
    startHex,
    finishHex,
    startOpacity,
    finishOpacity
  } = backgroundGradient;

  const position =
    type === "linear-gradient"
      ? `${linearAngle}deg`
      : `circle ${radialPosition}px`;
  const hex1 = getColor(startPalette, startHex, startOpacity, config);
  const hex2 = getColor(finishPalette, finishHex, finishOpacity, config);

  return `${type}(${position}, ${hex1} ${startPointer}%, ${hex2} ${finishPointer}%)`;
}

export const getBackgroundGradient = (getConfig) => {
  class BackgroundGradient extends Inline {
    static className = "text-gradient";
    static create(value) {
      // biome-ignore lint/complexity/noThisInStatic: parchment's ShadowBlot.create stamps the blot's marker class via `this.className`; calling Inline.create rebinds `this` to Quill's Inline, which has none, so neither `text-gradient` nor the subclass's `text-gradient-bg` is applied and the span is unwrapped on reparse
      const node = super.create(value);
      // biome-ignore lint/complexity/noThisInStatic: dispatch must follow the calling class — TextBackgroundGradient inherits this create and overrides setValue to strip `brz-image-gradient`; naming the parent freezes dispatch here and that override never runs
      this.setValue(value, node);
      return node;
    }

    static formats(node) {
      const getAttr = (name) => {
        const value = node.getAttribute(name);
        const isNumber = (v) =>
          !Number.isNaN(parseFloat(v)) && Number.isFinite(Number(v));

        return isNumber(value) ? Number(value) : value;
      };

      const type = getAttr("data-gradient_type");
      if (!type) return null;

      const radialPosition = getAttr("data-gradient_radial_position");
      const linearAngle = getAttr("data-gradient_linear_angle");
      const startPointer = getAttr("data-gradient_start_pointer");
      const finishPointer = getAttr("data-gradient_finish_pointer");
      const activePointer = getAttr("data-gradient_active_pointer");
      const startHex = getAttr("data-gradient_start_hex");
      const finishHex = getAttr("data-gradient_finish_hex");
      const startOpacity = getAttr("data-gradient_start_opacity");
      const finishOpacity = getAttr("data-gradient_finish_opacity");
      const startPalette = getAttr("data-gradient_start_palette");
      const finishPalette = getAttr("data-gradient_finish_palette");

      return {
        type,
        radialPosition,
        linearAngle,
        startPointer,
        finishPointer,
        activePointer,
        startHex,
        finishHex,
        startOpacity,
        finishOpacity,
        startPalette,
        finishPalette
      };
    }

    static setValue(value, node) {
      if (!value) return;

      const {
        type,
        radialPosition,
        linearAngle,
        startPointer,
        finishPointer,
        activePointer,
        startHex,
        finishHex,
        startOpacity,
        finishOpacity,
        startPalette,
        finishPalette
      } = value;

      const bgValue = getStyle(value, getConfig());

      node.style.backgroundImage = bgValue;

      node.classList.add("brz-image-gradient");

      node.setAttribute("data-gradient_type", type);
      node.setAttribute("data-gradient_radial_position", radialPosition);
      node.setAttribute("data-gradient_linear_angle", linearAngle);
      node.setAttribute("data-gradient_start_pointer", startPointer);
      node.setAttribute("data-gradient_finish_pointer", finishPointer);
      node.setAttribute("data-gradient_active_pointer", activePointer);
      node.setAttribute("data-gradient_start_hex", startHex);
      node.setAttribute("data-gradient_finish_hex", finishHex);
      node.setAttribute("data-gradient_start_opacity", startOpacity);
      node.setAttribute("data-gradient_finish_opacity", finishOpacity);
      node.setAttribute("data-gradient_start_palette", startPalette);
      node.setAttribute("data-gradient_finish_palette", finishPalette);
    }

    static removeValue(node) {
      node.style.backgroundImage = null;
      node.removeAttribute("data-gradient_type");
      node.removeAttribute("data-gradient_radial_position");
      node.removeAttribute("data-gradient_linear_angle");
      node.removeAttribute("data-gradient_start_pointer");
      node.removeAttribute("data-gradient_finish_pointer");
      node.removeAttribute("data-gradient_active_pointer");
      node.removeAttribute("data-gradient_start_hex");
      node.removeAttribute("data-gradient_finish_hex");
      node.removeAttribute("data-gradient_start_opacity");
      node.removeAttribute("data-gradient_finish_opacity");
      node.removeAttribute("data-gradient_start_palette");
      node.removeAttribute("data-gradient_finish_palette");
    }

    format(name, value) {
      if (name !== this.statics.blotName) {
        super.format(name, value);
      } else {
        if (value) {
          this.constructor.setValue(value, this.domNode);
        } else {
          this.constructor.removeValue(this.domNode);
        }
      }
    }
  }

  BackgroundGradient.blotName = "backgroundGradient";
  BackgroundGradient.tagName = "span";

  return BackgroundGradient;
};
