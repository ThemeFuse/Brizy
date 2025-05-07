import type { OptionName, OptionValue } from "visual/component/Options/types";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { RenderType } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { BreakpointsNames } from "visual/utils/breakpoints/types";
import { getTypographyValues } from "visual/utils/options/Typography/utils";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { CSSValue } from "visual/utils/style2/types";
import { MValue } from "visual/utils/value";
import { fns, toCSS } from ".";
import { getOptionModel } from "../fromElementModel";
import { getOptionMeta } from "../toMeta/utils";
import { OptionNameWithStyles } from "./types";

export const normalizeOptionModel = <T extends OptionName = OptionName>({
  type,
  optionModel,
  extraData,
  store,
  renderContext,
  getConfig
}: {
  type: T;
  optionModel: OptionValue<T>;
  store: Store;
  extraData: { device: BreakpointsNames; state: State };
  renderContext: RenderType;
  getConfig: GetConfig;
}): OptionValue<T> => {
  if (type === "typography") {
    const { device, state } = extraData;

    return getTypographyValues({
      device: device as ResponsiveMode,
      state,
      store,
      value: optionModel as OptionValue<"typography">,
      renderContext,
      getConfig
    }) as OptionValue<T>;
  }

  return optionModel;
};

export const getCSSByOptionType = <
  T extends OptionNameWithStyles = OptionNameWithStyles
>({
  type,
  data,
  renderContext
}: {
  type: T;
  data: CSSValue & { id: string };
  renderContext: RenderType;
}): MValue<string> => {
  const { id, state, device, v, store, getConfig } = data;

  const optionModel = getOptionModel<T>({
    type,
    v,
    breakpoint: device,
    state,
    store,
    id
  });

  const optionMeta = getOptionMeta(type, optionModel);
  const config = getConfig();

  return toCSS(
    type,
    config
  )({
    model: normalizeOptionModel({
      type,
      optionModel,
      store,
      extraData: { device, state },
      renderContext,
      getConfig
    }),
    meta: optionMeta
  });
};

export const isOptionWithStyles = (
  type: unknown
): type is OptionNameWithStyles =>
  Object.keys(fns).includes(type as OptionNameWithStyles);
