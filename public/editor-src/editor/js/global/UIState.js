import _ from "underscore";
import { EventEmitter } from "events";

function checkArgs(key, callback) {
  if (typeof key !== "string" || typeof callback !== "function") {
    throw new Error("incorrect argument types for UIState.addChangeListener");
  }
}

let _state = {};

const UIState = _.extend({}, EventEmitter.prototype, {
  /**
   * @param {string} key
   */
  emitChange: function(key, data) {
    this.emit(key, data);
  },

  /**
   * @param {string} key
   * @param {function} callback
   */
  addChangeListener: function(key, callback) {
    checkArgs(key, callback);
    this.on(key, callback);
  },

  /**
   * @param {string} key
   * @param {function} callback
   */
  removeChangeListener: function(key, callback) {
    checkArgs(key, callback);
    this.removeListener(key, callback);
  },

  get: function(key) {
    return _state[key];
  },

  set: function(key, value) {
    _state[key] = value;
    this.emitChange(key, value);
  }
});

UIState.setMaxListeners(Infinity);

export default UIState;
