import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, PageCommon, Project } from "visual/types";
import { MValue } from "visual/utils/value";
import { assetManager } from "./assetManager";
import { getDemoPage } from "./utils/demo";
import { compile } from "./worker";

interface Data {
  project: Project;
  page: PageCommon;
  globalBlocks?: Array<{ uid: string; block: GlobalBlock }>;
  config: ConfigCommon;
}

interface Output {
  html: string;
  styles: Array<string>;
  scripts: Array<string>;
}

interface GlobalBlockOutput extends Output {
  uid: string;
}

type Compile = {
  page: MValue<Output>;
  globalBlocks?: Array<GlobalBlockOutput>;
};

type GetCompileHTML = (d: Data) => Promise<Compile>;

export const getCompileHTML: GetCompileHTML = async ({
  page,
  project,
  config,
  globalBlocks = []
}) => {
  const { auth } = config;

  if (!auth?.token) {
    return { page: undefined };
  }

  if (auth.token === "demo") {
    const pageHTML = await compile({
      config,
      project,
      page: getDemoPage(),
      globalBlocks: {}
    });

    if (pageHTML?.html) {
      const asset = assetManager(pageHTML.assets);
      return {
        page: {
          html: pageHTML.html,
          scripts: asset.scripts,
          styles: asset.styles
        }
      };
    }

    return { page: undefined };
  }

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

  const [_pageHTML, ..._globalBlocksHTML] = await Promise.all(promises);
  const globalBlocksHTML: Array<GlobalBlockOutput> = _globalBlocksHTML.reduce(
    (acc, gb) => {
      if (gb?.html) {
        const asset = assetManager(gb.assets);
        const block = {
          uid: "",
          html: gb.html,
          scripts: asset.scripts,
          styles: asset.styles
        };
        return [...acc, block];
      }

      return acc;
    },
    [] as Array<GlobalBlockOutput>
  );

  let pageHTML = undefined;

  if (_pageHTML?.html) {
    const asset = assetManager(_pageHTML.assets);
    pageHTML = {
      html: _pageHTML.html,
      scripts: asset.scripts,
      styles: asset.styles
    };
  }

  return {
    page: pageHTML,
    globalBlocks: globalBlocksHTML.length > 0 ? globalBlocksHTML : undefined
  };
};
