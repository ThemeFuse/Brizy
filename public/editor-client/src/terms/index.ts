import { t } from "@/utils/i18n";
import { getTerms, getTermsBy } from "../api";
import { Terms } from "./types";

export const terms: Terms = {
  async getTerms(res, rej, taxonomy) {
    try {
      const content = await getTerms(taxonomy);
      res(content);
    } catch (e) {
      rej(t("Fail to find terms"));
    }
  },
  async getTermsBy(res, rej, data) {
    try {
      const content = await getTermsBy(data);

      res(content);
    } catch (e) {
      rej(t("Fail to find terms"));
    }
  }
};
