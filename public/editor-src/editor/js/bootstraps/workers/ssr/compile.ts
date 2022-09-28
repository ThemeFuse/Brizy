import { Config } from "visual/global/Config";
import { GlobalBlock, PageCommon, Project } from "visual/types";
import { MValue } from "visual/utils/value";
import { Output } from "./components/Editor";
import { compile } from "./worker";

interface Data {
  project: Project;
  page: PageCommon;
  globalBlocks?: Array<{ uid: string; block: GlobalBlock }>;
  config: Config;
}

type Compile = {
  page: MValue<Output>;
  globalBlocks?: Array<{ uid: string; html: Output }>;
};

type GetCompileHTML = (d: Data) => Promise<Compile>;

export const getCompileHTML: GetCompileHTML = async (data) => {
  const { page, project, config, globalBlocks = [] } = data;
  const promises = [
    compile({
      config,
      page,
      project,
      globalBlocks: {}
    })
  ];

  globalBlocks.forEach((block) => {
    promises.push(
      compile({
        config,
        page: { ...page, data: { items: [block.block.data] } },
        project,
        globalBlocks: {}
      })
    );
  });

  const [pageHTML, ...globalBlocksHTML] = await Promise.all(promises);

  return globalBlocksHTML.length > 0
    ? {
        page: pageHTML,
        globalBlocks: globalBlocksHTML
          .filter((block): block is Output => !!block?.html)
          .map((block, index) => ({
            uid: globalBlocks[index].uid,
            html: block
          }))
      }
    : { page: pageHTML };
};
