import { getStyles, getTypography } from "@/api";
import { Config } from "@/config";
import { t } from "@/utils/i18n";
import {
  FontStyle,
  Palette,
  RegeneratedGlobalStyles
} from "../types/DefaultTemplate";

export const getRegeneratedGlobalStyles = (
  config: Config
): RegeneratedGlobalStyles<Palette, FontStyle> => {
  return {
    async regenerateColors(res, rej) {
      try {
        const styles = await getStyles(config);

        res(styles.colorPalette);
      } catch (e) {
        rej(t("Failed to load Regenerated Styles"));
      }
    },
    async regenerateTypography(res, rej) {
      try {
        const data = await getTypography(config);

        res(data.fontStyles);
      } catch (e) {
        rej(t("Failed to load Regenerated Typography"));
      }
    },
    label: t("Regenerate with AI")
  };
};
