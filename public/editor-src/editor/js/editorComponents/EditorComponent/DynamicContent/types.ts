import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface DCApiProxyConfig {
  postId: string;
  cache?: boolean;
  globalConfig: ConfigCommon;
}

export interface DCApiProxyFetcher {
  getDC(placeholders: string[], config: DCApiProxyConfig): Promise<string[]>;
}

export interface Options {
  waitTime?: number;
}
