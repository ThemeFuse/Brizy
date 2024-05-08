import { updateGlobalBlock, updatePage, updateProject } from "@/api";
import { handleSymbols } from "@/onChange/symbols";
import { OnChange } from "@/types/OnChange";

export const onChange = (data: OnChange) => {
  if (data.projectData) {
    updateProject(data.projectData, { is_autosave: 0 });
  }

  if (data.pageData) {
    updatePage(data.pageData, { is_autosave: 0 });
  }

  if (data.globalBlock) {
    updateGlobalBlock(data.globalBlock, { is_autosave: 0 });
  }

  if (data.symbol) {
    handleSymbols(data.symbol);
  }
};
