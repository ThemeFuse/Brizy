import { assetManager } from "./assetManager";
import { GetCompileHTML, GlobalBlockOutput } from "./types";
import { getDemoPage } from "./utils/demo";
import { getHTML } from "./utils/getHTML";

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
    const pageHTML = await getHTML({
      type: "page",
      config,
      project,
      page: getDemoPage()
    });
    const compile = pageHTML.compile;

    if (compile) {
      const asset = assetManager(compile.assets);
      return {
        page: {
          html: compile.html,
          scripts: asset.scripts,
          styles: asset.styles
        }
      };
    }

    return { page: undefined };
  }

  const pageCompile = await getHTML({ type: "page", config, page, project });
  const globalBlocksHTML: Array<GlobalBlockOutput> = [];

  for (const block of globalBlocks) {
    try {
      const globalBlock = await getHTML({
        type: "globalBlock",
        config,
        project,
        block
      });

      if (globalBlock.compile) {
        const asset = assetManager(globalBlock.compile.assets);
        const data: GlobalBlockOutput = {
          id: block.id,
          html: globalBlock.compile.html,
          scripts: asset.scripts,
          styles: asset.styles
        };
        globalBlocksHTML.push(data);
      }
    } catch (e) {
      console.error("Fail to compile global block", e);
    }
  }

  let pageHTML = undefined;

  if (pageCompile.compile?.html) {
    const asset = assetManager(pageCompile.compile.assets);
    pageHTML = {
      html: pageCompile.compile.html,
      scripts: asset.scripts,
      styles: asset.styles
    };
  }

  return {
    page: pageHTML,
    globalBlocks: globalBlocksHTML.length > 0 ? globalBlocksHTML : undefined
  };
};
