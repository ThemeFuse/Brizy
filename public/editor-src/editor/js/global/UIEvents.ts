import { assignIn } from "es-toolkit/compat";
import { EventEmitter } from "events";

export { UIEventType } from "./UIEventType";

const UIEvents = assignIn({}, EventEmitter.prototype, {
  off(key: string, callback: () => void) {
    //@ts-expect-error: RemoveListener
    this.removeListener(key, callback);
  }
});
UIEvents.setMaxListeners(Infinity);

export default UIEvents;
