import { ElementModelType } from "visual/component/Elements/Types";

export type ElementTypes = "shortcode" | "column" | "row" | "addable";

//#region From Shortcode to [Column, Row, Section]

interface FromShortcodeBase {
  from: {
    itemType: "shortcode";
    itemIndex: number;
    itemPath: string[];
    containerPath: string[];
    containerType: string;
  };
}

interface FromShortcodeColumn extends FromShortcodeBase {
  to: {
    containerType: "column";
    itemPath: string[];
    containerPath: string[];
    itemIndex?: number;
  };
}

interface FromShortcodeRow extends FromShortcodeBase {
  to: {
    containerType: "row";
    itemPath: string[];
    containerPath: string[];
    itemIndex?: number;
  };
}

interface FromShortcodeSection extends FromShortcodeBase {
  to: {
    containerType: "section";
    itemPath: string[];
    containerPath: string[];
    itemIndex?: number;
  };
}

interface FromShortcodeThirdParty extends FromShortcodeBase {
  to: {
    containerType: "thirdPartyContainer";
    itemPath: string[];
    containerPath: string[];
    itemIndex?: number;
  };
}

type FromShortcode =
  | FromShortcodeColumn
  | FromShortcodeRow
  | FromShortcodeSection
  | FromShortcodeThirdParty;

//#endregion

//#region From Column to [Column, Row, Section]

interface FromColumnColumnBase {
  from: {
    itemType: "column";
    itemPath: string[];
    containerPath: string[];
    containerType: string;
  };
}

interface FromColumnColumn extends FromColumnColumnBase {
  to: {
    containerType: "column";
    itemPath: string[];
  };
}

interface FromColumnRow extends FromColumnColumnBase {
  to: {
    containerType: "row";
    itemPath: string[];
    containerPath: string[];
  };
}

interface FromColumnSection extends FromColumnColumnBase {
  to: {
    containerType: "section";
    itemPath: string[];
  };
}

interface FromColumnThirdParty extends FromColumnColumnBase {
  to: {
    containerType: "thirdPartyContainer";
    itemPath: string[];
    containerPath: string[];
  };
}

type FromColumn =
  | FromColumnColumn
  | FromColumnRow
  | FromColumnSection
  | FromColumnThirdParty;

//#endregion

//#region From Row to [Column, Section]

interface FromRow {
  from: {
    itemType: "row";
    itemPath: string[];
  };
  to: {
    containerType: "column" | "section" | "thirdPartyContainer";
    itemPath: string[];
  };
}

//#endregion

//#region From Addable (LeftSidebar) to [Column, Row, Section]

interface FromAddableBase {
  from: {
    itemType: "addable";
    itemData: ElementModelType;
  };
}

interface FromAddableColumn extends FromAddableBase {
  to: {
    containerType: "column";
    itemPath: string[];
  };
}

interface FromAddableRow extends FromAddableBase {
  to: {
    containerType: "row";
    containerPath: string[];
    itemPath: string[];
  };
}

interface FromAddableSection extends FromAddableBase {
  to: {
    containerType: "section";
    itemPath: string[];
  };
}

interface FromAddableThirdParty extends FromAddableBase {
  to: {
    containerType: "thirdPartyContainer";
    containerPath: string[];
    itemPath: string[];
  };
}

type FromAddable =
  | FromAddableColumn
  | FromAddableRow
  | FromAddableSection
  | FromAddableThirdParty;

//#endregion

export type FromTo = FromShortcode | FromRow | FromColumn | FromAddable;

export const isAddable = (d: FromTo): d is FromAddable => {
  return d.from.itemType === "addable";
};

export const isRow = (d: FromTo): d is FromRow => {
  return d.from.itemType === "row";
};

export const isColumn = (d: FromTo): d is FromColumn => {
  return d.from.itemType === "column";
};

export const isShortcode = (d: FromTo): d is FromShortcode => {
  return d.from.itemType === "shortcode";
};
