import AwesomeDebouncePromise from "awesome-debounce-promise";
import _ from "underscore";
import {
  autoSave as apiAutoSave,
  createGlobalBlock as apiCreateGlobalBlock,
  createSavedBlock as apiCreateSavedBlock,
  deleteSavedBlock as apiDeleteSavedBlock,
  onChange as apiOnChange,
  publish as apiPublish,
  sendHeartBeat as apiSendHeartBeat,
  updateGlobalBlock as apiUpdateGlobalBlock,
  updateGlobalBlocks as apiUpdateGlobalBlocks,
  updatePopupRules as apiUpdatePopupRules
} from "visual/utils/api";
import { Data, Output, getCompile } from "visual/utils/compiler";
import * as Obj from "visual/utils/reader/object";
import { Literal } from "visual/utils/types/Literal";

export {
  apiPublish,
  apiAutoSave,
  apiOnChange,
  apiCreateGlobalBlock,
  apiUpdateGlobalBlock,
  apiUpdateGlobalBlocks,
  apiCreateSavedBlock,
  apiDeleteSavedBlock,
  apiUpdatePopupRules,
  apiSendHeartBeat
};

const DEBOUNCE_WAIT = 2000;

class debounceById<T> {
  private cancelId: null | number;
  private wait: number;
  private fn: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _debounce: any;

  constructor(fn: T, wait: number) {
    this.fn = fn;
    this.wait = wait;
    this.cancelId = null;

    this._debounce = AwesomeDebouncePromise(
      (id: number, ...rest: Array<unknown>) => {
        if (id !== this.cancelId) {
          this.cancelId = null;
          // @ts-expect-error: TODO need to review
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

  cancel = (id: number) => {
    this.cancelId = id;
  };

  async set(id: Literal, ...rest: Array<unknown>) {
    const promise = await this._debounce(id, ...rest);

    return promise;
  }
}

export const debouncedApiAutoSave = _.debounce(apiAutoSave, DEBOUNCE_WAIT);

export const debouncedApiPublish = _.debounce(apiPublish, DEBOUNCE_WAIT);

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
  onDone: (html: Output) => void;
}

export const onUpdate = async (data: OnUpdateData) => {
  const { project, page, config, globalBlocks, onDone } = data;
  const html = await getCompile({ project, page, globalBlocks, config });

  onDone(html);
};
