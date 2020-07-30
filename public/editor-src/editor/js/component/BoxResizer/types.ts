import { ElementModel } from "visual/component/Elements/Types";

export type RestrictionsClamp = {
  min: number;
  max: number;
};
type RestrictionsTypes = {
  px: RestrictionsClamp;
  "%": RestrictionsClamp;
};
export type Restriction = {
  height: RestrictionsTypes;
  size: RestrictionsTypes;
  width: RestrictionsTypes;
};

export type SimpleRestriction = {
  height: RestrictionsClamp;
  size: RestrictionsClamp;
  width: RestrictionsClamp;
};

export type Restrictions = Restriction & {
  // Tablet
  tabletHeight: RestrictionsTypes;
  tabletSize: RestrictionsTypes;
  tabletWidth: RestrictionsTypes;

  // Mobile
  mobileHeight: RestrictionsTypes;
  mobileSize: RestrictionsTypes;
  mobileWidth: RestrictionsTypes;
};

export type DimensionSuffixVariants = "px" | "%";
export type DimensionSuffix = {
  widthSuffix: DimensionSuffixVariants;
  heightSuffix: DimensionSuffixVariants;
  sizeSuffix: DimensionSuffixVariants;
};
export type DimensionSuffixs = DimensionSuffix & {
  tabletWidthSuffix: DimensionSuffixVariants;
  tabletHeightSuffix: DimensionSuffixVariants;
  tabletSizeSuffix: DimensionSuffixVariants;

  mobileWidthSuffix: DimensionSuffixVariants;
  mobileHeightSuffix: DimensionSuffixVariants;
  mobileSizeSuffix: DimensionSuffixVariants;
};

export type Meta = { [k: string]: unknown };

export type Aligns = "horizontalAlign" | "verticalAlign";

export type V = ElementModel;

export type ValueMapping = Partial<Record<keyof Restrictions, number>>;

export type TransformRestrictions = (
  restrictions: Partial<Restrictions>,
  value: V
) => SimpleRestriction;

export type RestrictionMapping = Partial<Record<keyof Restriction, number>>;
export type TransformValue = (value: V) => RestrictionMapping;

export type RestrictionsMapping = Record<keyof Restrictions, number>;
export type TransformPatch = (
  patch: Partial<RestrictionMapping>,
  startValue: RestrictionMapping,
  value: V
) => Partial<RestrictionsMapping>;

export type Point =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "centerLeft"
  | "centerRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

export type Patch = {
  patch: Partial<RestrictionMapping>;
  deltaX: number;
  deltaY: number;
  point: Point;
};
