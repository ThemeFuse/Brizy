import type { ElementModel } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";

export interface CSSSymbol {
  uid: string;
  label: string;
  className: string;
  type: string;
  model: {
    vd: ElementModel;
    vs: ElementModel;
    v: ElementModel;
  };
}

export interface SymbolCSS {
  [k: string]: {
    css: string;
  };
}

export interface SymbolDataPatch<T extends ElementModel = ElementModel> {
  type: ElementTypes;
  value: T;
  store: ReduxState;
}

export interface SymbolDataOutput {
  label: string;
  model: CSSSymbol["model"];
}

export type HandleComponentSymbolCreate = (data: {
  type: ElementTypes;
  store: ReduxState;
  value: ElementModel;
  dispatch: TypedDispatch;
}) => void;
