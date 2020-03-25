import _ from "underscore";
import {
  updateProject as apiUpdateProject,
  updatePage as apiUpdatePage,
  updateInternalPopup as apiUpdateInternalPopup,
  updateExternalPopup as apiUpdateExternalPopup,
  createGlobalBlock as apiCreateGlobalBlock,
  updateGlobalBlock as apiUpdateGlobalBlock,
  createSavedBlock as apiCreateSavedBlock,
  updateSavedBlock as apiUpdateSavedBlock,
  deleteSavedBlock as apiDeleteSavedBlock,
  updateRules as apiUpdateRules,
  sendHeartBeat as apiSendHeartBeat
} from "visual/utils/api/editor";
import Config from "visual/global/Config";
import { IS_PAGE, IS_INTERNAL_POPUP } from "visual/utils/models/modes";

const updateFn =
  IS_PAGE || Config.get("wp")
    ? apiUpdatePage
    : IS_INTERNAL_POPUP
    ? apiUpdateInternalPopup
    : apiUpdateExternalPopup;

export {
  apiUpdateProject,
  updateFn as apiUpdatePage,
  apiCreateGlobalBlock,
  apiUpdateGlobalBlock,
  apiCreateSavedBlock,
  apiUpdateSavedBlock,
  apiDeleteSavedBlock,
  apiUpdateRules,
  apiSendHeartBeat
};

const DEBOUNCE_WAIT = 2000;

export const debouncedApiUpdateProject = _.debounce(
  apiUpdateProject,
  DEBOUNCE_WAIT
);

export const debouncedApiUpdatePage = _.debounce(updateFn, DEBOUNCE_WAIT);

export const debouncedApiCreateGlobalBlock = debounceById(
  apiCreateGlobalBlock,
  DEBOUNCE_WAIT
);
export const debouncedApiUpdateGlobalBlock = debounceById(
  apiUpdateGlobalBlock,
  DEBOUNCE_WAIT
);

export const debouncedApiCreateSavedBlock = debounceById(
  apiCreateSavedBlock,
  DEBOUNCE_WAIT
);
export const debouncedApiDUpdateSavedBlock = debounceById(
  apiUpdateSavedBlock,
  DEBOUNCE_WAIT
);
export const debouncedApiDeleteSavedBlock = debounceById(
  apiDeleteSavedBlock,
  DEBOUNCE_WAIT
);

/*
 * a customize debounce function that, being provided with an id,
 * allows to fire multiple instances of the same debounced function
 */
function debounceById(fn, wait, maxCacheItems = 5) {
  const MAX_CACHE_ITEMS = maxCacheItems;
  const cache = new Array(MAX_CACHE_ITEMS);
  let nextCacheIndex = 0;
  const idToCacheIndex = new Map();

  return function(id) {
    if (idToCacheIndex.get(id) === undefined) {
      idToCacheIndex.set(id, nextCacheIndex);
      cache[nextCacheIndex] = _.debounce(fn, wait);

      nextCacheIndex = (nextCacheIndex + 1) % MAX_CACHE_ITEMS;
    }

    return cache[idToCacheIndex.get(id)];
  };
}

// Polling
export function pollingSendHeartBeat(heartBeat) {
  let init = false;

  return new Promise((res, rej) => {
    if (!init) {
      init = true;

      const polling = () => {
        setTimeout(() => {
          apiSendHeartBeat().then(r => {
            if (r.locked === false) {
              polling();
            } else {
              rej({ heartBeat: true, data: r });
            }
          });
        }, heartBeat);
      };

      polling();
    }
  });
}
