import {
  ConfigCommon,
  PublishedGlobalBlock,
  PublishedPage,
  PublishedProject
} from "visual/global/Config/types/configs/ConfigCommon";
import { Store } from "visual/redux/store";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { prepareGlobalBlocks } from "./prepareGlobalBlocks";
import { preparePage } from "./preparePage";
import { prepareProject } from "./prepareProject";

interface Publish {
  config: ConfigCommon;
  project?: Project;
  page?: Page;
  globalBlocks?: Array<GlobalBlock>;
  store: Store;
}

interface Compiled {
  projectData?: PublishedProject;
  pageData?: PublishedPage;
  globalBlocks?: Array<PublishedGlobalBlock>;
  error?: string;
}

export function prepareHTML(data: Publish): Compiled {
  const { config, store } = data;
  const globalBlocks = data.globalBlocks
    ? prepareGlobalBlocks(data.globalBlocks, config, store)
    : undefined;
  const pageData = data.page
    ? preparePage(data.page, config, store)
    : undefined;
  const projectData = data.project
    ? prepareProject(data.project, config, store)
    : undefined;

  return {
    pageData,
    globalBlocks,
    projectData
  };
}
