import { hasProps, map } from "visual/utils/object";
import setIds from "./setIds";
import stripIds from "./stripIds";
import {
  setStyles,
  getStyles,
  getElementOfArrayLoop,
  getClosestParent,
  getParentWhichContainsStyleProperty
} from "./styles";
import { stripSystemKeys } from "./stripSystemKeys";
import { insertItem } from "./insertItem";
import {
  IS_PAGE,
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_GLOBAL_POPUP,
  isGlobalPopup
} from "./modes";

const isModel = obj => hasProps(["type", "value"], obj);

const mapModels = (fn, model) => {
  return isModel(model)
    ? map(mapModels.bind(null, fn), fn(model))
    : map(mapModels.bind(null, fn), model);
};

export {
  isModel,
  mapModels,
  setIds,
  stripIds,
  setStyles,
  getStyles,
  getElementOfArrayLoop,
  getClosestParent,
  getParentWhichContainsStyleProperty,
  stripSystemKeys,
  insertItem,
  IS_PAGE,
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_GLOBAL_POPUP,
  isGlobalPopup
};
