// region Locale
declare const _locale: unique symbol;

export type Locale = string & { [_locale]: "Locale" };
// endregion
