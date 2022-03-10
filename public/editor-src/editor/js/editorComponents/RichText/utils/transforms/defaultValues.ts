import deepMerge from "deepmerge";
import { ElementModel } from "visual/component/Elements/Types";

// represent how data will store inside html
// inside className, like a style or attribute
type HtmlValueType = "class" | "style" | "attribute";

export type Values = {
  [k in HtmlValueType]: {
    [k in keyof ElementModel]: {
      prefix: string;
      defaultValue: unknown;
    };
  };
};

// is it a good solution?
export const legacyValues: Values = {
  class: {
    typographyFontStyle: {
      prefix: "brz-tp",
      defaultValue: "paragraph"
    },
    tabletTypographyFontSize: {
      prefix: "brz-fs-sm-im",
      defaultValue: null
    },
    mobileTypographyFontSize: {
      prefix: "brz-fs-xs-im",
      defaultValue: null
    },

    tabletTypographyFontSizeSuffix: {
      prefix: "brz-fs-s-sm-im",
      defaultValue: null
    },
    mobileTypographyFontSizeSuffix: {
      prefix: "brz-fs-s-xs-im",
      defaultValue: null
    },

    tabletTypographyLineHeight: {
      prefix: "brz-lh-sm-im",
      defaultValue: null
    },
    mobileTypographyLineHeight: {
      prefix: "brz-lh-xs-im",
      defaultValue: null
    },

    tabletTypographyFontWeight: {
      prefix: "brz-fw-sm-im",
      defaultValue: null
    },
    mobileTypographyFontWeight: {
      prefix: "brz-fw-xs-im",
      defaultValue: null
    },

    tabletTypographyLetterSpacing: {
      prefix: "brz-ls-sm-im",
      defaultValue: null
    },
    mobileTypographyLetterSpacing: {
      prefix: "brz-ls-xs-im",
      defaultValue: null
    }
  },
  style: {},
  attribute: {}
};

export const blockValues: Values = {
  class: {
    typographyFontStyle: {
      prefix: "brz-tp-lg",
      defaultValue: ""
    },
    tabletTypographyFontStyle: {
      prefix: "brz-tp-sm",
      defaultValue: null
    },
    mobileTypographyFontStyle: {
      prefix: "brz-tp-xs",
      defaultValue: null
    },

    typographyFontFamily: {
      prefix: "brz-ff",
      defaultValue: "lato"
    },
    typographyFontFamilyType: {
      prefix: "brz-ft",
      defaultValue: "google"
    },

    typographyFontSize: {
      prefix: "brz-fs-lg",
      defaultValue: 16
    },
    tabletTypographyFontSize: {
      prefix: "brz-fs-sm",
      defaultValue: null
    },
    mobileTypographyFontSize: {
      prefix: "brz-fs-xs",
      defaultValue: null
    },

    typographyFontSizeSuffix: {
      prefix: "brz-fss-lg",
      defaultValue: "px"
    },
    tabletTypographyFontSizeSuffix: {
      prefix: "brz-fss-sm",
      defaultValue: null
    },
    mobileTypographyFontSizeSuffix: {
      prefix: "brz-fss-xs",
      defaultValue: null
    },

    typographyFontWeight: {
      prefix: "brz-fw-lg",
      defaultValue: 400
    },
    tabletTypographyFontWeight: {
      prefix: "brz-fw-sm",
      defaultValue: null
    },
    mobileTypographyFontWeight: {
      prefix: "brz-fw-xs",
      defaultValue: null
    },

    typographyLineHeight: {
      prefix: "brz-lh-lg",
      defaultValue: 1.3
    },
    tabletTypographyLineHeight: {
      prefix: "brz-lh-sm",
      defaultValue: null
    },
    mobileTypographyLineHeight: {
      prefix: "brz-lh-xs",
      defaultValue: null
    },

    typographyLetterSpacing: {
      prefix: "brz-ls-lg",
      defaultValue: 0
    },
    tabletTypographyLetterSpacing: {
      prefix: "brz-ls-sm",
      defaultValue: null
    },
    mobileTypographyLetterSpacing: {
      prefix: "brz-ls-xs",
      defaultValue: null
    },

    contentHorizontalAlign: {
      prefix: "brz-text-lg",
      defaultValue: "left"
    },
    tabletContentHorizontalAlign: {
      prefix: "brz-text-sm",
      defaultValue: null
    },
    mobileContentHorizontalAlign: {
      prefix: "brz-text-xs",
      defaultValue: null
    },

    marginTop: {
      prefix: "brz-mt-lg",
      defaultValue: 0
    },
    tabletMarginTop: {
      prefix: "brz-mt-sm",
      defaultValue: null
    },
    mobileMarginTop: {
      prefix: "brz-mt-xs",
      defaultValue: null
    },

    marginBottom: {
      prefix: "brz-mb-lg",
      defaultValue: 0
    },
    tabletMarginBottom: {
      prefix: "brz-mb-sm",
      defaultValue: null
    },
    mobileMarginBottom: {
      prefix: "brz-mb-xs",
      defaultValue: null
    },

    // To think about renaming this property
    "block-colorPalette": {
      prefix: "brz-bcp",
      defaultValue: ""
    }
  },
  style: {},
  attribute: {}
};

// keys inside shows how data will store into html. Like classname or style or attribute
export const inlineValues: Values = {
  class: {
    colorPalette: {
      prefix: "brz-cp",
      defaultValue: ""
    },
    shadowColorPalette: {
      prefix: "brz-scp",
      defaultValue: ""
    },
    prepopulation: {
      prefix: "brz-pre-population",
      defaultValue: ""
    },
    capitalize: {
      prefix: "brz-capitalize",
      defaultValue: "off"
    }
  },
  style: {
    opacity: {
      prefix: "opacity",
      defaultValue: 1
    },
    shadow: {
      prefix: "text-shadow",
      defaultValue: ""
    }
  },
  attribute: {
    populationColor: {
      prefix: "data-color",
      defaultValue: ""
    }
  }
};

// !!! to think and add custom values like link, backgroundImage, e.t.c
export const customValues = {};

export const currentBlockValues = deepMerge.all([
  blockValues,
  customValues
]) as Values;

export const currentValues = deepMerge.all([
  currentBlockValues,
  inlineValues
]) as Values;

export const allValues = deepMerge.all([currentValues, legacyValues]) as Values;
