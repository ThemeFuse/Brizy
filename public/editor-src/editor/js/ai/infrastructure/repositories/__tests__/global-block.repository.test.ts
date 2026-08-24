import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { IGlobalBlockRepository } from "../../../application/interfaces/i-global-block-repository";
import { createGlobalBlockRepository } from "../global-block.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

/**
 * These are primitives, not tools: every decision (which menu to bind, whether
 * a header duplicates existing chrome, whether a uid is really a popup) is made
 * in `@brizy/ai-chat` and tested there. What is under test here is only what
 * cannot leave this bundle — the block shape, the REST call, the dispatches.
 */
interface Behaviours {
  /** Return `{}` to simulate a response that carries no created block. */
  globalBlock?: ((extra: unknown) => unknown) | null;
  deleteGlobalBlock?: (uid: string) => string | void;
  globalBlocks?: Record<string, unknown>;
  /** Live edits, keyed by the same uid as `globalBlocks`. */
  blocksData?: Record<string, unknown>;
  blocksOrder?: string[];
}

interface Harness {
  repo: IGlobalBlockRepository;
  dispatch: jest.Mock;
  globalBlockCalls: Record<string, unknown>[];
  deleteCalls: string[];
}

function harness(behaviours: Behaviours = {}): Harness {
  const globalBlockCalls: Record<string, unknown>[] = [];
  const deleteCalls: string[] = [];

  const globalBlockBehaviour =
    behaviours.globalBlock === undefined
      ? (extra: unknown): unknown => extra
      : behaviours.globalBlock;

  const api: Record<string, unknown> = {};

  if (globalBlockBehaviour) {
    api.globalBlocks = {
      create: (
        res: (r: unknown) => void,
        _rej: (e: string) => void,
        extra: unknown
      ): void => {
        globalBlockCalls.push(extra as Record<string, unknown>);
        res(globalBlockBehaviour(extra));
      },
      delete: (
        res: (r: unknown) => void,
        rej: (e: string) => void,
        uid: string
      ): void => {
        deleteCalls.push(uid);
        const error = behaviours.deleteGlobalBlock?.(uid);
        error ? rej(error) : res({});
      }
    };
  }

  const config = {
    editorVersion: "1.0.0",
    api
  } as unknown as ConfigCommon;

  const state = {
    globalBlocks: behaviours.globalBlocks ?? {},
    blocksData: behaviours.blocksData ?? {},
    blocksOrder: behaviours.blocksOrder ?? []
  };
  const dispatch = jest.fn();

  const repo = createGlobalBlockRepository(
    () => state as unknown as ReduxState,
    dispatch as unknown as TypedDispatch,
    config
  );

  return { repo, dispatch, globalBlockCalls, deleteCalls };
}

const stateGlobalBlock = (
  overrides: {
    type?: "normal" | "popup";
    deleted?: boolean;
    align?: "top" | "bottom";
  } = {}
): Record<string, unknown> => ({
  data: {
    type: "SectionHeader",
    value: { _id: "gb" },
    ...(overrides.deleted === true && { deleted: true })
  },
  meta: { type: overrides.type ?? "normal", extraFontStyles: [] },
  position: { align: overrides.align ?? "top", top: 0, bottom: 0 }
});

const headerBlock = (): Record<string, unknown> => ({
  type: "SectionHeader",
  value: { _id: "header-1", items: [{ type: "Text", value: { text: "hi" } }] }
});

describe("GlobalBlockRepository.isSupported", () => {
  it("is true when the platform provides the delete handler", () => {
    expect(harness().repo.isSupported()).toBe(true);
  });

  it("is false without it", () => {
    expect(harness({ globalBlock: null }).repo.isSupported()).toBe(false);
  });
});

describe("GlobalBlockRepository.list", () => {
  // The chat package decides what to do about popups and soft-deleted entries,
  // so both have to survive the flattening rather than be filtered out here.
  it("flattens every entry, popups and soft-deleted included", () => {
    const { repo } = harness({
      globalBlocks: {
        "gb-1": stateGlobalBlock(),
        "gb-2": stateGlobalBlock({ align: "bottom" }),
        "popup-1": stateGlobalBlock({ type: "popup" }),
        "gone-1": stateGlobalBlock({ deleted: true })
      }
    });

    expect(repo.list()).toEqual([
      { uid: "gb-1", align: "top", isPopup: false, deleted: false },
      { uid: "gb-2", align: "bottom", isPopup: false, deleted: false },
      { uid: "popup-1", align: "top", isPopup: true, deleted: false },
      { uid: "gone-1", align: "top", isPopup: false, deleted: true }
    ]);
  });

  it("is empty on a project with no global blocks", () => {
    expect(harness().repo.list()).toEqual([]);
  });

  // `state.globalBlocks` holds the PUBLISHED snapshot; a block's live edits are
  // kept under the same uid in `blocksData`. Reading the raw map would report
  // this block as deleted on the strength of a snapshot the session has already
  // moved past.
  it("reports the live edit, not the published snapshot", () => {
    const { repo } = harness({
      globalBlocks: { "gb-1": stateGlobalBlock({ deleted: true }) },
      blocksData: { "gb-1": { type: "SectionHeader", value: { _id: "gb-1" } } }
    });

    expect(repo.list()).toEqual([
      { uid: "gb-1", align: "top", isPopup: false, deleted: false }
    ]);
  });
});

describe("GlobalBlockRepository.create", () => {
  it("persists, then inserts the block and converts it in place", async () => {
    const { repo, dispatch } = harness();

    const result = await repo.create(headerBlock(), "top", 0);

    expect(result.uid).toBe("header-1");
    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      "ADD_BLOCK",
      "MAKE_BLOCK_TO_GLOBAL_BLOCK"
    ]);
  });

  it("sends a rule the API serialiser understands", async () => {
    // Regression: an "all pages" rule that spells out appliedFor/entityType/
    // entityValues matches no branch of `editorRuleToApiRule`, so it is sent as
    // `rules=[null]` and the backend rejects the block with a 400.
    const { repo, globalBlockCalls } = harness();

    await repo.create(headerBlock(), "top", 0);

    expect(globalBlockCalls[0].rules).toEqual([
      { type: 1, appliedFor: null, entityType: "", entityValues: [] }
    ]);
  });

  // positionIndex is the caller's to choose; it lands on the align it belongs
  // to and leaves the other at 0.
  it.each([
    ["top", 2, { align: "top", top: 2, bottom: 0 }],
    ["bottom", 1, { align: "bottom", top: 0, bottom: 1 }]
  ])("anchors a %s block at index %i", async (position, index, expected) => {
    const { repo, globalBlockCalls } = harness();

    await repo.create(
      headerBlock(),
      position as "top" | "bottom",
      index as number
    );

    expect(globalBlockCalls[0].position).toEqual(expected);
  });

  it("throws and changes nothing when the server returns no block", async () => {
    const { repo, dispatch } = harness({ globalBlock: () => ({}) });

    await expect(repo.create(headerBlock(), "top", 0)).rejects.toThrow(
      "was not saved"
    );
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe("GlobalBlockRepository.delete", () => {
  it("deletes from the backend and from the session", async () => {
    const { repo, dispatch, deleteCalls } = harness();

    await repo.delete("gb-1");

    expect(deleteCalls).toEqual(["gb-1"]);
    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      "DELETE_GLOBAL_BLOCK"
    ]);
  });

  // The caller counts an already-gone entity as deleted, so a rejection has to
  // reach it rather than being swallowed here.
  it("rejects without dispatching when the backend refuses", async () => {
    const { repo, dispatch } = harness({
      deleteGlobalBlock: () => "nope"
    });

    await expect(repo.delete("gb-1")).rejects.toBeTruthy();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
