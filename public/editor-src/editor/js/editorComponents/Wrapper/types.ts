import type { ComponentType, Ref } from "react";
import type {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import type { SortableElementDataAttributes } from "visual/component/Sortable/SortableElement";
import type { WithClassName } from "visual/types/attributes";
import type { CssId } from "visual/utils/models/cssId";
import type { ElementModelWithSymbols } from "visual/utils/symbols/types";

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
