import classnames from "classnames";
import { debounce } from "es-toolkit";
import { produce } from "immer";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThumbnailSelector } from "visual/component/Controls/BlockThumbnail/ThumbnailSelector";
import { updateBlocks, updateGlobalBlock } from "visual/redux/actions2";
import {
  globalBlocksAssembled2Selector,
  pageBlocksDataAssembledSelector,
  pageBlocksSelector
} from "visual/redux/selectors";
import { GlobalBlockBase } from "visual/types/GlobalBlock";
import { FCC } from "visual/utils/react/types";
import { Props } from "./types";
import { PreloadThumbnailProps } from "./types";

export const BlockThumbnail: FCC<Props> = ({
  label,
  display = "inline",
  value: _value,
  config,
  onChange
}) => {
  const { value } = _value;
  const { className, helper, helperContent, attr } = config ?? {};

  const dispatch = useDispatch();
  const blocks = useSelector(pageBlocksSelector);
  const pageBlocksAssembled = useSelector(pageBlocksDataAssembledSelector);
  const globalBlocks = useSelector(globalBlocksAssembled2Selector);

  const [anchorInputs, setAnchorInputs] = useState(
    blocks.map(({ value: blockValue }) => ({
      id: blockValue._id,
      value: blockValue.anchorName
    }))
  );

  const _className = classnames(
    "brz-ed-option__block-thumbnail",
    `brz-ed-option__${display}`,
    className,
    attr?.className
  );

  const handleThumbnailClick = useCallback(
    (id: string) => {
      if (value === id) {
        onChange({ value: "" });
      } else {
        onChange({ value: id });
      }
    },
    [value, onChange]
  );

  const handleInputChange = debounce((text: string, id: string) => {
    const encodedText = encodeURIComponent(text);

    let anchorName = encodedText;
    if (anchorName !== "") {
      // suppose we have the following blockAnchorNames ["contact", "about-us"]
      // if we add "contact" once again we must detect that it's already used
      // and transform it to "contact-2"
      const blockAnchorNames = blocks
        .filter((block) => block.value._id !== id)
        .map((block) => {
          if (block.type === "GlobalBlock") {
            block = globalBlocks[block.value._id].data;
          }

          return block.value.anchorName;
        });
      let foundDuplicateAnchorName = false;
      let retriesCount = 0;
      do {
        foundDuplicateAnchorName = false;

        for (const blockAnchorName of blockAnchorNames) {
          if (anchorName === blockAnchorName) {
            foundDuplicateAnchorName = true;
            anchorName = encodedText + "-" + (++retriesCount + 1); // start at 2
            break;
          }
        }
      } while (foundDuplicateAnchorName);
    }

    const blockToUpdate = blocks.find(({ type, value }) => {
      if (type === "GlobalBlock") {
        return globalBlocks[value._id].data.value._id === id;
      }

      return value._id === id;
    });

    if (!blockToUpdate) {
      return;
    }

    if (blockToUpdate.type !== "GlobalBlock") {
      const updatedBlocks = blocks.map((block) => {
        return block.value._id === id
          ? {
              ...block,
              value: {
                ...block.value,
                anchorName
              }
            }
          : block;
      });

      dispatch(updateBlocks({ blocks: updatedBlocks }));
    } else {
      const _id = blockToUpdate.value._id;
      const globalBlock = produce<GlobalBlockBase>(
        globalBlocks[_id],
        (draft) => {
          draft.data.value.anchorName = anchorName;
          return draft;
        }
      );

      dispatch(updateGlobalBlock(globalBlock));
    }

    setAnchorInputs((prevAnchorInputs) => {
      return prevAnchorInputs.map((anchorInput) => {
        if (anchorInput.id === id) {
          return {
            ...anchorInput,
            value: anchorName
          };
        }

        return anchorInput;
      });
    });
  }, 1000);

  useEffect(() => () => handleInputChange.cancel(), [handleInputChange]);

  const blocksAssembled = pageBlocksAssembled.filter(
    (block: PreloadThumbnailProps) =>
      block.value._blockVisibility !== "unlisted"
  );

  return (
    <ThumbnailSelector
      attr={attr}
      className={_className}
      label={label}
      helper={helper}
      helperContent={helperContent}
      onChange={handleInputChange}
      onClick={handleThumbnailClick}
      anchorInputs={anchorInputs}
      blocks={blocksAssembled}
      value={value}
    />
  );
};
