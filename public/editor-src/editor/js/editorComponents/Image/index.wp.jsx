import Image from "./index.jsx";
import { placeholderObjFromStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";

export default class WPImage extends Image {
  getExtraImageProps(v) {
    const { alt: alt_, imageSrc, imagePopulation } = v;

    if (alt_) {
      return { alt: alt_ };
    }

    if (imagePopulation) {
      const placeholderData = placeholderObjFromStr(imagePopulation);

      if (placeholderData) {
        return {
          alt: `{{ brizy_dc_image_alt placeholder='${placeholderData.name}' }}`
        };
      }
    }

    return { alt: `{{ brizy_dc_image_alt uid='${imageSrc}' }}` };
  }
}
