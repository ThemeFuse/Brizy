// Some third-party embed codes may override the default `window.Worker`.
// This code stores the original `Worker` for later use.
import { MValue } from "visual/utils/value";

const _Worker = (function () {
  let instance: MValue<typeof Worker> = globalThis.Worker;

  function createInstance() {
    return globalThis.Worker;
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
    reset() {
      instance = undefined;
    }
  };
})();

export { _Worker };
