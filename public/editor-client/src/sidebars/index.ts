import { getSidebars } from "@/api";
import { t } from "@/utils/i18n";
import { Sidebars } from "./types";

export const sidebars: Sidebars = {
  async getSidebars(res, rej) {
    try {
      const content = await getSidebars();
      res(content);
    } catch (e) {
      rej(t("Fail to find sidebars"));
    }
  }
};
