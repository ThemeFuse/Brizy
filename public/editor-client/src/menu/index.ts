import { getMenus as _getMenus } from "@/api";
import { MenusTemplate } from "@/menu/types";
import { t } from "@/utils/i18n";

export const getMenus = (): MenusTemplate => {
  return {
    async handler(res, rej) {
      try {
        const data = await _getMenus();

        res(data);
      } catch (e) {
        rej(t("Failed to load meta.json"));
      }
    }
  };
};
