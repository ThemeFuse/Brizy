import { updateGlobalBlocks, updatePage, updateProject } from "@/api";
import { symbolsState, SymbolState } from "@/state/symbols";
import { GlobalBlock } from "@/types/GlobalBlocks";
import { Publish } from "@/types/Publish";
import { t } from "@/utils/i18n";
import { snapshot } from "valtio";
import { updateSymbols } from "./symbols";

// Size of each batch
const batchSize = 60;

async function updateGlobalBlocksLazy(items: Array<GlobalBlock>) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await updateGlobalBlocks(batch, { is_autosave: 0 });
  }
}

export const publish: Publish = {
  async handler(res, rej, args) {
    const { projectData, pageData, globalBlocks } = args;
    const symbols = snapshot(symbolsState) as SymbolState;

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
        await updateGlobalBlocksLazy(globalBlocks);
      } catch (e) {
        errors.push(t("Failed to update global blocks"));
      }
    }

    if (symbols.current.length > 0) {
      try {
        await updateSymbols();
      } catch (e) {
        errors.push(t("Failed to update symbols"));
      }
    }

    if (errors.length > 0) {
      rej(errors.join(";"));
    } else {
      res(args);
    }
  }
};
