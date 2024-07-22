import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { toHashCode } from "visual/utils/string";
import { Asset } from "../transforms/assets";
import { OTHERS_SCORE } from "../transforms/assets/scores";
import { getProjectStyles, getTypographyStyles } from "./getProjectStyles";

export const compileProject = (config: ConfigCommon): Asset[] => {
  const paletteStyles: Asset = {
    name: "projectPalette",
    score: OTHERS_SCORE,
    content: {
      type: "inline",
      content: getProjectStyles(config),
      attr: {
        class: "brz-style brz-project__style-palette"
      }
    },
    pro: false
  };

  const typography = getTypographyStyles(config);

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
