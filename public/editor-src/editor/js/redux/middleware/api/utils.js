import AwesomeDebouncePromise from "awesome-debounce-promise";
import _ from "underscore";
import Config from "visual/global/Config";
import {
  autoSave as apiAutoSave,
  createGlobalBlock as apiCreateGlobalBlock,
  createSavedBlock as apiCreateSavedBlock,
  deleteSavedBlock as apiDeleteSavedBlock,
  onChange as apiOnChange,
  publish as apiPublish,
  sendHeartBeat as apiSendHeartBeat,
  updateCustomerPage as apiUpdateCustomPage,
  updateGlobalBlock as apiUpdateGlobalBlock,
  updateGlobalBlocks as apiUpdateGlobalBlocks,
  updatePage as apiUpdatePage,
  updatePopupRules as apiUpdatePopupRules
} from "visual/utils/api";
import { isCustomerPage } from "visual/utils/env";

const updateFn = (() => {
  return isCustomerPage(Config.getAll()) ? apiUpdateCustomPage : apiUpdatePage;
})();

export {
  apiPublish,
  apiAutoSave,
  apiOnChange,
  updateFn as apiUpdatePage,
  apiCreateGlobalBlock,
  apiUpdateGlobalBlock,
  apiUpdateGlobalBlocks,
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
        key: (id) => id
      }
    );
  }

  cancel = (id) => {
    this.cancelId = id;
  };

  async set(id, ...rest) {
    const promise = await this._debounce(id, ...rest);

    return promise;
  }
}

export const debouncedApiAutoSave = _.debounce(apiAutoSave, DEBOUNCE_WAIT);

export const debouncedApiPublish = _.debounce(apiPublish, DEBOUNCE_WAIT);

export const debouncedApiUpdatePage = _.debounce(updateFn, DEBOUNCE_WAIT);

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
            .then((r) => {
              if (r?.locked === true) {
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
