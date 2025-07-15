import {
  FlexHorizontalAligns,
  readHorizontalAlign
} from "visual/utils/cssStyle";
import { OptionStyle, OutputOptionStyle } from "visual/utils/cssStyle/types";
import { optionColorWrapperSelector } from "./selectors";

export * from "./selectors";

export const optionColorAlignCSS: OptionStyle<"toggle"> = ({
  value: { value }
}) => {
  const align = readHorizontalAlign(value);

  if (!align) {
    return {} as OutputOptionStyle;
  }

  return {
    [optionColorWrapperSelector]: {
      "justify-content": FlexHorizontalAligns[align]
    }
  };
};

export const optionColorSpacingCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [optionColorWrapperSelector]: {
    gap: `${value}${unit}`
  }
});
