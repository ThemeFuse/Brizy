import { Choice } from "visual/component/Options/types/dev/Select/types";
import { Sources } from "visual/editorComponents/Posts/types";
import { V } from "visual/types";
import * as Str from "visual/utils/reader/string";

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

export const orderByConverter = (
  selectedSource: string | null | undefined,
  sourcesArr: Sources[]
): Choice[] =>
  sourcesArr
    .find((item) => item.id === selectedSource)
    ?.orderBy.map((orderByItem) => ({
      value: orderByItem.id,
      title: orderByItem.title
    })) ?? [];
