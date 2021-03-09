export type M = "on" | "off";

export const hasMembership = (m: M, mRoles: string): boolean => {
  try {
    return !!JSON.parse(mRoles).length && m === "on";
  } catch (e) {
    return false;
  }
};
