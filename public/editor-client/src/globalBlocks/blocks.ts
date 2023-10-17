import { createGlobalBlock } from "@/api";
import { GlobalBlockConfig } from "@/types/GlobalBlocks";
import { t } from "@/utils/i18n";

export const globalBlocks: GlobalBlockConfig = {
  async create(res, rej, extra) {
    try {
      const block = await createGlobalBlock(extra);
      res(block);
    } catch (e) {
      rej(t("Failed to create Global Block"));
    }
  }
};
