type Listener = () => void;

export interface ObserverProperty {
  notifyListeners: VoidFunction;
  addEvents: VoidFunction;
  removeEvents: VoidFunction;
  events: string[];
  framePending: boolean;
  listeners: Listener[];
  addListener: (listener: Listener) => void;
  removeListener: (listener: Listener) => void;
}
