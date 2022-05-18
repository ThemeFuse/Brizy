import { match } from "fp-utilities";
import { Config } from "visual/global/Config/types";
import {
  CMS,
  isCloud,
  isCMS,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";

export type M = "on" | "off";

export type Language = {
  name: string;
  code: string;
};

export const hasMultiLanguage = (m: M, mLanguages: string): boolean => {
  try {
    return !!JSON.parse(mLanguages).length && m === "on";
  } catch (e) {
    return false;
  }
};

export const getTranslationsLanguages = (config: Config): Language[] => {
  const availableRoles = match(
    [
      isWp,
      (): Language[] => {
        if (process.env.NODE_ENV === "development") {
          console.error("not implemented");
        }

        return [];
      }
    ],
    [
      isCloud,
      match(
        [isCMS, (c: CMS): Language[] => c.availableTranslations],
        [isShopify, () => []]
      )
    ]
  );

  return availableRoles(config) || [];
};

export const getLanguagesChoices = (
  config: Config
): {
  title: string;
  value: string;
}[] => {
  const membershipRoles = getTranslationsLanguages(config);

  return membershipRoles.map(({ code, name }) => ({
    title: name,
    value: code
  }));
};
