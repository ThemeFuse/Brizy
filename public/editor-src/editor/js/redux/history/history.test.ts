import { History } from "./types";
import {
  createHistorySnapshot,
  addHistoryDataToState,
  isHistoryEnhancedState
} from "./reducers";

describe("testing 'History' class", () => {
  const config = {
    maxSize: 3,
    collapseFrequency: -1 // disables snapshot collapsing
  };

  it("Should track history", () => {
    const history = new History(config);

    history.update({ a: 1 });
    history.update({ a: 2 });
    history.update({ a: 3 });

    expect(history.getSnapshots()).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
  });

  it("Should not track consecutive states with equal keys", () => {
    const history = new History(config);

    history.update({ a: 1, b: "a" });
    history.update({ a: 1, b: "a" }); // same as above
    history.update({ a: 1, b: "b" });
    history.update({ a: 2, b: "b" });

    expect(history.getSnapshots()).toEqual([
      { a: 1, b: "a" },
      { a: 1, b: "b" },
      { a: 2, b: "b" }
    ]);
  });

  it("Should overflow correctly", () => {
    const history = new History(config);

    history.update({ a: 1 });
    history.update({ a: 2 });
    history.update({ a: 3 });
    history.update({ a: 4 }); // overwrites a:1
    history.update({ a: 5 }); // overwrites a:2

    expect(history.getSnapshots()).toEqual([{ a: 3 }, { a: 4 }, { a: 5 }]);
  });

  it("Should give current snapshot", () => {
    const history = new History(config);
    const snapshot1 = history.getCurrentSnapshot();

    history.update({ a: 1 });
    const snapshot2 = history.getCurrentSnapshot();

    history.update({ a: 2 });
    const snapshot3 = history.getCurrentSnapshot();

    expect(snapshot1).toBe(null);
    expect(snapshot2).toEqual({ a: 1 });
    expect(snapshot3).toEqual({ a: 2 });
  });

  it("Should give previous snapshot", () => {
    const history = new History(config);
    const snapshot1 = history.getPreviousSnapshot();

    history.update({ a: 1 });
    const snapshot2 = history.getPreviousSnapshot();

    history.update({ a: 2 });
    const snapshot3 = history.getPreviousSnapshot();

    history.undo();
    const snapshot4 = history.getPreviousSnapshot();

    history.redo();
    const snapshot5 = history.getPreviousSnapshot();

    history.update({ a: 3 });
    const snapshot6 = history.getPreviousSnapshot();

    expect(snapshot1).toBe(null);
    expect(snapshot2).toBe(null);
    expect(snapshot3).toEqual({ a: 1 });
    expect(snapshot4).toEqual({ a: 2 });
    expect(snapshot5).toEqual({ a: 1 });
    expect(snapshot6).toEqual({ a: 2 });
  });

  it("Should give snapshot by index", () => {
    const history = new History(config);

    history.update({ a: 1 });
    history.update({ a: 2 });
    history.update({ a: 3 });

    expect(history.getSnapshot(1)).toEqual({ a: 1 });
    expect(history.getSnapshot(2)).toEqual({ a: 2 });
    expect(history.getSnapshot(3)).toEqual({ a: 3 });
    expect(history.getSnapshot(-1)).toEqual({ a: 3 });
    expect(history.getSnapshot(-2)).toEqual({ a: 2 });
    expect(history.getSnapshot(-3)).toEqual({ a: 1 });
    expect(history.getSnapshot(0)).toEqual(null);
    expect(history.getSnapshot(4)).toEqual(null);
    expect(history.getSnapshot(-4)).toEqual(null);
  });

  it("Should undo", () => {
    const history = new History(config);
    const canUndo1 = history.canUndo();

    history.update({ a: 1 });
    const canUndo2 = history.canUndo();

    history.update({ a: 2 });
    const canUndo3 = history.canUndo();

    history.undo();
    const canUndo4 = history.canUndo();
    const snapshot4 = history.getCurrentSnapshot();

    expect(canUndo1).toEqual(false);
    expect(canUndo2).toEqual(false);
    expect(canUndo3).toEqual(true);
    expect(canUndo4).toEqual(false);
    expect(snapshot4).toEqual({ a: 1 });
  });

  it("Should redo", () => {
    const history = new History(config);
    const canRedo1 = history.canRedo();

    history.update({ a: 1 });
    const canRedo2 = history.canRedo();

    history.update({ a: 2 });
    const canRedo3 = history.canRedo();

    history.undo();
    const canRedo4 = history.canRedo();

    history.redo();
    const canRedo5 = history.canRedo();
    const snapshot5 = history.getCurrentSnapshot();

    history.undo();
    // update in shifted history mode, nullifies all snapshots after it
    // making the current update also the latest one
    history.update({ a: 3 });
    const canRedo6 = history.canRedo();
    const snapshot6 = history.getCurrentSnapshot();

    expect(canRedo1).toEqual(false);
    expect(canRedo2).toEqual(false);
    expect(canRedo3).toEqual(false);
    expect(canRedo4).toEqual(true);
    expect(canRedo5).toEqual(false);
    expect(snapshot5).toEqual({ a: 2 });
    expect(canRedo6).toEqual(false);
    expect(snapshot6).toEqual({ a: 3 });
  });

  it("Should collapse frequent updates", async () => {
    const history = new History({ ...config, collapseFrequency: 10 });
    const wait = (ms: number): Promise<void> =>
      new Promise(res => setTimeout(res, ms));

    history.update({ a: 1 });
    await wait(20);
    history.update({ a: 2 });
    history.update({ a: 3 });
    history.update({ a: 4 });
    await wait(20);
    history.update({ a: 5 });
    history.update({ a: 6 });

    expect(history.getSnapshots()).toEqual([{ a: 1 }, { a: 4 }, { a: 6 }]);
  });

  it("Should allow to replace history", () => {
    const history = new History<{ a: number }>(config);

    history.update({ a: 1 });
    history.update({ a: 2 });
    history.update({ a: 3 });

    history.replaceSnapshots([{ a: 4 }, { a: 5 }, { a: 6 }]);

    expect(history.getSnapshots()).toEqual([{ a: 4 }, { a: 5 }, { a: 6 }]);
    // must replaced snapshots must be of equal sizes (lengths)
    expect(() => {
      history.replaceSnapshots([{ a: 99 }]);
    }).toThrow();
    // must have equal nulls
    expect(() => {
      history.replaceSnapshots([{ a: 99 }, null, null]);
    }).toThrow();
  });
});

describe("testing 'createHistorySnapshot' function", () => {
  it("Should work", () => {
    const snapshot = createHistorySnapshot({ a: 123, b: "abc", c: [], d: {} }, [
      "a",
      "b"
    ]);

    expect(snapshot).toEqual({ a: 123, b: "abc" });
  });
});

describe("testing 'addHistoryDataToState' function", () => {
  it("Should work", () => {
    const history = new History<{ a: number }>({
      maxSize: 3,
      collapseFrequency: -1
    });

    const state1 = { a: 1 };
    history.update(state1);
    const enhanced1 = addHistoryDataToState(state1, history);

    const state2 = { a: 2 };
    history.update(state2);
    const enhanced2 = addHistoryDataToState(state2, history);

    history.undo();
    const enhanced3 = addHistoryDataToState(state2, history);

    expect(enhanced1).toEqual({
      a: 1,
      history: {
        currSnapshot: { a: 1 },
        prevSnapshot: null,
        canUndo: false,
        canRedo: false
      }
    });
    expect(enhanced2).toEqual({
      a: 2,
      history: {
        currSnapshot: { a: 2 },
        prevSnapshot: { a: 1 },
        canUndo: true,
        canRedo: false
      }
    });
    expect(enhanced3).toEqual({
      a: 2,
      history: {
        currSnapshot: { a: 1 },
        prevSnapshot: { a: 2 },
        canUndo: false,
        canRedo: true
      }
    });
  });
});

describe("testing 'isHistoryEnhancedState' function", () => {
  it.each([
    [{}, false],
    [{ a: 1 }, false],
    [{ a: 1, history: "abc" }, false],
    [{ a: 1, history: null }, false],
    [{ a: 1, history: {} }, false],
    [{ a: 1, history: { canUndo: false } }, false],
    [
      {
        a: 1,
        history: {
          currSnapshot: {},
          prevSnapshot: {},
          canUndo: false,
          canRedo: false
        }
      },
      true
    ]
  ])("Should Work", (state, result) => {
    expect(isHistoryEnhancedState(state)).toEqual(result);
  });
});
