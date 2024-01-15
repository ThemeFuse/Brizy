import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { MValue } from "visual/utils/value";

export const projectClassName = (config: ConfigCommon): MValue<string> => {
  const projectId = config.projectData?.id;
  const pageId = config.pageData?.id;

  if (projectId) {
    const cls = `brz-project__${projectId}`;
    return pageId ? `${cls}-${pageId}` : cls;
  }

  return undefined;
};
