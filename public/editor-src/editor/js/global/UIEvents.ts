import _ from "underscore";
import { EventEmitter } from "events";

const UIEvents = _.extend({}, EventEmitter.prototype, {
  off(key: string, callback: () => {}) {
    this.removeListener(key, callback);
  }
});
UIEvents.setMaxListeners(Infinity);

export default UIEvents;
