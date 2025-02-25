import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { CSSStyleFn } from "visual/utils/cssStyle/types";
import { css as cssStyleBackgroundColor } from "visual/utils/options/BackgroundColor/css";
import { css as cssStyleBorder } from "visual/utils/options/Border/css";
import { css as cssStyleBoxShadow } from "visual/utils/options/BoxShadow/css";
import { css as cssStyleColor } from "visual/utils/options/ColorPicker/css";
import { css as cssStyleCorners } from "visual/utils/options/Corners/css";
import { css as cssStyleFilters } from "visual/utils/options/Filters/css";
import { css as cssStyleMargin } from "visual/utils/options/Margin/css";
import { css as cssStylePadding } from "visual/utils/options/Padding/css";
import { css as cssStyleTextShadow } from "visual/utils/options/TextShadow/css";
import { css as cssStyleTypography } from "visual/utils/options/Typography/css";
import {
  OptionNameWithStyles,
  ToCSSData
} from "visual/utils/options/utils/toCSS/types";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { MValue } from "visual/utils/value";

export const fns = {
  border: cssStyleBorder,
  colorPicker: cssStyleColor,
  margin: cssStyleMargin,
  padding: cssStylePadding,
  corners: cssStyleCorners,
  boxShadow: cssStyleBoxShadow,
  textShadow: cssStyleTextShadow,
  backgroundColor: cssStyleBackgroundColor,
  typography: cssStyleTypography,
  filters: cssStyleFilters
};

export const toCSS =
  <T extends OptionNameWithStyles>(type: T, config: ConfigCommon) =>
  (data: ToCSSData<T>): MValue<string> => {
    const { model, meta } = data;
    const cssFn = fns?.[type] as CSSStyleFn<T>;

    if (typeof cssFn === "function" && model) {
      const css = cssFn({
        ...(meta && Obj.length(meta) > 0 ? { meta } : {}),
        value: model,
        config
      });

      if (Str.read(css) && css !== "") {
        return css;
      }
    }
  };
