import { assetUrl } from "visual/utils/asset";

export function editorIconUrl({ icon, url }) {
  return url
    ? `${url}/icons.svg#${icon}`
    : assetUrl(`editor/icons/icons.svg#${icon}`);
}
