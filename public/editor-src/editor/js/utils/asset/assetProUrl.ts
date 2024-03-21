import { Pro } from "visual/global/Config/types/Pro";

export function assetProUrl(config: Pro, url: string): string {
  return `${config.urls.assets}/${url}`;
}
