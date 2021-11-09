export interface RestrictionInterval {
  px: {
    min: number;
    max: number;
  };
  "%": {
    min: number;
    max: number;
  };
}

export interface SizeRestriction {
  size: RestrictionInterval;
  tabletSize: RestrictionInterval;
  mobileSize: RestrictionInterval;
}

export interface WidthHeightRestriction {
  height: RestrictionInterval;
  width: RestrictionInterval;
  tabletWidth: RestrictionInterval;
  mobileWidth: RestrictionInterval;
}
