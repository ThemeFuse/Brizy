import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Dictionary } from "visual/types/utils";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { ECKeyDCInfo } from "../types";
import { DCApiProxy } from "./DCApiProxy";
import { DCApiProxyInstance } from "./DCApiProxyInstance";
import { placeholderObjFromECKeyDCInfo } from "./utils";

export interface DCObjResult {
  [k: string]: unknown;
}

export type DCObjDetails = Dictionary<{
  loaded: boolean;
  staticValue: unknown;
  dcValue: unknown;
}>;

export interface DCObjComplete {
  type: "complete";
  value: DCObjResult;
  details: DCObjDetails;
}

export interface DCObjIncomplete {
  type: "incomplete";
  _getCompleteAborted: boolean;
  partialValue: DCObjResult;
  getComplete: () => Promise<DCObjComplete>;
  abortGetComplete: () => void;
  details: DCObjDetails;
}

export const getDCObjPreview = (keys: ECKeyDCInfo[]): DCObjComplete => {
  const value: DCObjResult = {};
  const details: DCObjDetails = {};

  for (const keyDcInfo of keys) {
    const placeholderObj = placeholderObjFromECKeyDCInfo(keyDcInfo);

    if (placeholderObj) {
      value[keyDcInfo.key] = makePlaceholder(placeholderObj);
      details[keyDcInfo.key] = {
        loaded: true,
        staticValue: keyDcInfo.staticValue,
        dcValue: value[keyDcInfo.key]
      };
    }
  }

  return {
    type: "complete",
    value,
    details
  };
};

// exported for testing purposes
export const getDCObjEditor_ =
  (apiProxy: DCApiProxy, config: ConfigCommon) =>
  (
    keys: ECKeyDCInfo[],
    context: EditorComponentContextValue
  ): DCObjComplete | DCObjIncomplete => {
    const toFetchK: string[] = [];
    const toFetchV: string[] = [];
    const partialValue: DCObjResult = {};
    const details: DCObjDetails = {};
    const apiProxyConfig = {
      postId: context.dynamicContent.itemId,
      globalConfig: config
    };

    for (const keyDCInfo of keys) {
      const placeholderObj = placeholderObjFromECKeyDCInfo(keyDCInfo);

      if (!placeholderObj) {
        continue;
      }

      const placeholderStr = makePlaceholder(placeholderObj);
      const cached = apiProxy.getFromCache(placeholderStr, apiProxyConfig);

      if (cached === undefined) {
        toFetchK.push(keyDCInfo.key);
        toFetchV.push(placeholderStr);
        details[keyDCInfo.key] = {
          loaded: false,
          staticValue: keyDCInfo.staticValue,
          dcValue: undefined
        };
      } else {
        partialValue[keyDCInfo.key] = cached;
        details[keyDCInfo.key] = {
          loaded: true,
          staticValue: keyDCInfo.staticValue,
          dcValue: cached
        };
      }
    }

    if (toFetchK.length === 0) {
      return {
        type: "complete",
        value: partialValue, // partial is complete here
        details
      };
    } else {
      return {
        type: "incomplete",
        _getCompleteAborted: false,
        partialValue,
        async getComplete(): Promise<DCObjComplete> {
          const r = await apiProxy.getDC(toFetchV, apiProxyConfig);

          if (this._getCompleteAborted) {
            throw new Error("getComplete aborted");
          }

          const value_: DCObjResult = { ...partialValue };
          const details_: DCObjDetails = { ...details };
          for (let i = 0; i < r.length; i++) {
            value_[toFetchK[i]] = r[i];
            details_[toFetchK[i]] = {
              loaded: true,
              staticValue: details[toFetchK[i]]?.staticValue,
              dcValue: r[i]
            };
          }

          return {
            type: "complete",
            value: value_,
            details: details_
          };
        },
        abortGetComplete(): void {
          this._getCompleteAborted = true;
        },
        details
      };
    }
  };

export const getDCObjEditor = (config: ConfigCommon) =>
  getDCObjEditor_(DCApiProxyInstance, config);
