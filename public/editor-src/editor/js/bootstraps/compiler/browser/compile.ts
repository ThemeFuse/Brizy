import { produce } from "immer";
import { t } from "visual/utils/i18n";
import { assetManager } from "../common/assetManager";
import { makeStyles } from "../common/assetManager/utils";
import { compileProject } from "../common/compileProject";
import { Compile, Data } from "./types";
import { getDemoPage } from "./utils/demo";
import { compilePage } from "./worker";

export const getCompileHTML = async (data: Data): Promise<Compile> => {
  const { config, project, needToCompile } = data;
  const { auth, compiler } = config;
  const compiledProject = needToCompile.project
    ? compileProject(config)
    : undefined;

  if (AUTHORIZATION_URL) {
    if (!auth?.token) {
      throw Error(t("The token are missing"));
    }

    if (auth.token === "demo") {
      try {
        // Override the original PageData with Demo PageData
        const page = getDemoPage();
        const _config = produce(config, (draft) => {
          draft.globalBlocks = [];
          draft.pageData = page;
        });
        const HTML = await compilePage({
          config: _config,
          page,
          project,
          needToCompile: { page, project }
        });

        if (compiler?.assets === "html") {
          const { page, globalBlocks } = HTML;
          return {
            page: { html: page.html, ...assetManager(page.assets) },
            ...(Array.isArray(globalBlocks) && {
              globalBlocks: globalBlocks.map((block) => ({
                uid: block.uid,
                html: block.html,
                ...assetManager(block.assets)
              }))
            })
          };
        }

        return {
          page: HTML.page
        };
      } catch (e) {
        throw Error(t("Fail to compile the page"));
      }
    }
  }

  try {
    const compile = await compilePage(data);

    if (compiler?.assets === "html") {
      const { page, globalBlocks } = compile;

      return {
        page: { html: page.html, ...assetManager(page.assets) },
        ...(Array.isArray(globalBlocks) && {
          globalBlocks: globalBlocks.map((block) => ({
            uid: block.uid,
            html: block.html,
            ...assetManager(block.assets)
          }))
        }),

        ...(compiledProject && {
          project: { styles: compiledProject.map(makeStyles) }
        })
      };
    }

    return {
      ...compile,
      ...(compiledProject && {
        project: { styles: compiledProject }
      })
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
    throw Error(t("Fail to compile the page"));
  }
};
