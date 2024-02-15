import { updateGlobalBlocks, updatePage, updateProject } from "@/api";
import { Publish } from "@/types/Publish";
import { t } from "@/utils/i18n";

export const publish: Publish = {
  async handler(res, rej, args) {
    const { projectData, pageData, globalBlocks } = args;
    const errors: Array<string> = [];

    if (projectData) {
      try {
        await updateProject(projectData, { is_autosave: 0 });
      } catch (e) {
        errors.push(t("Failed to update project"));
      }
    }

    if (pageData) {
      try {
        await updatePage(pageData, { is_autosave: 0 });
      } catch (e) {
        errors.push(t("Failed to update page"));
      }
    }

    if (globalBlocks && globalBlocks.length > 0) {
      try {
        await updateGlobalBlocks(globalBlocks, { is_autosave: 0 });
      } catch (e) {
        errors.push(t("Failed to update global blocks"));
      }
    }

    if (errors.length > 0) {
      rej(errors.join(";"));
    } else {
      res(args);
    }
  }
};
