import { once } from "es-toolkit";
import { Base64 } from "js-base64";
import { customAlphabet } from "nanoid";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { makePlaceholder } from "visual/utils/dynamicContent";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const fullSymbolList =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";

export const uuid = (length = 12): string =>
  customAlphabet(alphabet, 1)() +
  customAlphabet(fullSymbolList, length)(length - 1);

// Generates a UID using the projectId and pageId to
// ensure that the CSS for the project and page are consistent and share the same UID.
const getUid = once(() => uuid(4));
export const uidByConfig = (config: ConfigCommon): string => {
  const projectId = config.projectData?.id ?? getUid();
  const pageId = config.pageData?.id ?? getUid();
  return Base64.encode(`${projectId}-${pageId}`).replace("=", "");
};

export const uuidWithPlaceholderUuid = () => {
  const uidPlaceholder = makePlaceholder({
    content: "{{ random_id }}"
  });

  return `${uuid()}_${uidPlaceholder}`;
};
