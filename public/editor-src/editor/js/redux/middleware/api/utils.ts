import _ from "underscore";
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

export const debouncedApiAutoSave = _.debounce(apiAutoSave, DEBOUNCE_WAIT);

export const debouncedApiPublish = _.debounce(apiPublish, DEBOUNCE_WAIT);

// Polling
export function pollingSendHeartBeat(heartBeat: number) {
  let init = false;

  return new Promise((_res, rej) => {
    if (!init) {
      init = true;

      const polling = () => {
        setTimeout(() => {
          apiSendHeartBeat()
            .then((r) => {
              if (Obj.isObject(r) && r?.locked === true) {
                rej({ heartBeat: true, data: r });
              } else {
                polling();
              }
            })
            .catch(polling);
        }, heartBeat);
      };

      polling();
    }
  });
}

// OnUpdate res

interface OnUpdateData extends Data {
  onDone: (data: PublishData) => void;
}

export const onUpdate = async (data: OnUpdateData) => {
  const { state, config, needToCompile, is_autosave, onDone } = data;
  const html = await getCompile({ state, config, needToCompile, is_autosave });

  onDone(html);
};
