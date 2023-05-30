import { placeholderObjFromStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config from "visual/global/Config";
import Image from "./index.jsx";

export default class WPImage extends Image {
  getExtraImageProps(v) {
    const { alt: alt_, imageSrc, imagePopulation } = v;

    if (alt_) {
      return { alt: alt_ };
    }

    if (imagePopulation) {
      const useCustomPlaceholder =
        Config.getAll().dynamicContent?.useCustomPlaceholder ?? false;
      const placeholderData = placeholderObjFromStr(
        imagePopulation,
        useCustomPlaceholder
      );

      if (placeholderData) {
        return {
          alt: `{{ brizy_dc_image_alt placeholder='${placeholderData.name}' }}`
        };
      }
    }

    return { alt: `{{ brizy_dc_image_alt uid='${imageSrc}' }}` };
  }
}
