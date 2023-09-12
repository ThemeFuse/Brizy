import { createBlockScreenshot, updateBlockScreenshot } from "../api";
import { Screenshots } from "../types/Screenshots";
import { t } from "../utils/i18n";

export const screenshots = (): Screenshots => {
  return {
    async create(res, rej, data) {
      try {
        const r = await createBlockScreenshot(data);
        res(r);
      } catch (e) {
        console.error("API Client Create Screenshots:", e);
        rej(t("Failed to create screenshot"));
      }
    },
    async update(res, rej, data) {
      try {
        const r = await updateBlockScreenshot(data);
        res(r);
      } catch (e) {
        console.error("API Client Update Screenshots:", e);
        rej(t("Failed to update screenshot"));
      }
    }
  };
};
