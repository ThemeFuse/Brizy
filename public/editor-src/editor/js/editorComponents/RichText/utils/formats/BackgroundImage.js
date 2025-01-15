import Quill from "quill";
import Config from "visual/global/Config";
import { SizeType } from "visual/global/Config/types/configs/common";
import { getImageUrl } from "visual/utils/image";
import { getImagePopulation } from "../requests/ImagePopulation";

let Inline = Quill.import("blots/inline");

class BackgroundImage extends Inline {
  // static className = "text-mask";
  static create(value) {
    const node = super.create(value);
    this.setValue(value, node);
    return node;
  }

  static formats(node) {
    let imageSrc = node.getAttribute("data-image_src");
    let imagePopulation = node.getAttribute("data-image_population");

    if (imageSrc || imagePopulation) {
      const imagePositionX = parseInt(node.style.backgroundPositionX) || null;
      const imagePositionY = parseInt(node.style.backgroundPositionY) || null;
      const imageWidth =
        parseInt(node.getAttribute("data-image_width")) || null;
      const imageHeight =
        parseInt(node.getAttribute("data-image_height")) || null;
      const imageExtension = node.getAttribute("data-image_extension");
      const imageFileName =
        node.getAttribute("data-image_file_name") || "image";

      if (!node.classList.contains("brz-population-mask")) {
        imagePopulation = null;
      }

      return {
        imageSrc,
        imageWidth,
        imageHeight,
        imageExtension,
        imageFileName,
        imagePositionX,
        imagePositionY,
        imagePopulation,
        positionX: imagePositionX,
        positionY: imagePositionY
      };
    }
    return null;
  }

  static setValue(value, node) {
    const {
      imageSrc,
      imageFileName,
      imageExtension,
      imageWidth,
      imageHeight,
      imagePositionX,
      imagePositionY,
      imagePopulation
    } = value;

    const config = Config.getAll();

    if (imagePopulation && typeof imagePopulation === "string") {
      node.style.backgroundImage = null;
      // ! should be 50% 50% or should we set image position?
      node.style.backgroundPosition = "50% 50%";
      node.classList.add("brz-population-mask");
      node.classList.remove("brz-population-mask__style");
      node.classList.remove("brz-text-mask");
      node.setAttribute("data-image_population", imagePopulation);

      requestAnimationFrame(() => {
        const itemId = node
          .closest("[data-item_id]")
          .getAttribute("data-item_id");

        const renderDC =
          typeof config?.dynamicContent?.getPlaceholderData === "function";

        if (renderDC) {
          getImagePopulation(imagePopulation, itemId, config).then((url) => {
            if (url) {
              node.style.backgroundImage = `url('${url}')`;
              node.classList.add("brz-population-mask__style");
            }
          });
        } else {
          node.style.backgroundImage = `url('${imagePopulation}')`;
          node.classList.add("brz-population-mask__style");
        }
      });
    } else if (imageSrc) {
      const imgUrl = getImageUrl(
        {
          fileName: imageFileName,
          uid: imageSrc,
          sizeType: SizeType.custom
        },
        config
      );
      node.classList.add("brz-text-mask");
      node.classList.remove("brz-population-mask");
      node.classList.remove("brz-population-mask__style");
      node.style.backgroundImage = `url('${imgUrl}')`;
      node.style.backgroundPosition = `${imagePositionX}% ${imagePositionY}%`;
      node.removeAttribute("data-image_population");
      node.setAttribute("data-image_src", imageSrc);
      node.setAttribute("data-image_file_name", imageFileName);
      node.setAttribute("data-image_width", imageWidth);
      node.setAttribute("data-image_height", imageHeight);
      node.setAttribute("data-image_extension", imageExtension);
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
