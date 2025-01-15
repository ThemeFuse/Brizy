import { Base64 } from "js-base64";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Image } from "./index.jsx";
import { migrations } from "./migrations";

class WPImage extends Image {
  getExtraImageProps(v) {
    const { alt: alt_, imageSrc, imagePopulation } = v;

    if (alt_) {
      return { alt: alt_ };
    }

    if (imagePopulation) {
      // prettier-ignore
      const imagePlaceholder = Base64.encode(imagePopulation.replace(/"/g, "\\\""));

      return {
        alt: makePlaceholder({
          content: "{{ brizy_dc_image_alt }}",
          attr: { imagePlaceholder }
        })
      };
    }

    return {
      alt: makePlaceholder({
        content: "{{ brizy_dc_image_alt }}",
        attr: { imageSrc }
      })
    };
  }
}

export default withMigrations(WPImage, migrations);
