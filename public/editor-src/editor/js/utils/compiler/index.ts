import { getCompileHTML } from "visual/bootstraps/workers/ssr/compile";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { PageCommon, Project } from "visual/types";
import { AuthProvider } from "visual/utils/api/providers/Auth";
import { CustomError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";

export interface Data {
  config: ConfigCommon;
  project: Project;
  page: PageCommon;
}

export interface Output {
  html?: string;
  styles?: Array<string>;
  scripts?: Array<string>;
  error?: string;
}

export const getCompile = async ({
  config,
  project,
  page
}: Data): Promise<Output> => {
  let pageHTML = {};

  if (config.compiler?.type === "browser") {
    try {
      if (AUTHORIZATION_URL) {
        const Auth = new AuthProvider(AUTHORIZATION_URL);
        await Auth.send();
      }
      ({ page: pageHTML = {} } = await getCompileHTML({
        config,
        project,
        page
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
