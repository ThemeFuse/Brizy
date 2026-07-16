import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import { PageRepository } from "../page.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

type HistoryFlags = { canUndo: boolean; canRedo: boolean };

/**
 * Build a getState stub that returns a state carrying the given history flags.
 * `states` are returned in order across successive calls (undo reads twice:
 * once before dispatch, once after).
 */
function makeGetState(states: HistoryFlags[]): () => ReduxState {
  let i = 0;
  return () => {
    const flags = states[Math.min(i, states.length - 1)];
    i++;
    return { history: flags } as unknown as ReduxState;
  };
}

const config = {} as ConfigCommon;

describe("PageRepository.undo", () => {
  it("dispatches UNDO and reports the post-undo history flags", () => {
    const dispatch = jest.fn();
    const getState = makeGetState([
      { canUndo: true, canRedo: false }, // before
      { canUndo: false, canRedo: true } // after
    ]);

    const repo = new PageRepository(getState, dispatch, config);
    const result = repo.undo();

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: "UNDO" });
    expect(result).toEqual({
      success: true,
      data: { reverted: true, canUndo: false }
    });
  });

  it("is a no-op when there is nothing to undo", () => {
    const dispatch = jest.fn();
    const getState = makeGetState([{ canUndo: false, canRedo: false }]);

    const repo = new PageRepository(getState, dispatch, config);
    const result = repo.undo();

    expect(dispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: { reverted: false, canUndo: false }
    });
  });
});
