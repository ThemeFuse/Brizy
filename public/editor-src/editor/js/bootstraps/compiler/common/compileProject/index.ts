import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Store } from "visual/redux/store";
import { toHashCode } from "visual/utils/string";
import { Asset } from "../transforms/assets";
import { OTHERS_SCORE } from "../transforms/assets/scores";
import { getProjectStyles, getTypographyStyles } from "./getProjectStyles";

export const compileProject = (config: ConfigCommon, store: Store): Asset[] => {
  const paletteStyles: Asset = {
    name: "projectPalette",
    score: OTHERS_SCORE,
    content: {
      type: "inline",
      content: getProjectStyles(config, store),
      attr: {
        class: "brz-style brz-project__style-palette"
      }
    },
    pro: false
  };

  const typography = getTypographyStyles(config, store);

  if (typography) {
    const typographyStyles: Asset = {
      name: toHashCode(typography),
      score: OTHERS_SCORE,
      content: {
        type: "inline",
        content: typography,
        attr: {
          class: "brz-style brz-project__style-fonts"
        }
      },
      pro: false
    };

    return [paletteStyles, typographyStyles];
  }

  return [paletteStyles];
};
