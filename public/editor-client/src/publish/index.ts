import { updatePage, updateProject } from "../api";
import { Publish } from "../types/Publish";
import { t } from "../utils/i18n";

export const publish: Publish = {
  async handler(res, rej, args) {
    const { projectData, pageData } = args;

    if (projectData) {
      try {
        await updateProject(projectData, { is_autosave: 0 });
        res(args);
      } catch (e) {
        rej(t("Failed to update project"));
      }
    }

    if (pageData) {
      try {
        await updatePage(pageData, { is_autosave: 0 });
        res(args);
      } catch (e) {
        rej(t("Failed to update page"));
      }
    }
  }
};
