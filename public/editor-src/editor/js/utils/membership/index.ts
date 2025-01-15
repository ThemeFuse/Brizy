import { match } from "fp-utilities";
import { Config } from "visual/global/Config/types";
import { Cloud, isCloud } from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { WP, isWp } from "visual/global/Config/types/configs/WP";
import { t } from "visual/utils/i18n";

export type M = "on" | "off";

export type Role = {
  name: string;
  role: string;
};

export const hasMembership = (m: M, mRoles: string): boolean => {
  try {
    return !!JSON.parse(mRoles).length && m === "on";
  } catch (e) {
    return false;
  }
};

export const getMembershipRoles = (config: ConfigCommon): Role[] => {
  const availableRoles = match(
    [isWp, (c: WP): Role[] => c.wp.availableRoles],
    [isCloud, (c: Cloud): Role[] => c.availableRoles]
  );

  return availableRoles(config as Config) || [];
};

export const getMembershipChoices = (
  config: Config
): {
  title: string;
  value: string;
}[] => {
  const membershipRoles = getMembershipRoles(config);

  return membershipRoles.map(({ role, name }) => ({
    title: name,
    value: role
  }));
};

export const getAllMembershipChoices = (
  config: Config
): {
  title: string;
  value: string;
}[] => {
  return [
    { title: t("Not logged"), value: "not_logged" },
    { title: t("Logged"), value: "logged" },

    ...getMembershipChoices(config)
  ];
};
