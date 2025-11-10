import { ComponentType, Ref } from "react";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { SortableElementDataAttributes } from "visual/component/Sortable/SortableElement";
import { WithClassName } from "visual/types/attributes";
import { CssId } from "visual/utils/models/cssId";
import { ElementModelWithSymbols } from "visual/utils/symbols/types";

export interface Value extends ElementModel, CssId, ElementModelWithSymbols {
  items: ElementModelType[];
}

export type Component<P> = ComponentType<P> | keyof JSX.IntrinsicElements;
export type Props = {
  meta: {
    desktopW: number;
    desktopWNoSpacing: number;
    tabletW: number;
    tabletWNoSpacing: number;
    mobileW: number;
    mobileWNoSpacing: number;
    sectionPopup?: boolean;
    sectionPopup2?: boolean;
    wrapperAnimationId: string;
    wrapperAnimationActive: boolean;
  };
};

export type Static = WithClassName & {
  v: Value;
  vs: Value;
  vd: Value;
  extraAttr?: SortableElementDataAttributes;
  ref?: Ref<unknown>;
  needWrapper?: boolean;
};
