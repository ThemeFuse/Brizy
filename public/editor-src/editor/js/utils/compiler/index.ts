import { isT } from "fp-utilities";
import { getCompileHTML } from "visual/bootstraps/compiler/browser/compile";
import { isCloud } from "visual/global/Config/types";
import {
  ConfigCommon,
  PublishedGlobalBlock,
  PublishedPage,
  PublishedProject
} from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { stringifyGlobalBlock } from "visual/utils/api/adapter";
import { t } from "visual/utils/i18n";
import { read as readStr } from "visual/utils/reader/string";

export interface Data {
  config: ConfigCommon;
  state: {
    project: Project;
    page: Page;
    globalBlocks: Array<GlobalBlock>;
  };
  needToCompile: {
    project?: Project;
    page?: Page;
    globalBlocks?: Array<GlobalBlock>;
  };
}

interface Compiled {
  projectData?: PublishedProject;
  pageData?: PublishedPage;
  globalBlocks?: Array<PublishedGlobalBlock>;
  error?: string;
}

export const getCompile = async (data: Data): Promise<Compiled> => {
  const { config, state, needToCompile } = data;
  const { disabled } = config.compiler ?? {};
  let output: Compiled = {
    pageData: needToCompile.page,
    projectData: needToCompile.project
  };
  const is_cloud = isCloud(config);

  if (disabled) {
    const gb = needToCompile.globalBlocks?.map((block) =>
      stringifyGlobalBlock(block, is_cloud)
    );
    return { ...output, globalBlocks: gb };
  }

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
          const toApi = stringifyGlobalBlock(globalBlock, is_cloud);
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

    return { pageData, globalBlocks, projectData };
  } catch (e) {
    const error = readStr(e) ?? t("Fail to compile");
    output = { ...output, error };
  }

  return output;
};
