import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxy";

export const getImagePopulation = async (
  placeholder: string,
  id: string,
  useCustomPlaceholder: boolean
): Promise<string> => {
  if (!id || !placeholder) {
    return "";
  }
  const apiProxyConfig = { postId: id, useCustomPlaceholder };
  const cached = DCApiProxyInstance.getFromCache(placeholder, apiProxyConfig);

  if (cached) {
    return cached;
  }

  return await DCApiProxyInstance.getDC([placeholder], apiProxyConfig)
    .then((r) => r[0])
    .catch(() => "");
};
