import React from "react";
import _ from "underscore";

const HISTORY_UPDATE_FREQUENCY = 2000;
const MAX_HISTORY_LENGTH = 10;

let history = new Array(MAX_HISTORY_LENGTH).fill(null);
let currentHistoryIndex = 0;
let lastSnapshotTimestamp = 0;
let canUndo = false;
let canRedo = false;

const createHistorySnapshot = (state, keysToTrack) =>
  keysToTrack.reduce((acc, key) => {
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
const updateHistory = (state, keysToTrack, options) => {
  // the first (initial) snapshot
  if (currentHistoryIndex === 0 && history[currentHistoryIndex] === null) {
    history[currentHistoryIndex] = createHistorySnapshot(state, keysToTrack);
    updateFlags();
    lastSnapshotTimestamp = Date.now();
    return;
  }

  let newStateIsDifferent = keysToTrack.some(
    key => state[key] !== history[currentHistoryIndex][key]
  );

  if (newStateIsDifferent) {
    const nextSnapshot = createHistorySnapshot(state, keysToTrack);
    const currentTimestamp = Date.now();

    if (options.replacePresent) {
      history[currentHistoryIndex] = nextSnapshot;
    } else if (
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
};

export const ActionTypes = {
  UNDO: "UNDO",
  REDO: "REDO"
};

export default function historyEnhancer(reducer, keysToTrack) {
  return function(state, action) {
    switch (action.type) {
      case ActionTypes.UNDO:
        const undoSnapshot = undoHistory();
        return {
          ...state,
          ...undoSnapshot,
          historyTravelling: true
        };
      case ActionTypes.REDO:
        const redoSnapshot = redoHistory();
        return {
          ...state,
          ...redoSnapshot,
          historyTravelling: true
        };
      default:
        state && delete state.historyTravelling;
        const newState = reducer(state, action);

        if (action.type !== "@@redux/INIT") {
          updateHistory(newState, keysToTrack, {
            replacePresent: action.meta && action.meta.historyReplacePresent
          });
        }

        return newState;
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
    const Y_KEY_CODE = 89;

    if (e.metaKey || e.ctrlKey) {
      if (e.keyCode === Z_KEY_CODE) {
        this.triggerUndo();
      } else if (e.keyCode === Y_KEY_CODE) {
        this.triggerRedo();
      }
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
