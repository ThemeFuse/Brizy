import Config from "visual/global/Config";

export const currentUserRole = () => Config.get("user").role;
