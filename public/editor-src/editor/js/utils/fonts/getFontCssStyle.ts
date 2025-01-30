import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { makeStyleCSSVar } from "visual/utils/fonts/makeGlobalStylesTypography";
import { FONT_INITIAL } from "visual/utils/fonts/utils";
import { ResponsiveMode } from "visual/utils/responsiveMode";

export const getFontCssStyle = ({
  fontStyle,
  key,
  device,
  config
}: {
  fontStyle: string;
  key: string;
  device: ResponsiveMode;
  config: ConfigCommon;
}): string | undefined => {
  if (fontStyle && fontStyle !== "custom") {
    return `var(${makeStyleCSSVar({
      id: fontStyle,
      device,
      key,
      config
    })}, ${FONT_INITIAL})`;
  }
};
