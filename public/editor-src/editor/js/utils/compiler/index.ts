import { getCompileHTML } from "visual/bootstraps/workers/ssr/compile";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, PageCommon, Project } from "visual/types";
import { AuthProvider } from "visual/utils/api/providers/Auth";
import { CustomError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";

export interface Data {
  config: ConfigCommon;
  project: Project;
  page: PageCommon;
  globalBlocks?: Array<GlobalBlock>;
}

export interface Output {
  html?: string;
  styles?: Array<string>;
  scripts?: Array<string>;
  error?: string;
}

export const getCompile = async (data: Data): Promise<Output> => {
  const { config, project, page, globalBlocks } = data;
  let pageHTML = {};

  if (config.compiler?.type === "browser") {
    try {
      if (AUTHORIZATION_URL) {
        const Auth = new AuthProvider(AUTHORIZATION_URL);
        await Auth.send();
        const { auth } = config;

        if (!auth?.token) {
          return {};
        }
      }
      ({ page: pageHTML = {} } = await getCompileHTML({
        config,
        project,
        page,
        globalBlocks
      }));
    } catch (e) {
      pageHTML = {
        error:
          e instanceof CustomError ? e.getMessage() : t("Something went wrong")
      };
    }
  }

  return pageHTML;
};
