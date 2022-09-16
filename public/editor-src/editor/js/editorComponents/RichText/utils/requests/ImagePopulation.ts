import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxy";

export const getImagePopulation = async (
  placeholder: string,
  id: string
): Promise<string> => {
  if (!id || !placeholder) {
    return "";
  }
  const apiProxyConfig = { postId: id };
  const cached = DCApiProxyInstance.getFromCache(placeholder, apiProxyConfig);

  if (cached) {
    return cached;
  }

  return await DCApiProxyInstance.getDC([placeholder], {
    postId: apiProxyConfig.postId
  })
    .then((r) => {
      return r[0];
    })
    .catch(() => {
      return "";
    });
};
