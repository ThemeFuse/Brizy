import Quill from "quill";
import { imageUrl, svgUrl } from "visual/utils/image";
let Inline = Quill.import("blots/inline");

const isSVG = extension => extension === "svg";

class BackgroundImage extends Inline {
  // static className = "text-mask";
  static create(value) {
    const node = super.create(value);
    this.setValue(value, node);
    return node;
  }

  static formats(node) {
    let src = node.getAttribute("data-image_src");
    if (!src) {
      return null;
    }

    let population = node.getAttribute("data-image_population");
    const x = parseInt(node.style.backgroundPositionX) || null;
    const y = parseInt(node.style.backgroundPositionY) || null;
    const width = parseInt(node.getAttribute("data-image_width")) || null;
    const height = parseInt(node.getAttribute("data-image_height")) || null;
    const extension = node.getAttribute("data-image_extension");

    if (!node.classList.contains("brz-population-mask")) {
      population = null;
    }

    return { src, population, x, y, extension, width, height };
  }

  static setValue(value, node) {
    const { src, population, x, y, extension, width, height } = value;

    if (population) {
      node.style.backgroundImage = null;
      // ! should be 50% 50% or should we set image position?
      node.style.backgroundPosition = "50% 50%";
      node.classList.add("brz-population-mask");
      node.classList.remove("brz-text-mask");
      node.setAttribute("data-image_population", population);
    } else if (src) {
      const imgUrl = isSVG(extension) ? svgUrl(src) : imageUrl(src);
      node.classList.add("brz-text-mask");
      node.classList.remove("brz-population-mask");
      node.style.backgroundImage = `url('${imgUrl}')`;
      node.style.backgroundPosition = `${x}% ${y}%`;
      node.removeAttribute("data-image_population");
      node.setAttribute("data-image_src", src);
      node.setAttribute("data-image_width", width);
      node.setAttribute("data-image_height", height);
      node.setAttribute("data-image_extension", extension);
    } else {
      this.removeValue(node);
    }
  }

  static removeValue(node) {
    node.style.backgroundImage = null;
    node.style.backgroundPosition = null;
    node.classList.remove("brz-text-mask");
    node.classList.remove("brz-population-mask");
    node.removeAttribute("data-image_population");
    node.removeAttribute("data-image_src");
    node.removeAttribute("data-image_width");
    node.removeAttribute("data-image_height");
    node.removeAttribute("data-image_extension");
  }

  format(name, value) {
    if (name !== this.statics.blotName) {
      super.format(name, value);
    } else {
      value
        ? this.constructor.setValue(value, this.domNode)
        : this.constructor.removeValue(this.domNode);
    }
  }
}
BackgroundImage.blotName = "backgroundImage";
BackgroundImage.tagName = "span";

export { BackgroundImage as default };
