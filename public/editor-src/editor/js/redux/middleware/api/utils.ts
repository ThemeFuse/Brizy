import { debounce, once } from "es-toolkit";
import { prepareHTML } from "visual/bootstraps/compiler/common/utils/prepareHTML";
import {
  ConfigCommon,
  PublishData
} from "visual/global/Config/types/configs/ConfigCommon";
import { Store } from "visual/redux/store";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
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

export const debouncedApiAutoSave = once((interval: number = DEBOUNCE_WAIT) =>
  debounce(apiAutoSave, interval)
);

export const debouncedApiPublish = debounce(apiPublish, DEBOUNCE_WAIT);

// Polling
export function pollingSendHeartBeat(heartBeat: number, config: ConfigCommon) {
  let init = false;
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
          } catch (_) {
            polling();
          }
        }, heartBeat);
      };

      polling();
    }
  });
}

// OnUpdate res

interface CompileData {
  page: Page;
  project: Project;
  globalBlocks: Array<GlobalBlock>;
}

interface OnUpdateData {
  is_autosave: 1 | 0;
  config: ConfigCommon;
  needToCompile: Partial<CompileData>;
  store: Store;
  onDone: (data: PublishData) => void;
}

export const onUpdate = async (data: OnUpdateData) => {
  const { store, config, needToCompile, is_autosave, onDone } = data;
  const html = prepareHTML({
    config,
    store,
    globalBlocks: needToCompile.globalBlocks,
    page: needToCompile.page,
    project: needToCompile.project
  });

  onDone({ ...html, is_autosave });
};
