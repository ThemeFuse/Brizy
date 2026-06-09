import { MValue } from "@brizy/readers/dist/value";
import { getIn, setIn } from "timm";
import { ElementModelType2 } from "visual/component/Elements/Types";
import { TypeId } from "visual/config/icons/Type";
import { getTypeIcons } from "visual/config/icons/icons";
import changeValueAfterDND from "visual/editorComponents/Page/utils/changeValueAfterDND";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  addBlock as addBlockAction,
  removeBlock as removeBlockAction,
  removeBlocks as removeBlocksAction,
  reorderBlocks,
  updateBlockData
} from "visual/redux/actions2";
import type { Store, TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { Block } from "visual/types/Block";
import { isPro } from "visual/utils/env";
import { findDeep } from "visual/utils/object";
import type {
  AddBlockParams,
  AddElementParams,
  DuplicateElementParams,
  GetAvailableIconsParams,
  IPageRepository,
  InsertTemplateParams,
  MoveElementParams,
  RemoveElementParams,
  SearchElementsParams,
  UpdateElementParams,
  UpdateRichTextParams
} from "../../application/interfaces/i-page-repository";
import type {
  AddBlockResult,
  AddElementResult,
  BlockSummary,
  BrizyToolResult,
  DuplicateElementResult,
  ElementDetails,
  GetAvailableIconsResult,
  IconInfo,
  MoveElementResult,
  PageStructure,
  RemoveBlockResult,
  RemoveElementResult,
  SearchElementsResult,
  UpdateElementResult
} from "../../entities/models";
import { log } from "../../utils/logger";
import {
  type InternalSearchResult,
  applyFuzzySearch,
  applyRichTextUpdates,
  buildAddableFromTo,
  buildElementSummary,
  buildMoveFromTo,
  cloneBlockWithNewIds,
  collectElements,
  correctContainerForElement,
  createDefaultBlock,
  createDefaultElement,
  duplicateElementInBlock,
  getNestedValue,
  mapToDndContainerType,
  parseBackendBlockData,
  removeElementFromBlock,
  toSearchResults,
  updateColumnInRow
} from "./utils";

/**
 * Page repository implementation using Redux
 */
export class PageRepository implements IPageRepository {
  constructor(
    private readonly getState: () => ReduxState,
    private readonly dispatch: TypedDispatch,
    private readonly config: ConfigCommon
  ) {}

  isPro(): boolean {
    return isPro(this.config);
  }

  getPageStructure(depth = 3): PageStructure {
    log.repository("getPageStructure depth=%d", depth);
    const state = this.getState();
    const { blocksOrder, blocksData } = state;

    const blocks: BlockSummary[] = blocksOrder.map((blockId) => {
      const block = blocksData[blockId];
      return {
        id: blockId,
        type: block?.type || "Unknown",
        children: buildElementSummary(block?.value?.items, 0, depth)
      };
    });

    return { blocksOrder, blocks };
  }

  addBlock(params: AddBlockParams): BrizyToolResult<AddBlockResult> {
    log.repository("addBlock params=%o", params);
    try {
      const state = this.getState();
      const { blocksOrder } = state;

      const index = params.insertIndex ?? blocksOrder.length;
      const clampedIndex = Math.max(0, Math.min(index, blocksOrder.length));

      // Use backend-provided block data or create default
      const block = params.blockData
        ? parseBackendBlockData(params.blockData)
        : createDefaultBlock(params);

      this.dispatch(
        addBlockAction({ block, fonts: [] }, { insertIndex: clampedIndex })
      );

      return {
        success: true,
        data: {
          blockId: block.value._id,
          insertedAt: clampedIndex
        },
        undoAction: {
          type: "REMOVE_BLOCK",
          payload: { index: clampedIndex, id: block.value._id }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  removeBlock(params: {
    blockId?: string;
    blockIndex?: number;
  }): BrizyToolResult<RemoveBlockResult> {
    log.repository("removeBlock params=%o", params);
    try {
      const state = this.getState();
      const { blocksOrder, blocksData } = state;

      let index: number;
      let blockId: string;

      if (params.blockId) {
        index = blocksOrder.indexOf(params.blockId);
        if (index === -1) {
          return {
            success: false,
            error: `Block with ID "${params.blockId}" not found`
          };
        }
        blockId = params.blockId;
      } else if (params.blockIndex !== undefined) {
        index = params.blockIndex;
        if (index < 0 || index >= blocksOrder.length) {
          return { success: false, error: `Invalid block index: ${index}` };
        }
        blockId = blocksOrder[index];
      } else {
        return {
          success: false,
          error: "Either blockId or blockIndex must be provided"
        };
      }

      const removedBlock = blocksData[blockId];

      this.dispatch(
        removeBlockAction({ index, id: blockId, config: this.config })
      );

      return {
        success: true,
        data: { removedBlockId: blockId, removedAt: index },
        undoAction: {
          type: "ADD_BLOCK",
          payload: { block: removedBlock, insertIndex: index }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  moveBlock(params: {
    blockId?: string;
    fromIndex?: number;
    toIndex: number;
  }): BrizyToolResult<{
    blockId: string;
    previousIndex: number;
    newIndex: number;
  }> {
    log.repository("moveBlock params=%o", params);
    try {
      const state = this.getState();
      const { blocksOrder } = state;

      let fromIndex: number;
      let blockId: string;

      if (params.blockId) {
        fromIndex = blocksOrder.indexOf(params.blockId);
        if (fromIndex === -1) {
          return {
            success: false,
            error: `Block with ID "${params.blockId}" not found`
          };
        }
        blockId = params.blockId;
      } else if (params.fromIndex !== undefined) {
        fromIndex = params.fromIndex;
        if (fromIndex < 0 || fromIndex >= blocksOrder.length) {
          return { success: false, error: `Invalid from index: ${fromIndex}` };
        }
        blockId = blocksOrder[fromIndex];
      } else {
        return {
          success: false,
          error: "Either blockId or fromIndex must be provided"
        };
      }

      const { toIndex } = params;
      if (toIndex < 0 || toIndex >= blocksOrder.length) {
        return { success: false, error: `Invalid to index: ${toIndex}` };
      }

      if (fromIndex !== toIndex) {
        this.dispatch(
          reorderBlocks({
            oldIndex: fromIndex,
            newIndex: toIndex,
            config: this.config
          })
        );
      }

      return {
        success: true,
        data: { blockId, previousIndex: fromIndex, newIndex: toIndex },
        undoAction: {
          type: "REORDER_BLOCKS",
          payload: { oldIndex: toIndex, newIndex: fromIndex }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  duplicateBlock(params: {
    blockId?: string;
    blockIndex?: number;
    insertAfter?: boolean;
  }): BrizyToolResult<{
    originalBlockId: string;
    newBlockId: string;
    insertedAt: number;
  }> {
    log.repository("duplicateBlock params=%o", params);
    try {
      const state = this.getState();
      const { blocksOrder, blocksData } = state;

      let index: number;
      let blockId: string;

      if (params.blockId) {
        index = blocksOrder.indexOf(params.blockId);
        if (index === -1) {
          return {
            success: false,
            error: `Block with ID "${params.blockId}" not found`
          };
        }
        blockId = params.blockId;
      } else if (params.blockIndex !== undefined) {
        index = params.blockIndex;
        if (index < 0 || index >= blocksOrder.length) {
          return { success: false, error: `Invalid block index: ${index}` };
        }
        blockId = blocksOrder[index];
      } else {
        return {
          success: false,
          error: "Either blockId or blockIndex must be provided"
        };
      }

      const originalBlock = blocksData[blockId];
      if (!originalBlock) {
        return {
          success: false,
          error: `Block data not found for ID: ${blockId}`
        };
      }

      const clonedBlock = cloneBlockWithNewIds(originalBlock);
      const insertIndex = params.insertAfter !== false ? index + 1 : index;

      this.dispatch(
        addBlockAction({ block: clonedBlock, fonts: [] }, { insertIndex })
      );

      return {
        success: true,
        data: {
          originalBlockId: blockId,
          newBlockId: clonedBlock.value._id,
          insertedAt: insertIndex
        },
        undoAction: {
          type: "REMOVE_BLOCK",
          payload: { index: insertIndex, id: clonedBlock.value._id }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  clearPage(): BrizyToolResult<{ removedCount: number }> {
    log.repository("clearPage");
    try {
      const state = this.getState();
      const { blocksOrder } = state;

      if (blocksOrder.length === 0) {
        return { success: true, data: { removedCount: 0 } };
      }

      this.dispatch(removeBlocksAction({ config: this.config }));

      return { success: true, data: { removedCount: blocksOrder.length } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  insertTemplate(_params: InsertTemplateParams): BrizyToolResult<{
    blockId: string;
    insertedAt: number;
  }> {
    log.repository("insertTemplate params=%o", _params);
    // Stub implementation
    return {
      success: false,
      error:
        "Template insertion not implemented yet. Use addBlock to create new sections."
    };
  }

  getElementById(elementId: string): BrizyToolResult<ElementDetails> {
    log.repository("getElementById elementId=%s", elementId);
    try {
      const state = this.getState();
      const { blocksData } = state;

      // Search within the block
      const { obj: found, path } = findDeep(
        blocksData,
        ({ value }: Block) => value?._id === elementId
      );

      if (found) {
        // Find parent info — path is relative to blocksData
        const parentPath = path.slice(0, -3); // Remove last 3 elements (value, items, index)
        const parent =
          parentPath.length > 0
            ? (getIn(blocksData, parentPath) as ElementModelType2 | undefined)
            : undefined;

        log.repository("getElementById parent=%s", parent);

        return {
          success: true,
          data: {
            id: elementId,
            type: found.type,
            path: path,
            value: found.value as Record<string, unknown>,
            parentId: parent?.value?._id,
            parentType: parent?.type
          }
        };
      }

      return {
        success: false,
        error: `Element with ID "${elementId}" not found`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  searchElements(
    params: SearchElementsParams
  ): BrizyToolResult<SearchElementsResult> {
    log.repository("searchElements params=%o", params);
    try {
      const state = this.getState();
      const { blocksOrder, blocksData } = state;
      const limit = params.limit ?? 20;

      // If blockId is specified, search only within that block
      const blocksToSearch = params.blockId
        ? [params.blockId].filter((id) => blocksData[id])
        : blocksOrder;

      // Step 1: Collect all candidates from all blocks (applies type + regex filters)
      const candidates: InternalSearchResult[] = [];
      for (const blockId of blocksToSearch) {
        const block = blocksData[blockId];
        if (!block) continue;

        collectElements(block, [blockId], params, candidates);
      }

      // Step 2: Apply fuzzy search if containsText is provided
      const filtered = params.containsText
        ? applyFuzzySearch(candidates, params.containsText)
        : candidates;

      // Step 3: Convert to public results with limit
      const results = toSearchResults(filtered, limit);

      return {
        success: true,
        data: {
          elements: results,
          totalFound: filtered.length,
          searchedBlocks: blocksToSearch.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  addElement(params: AddElementParams): BrizyToolResult<AddElementResult> {
    log.repository("addElement params=%o", params);
    try {
      const state = this.getState();
      const { blocksData } = state;
      const { containerId, elementType } = params;

      // Find the container element
      const { obj: foundContainer, path: foundPath } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === containerId
      );

      if (!foundContainer) {
        return {
          success: false,
          error: `Container with ID "${params.containerId}" not found`
        };
      }

      // Correct and validate container for the element type
      // Handles: Section→SectionItem/Column, Cloneable rules, Wrapper nesting
      const correctionResult = correctContainerForElement(
        foundContainer,
        foundPath,
        elementType
      );

      if (!correctionResult.success) {
        return {
          success: false,
          error: correctionResult.error
        };
      }

      const { container, path: containerPath } = correctionResult;
      const containerType = container.type;

      // Create the new element with optional initial properties
      const newElement = createDefaultElement(
        elementType,
        containerType,
        this.config,
        params.initialProperties
      );
      if (!newElement) {
        return {
          success: false,
          error: `Unknown element type: ${elementType}`
        };
      }

      log.repository("addElement element %o", newElement);

      // Get the current items array from the container
      const items = container.value?.items || [];
      const insertIndex = params.insertIndex ?? items.length;
      const clampedIndex = Math.max(0, Math.min(insertIndex, items.length));

      // Map element type to DND container type
      const dndContainerType = mapToDndContainerType(containerType);

      // excluded 1 item from container exlucded blockId
      const [blockId, ...path] = containerPath;

      // Build the item path for insertion
      const itemsPath =
        containerPath.length > 0
          ? [...path, "value", "items", `${clampedIndex}`]
          : ["value", "items", `${clampedIndex}`];

      // Construct FromTo for addable element
      const fromTo = buildAddableFromTo(
        newElement,
        dndContainerType,
        itemsPath,
        path
      );

      // Create store interface for changeValueAfterDND
      const store: Store = {
        getState: this.getState,
        dispatch: this.dispatch
      } as Store;

      // Apply the change using changeValueAfterDND
      const updatedBlock = changeValueAfterDND(
        blocksData[blockId],
        fromTo,
        store,
        this.config
      );

      log.repository("addElement updatedBlock %o", updatedBlock);

      // Dispatch update action
      this.dispatch(
        updateBlockData({
          blockId,
          data: updatedBlock as Block
        })
      );

      const elementId = newElement.value._id as string;
      // When is simple element like Text, Image, elementId is wrapper
      const childElementId = getIn(newElement, [
        "value",
        "items",
        0,
        "value",
        "_id"
      ]) as MValue<string>;

      return {
        success: true,
        data: {
          elementId,
          childElementId,
          containerId: params.containerId,
          insertedAt: clampedIndex
        },
        undoAction: {
          type: "REMOVE_ELEMENT",
          payload: {
            elementId,
            containerId: params.containerId
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  removeElement(
    params: RemoveElementParams
  ): BrizyToolResult<RemoveElementResult> {
    log.repository("removeElement params=%o", params);
    try {
      const state = this.getState();
      const { blocksData } = state;
      const { elementId } = params;

      const { obj, path } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === elementId
      );

      if (!obj) {
        return {
          success: false,
          error: `Element with ID "${elementId}" not found`
        };
      }

      // Get block ID from the path (first element is the block ID key in blocksData)
      const blockId = path[0];
      const block = blocksData[blockId];

      // Get relative path within the block (remove blockId prefix)
      const relativePath = path.slice(1);

      // Remove element and clean up empty wrappers
      const result = removeElementFromBlock(block, relativePath, elementId);

      if (!result) {
        return {
          success: false,
          error: "Failed to remove element"
        };
      }

      if (!result.success) {
        return { success: false, error: result.error };
      }

      const { updatedBlock, removedElementId, finalPath } = result;

      log.repository("removeElement updatedBlock %o", updatedBlock);

      // Dispatch update action
      this.dispatch(
        updateBlockData({
          blockId,
          data: updatedBlock
        })
      );

      const removedAt = parseInt(finalPath[finalPath.length - 1]) || 0;

      // Resolve the actual immediate parent container ID from finalPath
      // finalPath follows the pattern: ...parentSegments / "value" / "items" / index
      const parentRelativePath = finalPath.slice(0, -3);
      let containerId: string;

      if (parentRelativePath.length > 0) {
        const parent = getNestedValue<ElementModelType2>(
          block,
          parentRelativePath
        );
        containerId = (parent?.value?._id ?? block.value._id) as string;
      } else {
        containerId = block.value._id as string;
      }

      return {
        success: true,
        data: {
          elementId: removedElementId,
          containerId,
          removedAt
        },
        undoAction: {
          type: "ADD_ELEMENT",
          payload: {
            elementId: removedElementId,
            containerId,
            insertIndex: removedAt
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  duplicateElement(
    params: DuplicateElementParams
  ): BrizyToolResult<DuplicateElementResult> {
    log.repository("duplicateElement params=%o", params);
    try {
      const state = this.getState();
      const { blocksData } = state;
      const { elementId, insertAfter = true } = params;

      const { obj, path } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === elementId
      );

      if (!obj) {
        return {
          success: false,
          error: `Element with ID "${elementId}" not found`
        };
      }

      // Get block ID from the path (first element is the block ID key in blocksData)
      const blockId = path[0];
      const block = blocksData[blockId];

      // Get relative path within the block (remove blockId prefix)
      const relativePath = path.slice(1);

      // Duplicate the element within the block
      const result = duplicateElementInBlock(
        block,
        relativePath,
        obj.type,
        insertAfter
      );

      if (!result) {
        return {
          success: false,
          error: "Failed to duplicate element"
        };
      }

      const { updatedBlock, newElementId, containerId, insertedAt } = result;

      log.repository("duplicateElement updatedBlock %o", updatedBlock);

      // Dispatch update action
      this.dispatch(
        updateBlockData({
          blockId,
          data: updatedBlock
        })
      );

      return {
        success: true,
        data: {
          elementId: newElementId,
          containerId: containerId || blockId,
          duplicatedAt: insertedAt
        },
        undoAction: {
          type: "REMOVE_ELEMENT",
          payload: {
            elementId: newElementId,
            containerId: containerId || blockId
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  moveElement(params: MoveElementParams): BrizyToolResult<MoveElementResult> {
    log.repository("moveElement params=%o", params);
    try {
      const state = this.getState();
      const { blocksData } = state;
      const { elementId, targetContainerId } = params;

      // 1. Find the source element
      const { obj: sourceObj, path: sourcePath } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === elementId
      );

      if (!sourceObj) {
        return {
          success: false,
          error: `Element with ID "${elementId}" not found`
        };
      }

      const sourceBlockId = sourcePath[0];
      const sourceBlock = blocksData[sourceBlockId];
      const sourceRelativePath = sourcePath.slice(1);

      // 2. Find the target container
      const { obj: targetContainer, path: targetPath } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === targetContainerId
      );

      if (!targetContainer) {
        return {
          success: false,
          error: `Target container with ID "${targetContainerId}" not found`
        };
      }

      const targetBlockId = targetPath[0];

      // 3. Validate and correct the target container
      const correctionResult = correctContainerForElement(
        targetContainer,
        targetPath,
        sourceObj.type
      );

      if (!correctionResult.success) {
        return {
          success: false,
          error: correctionResult.error
        };
      }

      const { container: correctedContainer } = correctionResult;

      // 4. Calculate target index
      const targetItems = correctedContainer.value?.items || [];
      const targetIndex = params.targetIndex ?? targetItems.length;
      const clampedIndex = Math.max(
        0,
        Math.min(targetIndex, targetItems.length)
      );

      // 5. Build UID-based FromTo (same logic for same-block and cross-block)
      const fromTo = buildMoveFromTo(
        sourceBlock,
        sourceObj,
        sourceRelativePath,
        correctedContainer,
        clampedIndex
      );

      log.repository("moveElement fromTo %o", fromTo);

      const store: Store = {
        getState: this.getState,
        dispatch: this.dispatch
      } as Store;

      if (sourceBlockId === targetBlockId) {
        // Same-block: pass single block to changeValueAfterDND
        const updatedBlock = changeValueAfterDND(
          sourceBlock,
          fromTo,
          store,
          this.config
        );

        this.dispatch(
          updateBlockData({
            blockId: sourceBlockId,
            data: updatedBlock as Block
          })
        );
      } else {
        // Cross-block: combine both blocks into a page-like structure
        // so normalizeFromTo can resolve UIDs across both blocks
        const targetBlock = blocksData[targetBlockId];
        const combinedValue = {
          type: "Page",
          value: {
            _id: "temp-move-page",
            items: [sourceBlock, targetBlock]
          }
        };

        const updatedCombined = changeValueAfterDND(
          combinedValue,
          fromTo,
          store,
          this.config
        );

        // Extract updated blocks from the combined result
        const updatedItems =
          (updatedCombined as ElementModelType2).value?.items || [];

        this.dispatch(
          updateBlockData({
            blockId: sourceBlockId,
            data: updatedItems[0] as Block
          })
        );
        this.dispatch(
          updateBlockData({
            blockId: targetBlockId,
            data: updatedItems[1] as Block
          })
        );
      }

      const fromContainerId = correctedContainer.value._id || "";

      return {
        success: true,
        data: {
          elementId,
          fromContainerId,
          toContainerId: targetContainerId,
          movedTo: clampedIndex
        },
        undoAction: {
          type: "MOVE_ELEMENT",
          payload: {
            elementId,
            targetContainerId: fromContainerId
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  updateElement(
    params: UpdateElementParams
  ): BrizyToolResult<UpdateElementResult> {
    log.repository("updateElement params=%o", params);
    try {
      const state = this.getState();
      const { blocksData } = state;
      const { elementId, elementType, changes } = params;

      // Find the element
      const { obj, path } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === elementId
      );

      if (!obj) {
        return {
          success: false,
          error: `Element with ID "${elementId}" not found`
        };
      }

      // Validate element type matches
      if (obj.type !== elementType) {
        return {
          success: false,
          error: `Element "${elementId}" is of type "${obj.type}", not "${elementType}". Use the correct update tool for this element type.`
        };
      }

      // Get block ID from the path
      const blockId = path[0];
      const block = blocksData[blockId];

      // Get the path to the element's value within the block
      const relativePath = path.slice(1);

      // Merge changes with existing element value
      const updatedValue = {
        ...obj.value,
        ...changes
      };

      // Create updated element
      const updatedElement = {
        ...obj,
        value: updatedValue
      };

      const updatedBlock = setIn(block, relativePath, updatedElement);

      // Dispatch update action
      this.dispatch(
        updateBlockData({
          blockId,
          data: updatedBlock as Block
        })
      );

      return {
        success: true,
        data: {
          elementId,
          elementType: obj.type,
          previousValues: obj.value
        },
        undoAction: {
          type: "UPDATE_ELEMENT",
          payload: {
            elementId,
            changes: obj.value
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  updateColumn(
    params: UpdateElementParams
  ): BrizyToolResult<UpdateElementResult> {
    log.repository("updateColumn params=%o", params);
    try {
      const state = this.getState();
      const { blocksData } = state;
      const { elementId, elementType, changes } = params;

      // Find the column element
      const { obj, path } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === elementId
      );

      if (!obj) {
        return {
          success: false,
          error: `Element with ID "${elementId}" not found`
        };
      }

      // Validate element type matches
      if (obj.type !== elementType) {
        return {
          success: false,
          error: `Element "${elementId}" is of type "${obj.type}", not "${elementType}". Use the correct update tool for this element type.`
        };
      }

      // Get block ID and relative path within the block
      const blockId = path[0];
      const block = blocksData[blockId];
      const relativePath = path.slice(1);

      // Update column and redistribute sibling widths if width changed
      const result = updateColumnInRow(block, relativePath, obj, changes);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Dispatch update action
      this.dispatch(
        updateBlockData({
          blockId,
          data: result.updatedBlock
        })
      );

      return {
        success: true,
        data: {
          elementId,
          elementType: obj.type,
          previousValues: obj.value
        },
        undoAction: {
          type: "UPDATE_ELEMENT",
          payload: {
            elementId,
            changes: obj.value
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  updateRichText(
    params: UpdateRichTextParams
  ): BrizyToolResult<UpdateElementResult> {
    log.repository("updateRichText params=%o", params);
    try {
      const state = this.getState();
      const { blocksData } = state;
      const { elementId, ...properties } = params;

      // Note: HTML validation is done at the handler layer via Zod schema

      // Find the element
      const { obj, path } = findDeep(
        blocksData,
        ({ value }: ElementModelType2) => value?._id === elementId
      );

      if (!obj) {
        return {
          success: false,
          error: `Element with ID "${elementId}" not found`
        };
      }

      // Verify it's a RichText element
      if (obj.type !== "RichText") {
        return {
          success: false,
          error: `Element "${elementId}" is not a RichText element (found: ${obj.type})`
        };
      }

      // Get block ID from the path
      const blockId = path[0];
      const block = blocksData[blockId];
      const relativePath = path.slice(1);

      // Get current HTML content
      const currentHtml = obj.value?.text || "";

      // Apply updates to the HTML
      const updatedHtml = applyRichTextUpdates(currentHtml, properties);

      // Create updated element value
      const updatedValue: Record<string, unknown> = {
        ...obj.value,
        text: updatedHtml
      };

      // Merge font family properties into element value (not HTML)
      if (properties.fontFamily !== undefined) {
        updatedValue.fontFamily = properties.fontFamily;
      }
      if (properties.fontFamilyType !== undefined) {
        updatedValue.fontFamilyType = properties.fontFamilyType;
      }

      // Create updated element
      const updatedElement = {
        ...obj,
        value: updatedValue
      };

      const updatedBlock = setIn(block, relativePath, updatedElement);

      // Dispatch update action
      this.dispatch(
        updateBlockData({
          blockId,
          data: updatedBlock as Block
        })
      );

      return {
        success: true,
        data: {
          elementId,
          elementType: obj.type,
          previousValues: { text: currentHtml }
        },
        undoAction: {
          type: "UPDATE_RICHTEXT",
          payload: {
            elementId,
            text: currentHtml
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async getAvailableIcons(
    params: GetAvailableIconsParams
  ): Promise<BrizyToolResult<GetAvailableIconsResult>> {
    log.repository("getAvailableIcons params=%o", params);
    try {
      const { iconType, search, limit = 50 } = params;

      // Map string type to TypeId enum
      const typeMap: Record<string, TypeId> = {
        outline: TypeId.Outline,
        glyph: TypeId.Glyph,
        fa: TypeId.Fa
      };

      // Determine which icon types to load
      const typesToLoad = iconType
        ? [typeMap[iconType]]
        : [TypeId.Outline, TypeId.Glyph, TypeId.Fa];

      // Load icons from all requested types
      const iconPromises = typesToLoad.map((type) =>
        getTypeIcons(type, this.config)
      );
      const iconArrays = await Promise.all(iconPromises);

      // Flatten and transform to IconInfo format
      const typeIdToName: Record<number, string> = {
        [TypeId.Outline]: "outline",
        [TypeId.Glyph]: "glyph",
        [TypeId.Fa]: "fa"
      };
      let allIcons: IconInfo[] = [];

      iconArrays.forEach((icons, index) => {
        const typeName = typeIdToName[typesToLoad[index]];
        const transformed = icons.map((icon) => ({
          name: icon.name,
          title: "title" in icon ? icon.title : icon.name,
          type: typeName
        }));
        allIcons = allIcons.concat(transformed);
      });

      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        allIcons = allIcons.filter(
          (icon) =>
            icon.name.toLowerCase().includes(searchLower) ||
            icon.title.toLowerCase().includes(searchLower)
        );
      }

      const totalCount = allIcons.length;

      // Apply limit
      const limitedIcons = allIcons.slice(0, limit);

      return {
        success: true,
        data: {
          icons: limitedIcons,
          totalCount
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

/**
 * Create page repository
 */
export function createPageRepository(
  getState: () => ReduxState,
  dispatch: TypedDispatch,
  config: ConfigCommon
): IPageRepository {
  return new PageRepository(getState, dispatch, config);
}
