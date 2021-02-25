import AwesomeDebouncePromise from "awesome-debounce-promise";
import _ from "underscore";
import {
  updateProject as apiUpdateProject,
  updatePage as apiUpdatePage,
  updateExternalStories as apiUpdateExternalStories,
  updateInternalPopup as apiUpdateInternalPopup,
  updateExternalPopup as apiUpdateExternalPopup,
  createGlobalBlock as apiCreateGlobalBlock,
  updateGlobalBlock as apiUpdateGlobalBlock,
  updateGlobalBlocks as apiUpdateGlobalBlocks,
  updateGlobalBlocksPositions as apiUpdateGlobalBlocksPositions,
  createSavedBlock as apiCreateSavedBlock,
  deleteSavedBlock as apiDeleteSavedBlock,
  updatePopupRules as apiUpdatePopupRules,
  sendHeartBeat as apiSendHeartBeat
} from "visual/utils/api";
import { IS_WP, IS_PAGE, IS_SINGLE, IS_ARCHIVE } from "visual/utils/env";
import {
  IS_INTERNAL_STORY,
  IS_EXTERNAL_STORY,
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP
} from "visual/utils/models/modes";

const updateFn = (() => {
  if (IS_WP) {
    return apiUpdatePage;
  } else {
    const err = () => {
      throw new Error("unknown editor mode");
    };

    return IS_PAGE || IS_SINGLE || IS_ARCHIVE || IS_INTERNAL_STORY
      ? apiUpdatePage
      : IS_INTERNAL_POPUP
      ? apiUpdateInternalPopup
      : IS_EXTERNAL_POPUP
      ? apiUpdateExternalPopup
      : IS_EXTERNAL_STORY
      ? apiUpdateExternalStories
      : err();
  }
})();

export {
  apiUpdateProject,
  updateFn as apiUpdatePage,
  apiCreateGlobalBlock,
  apiUpdateGlobalBlock,
  apiUpdateGlobalBlocks,
  apiUpdateGlobalBlocksPositions,
  apiCreateSavedBlock,
  apiDeleteSavedBlock,
  apiUpdatePopupRules,
  apiSendHeartBeat
};

const DEBOUNCE_WAIT = 2000;

class debounceById {
  constructor(fn, wait) {
    this.fn = fn;
    this.wait = wait;
    this.cancelId = null;

    this._debounce = AwesomeDebouncePromise(
      (id, ...rest) => {
        if (id !== this.cancelId) {
          this.cancelId = null;
          return this.fn(...rest);
        }

        return Promise.resolve();
      },
      this.wait,
      {
        key: id => id
      }
    );
  }

  cancel = id => {
    this.cancelId = id;
  };

  async set(id, ...rest) {
    const promise = await this._debounce(id, ...rest);

    return promise;
  }
}

export const debouncedApiUpdateProject = _.debounce(
  apiUpdateProject,
  DEBOUNCE_WAIT
);

export const debouncedApiUpdatePage = _.debounce(updateFn, DEBOUNCE_WAIT);

export const debouncedApiUpdateGlobalBlocksPositions = _.debounce(
  apiUpdateGlobalBlocksPositions,
  DEBOUNCE_WAIT
);

export const debouncedApiUpdateGlobalBlock = new debounceById(
  apiUpdateGlobalBlock,
  DEBOUNCE_WAIT
);

/*
 * a customize debounce function that, being provided with an id,
 * allows to fire multiple instances of the same debounced function
 */
// function debounceById(fn, wait, maxCacheItems = 5) {
//   const MAX_CACHE_ITEMS = maxCacheItems;
//   const cache = new Array(MAX_CACHE_ITEMS);
//   let nextCacheIndex = 0;
//   const idToCacheIndex = new Map();

//   return function(id) {
//     if (idToCacheIndex.get(id) === undefined) {
//       idToCacheIndex.set(id, nextCacheIndex);
//       cache[nextCacheIndex] = _.debounce(fn, wait);

//       nextCacheIndex = (nextCacheIndex + 1) % MAX_CACHE_ITEMS;
//     }

//     return cache[idToCacheIndex.get(id)];
//   };
// }

// Polling
export function pollingSendHeartBeat(heartBeat) {
  let init = false;

  return new Promise((res, rej) => {
    if (!init) {
      init = true;

      const polling = () => {
        setTimeout(() => {
          apiSendHeartBeat()
            .then(r => {
              if (!r || r.locked === false) {
                polling();
              } else {
                rej({ heartBeat: true, data: r });
              }
            })
            .catch(polling);
        }, heartBeat);
      };

      polling();
    }
  });
}
