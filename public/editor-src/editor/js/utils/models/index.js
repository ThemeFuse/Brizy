import { hasProps } from "visual/utils/object";
import { mapWithStructuralSharing } from "../object/mapWithStructuralSharing";
import { cloneItem } from "./cloneItem";
import { getBlockData } from "./getBlockData";
import { insertItem } from "./insertItem";
import { insertItemsBatch } from "./insertItemsBatch";
import {
  isExternalPopup,
  isExternalStory,
  isInternalPopup,
  isInternalStory,
  isPopup,
  isStory,
  IS_EXTERNAL_POPUP,
  IS_EXTERNAL_STORY,
  IS_GLOBAL_POPUP,
  IS_INTERNAL_POPUP,
  IS_INTERNAL_STORY,
  IS_STORY,
  IS_TEMPLATE
} from "./modes";
import { createFullModelPath } from "./path";
import { setOffsetsToElementFromWrapper } from "./setDataInElement";
import setIds from "./setIds";
import stripIds from "./stripIds";
import { stripSystemKeys } from "./stripSystemKeys";
import {
  getClosestParent,
  getElementOfArrayLoop,
  getParentWhichContainsStyleProperty,
  getStyles,
  setStyles
} from "./styles";

const isModel = (obj) => hasProps(["type", "value"], obj);

const mapModels = (fn, model) =>
  mapWithStructuralSharing(model, (obj) => (isModel(obj) ? fn(obj) : obj));

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
  isInternalPopup,
  isInternalStory,
  isExternalPopup,
  isExternalStory,
  isPopup,
  isStory,
  getBlockData,
  createFullModelPath
};
