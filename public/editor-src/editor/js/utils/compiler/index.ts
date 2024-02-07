import { isT } from "fp-utilities";
import { getCompileHTML } from "visual/bootstraps/compiler/browser/compile";
import {
  ConfigCommon,
  PublishData
} from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, PageCommon, Project } from "visual/types";
import { stringifyGlobalBlock } from "visual/utils/api/adapter";
import { t } from "visual/utils/i18n";
import { read as readStr } from "visual/utils/reader/string";

export interface Data {
  config: ConfigCommon;
  is_autosave: 0 | 1;
  state: {
    project: Project;
    page: PageCommon;
    globalBlocks: Array<GlobalBlock>;
  };
  needToCompile: {
    project?: Project;
    page?: PageCommon;
    globalBlocks?: Array<GlobalBlock>;
  };
}

export const getCompile = async (data: Data): Promise<PublishData> => {
  const { config, is_autosave, state, needToCompile } = data;
  let output: PublishData = {
    is_autosave,
    pageData: needToCompile.page,
    projectData: needToCompile.project
  };

  try {
    const {
      page: compiledPage,
      globalBlocks: compiledBlocks,
      project: compiledProject
    } = await getCompileHTML({ ...state, config, needToCompile });

    let projectData = output.projectData;
    let pageData = output.pageData;
    const globalBlocks = compiledBlocks
      ?.map((block) => {
        const { uid, ...compiled } = block;
        const globalBlock = needToCompile.globalBlocks?.find(
          (b) => b.uid === uid
        );

        if (globalBlock) {
          const toApi = stringifyGlobalBlock(globalBlock);
          return { ...toApi, compiled };
        }
      })
      .filter(isT);

    if (pageData && compiledPage) {
      pageData = { ...pageData, compiled: compiledPage };
    }

    if (projectData && compiledProject) {
      projectData = { ...projectData, compiled: compiledProject };
    }

    return {
      is_autosave,
      pageData,
      globalBlocks,
      projectData
    };
  } catch (e) {
    const error = readStr(e) ?? t("Fail to compile");
    output = { ...output, error };
  }

  return output;
};
