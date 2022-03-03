import { match } from "fp-utilities";
import { Cloud, isCloud } from "visual/global/Config/types/configs/Cloud";
import { isWp, WP } from "visual/global/Config/types/configs/WP";
import { Config } from "visual/global/Config/types";

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

export const getMembershipRoles = (config: Config): Role[] => {
  const availableRoles = match(
    [isWp, (c: WP): Role[] => c.wp.availableRoles],
    [isCloud, (c: Cloud): Role[] => c.availableRoles]
  );

  return availableRoles(config) || [];
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
    { title: "Not logged", value: "not_logged" },
    { title: "Logged", value: "logged" },

    ...getMembershipChoices(config)
  ];
};
