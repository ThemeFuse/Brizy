import React from "react";
import _ from "underscore";

const HISTORY_UPDATE_FREQUENCY = 2000;
const MAX_HISTORY_LENGTH = 11; // 10 undo states + initial state

let history = [];
let currentHistoryIndex = -1;
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
  canRedo = currentHistoryIndex < history.length - 1;
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
const updateHistory = (state, keysToTrack) => {
  let updateHistory = false;

  if (history.length === 0) {
    updateHistory = true;
  } else {
    const lastSnapshot = history[currentHistoryIndex];

    for (const key of keysToTrack) {
      if (state[key] !== lastSnapshot[key]) {
        updateHistory = true;
        break;
      }
    }
  }

  if (updateHistory) {
    const nextSnapshot = createHistorySnapshot(state, keysToTrack);
    const currentTimestamp = Date.now();

    if (currentHistoryIndex < history.length - 1) {
      // shifted history mode
      // when user is not at the latest snapshot
      currentHistoryIndex++;
      history = [...history.slice(0, currentHistoryIndex), nextSnapshot];
    } else {
      const enoughTimePassed =
        currentTimestamp - lastSnapshotTimestamp > HISTORY_UPDATE_FREQUENCY;

      if (enoughTimePassed) {
        const historyIsFull = history.length >= MAX_HISTORY_LENGTH;

        if (historyIsFull) {
          // history.shift();
          // history.push(nextSnapshot);

          history = [...history.slice(1), nextSnapshot];
        } else {
          // history.push(nextSnapshot);
          // currentHistoryIndex++;

          history = [...history, nextSnapshot];
          currentHistoryIndex++;
        }
      } else {
        // history[history.length - 1] = nextSnapshot;

        history = [...history.slice(0, -1), nextSnapshot];
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
          updateHistory(newState, keysToTrack);
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
