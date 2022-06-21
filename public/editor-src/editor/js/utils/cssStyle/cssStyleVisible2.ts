import { getMembershipRoles, Role } from "visual/utils/membership";
import Config, { Config as ConfigType } from "visual/global/Config";
import * as Arr from "visual/utils/array";
import { CSSValue } from "visual/utils/style2/types";
import {
  getTranslationsLanguages,
  Language
} from "visual/utils/multilanguages";

type Value = {
  membership: "on" | "off";
  membershipRoles: string;
  translations: "on" | "off";
  translationsLangs: string;
};

const getRolesData = (
  membership: "on" | "off",
  membershipRoles: string,
  config: ConfigType
): {
  cssRoles: string;
  rolesCount: number;
} => {
  const roles = JSON.parse(membershipRoles) as string[];

  if (membership === "off" || roles.length === 0) {
    return {
      cssRoles: "",
      rolesCount: 0
    };
  }

  if (roles.includes("logged")) {
    return roles.includes("not_logged")
      ? {
          cssRoles: "",
          rolesCount: 0
        }
      : {
          cssRoles: "var(--role-not_logged, ",
          rolesCount: 1
        };
  }

  const allMembershipRoles = getMembershipRoles(config).map(
    (item: Role) => item.role
  );

  const otherRoles = Arr.eliminateItems(
    [...allMembershipRoles, "logged", "not_logged"],
    roles
  );

  const cssRoles =
    otherRoles
      .map(item => `var(--role-${item}`)
      .join(", ")
      .replace(/\//g, "") + ",";

  return {
    rolesCount: otherRoles.length,
    cssRoles
  };
};

const getLangsData = (
  translations: "on" | "off",
  translationsLangs: string,
  config: ConfigType
): {
  cssLangs: string;
  langsCount: number;
} => {
  const langs = JSON.parse(translationsLangs) as string[];

  if (translations === "off" || langs.length === 0) {
    return {
      cssLangs: "",
      langsCount: 0
    };
  }

  const otherLangs = Arr.eliminateItems(
    getTranslationsLanguages(config).map((item: Language) => item.code),
    langs
  );

  const cssLangs =
    otherLangs
      .map(item => `var(--lang-${item}`)
      .join(", ")
      .replace(/\//g, "") + ",";

  return {
    langsCount: otherLangs.length,
    cssLangs
  };
};

function cssStyleShowEditorSection(
  v: Value,
  display: "block" | "flex"
): string {
  const config = Config.getAll();

  const { membership, membershipRoles, translations, translationsLangs } = v;

  const rolesData = getRolesData(membership, membershipRoles, config);
  const langsData = getLangsData(translations, translationsLangs, config);

  const { cssRoles, rolesCount } = rolesData;
  const { cssLangs, langsCount } = langsData;

  const _cssRoles = rolesCount === 0 ? "" : cssRoles;
  const _cssLangs = langsCount === 0 ? "" : cssLangs;

  const closeParentheses = ")".repeat(rolesCount + langsCount);

  return `display: ${_cssRoles} ${_cssLangs} ${display}${closeParentheses};`;
}

export function cssStyleShowBlock({ v }: CSSValue<Value>): string {
  return cssStyleShowEditorSection(v, "block");
}

export function cssStyleShowFlex({ v }: CSSValue<Value>): string {
  return cssStyleShowEditorSection(v, "flex");
}
