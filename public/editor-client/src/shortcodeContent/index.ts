import { t } from "@/utils/i18n";
import { shortcodeContent as getContent } from "../api";
import { ShortcodeContent } from "./types";

export const shortcodeContent: ShortcodeContent = {
  async handler(res, rej, shortcode) {
    try {
      const content = await getContent(shortcode);
      res(content);
    } catch (e) {
      rej(t("Fail to find shortcode Content"));
    }
  }
};
