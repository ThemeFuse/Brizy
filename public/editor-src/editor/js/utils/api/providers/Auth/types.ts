import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface AuthProviderResponse {
  message: string;
}

export interface APIAuthProvider {
  send(): Promise<AuthProviderResponse>;
}

export type Auth = Required<ConfigCommon>["auth"];
