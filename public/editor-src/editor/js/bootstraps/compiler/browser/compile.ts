import { produce } from "immer";
import { t } from "visual/utils/i18n";
import { assetManager } from "../common/assetManager";
import { makeStyles } from "../common/assetManager/utils";
import { Compile, Data } from "./types";
import { getDemoPage } from "./utils/demo";
import { compilePage } from "./worker";

export const getCompileHTML = async (data: Data): Promise<Compile> => {
  const { config, project } = data;
  const { auth, compiler } = config;

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
          const { page } = HTML;
          return {
            page: { html: page.html, ...assetManager(page.assets) },
            ...(HTML.project && {
              project: { styles: HTML.project.styles.map(makeStyles) }
            })
          };
        }

        return {
          page: HTML.page,
          project: HTML.project
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

        ...(compile.project && {
          project: { styles: compile.project.styles.map(makeStyles) }
        })
      };
    }

    return compile;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }
    throw Error(t("Fail to compile the page"));
  }
};
