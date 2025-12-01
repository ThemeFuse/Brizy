import { Obj } from "@brizy/readers";
import { omit, uniqBy } from "es-toolkit";
import type { SymbolAsset } from "visual/bootstraps/compiler/common/transforms/assets/makeSymbols";
import type { ElementModel } from "visual/component/Elements/Types";
import {
  createClassName,
  createPatch,
  flattenDefaultValue
} from "visual/editorComponents/EditorComponent/utils";
import { type SymbolsCreatePayload, createSymbol } from "visual/redux/actions2";
import { symbolsSelector } from "visual/redux/selectors";
import type {
  HandleComponentSymbolCreate,
  SymbolDataOutput,
  SymbolDataPatch
} from "visual/types/Symbols";
import {
  getComponentDefaultValue,
  getComponentRulesValue
} from "visual/utils/traverse/common";
import { uuid } from "visual/utils/uuid";
import { MValue } from "../value";

export const CSS_MODEL_KEY = "classes";

export const omitSymbolsKey = (patch: ElementModel): ElementModel =>
  omit(patch, [CSS_MODEL_KEY]);

const getSymbolData = <T extends ElementModel = ElementModel>({
  type,
  value,
  store
}: SymbolDataPatch<T>): SymbolDataOutput => {
  const defaultValue = getComponentDefaultValue(type);
  const rulesValue = getComponentRulesValue(store, value);

  const defaultStyle = flattenDefaultValue(defaultValue?.style ?? {});

  const cssSymbols = symbolsSelector(store);
  const label = createClassName(type, cssSymbols.classes);
  const patch = createPatch<T>(value, defaultStyle).style ?? ({} as T);
  const rulesPatch =
    createPatch<T>((rulesValue as T) ?? {}, defaultStyle).style ?? ({} as T);

  return {
    label,
    model: {
      vd: omitSymbolsKey(defaultValue?.style ?? {}),
      vs: rulesPatch ?? {},
      v: omitSymbolsKey(patch)
    }
  };
};

export const getUniqSymbols = (symbols: SymbolAsset[]): SymbolAsset[] =>
  uniqBy(symbols, (s) => s.attr.class);

export const handleComponentSymbolCreate: HandleComponentSymbolCreate = ({
  type,
  value,
  store,
  onChange
}) => {
  const { label, model } = getSymbolData({ type, value, store });

  const uid = uuid();
  const className = `brz-${type.toLowerCase()}-${uid}`;

  const payload: SymbolsCreatePayload = {
    element: undefined,
    cssClasses: [
      {
        uid: uuid(),
        className,
        label,
        type,
        model
      }
    ]
  };

  onChange(createSymbol(payload));
};

export const validateSymbolModel = (_model: unknown): MValue<boolean> => {
  const model = Obj.readNoArray(_model);

  if (
    model &&
    Obj.length(model) === 3 &&
    Obj.hasKeys(["vd", "vs", "v"], model)
  ) {
    return ["vd", "vs", "v"].every((key) =>
      Obj.readNoArray(model[key as keyof typeof model])
    );
  }

  if (process.env.NODE_ENV === "development") {
    throw new Error("Invalid symbol model");
  }
};
