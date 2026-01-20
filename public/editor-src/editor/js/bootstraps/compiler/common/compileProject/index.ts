import { Config } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { fontsSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { toHashCode } from "visual/utils/string";
import { Asset } from "../transforms/assets";
import { makePageFonts } from "../transforms/assets/makeStyles";
import { OTHERS_SCORE } from "../transforms/assets/scores";
import {
  getProjectStyles,
  getTypographyStyles,
  getUsedProjectFonts
} from "./getProjectStyles";

interface CompileProjectAssets {
  styles: Asset[];
  fonts: Asset[];
}

export const compileProject = (
  config: ConfigCommon,
  store: Store
): CompileProjectAssets => {
  const { googleFonts, uploadedFonts, adobeFonts } = getUsedProjectFonts(store);
  const adobeKitId = fontsSelector(store.getState()).adobe?.id;

  const pageFonts = makePageFonts({
    fonts: {
      google: googleFonts,
      upload: uploadedFonts,
      adobe: adobeFonts
    },
    extra: { adobeKitId },
    config: config as Config
  });

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

  const assets = {
    styles: [paletteStyles]
  } as CompileProjectAssets;

  if (pageFonts.length) {
    assets.fonts = pageFonts;
  }

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

    assets.styles.push(typographyStyles);
  }

  return assets;
};
