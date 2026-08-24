import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  addBlock,
  deleteGlobalBlock as deleteGlobalBlockAction,
  makeNormalToGlobalBlock
} from "visual/redux/actions2";
import { globalBlocksAssembled2Selector } from "visual/redux/selectors";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import type {
  GlobalBlockNormal,
  GlobalBlockPosition
} from "visual/types/GlobalBlock";
import { BlockTypeRule, type Rule } from "visual/types/Rule";
import { isGlobalPopup } from "visual/types/utils";
import {
  createGlobalBlock as createGlobalBlockApi,
  deleteGlobalBlock as deleteGlobalBlockApi
} from "visual/utils/api";
import { uuid } from "visual/utils/uuid";
import type {
  GlobalBlockSummary,
  IGlobalBlockRepository,
  SiteBlockPosition
} from "../../application/interfaces/i-global-block-repository";
import { log } from "../../utils/logger";
import { topInsertIndex } from "./utils";

/**
 * Rule matching every page.
 *
 * Must carry ONLY `type`: `isAllRule` identifies an "all pages" rule by the
 * ABSENCE of `appliedFor` / `entityType` / `entityValues` (see
 * `utils/blocks/guards.ts`). Spelling those keys out here makes the rule match
 * no branch of `editorRuleToApiRule`, which then serialises it as `null` and the
 * backend rejects the whole block with a 400. `stringifyGlobalBlock` expands
 * this into the `{type, appliedFor: null, entityType: "", entityValues: []}`
 * shape the API expects.
 */
const ALL_PAGES_RULE: Rule = { type: BlockTypeRule.include };

/**
 * The Redux and REST half of global blocks.
 *
 * Deliberately decision-free: which block to create, which menu it should
 * carry and whether any of it is a duplicate are all judged in `@brizy/ai-chat`,
 * which owns the tools. This only does what cannot leave the editor bundle.
 */
class GlobalBlockRepository implements IGlobalBlockRepository {
  constructor(
    private readonly getState: () => ReduxState,
    private readonly dispatch: TypedDispatch,
    private readonly config: ConfigCommon
  ) {}

  isSupported(): boolean {
    return Boolean(this.config.api?.globalBlocks?.delete);
  }

  list(): GlobalBlockSummary[] {
    return Object.entries(globalBlocksAssembled2Selector(this.getState())).map(
      ([uid, globalBlock]): GlobalBlockSummary => ({
        uid,
        align: globalBlock.position?.align ?? null,
        isPopup: isGlobalPopup(globalBlock),
        deleted: globalBlock.data.deleted === true
      })
    );
  }

  async create(
    blockData: Record<string, unknown>,
    position: SiteBlockPosition,
    positionIndex: number
  ): Promise<{ uid: string }> {
    log.repository(
      "createGlobalBlock position=%s positionIndex=%d",
      position,
      positionIndex
    );

    // Build the GlobalBlockNormal, mirroring the "make it global" UI flow.
    const value = (blockData.value ?? {}) as Record<string, unknown>;
    const _id = typeof value._id === "string" && value._id ? value._id : uuid();

    const data = {
      ...blockData,
      value: { ...value, _id },
      editorVersion: this.config.editorVersion
    } as unknown as GlobalBlockNormal["data"];

    const gbPosition: GlobalBlockPosition =
      position === "top"
        ? { align: "top", top: positionIndex, bottom: 0 }
        : { align: "bottom", top: 0, bottom: positionIndex };

    const globalBlock: GlobalBlockNormal = {
      uid: _id,
      data,
      status: "publish",
      meta: { type: "normal", extraFontStyles: [] },
      rules: [ALL_PAGES_RULE],
      position: gbPosition,
      dataVersion: 0,
      dependencies: []
    };

    // Persist first — the config handler may be absent on non-CMS platforms.
    // The underlying request resolves for any non-5xx response, so a rejected
    // call can still land here carrying an error body instead of a block.
    // Check the same signal the convert-to-global UI flow checks before
    // treating it as saved.
    const persisted = await createGlobalBlockApi(globalBlock, this.config);

    if (!persisted?.data) {
      throw new Error(
        "The global block was not saved — the server did not return the created block. Nothing was added to the project."
      );
    }

    // Live sync in the current session, same as the "make it global" UI flow.
    // Not `addGlobalBlock`: it only re-rules a global block the project already
    // has, so a freshly created one appears only after a reload.
    const state = this.getState();
    const insertIndex =
      position === "top"
        ? topInsertIndex(state.blocksOrder, state.globalBlocks)
        : state.blocksOrder.length;

    this.dispatch(
      addBlock({ block: data as Block, fonts: [] }, { insertIndex })
    );
    this.dispatch(
      makeNormalToGlobalBlock({ block: globalBlock, fromBlockId: _id })
    );

    return { uid: _id };
  }

  async delete(uid: string): Promise<void> {
    log.repository("deleteGlobalBlock uid=%s", uid);

    await deleteGlobalBlockApi(uid, this.config);

    this.dispatch(deleteGlobalBlockAction({ id: uid }));
  }
}

/**
 * Create the global block repository.
 */
export function createGlobalBlockRepository(
  getState: () => ReduxState,
  dispatch: TypedDispatch,
  config: ConfigCommon
): IGlobalBlockRepository {
  return new GlobalBlockRepository(getState, dispatch, config);
}
