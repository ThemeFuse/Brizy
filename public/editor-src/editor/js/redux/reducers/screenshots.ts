import { produce } from "immer";
import {
  ElementModel,
  ElementModelType2 as ElementModelType
} from "visual/component/Elements/Types";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types/Block";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Screenshot } from "visual/types/Screenshot";
import { objectTraverse2 } from "visual/utils/object";
import { ActionTypes, ReduxAction } from "../actions2";

interface ScreenshotModel extends ElementModel, Screenshot {
  _id: string;
}

interface ScreenshotModelType extends ElementModelType {
  value: ScreenshotModel;
}

const validateScreenshots = (
  obj: ScreenshotModelType | ElementModel | Block
): obj is ScreenshotModelType => {
  return obj.type && obj.value && obj.value._id && obj.value._thumbnailSrc;
};

const getScreenshot = <T extends GlobalBlock["meta"]>(
  obj: T
): Screenshot | undefined => {
  if (
    obj._thumbnailSrc !== undefined &&
    obj._thumbnailWidth !== undefined &&
    obj._thumbnailHeight !== undefined &&
    obj._thumbnailTime !== undefined
  ) {
    return {
      _thumbnailSrc: obj._thumbnailSrc,
      _thumbnailWidth: obj._thumbnailWidth,
      _thumbnailHeight: obj._thumbnailHeight,
      _thumbnailTime: obj._thumbnailTime
    };
  }
  return undefined;
};

function parseScreenshots(data: ScreenshotModel | ElementModel) {
  const acc: Record<string, Screenshot> = {};

  objectTraverse2(data, (obj: ScreenshotModelType | ElementModel) => {
    if (validateScreenshots(obj)) {
      const v = obj.value;

      acc[obj.value._id] = {
        _thumbnailSrc: v._thumbnailSrc,
        _thumbnailWidth: v._thumbnailWidth,
        _thumbnailHeight: v._thumbnailHeight,
        _thumbnailTime: v._thumbnailTime
      };
    }
  });

  return acc;
}

type Screenshots = ReduxState["screenshots"];

type RScreenshots = (
  a: Screenshots,
  b: ReduxAction,
  c: ReduxState,
  d: ReduxState
) => Screenshots;

export const screenshots: RScreenshots = (
  state,
  action,
  _fullState,
  inConstructionState
) => {
  switch (action.type) {
    case "HYDRATE":
    case "PUBLISH": {
      const pageScreenshots = parseScreenshots(inConstructionState.page.data);
      const globalBlocksScreenshots: Record<string, Screenshot> = {};

      // global blocks parsing is a little more messy
      for (const [key, obj] of Object.entries(
        inConstructionState.globalBlocks
      )) {
        const objValue = obj.data;
        if (validateScreenshots(objValue)) {
          const v = objValue.value;

          globalBlocksScreenshots[key] = {
            _thumbnailSrc: v._thumbnailSrc,
            _thumbnailWidth: v._thumbnailWidth,
            _thumbnailHeight: v._thumbnailHeight,
            _thumbnailTime: v._thumbnailTime
          };
        }

        Object.assign(
          globalBlocksScreenshots,
          parseScreenshots(objValue.value)
        );
      }

      return {
        ...pageScreenshots,
        ...globalBlocksScreenshots,
        _published: {
          ...pageScreenshots,
          ...globalBlocksScreenshots
        }
      };
    }
    case ActionTypes.UPDATE_SCREENSHOT: {
      const {
        payload: { blockId, data }
      } = action;

      return produce(state, (draft) => {
        draft[blockId] = data;
      });
    }
    case "MAKE_POPUP_TO_GLOBAL_POPUP":
    case "MAKE_BLOCK_TO_GLOBAL_BLOCK": {
      const {
        data: {
          value: { _id }
        },
        meta
      } = action.payload.block;
      const screenshot = getScreenshot(meta);

      if (screenshot) {
        return produce(state, (draft) => {
          draft[_id] = screenshot;
          draft._published[_id] = screenshot;
        });
      }

      return state;
    }
    default:
      return state;
  }
};
