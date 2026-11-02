// biome-ignore lint/style/useNodejsImportProtocol: browser bundle — "events" resolves to the npm shim, "node:events" is an unhandled scheme in rspack
import { EventEmitter } from "events";
import { assignIn } from "es-toolkit/compat";

export { UIEventType } from "./UIEventType";

const UIEvents = assignIn({}, EventEmitter.prototype, {
  off(key: string, callback: () => void) {
    //@ts-expect-error: RemoveListener
    this.removeListener(key, callback);
  }
});
UIEvents.setMaxListeners(Infinity);

export default UIEvents;
