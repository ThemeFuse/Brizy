import Config from "visual/global/Config";
import { makeStyleCSSVar } from "visual/utils/fonts";
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
  if (fontStyle) {
    return `var(${makeStyleCSSVar({
      id: fontStyle,
      device,
      key,
      config: Config.getAll()
    })})`;
  }
};
