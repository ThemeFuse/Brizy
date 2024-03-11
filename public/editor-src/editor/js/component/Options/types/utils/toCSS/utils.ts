import type { OptionName, OptionValue } from "visual/component/Options/types";
import { getOptionModel } from "visual/component/Options/types/utils/fromElementModel";
import { getOptionMeta } from "visual/component/Options/types/utils/toMeta/utils";
import { BreakpointsNames } from "visual/utils/breakpoints/types";
import { getTypographyValues } from "visual/utils/options/Typography/utils";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { CSSValue } from "visual/utils/style2/types";
import { MValue } from "visual/utils/value";
import { fns, toCSS } from ".";
import { OptionNameWithStyles } from "./types";

export const normalizeOptionModel = <T extends OptionName = OptionName>({
  type,
  optionModel,
  extraData
}: {
  type: T;
  optionModel: OptionValue<T>;
  extraData: { device: BreakpointsNames; state: State };
}): OptionValue<T> => {
  if (type === "typography") {
    const { device, state } = extraData;

    return getTypographyValues({
      device: device as ResponsiveMode,
      state,
      value: optionModel as OptionValue<"typography">
    }) as OptionValue<T>;
  }

  return optionModel;
};

export const getCSSByOptionType = <
  T extends OptionNameWithStyles = OptionNameWithStyles
>(
  type: T,
  data: CSSValue & { id: string }
): MValue<string> => {
  const { id, state, device, v } = data;

  const optionModel = getOptionModel<T>({
    type,
    v,
    breakpoint: device,
    state,
    id
  });

  const optionMeta = getOptionMeta(type, optionModel);

  return toCSS(type)({
    model: normalizeOptionModel({
      type,
      optionModel,
      extraData: { device, state }
    }),
    meta: optionMeta
  });
};

export const isOptionWithStyles = (
  type: unknown
): type is OptionNameWithStyles =>
  Object.keys(fns).includes(type as OptionNameWithStyles);
