import _ from "underscore";
import Config from "visual/global/Config";
import { PublishData } from "visual/global/Config/types/configs/ConfigCommon";
import {
  autoSave as apiAutoSave,
  createGlobalBlock as apiCreateGlobalBlock,
  createSavedBlock as apiCreateSavedBlock,
  deleteSavedBlock as apiDeleteSavedBlock,
  onChange as apiOnChange,
  publish as apiPublish,
  sendHeartBeat as apiSendHeartBeat,
  updatePopupRules as apiUpdatePopupRules
} from "visual/utils/api";
import { Data, getCompile } from "visual/utils/compiler";
import * as Obj from "visual/utils/reader/object";

export {
  apiPublish,
  apiAutoSave,
  apiOnChange,
  apiCreateGlobalBlock,
  apiCreateSavedBlock,
  apiDeleteSavedBlock,
  apiUpdatePopupRules,
  apiSendHeartBeat
};

const DEBOUNCE_WAIT = 2000;

export const debouncedApiAutoSave = _.once((interval: number = DEBOUNCE_WAIT) =>
  _.debounce(apiAutoSave, interval)
);

export const debouncedApiPublish = _.debounce(apiPublish, DEBOUNCE_WAIT);

// Polling
export function pollingSendHeartBeat(heartBeat: number) {
  let init = false;
  const config = Config.getAll();
  const { sendHandler } = config.api?.heartBeat ?? {};

  if (typeof sendHandler === "undefined") {
    return Promise.resolve();
  }

  return new Promise((_res, rej) => {
    if (!init) {
      init = true;

      const polling = () => {
        setTimeout(async () => {
          try {
            const r = await apiSendHeartBeat(config);
            if (Obj.isObject(r) && r?.locked === true) {
              rej({ heartBeat: true, data: r });
            } else {
              polling();
            }
          } catch (e) {
            polling();
          }
        }, heartBeat);
      };

      polling();
    }
  });
}

// OnUpdate res

interface OnUpdateData extends Data {
  is_autosave: 1 | 0;
  onDone: (data: PublishData) => void;
}

export const onUpdate = async (data: OnUpdateData) => {
  const { state, config, needToCompile, is_autosave, onDone } = data;
  const html = await getCompile({ state, config, needToCompile });

  onDone({ ...html, is_autosave });
};
