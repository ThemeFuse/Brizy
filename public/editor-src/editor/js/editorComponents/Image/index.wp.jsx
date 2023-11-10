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
      return {
        alt: makePlaceholder({
          content: "{{ brizy_dc_image_alt }}",
          // prettier-ignore
          attr: { imagePlaceholder: imagePopulation.replace(/"/g, "\\\"") }
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
