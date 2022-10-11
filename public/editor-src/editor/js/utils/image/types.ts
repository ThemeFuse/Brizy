export interface BaseOptions {
  fileName?: string;
}

export interface FilterOption extends BaseOptions {
  iW?: number;
  iH?: "any" | number;
}

export interface SizeOption extends BaseOptions {
  size: string;
}

export type ImageUrl = (src: string, options?: FilterOption) => string | null;

export type ImageSpecificSize = (src: string, options: SizeOption) => string;

export type SvgUrl = (string: unknown, options?: BaseOptions) => string | null;
