import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getColor } from "visual/utils/color";
import { OptionStyle } from "visual/utils/cssStyle/types";

export const getSelectBgColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return {
        "{{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__phone--country .ss-content, {{WRAPPER}}.brz-forms2__field.brz-forms2__field-phone .brz-forms2__phone--country .ss-content .ss-search input[type='search']":
          {
            "background-color": color
          }
      };
    }
  };
