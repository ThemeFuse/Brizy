import { hasProps } from "visual/utils/object";
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
import { cloneItem } from "./cloneItem";
import { insertItemsBatch } from "./insertItemsBatch";
import {
  IS_TEMPLATE,
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_GLOBAL_POPUP,
  IS_STORY,
  IS_INTERNAL_STORY,
  IS_EXTERNAL_STORY,
  isGlobalPopup
} from "./modes";
import { setOffsetsToElementFromWrapper } from "./setDataInElement";
import { mapWithStructuralSharing } from "../object/mapWithStructuralSharing";

const isModel = obj => hasProps(["type", "value"], obj);

const mapModels = (fn, model) =>
  mapWithStructuralSharing(model, obj => (isModel(obj) ? fn(obj) : obj));

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
  insertItemsBatch,
  cloneItem,
  setOffsetsToElementFromWrapper,
  mapModels,
  isModel,
  IS_TEMPLATE,
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_GLOBAL_POPUP,
  IS_STORY,
  IS_INTERNAL_STORY,
  IS_EXTERNAL_STORY,
  isGlobalPopup
};
