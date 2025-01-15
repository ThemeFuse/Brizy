import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface AuthProviderResponse {
  message: string;
}

export interface APIAuthProvider {
  send(config: ConfigCommon): Promise<AuthProviderResponse>;
}

export type Auth = Required<ConfigCommon>["auth"];
