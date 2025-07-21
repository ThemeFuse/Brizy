import { pipe } from "@brizy/readers";
import deepMerge from "deepmerge";
import { flatten } from "es-toolkit";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getShortcodeComponents } from "visual/shortcodeComponents/index";
import { type Shortcode, ShortcodeComponents, Shortcodes } from "visual/types";
import { MValue } from "visual/utils/value";

const getThirdPartyShortcodeConfig = (element: {
  id: string;
  title?: string;
  icon?: string;
}): Shortcode["component"] => ({
  id: element.id,
  title: element.title ?? "Component",
  icon: element.icon ?? "nc-wp-shortcode-element",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--toolbar"],
      items: [
        {
          type: "ThirdParty",
          value: {
            thirdPartyId: element.id,
            items: []
          }
        }
      ]
    }
  }
});

export const getThirdPartyShortcodesData = (config: ConfigCommon) => {
  const { thirdPartyComponents } = config;

  if (!thirdPartyComponents) {
    return {
      keywords: {},
      shortcodeData: {}
    };
  }

  return Object.values(thirdPartyComponents).reduce<{
    keywords: Record<string, string>;
    shortcodeData: Record<string, Shortcode["component"]>;
  }>(
    (acc, element) => {
      const { id, keywords } = element;

      if (keywords) {
        acc.keywords[id] = keywords;
      }

      acc.shortcodeData[id] = getThirdPartyShortcodeConfig(element);

      return acc;
    },
    {
      keywords: {},
      shortcodeData: {}
    }
  );
};

export const flatShortcodes = (shortcodes: ShortcodeComponents): Shortcodes =>
  shortcodes.reduce(
    // Here we need to use deepMerge because we can have the case when we have different shortcodes with the same
    // category (moduleName) and we need to merge them into one category
    (mergedShortcodes, item) => deepMerge(mergedShortcodes, item.shortcodes),
    {}
  );

export const getShortcode = (
  id: string,
  shortcodes: Shortcodes
): MValue<Shortcode> => {
  const flattenShortcodes = flatten(Object.values(shortcodes));
  return flattenShortcodes.find((shortcode) => shortcode.component.id === id);
};

export const getFlatShortcodes = pipe(getShortcodeComponents, flatShortcodes);
