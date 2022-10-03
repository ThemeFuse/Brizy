import Quill from "quill";
import { imageUrl, svgUrl } from "visual/utils/image";
import { getImagePopulation } from "../requests/ImagePopulation";
let Inline = Quill.import("blots/inline");
const isSVG = (extension) => extension === "svg";

class BackgroundImage extends Inline {
  // static className = "text-mask";
  static create(value) {
    const node = super.create(value);
    this.setValue(value, node);
    return node;
  }

  static formats(node) {
    let src = node.getAttribute("data-image_src");
    let population = node.getAttribute("data-image_population");

    if (src || population) {
      const x = parseInt(node.style.backgroundPositionX) || null;
      const y = parseInt(node.style.backgroundPositionY) || null;
      const width = parseInt(node.getAttribute("data-image_width")) || null;
      const height = parseInt(node.getAttribute("data-image_height")) || null;
      const extension = node.getAttribute("data-image_extension");
      const fileName = node.getAttribute("data-image_file_name") || "image";

      if (!node.classList.contains("brz-population-mask")) {
        population = null;
      }

      return {
        src,
        population,
        x,
        y,
        extension,
        fileName,
        width,
        height
      };
    }
    return null;
  }

  static setValue(value, node) {
    const { src, fileName, population, x, y, extension, width, height } = value;

    if (population) {
      node.style.backgroundImage = null;
      // ! should be 50% 50% or should we set image position?
      node.style.backgroundPosition = "50% 50%";
      node.classList.add("brz-population-mask");
      node.classList.remove("brz-population-mask__style");
      node.classList.remove("brz-text-mask");
      node.setAttribute("data-image_population", population);

      requestAnimationFrame(() => {
        const itemId = node
          .closest("[data-item_id]")
          .getAttribute("data-item_id");
        getImagePopulation(population, itemId).then((url) => {
          if (url) {
            node.style.backgroundImage = `url(${url})`;
            node.classList.add("brz-population-mask__style");
          }
        });
      });
    } else if (src) {
      const imgUrl = isSVG(extension)
        ? svgUrl(src, { fileName })
        : imageUrl(src, { fileName });
      node.classList.add("brz-text-mask");
      node.classList.remove("brz-population-mask");
      node.classList.remove("brz-population-mask__style");
      node.style.backgroundImage = `url(${imgUrl})`;
      node.style.backgroundPosition = `${x}% ${y}%`;
      node.removeAttribute("data-image_population");
      node.setAttribute("data-image_src", src);
      node.setAttribute("data-image_file_name", fileName);
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
    node.classList.remove("brz-population-mask__style");
    node.removeAttribute("data-image_population");
    node.removeAttribute("data-image_src");
    node.removeAttribute("data-image_file_name");
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
