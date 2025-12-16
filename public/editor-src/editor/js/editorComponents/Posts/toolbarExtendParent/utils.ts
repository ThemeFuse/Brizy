import { DeviceMode, V } from "visual/types";
import * as Str from "visual/utils/reader/string";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";

export const disableNavigation = (v: V): boolean => {
  const { source } = v;

  const lvl1OptionId = `symbol_${source}_incBy`;
  const lv1OptionValue = Str.read(v[lvl1OptionId]) ?? "{}";

  let value = undefined;

  try {
    const parsedValue = JSON.parse(lv1OptionValue);

    if (Array.isArray(parsedValue)) {
      value = parsedValue[0];
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  if (value === undefined || (Array.isArray(value) && value.length === 0)) {
    switch (source) {
      case "shopify-collection":
      case "shopify-blog":
        return true;
    }
  }

  switch (source) {
    case "shopify-product":
      switch (value) {
        case "related":
        case "shopify-collection":
          return false;
        case "manual":
          return true;
      }
      return false;
    case "shopify-article":
      return false;
    case "shopify-collection":
    case "shopify-page":
    case "shopify-blog":
      return true;
  }

  return false;
};

export const maxColumn = (device: DeviceMode): number => {
  switch (device) {
    case DESKTOP:
      return 6;
    case TABLET:
    case MOBILE:
      return 2;
  }
};
