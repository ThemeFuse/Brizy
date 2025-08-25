import { createGlobalBlock, deleteGlobalBlock } from "@/api";
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
  },
  async delete(res, rej, uid) {
    try {
      const status = await deleteGlobalBlock(uid);
      res(status);
    } catch (e) {
      rej(t("Failed to delete Global Block"));
    }
  }
};
