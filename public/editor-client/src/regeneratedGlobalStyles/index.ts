import { getStyles, getTypography } from "@/api";
import { Config } from "@/config";
import { t } from "@/utils/i18n";
import {
  FontStyle,
  Palette,
  RegeneratedGlobalStyles
} from "../types/DefaultTemplate";
import { normalizeFontStyles } from "./utils";

export const getRegeneratedGlobalStyles = (
  config: Config
): RegeneratedGlobalStyles<Palette[], FontStyle[]> => {
  return {
    async regenerateColors(res, rej, extra) {
      try {
        const styles = await getStyles(config, extra.colorPalette);

        res(styles.colorPalette);
      } catch (e) {
        rej(t("Failed to load Regenerated Styles"));
      }
    },
    async regenerateTypography(res, rej, extra) {
      try {
        const data = await getTypography(config, extra.fontStyles);
        const normalizedFontStyles = normalizeFontStyles(data.fontStyles);

        res(normalizedFontStyles);
      } catch (e) {
        rej(t("Failed to load Regenerated Typography"));
      }
    },
    label: t("Regenerate with AI")
  };
};
