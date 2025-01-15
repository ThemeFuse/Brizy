import { mapWithStructuralSharing } from "../object/mapWithStructuralSharing";
import { cloneItem } from "./cloneItem";
import { getBlockData } from "./getBlockData";
import { insertItem } from "./insertItem";
import { insertItemsBatch } from "./insertItemsBatch";
import { isModel } from "./model";
import {
  isExternalPopup,
  isExternalStory,
  isInternalPopup,
  isInternalStory,
  isPopup,
  isStory,
  isTemplate
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
  setStyles
} from "./styles";

const mapModels = (fn, model) =>
  mapWithStructuralSharing(model, (obj) => (isModel(obj) ? fn(obj) : obj));

export {
  setIds,
  stripIds,
  setStyles,
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
  isTemplate,
  isInternalPopup,
  isInternalStory,
  isExternalPopup,
  isExternalStory,
  isPopup,
  isStory,
  getBlockData,
  createFullModelPath
};
