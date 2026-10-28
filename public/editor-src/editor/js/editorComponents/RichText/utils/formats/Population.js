import Quill from "quill";

const Inline = Quill.import("blots/inline");

class Population extends Inline {
  static className = "text-population";
  static create(value) {
    // biome-ignore lint/complexity/noThisInStatic: parchment's ShadowBlot.create stamps the blot's marker class via `this.className`; calling Inline.create rebinds `this` to Quill's Inline, which has none, so `text-population` is never applied and the span is unwrapped on reparse
    const node = super.create(value);
    Population.setValue(value, node);
    return node;
  }

  static formats(node) {
    const population = node.getAttribute("data-population");

    if (population) {
      return population;
    }

    return null;
  }

  static setValue(population, node) {
    if (population) {
      node.setAttribute("data-population", population);
    }
  }

  static removeValue(node) {
    node.removeAttribute("data-population");
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
Population.blotName = "population";
Population.tagName = "span";

export { Population as default };
