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
  IS_TEMPLATE,
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_GLOBAL_POPUP,
  isGlobalPopup,
  IS_WP
} from "./modes";

const isModel = obj => hasProps(["type", "value"], obj);

const mapModels = (fn, model) => {
  return isModel(model)
    ? map(mapModels.bind(null, fn), fn(model))
    : map(mapModels.bind(null, fn), model);
};

export {
  setIds,
  stripIds,
  setStyles,
  getStyles,
  getElementOfArrayLoop,
  getClosestParent,
  getParentWhichContainsStyleProperty,
  stripSystemKeys,
  insertItem,
  mapModels,
  isModel,
  IS_WP,
  IS_PAGE,
  IS_TEMPLATE,
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_GLOBAL_POPUP,
  isGlobalPopup
};
