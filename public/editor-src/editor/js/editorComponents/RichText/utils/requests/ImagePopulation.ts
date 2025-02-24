import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxyInstance";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const getImagePopulation = async (
  placeholder: string,
  id: string,
  config: ConfigCommon
): Promise<string> => {
  if (!id || !placeholder) {
    return "";
  }
  const apiProxyConfig = { postId: id, globalConfig: config };
  const cached = DCApiProxyInstance.getFromCache(placeholder, apiProxyConfig);

  if (cached) {
    return cached;
  }

  return await DCApiProxyInstance.getDC([placeholder], apiProxyConfig)
    .then((r) => r[0])
    .catch(() => "");
};
