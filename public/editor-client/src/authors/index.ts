import { getAuthors } from "@/api";
import { t } from "@/utils/i18n";
import { Authors } from "./types";

export const authors: Authors = {
  async getAuthors(res, rej, props) {
    try {
      const content = await getAuthors(props);

      res(content);
    } catch (e) {
      rej(t("Fail to find authors"));
    }
  }
};
