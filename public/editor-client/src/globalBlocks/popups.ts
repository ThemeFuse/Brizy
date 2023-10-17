import { createGlobalBlock } from "@/api";
import { GlobalBlockConfig } from "@/types/GlobalBlocks";
import { t } from "@/utils/i18n";

export const globalPopups: GlobalBlockConfig = {
  async create(res, rej, extra) {
    try {
      const popup = await createGlobalBlock(extra);
      res(popup);
    } catch (e) {
      rej(t("Failed to create Global Popups"));
    }
  }
};
