import React from "react";

const HISTORY_UPDATE_FREQUENCY = 2000;
const MAX_HISTORY_LENGTH = 10;

let history = new Array(MAX_HISTORY_LENGTH).fill(null);
let currentHistoryIndex = 0;
let lastSnapshotTimestamp = 0;
let canUndo = false;
let canRedo = false;

const createHistorySnapshot = (state, keysToTrack) =>
  keysToTrack.reduce((acc, key) => {
    if (typeof key === "object") {
      key = key.key;
    }

    acc[key] = state[key];
    return acc;
  }, {});

const updateFlags = () => {
  canUndo = currentHistoryIndex > 0;
  canRedo = Boolean(
    history[currentHistoryIndex + 1] &&
      history[currentHistoryIndex + 1] !== null
  );
};
const undoHistory = () => {
  currentHistoryIndex--;
  updateFlags();
  return history[currentHistoryIndex];
};
const redoHistory = () => {
  currentHistoryIndex++;
  updateFlags();
  return history[currentHistoryIndex];
};
const updateHistory = (state, { keysToTrack }, options) => {
  // the first (initial) snapshot
  if (currentHistoryIndex === 0 && history[currentHistoryIndex] === null) {
    history[currentHistoryIndex] = createHistorySnapshot(state, keysToTrack);
    updateFlags();
    lastSnapshotTimestamp = Date.now();
    return;
  }

  let newStateIsDifferent = keysToTrack.some(key => {
    if (typeof key === "string") {
      return state[key] !== history[currentHistoryIndex][key];
    } else {
      const { key: key_, equals } = key;

      if (equals) {
        return !equals(state[key_], history[currentHistoryIndex][key_]);
      } else {
        return state[key_] !== history[currentHistoryIndex][key_];
      }
    }
  });

  if (newStateIsDifferent) {
    const nextSnapshot = createHistorySnapshot(state, keysToTrack);
    const currentTimestamp = Date.now();

    if (options.replacePresent) {
      history[currentHistoryIndex] = nextSnapshot;
    } else {
      if (
        history[currentHistoryIndex + 1] &&
        history[currentHistoryIndex + 1] !== null
      ) {
        // shifted history mode
        // when user is not at the latest snapshot
        // and altered history from that point
        currentHistoryIndex++;
        history[currentHistoryIndex] = nextSnapshot;
        for (let i = currentHistoryIndex + 1; i <= history.length - 1; i++) {
          history[i] = null;
        }
      } else {
        const enoughTimePassed =
          currentTimestamp - lastSnapshotTimestamp > HISTORY_UPDATE_FREQUENCY;

        if (enoughTimePassed) {
          const historyIsFull = currentHistoryIndex === history.length - 1;

          if (historyIsFull) {
            for (let i = 0; i <= history.length - 2; i++) {
              history[i] = history[i + 1];
            }
            history[history.length - 1] = nextSnapshot;
          } else {
            currentHistoryIndex++;
            history[currentHistoryIndex] = nextSnapshot;
          }
        } else {
          history[currentHistoryIndex] = nextSnapshot;
        }
      }

      updateFlags();
      lastSnapshotTimestamp = currentTimestamp;
    }
  }
};

export const ActionTypes = {
  UNDO: "UNDO",
  REDO: "REDO"
};

export default function historyEnhancer(reducer, config) {
  return function(state, action) {
    switch (action.type) {
      case ActionTypes.UNDO: {
        const undoSnapshot = undoHistory();

        return {
          ...state,
          ...undoSnapshot,
          historyTravelling: true
        };
      }
      case ActionTypes.REDO: {
        const redoSnapshot = redoHistory();

        return {
          ...state,
          ...redoSnapshot,
          historyTravelling: true
        };
      }
      default: {
        state && delete state.historyTravelling;
        const newState = reducer(state, action);

        const {
          changeHistoryBeforeUpdate = () => {},
          changeHistoryAfterUpdate = () => {}
        } = config;

        if (action.type !== "@@redux/INIT") {
          changeHistoryBeforeUpdate(
            newState,
            history,
            currentHistoryIndex,
            action
          );

          updateHistory(newState, config, {
            replacePresent: action.meta && action.meta.historyReplacePresent
          });

          changeHistoryAfterUpdate(
            newState,
            history,
            currentHistoryIndex,
            action
          );
        }

        return newState;
      }
    }
  };
}

export class HistoryButtons extends React.Component {
  static defaultProps = {
    dispatch: null,
    render: null
  };

  componentDidMount() {
    window.document.addEventListener("keydown", this.handleKeyDown);
    window.parent.document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.document.removeEventListener("keydown", this.handleKeyDown);
    window.parent.document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = e => {
    const Z_KEY_CODE = 90;

    const modifierKeysWasPressed = e.metaKey || e.ctrlKey;
    if (
      e.keyCode === Z_KEY_CODE &&
      (modifierKeysWasPressed || (modifierKeysWasPressed && e.shiftKey))
    ) {
      e.preventDefault();
      e.shiftKey ? this.triggerRedo() : this.triggerUndo();
    }
  };

  triggerUndo = () => {
    if (canUndo) {
      this.props.dispatch({
        type: ActionTypes.UNDO,
        currentSnapshot: history[currentHistoryIndex],
        nextSnapshot: history[currentHistoryIndex - 1]
      });
    }
  };

  triggerRedo = () => {
    if (canRedo) {
      this.props.dispatch({
        type: ActionTypes.REDO,
        currentSnapshot: history[currentHistoryIndex],
        nextSnapshot: history[currentHistoryIndex + 1]
      });
    }
  };

  render() {
    return this.props.render({
      canUndo,
      triggerUndo: this.triggerUndo,
      canRedo,
      triggerRedo: this.triggerRedo
    });
  }
}
