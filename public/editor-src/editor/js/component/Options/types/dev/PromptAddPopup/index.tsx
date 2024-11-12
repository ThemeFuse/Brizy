import deepMerge from "deepmerge";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { insert } from "timm";
import { PromptAddPopup as Control } from "visual/component/Controls/PromptAddPopup";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import { PromptBlockTemplate } from "visual/component/Prompts/PromptBlocks/types";
import { hideToolbar } from "visual/component/Toolbar";
import { SectionPopup2Instances } from "visual/editorComponents/SectionPopup2/instances";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup/instances";
import Config from "visual/global/Config";
import {
  FontsPayload,
  addFonts,
  updateExtraFontStyles,
  updateGlobalBlock
} from "visual/redux/actions2";
import {
  globalBlocksAssembled2Selector,
  pageBlocksSelector
} from "visual/redux/selectors";
import { Block } from "visual/types";
import { insertItem } from "visual/utils/models";
import { FCC } from "visual/utils/react/types";
import { uuid } from "visual/utils/uuid";
import { Props } from "./types";

export const PromptAddPopup: FCC<Props> = ({
  label,
  value,
  config,
  onChange
}) => {
  const dispatch = useDispatch();
  const { value: _value, popups } = value;

  const { popupKey = "", canDelete = true } = config ?? {};

  const globalBlocks = useSelector(globalBlocksAssembled2Selector);
  const pageBlocks = useSelector(pageBlocksSelector);

  const handleAddBlocks = useCallback(
    ({ block: blockData, fonts }: { block: Block; fonts: FontsPayload }) => {
      let popupId: string;

      if (fonts?.length) {
        dispatch(addFonts(fonts));
      }

      let newPopups;

      if (blockData.type === "GlobalBlock") {
        const { _id } = blockData.value;
        const globalBlock: Block = globalBlocks[_id].data;

        if (globalBlock.value.popupId) {
          popupId = globalBlock.value.popupId;
        } else {
          // legacy global popups do not have value.popupId so we add it
          popupId = uuid();

          dispatch(
            updateGlobalBlock({
              uid: _id,
              data: deepMerge(globalBlock, { value: { popupId } }),
              meta: { is_autosave: 0 }
            })
          );
        }

        newPopups = insert(popups, popups.length, blockData);
      } else {
        popupId = uuid();
        blockData = deepMerge(blockData, {
          value: {
            _blockVisibility: "unlisted",
            popupId
          }
        });

        newPopups = insertItem(popups, popups.length, blockData);
      }

      onChange({
        value: popupId,
        popups: newPopups
      });
    },
    [globalBlocks, popups, onChange, dispatch]
  );

  const handleAddSavedBlock = useCallback(
    ({ fonts, blocks, extraFontStyles = [] }: PromptBlockTemplate) => {
      const popupId = uuid();
      const blockData = deepMerge(blocks[0], {
        value: {
          _blockVisibility: "unlisted",
          popupId
        }
      });

      if (fonts.length) {
        dispatch(addFonts(fonts));
      }

      if (extraFontStyles.length) {
        dispatch(updateExtraFontStyles(extraFontStyles));
      }

      onChange({
        value: popupId,
        popups: insertItem(popups, popups.length, blockData)
      });
    },
    [onChange, popups, dispatch]
  );

  const handleCreate = useCallback(() => {
    const config = Config.getAll();
    const showGlobal = typeof config.api?.globalPopups?.create === "function";
    const showSaved = typeof config.api?.savedBlocks?.create === "function";

    const data: PromptsProps<"popup"> = {
      prompt: "blocks",
      mode: "single",
      props: {
        type: "popup",
        showGlobal,
        showSaved,
        showTemplate: false,
        blocksType: false,
        onChangeBlocks: handleAddBlocks,
        onChangeGlobal: handleAddBlocks,
        onChangeSaved: handleAddSavedBlock
      }
    };
    Prompts.open(data);
  }, [handleAddBlocks, handleAddSavedBlock]);

  const handleEdit = () => {
    new Map([...SectionPopupInstances, ...SectionPopup2Instances])
      .get(popupKey || _value)
      .open();

    hideToolbar();
  };

  const handleDelete = useCallback(() => {
    onChange({
      value: "",
      popups: popups.filter((item) => {
        if (item.type !== "GlobalBlock") {
          return item.value.popupId !== _value;
        } else {
          const { _id } = item.value;
          const globalBlock = globalBlocks[_id].data;

          return globalBlock ? globalBlock.value.popupId !== _value : true;
        }
      })
    });
  }, [_value, popups, globalBlocks, onChange]);

  const popupBlock = useMemo<Block | undefined>(
    () =>
      popups.find((block) => {
        if (block.type === "GlobalBlock" && globalBlocks[block.value._id]) {
          block = globalBlocks[block.value._id].data;
        }
        return block.value.popupId === _value;
      }) ?? pageBlocks.find((block: Block) => block.value._id === _value),
    [popups, _value, globalBlocks, pageBlocks]
  );

  return (
    <Control
      label={label}
      onDelete={canDelete ? handleDelete : undefined}
      onEdit={handleEdit}
      onCreate={handleCreate}
      popupBlock={popupBlock}
    />
  );
};
