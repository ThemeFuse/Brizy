import * as Str from "visual/utils/string/specs";

// region XAuthUserToken
declare const _xAuthUserToken: unique symbol;

export type XAuthUserToken = string & { [_xAuthUserToken]: "XAuthUserToken" };

// endregion

export interface WithToken {
  __type: "withToken";
  uri: string;
  token: XAuthUserToken;
}

export interface WithoutToken {
  __type: "withOutToken";
  uri: string;
}

export type XAuth = WithToken | WithoutToken;

export const fromRecord = (v: Record<string, unknown>): XAuth | undefined => {
  switch (v.__type) {
    case "withToken": {
      const uri = Str.read(v.uri);
      const token = Str.read(v.token);

      return uri && token
        ? { __type: "withToken", uri, token: token as XAuthUserToken }
        : undefined;
    }
    case "withOutToken": {
      const uri = Str.read(v.uri);

      return uri ? { __type: "withOutToken", uri } : undefined;
    }
    default:
      return undefined;
  }
};
