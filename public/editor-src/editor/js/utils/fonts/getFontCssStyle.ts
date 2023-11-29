import Config from "visual/global/Config";
import { makeStyleCSSVar } from "visual/utils/fonts";
import { FONT_INITIAL } from "visual/utils/fonts/utils";
import { ResponsiveMode } from "visual/utils/responsiveMode";

export const getFontCssStyle = ({
  fontStyle,
  key,
  device
}: {
  fontStyle: string;
  key: string;
  device: ResponsiveMode;
}): string | undefined => {
  if (fontStyle && fontStyle !== "custom") {
    return `var(${makeStyleCSSVar({
      id: fontStyle,
      device,
      key,
      config: Config.getAll()
    })}, ${FONT_INITIAL})`;
  }
};
