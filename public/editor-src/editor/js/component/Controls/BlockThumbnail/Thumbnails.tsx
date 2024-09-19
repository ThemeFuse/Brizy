import classnames from "classnames";
import React, { JSX } from "react";
import { AnchorInput as _AnchorInput, ThumbnailsProps } from "./types";
import { ThumbnailBlockWithInput } from "./ThumbnailBlockWithInput";

export const Thumbnails = ({
  pageBlocksAssembled,
  globalBlocks,
  value,
  onClick,
  anchorInputs,
  onChange
}: ThumbnailsProps): JSX.Element => (
  <>
    {pageBlocksAssembled.map((block) => {
      const { _id } = block.value;

      if (block.type === "GlobalBlock" && globalBlocks[_id]?.data) {
        block = globalBlocks[_id].data;
      }

      const className = classnames("brz-ed-option__block-thumbnail-item", {
        active: _id === value
      });

      const anchorName = anchorInputs.find(
        (input: _AnchorInput) => input.id === _id
      )?.value;

      const inputValue = anchorName ? decodeURIComponent(anchorName) : "";

      return (
        <ThumbnailBlockWithInput
          id={_id}
          key={_id}
          className={className}
          inputValue={inputValue}
          block={block}
          onClick={onClick}
          onChange={onChange}
        />
      );
    })}
  </>
);
