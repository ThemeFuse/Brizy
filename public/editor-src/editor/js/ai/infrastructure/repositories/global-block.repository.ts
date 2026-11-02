import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  addBlock,
  deleteGlobalBlock as deleteGlobalBlockAction,
  makeNormalToGlobalBlock
} from "visual/redux/actions2";
import {
  extraFontStylesSelector,
  globalBlocksAssembled2Selector,
  pageSelector
} from "visual/redux/selectors";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type {
  GlobalBlockNormal,
  GlobalBlockPosition
} from "visual/types/GlobalBlock";
import { BlockTypeRule, type CollectionTypeRule } from "visual/types/Rule";
import { isGlobalPopup } from "visual/types/utils";
import {
  createGlobalBlock as createGlobalBlockApi,
  deleteGlobalBlock as deleteGlobalBlockApi
} from "visual/utils/api";
import { getCurrentRule } from "visual/utils/blocks";
import { uuid } from "visual/utils/uuid";
import type {
  GlobalBlockSummary,
  IGlobalBlockRepository,
  SiteBlockPosition
} from "../../application/interfaces/i-global-block-repository";
import { log } from "../../utils/logger";
import { topInsertIndex } from "./utils";
import { parseBackendBlockData } from "./utils/block";

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

    const block = parseBackendBlockData(blockData);
    const uid = uuid(32);
    const state = this.getState();
    const page = pageSelector(state);

    const data: GlobalBlockNormal["data"] = {
      ...block,
      value: { ...block.value, _id: uid },
      ...(block.deleted !== undefined && { deleted: false }),
      editorVersion: this.config.editorVersion
    };

    const gbPosition: GlobalBlockPosition =
      position === "top"
        ? { align: "top", top: positionIndex, bottom: 0 }
        : { align: "bottom", top: 0, bottom: positionIndex };

    const { group, type } = getCurrentRule(page, this.config);
    const allOfType: CollectionTypeRule = {
      type: BlockTypeRule.include,
      appliedFor: group,
      entityType: type
    };

    const globalBlock: GlobalBlockNormal = {
      uid,
      data,
      status: "publish",
      meta: {
        type: "normal",
        extraFontStyles: extraFontStylesSelector(state)
      },
      rules: [allOfType],
      position: gbPosition,
      dataVersion: 0,
      dependencies: []
    };

    const persisted = await createGlobalBlockApi(globalBlock, this.config);

    if (!persisted?.data) {
      throw new Error(
        "The global block was not saved — the server did not return the created block. Nothing was added to the project."
      );
    }

    const current = this.getState();
    const insertIndex =
      position === "top"
        ? topInsertIndex(current.blocksOrder, current.globalBlocks)
        : current.blocksOrder.length;

    this.dispatch(addBlock({ block, fonts: [] }, { insertIndex }));
    this.dispatch(
      makeNormalToGlobalBlock({
        block: globalBlock,
        fromBlockId: block.value._id
      })
    );

    return { uid };
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
