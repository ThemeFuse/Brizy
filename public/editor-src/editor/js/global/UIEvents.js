import _ from "underscore";
import { EventEmitter } from "events";

const UIEvents = _.extend({}, EventEmitter.prototype, {
  off(key, callback) {
    this.removeListener(key, callback);
  }
});
UIEvents.setMaxListeners(Infinity);

export default UIEvents;
