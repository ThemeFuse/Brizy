import { Config } from "@/config";
import { Menu } from "@/types/Menu";
import { t } from "@/utils/i18n";

export const getMenu = (config: Config): Menu => ({
  onOpen() {
    const { menuUrl } = config.api;
    window.open(menuUrl, "_blank");
  },
  createMenuLabel: t("Create a menu in your WordPress admin")
});
