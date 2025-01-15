import Config from "visual/global/Config";

export const currentUserRole = (): string =>
  Config.getAll().user?.role ?? "admin";
