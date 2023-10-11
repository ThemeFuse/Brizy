// region XAuthUserToken
declare const _xAuthUserToken: unique symbol;

export type XAuthUserToken = string & { [_xAuthUserToken]: "XAuthUserToken" };
