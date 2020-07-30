import { EventEmitter } from "events";

const _state: { [key: string]: unknown } = {};

type Callback = <T>(arg: T) => void;

class UIState extends EventEmitter {
  /**
   * @param {string} key
   * @param {function} callback
   */
  addChangeListener(key: string, callback: Callback): void {
    this.on(key, callback);
  }

  /**
   * @param {string} key
   * @param {function} callback
   */
  removeChangeListener(key: string, callback: Callback): void {
    this.removeListener(key, callback);
  }

  get(key: string): unknown {
    return _state[key];
  }

  set(key: string, value: unknown): void {
    _state[key] = value;
    this.emit(key, value);
  }
}

const uiState = new UIState();

uiState.setMaxListeners(Infinity);

export default uiState;
