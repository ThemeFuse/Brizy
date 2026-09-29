type ValueSyncArgs = {
  incoming: string;
  domValue: string;
  committedValue: string;
};

// A store value is external when it is neither what the editor currently
// shows nor the last value this editor committed upstream. The latter is the
// echo of our own commit arriving while a newer edit is still debounced, and
// it must not reset the DOM.
export const isExternalValueChange = ({
  incoming,
  domValue,
  committedValue
}: ValueSyncArgs): boolean =>
  incoming !== domValue && incoming !== committedValue;
