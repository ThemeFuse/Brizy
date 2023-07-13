import { store } from "src/valtio";
import { State } from "src/valtio/types";
import { clearSymbols } from "src/valtio/utils";
import { snapshot } from "valtio/vanilla";
import { updatePage, updateProject, updateSymbols } from "../api";
import { Publish } from "../types/Publish";
import { t } from "../utils/i18n";

export const publish: Publish = {
  async handler(res, rej, args) {
    const { projectData, pageData, symbols } = args;

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

    if (symbols) {
      try {
        const snap = snapshot<State>(store) as Readonly<State>;

        await updateSymbols(snap);

        clearSymbols(store);
        res(args);
      } catch (error) {
        rej(t("Failed to update symbols"));
      }
    }
  }
};
